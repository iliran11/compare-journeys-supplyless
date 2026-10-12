import kebabCase from 'lodash/kebabCase';
import buildBoardSections from './logic/buildBoardSections';
import buildJourneyStops from './logic/buildJourneyStops';
import buildMatchGroupIds from './logic/buildMatchGroupIds';
import buildRemoteStation from './logic/buildRemoteStation';
import buildStopMatchKeys from './logic/buildStopMatchKeys';
import buildStopSetKey from './logic/buildStopSetKey';
import journeyIntegrationCode from './logic/journeyIntegrationCode';
import markMatchedStops from './logic/markMatchedStops';

function assignMatchedScoreRank(rows) {
  const byScore = rows.slice().sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return a.departure < b.departure ? -1 : 1;
  });
  for (let i = 0; i < byScore.length; i++) {
    byScore[i].matchedScoreRank = i + 1;
  }
}

export function prepareComparison(tcRaw, bawRaw) {
  const sides = [
    { label: 'tc', raw: tcRaw },
    { label: 'baw', raw: bawRaw }
  ];

  const rowsBySide = { tc: [], baw: [] };

  for (const side of sides) {
    const response = side.raw || {};
    const trips = (response.trips || []).concat(response.alternativeTrips || []);
    for (const trip of trips) {
      for (const leg of trip.legs || []) {
        for (const journey of leg.journeys || []) {
          const departure = new Date(journey.departure.date).toLocaleString('sv-SE', { timeZone: journey.departure.timezone }).slice(0, 16);
          const arrival = new Date(journey.arrival.date).toLocaleString('sv-SE', { timeZone: journey.arrival.timezone }).slice(0, 16);
          const companyKey = kebabCase(leg.companyName || '');
          const stops = buildJourneyStops(leg, journey);
          const matchKeys = buildStopMatchKeys(companyKey, stops);
          rowsBySide[side.label].push({
            tripId: trip._id,
            company: leg.companyName || '',
            supplierFilterId: leg.supplier && leg.supplier.id ? leg.supplier.id : companyKey,
            lineClass: leg.lineClass || '',
            vehicleType: leg.lineType || leg.type || '',
            fromStation: leg.from ? leg.from.name : '',
            toStation: leg.to ? leg.to.name : '',
            remoteFrom: buildRemoteStation(leg.from),
            remoteTo: buildRemoteStation(leg.to),
            departure: departure,
            arrival: arrival,
            price: journey.price ? journey.price.amount : null,
            integrationCode: journeyIntegrationCode(journey),
            score: typeof trip.originalScore === 'number' ? trip.originalScore : (typeof trip.score === 'number' ? trip.score : 0),
            pictures: (leg.pictures || []).map(function (p) { return p && p.url ? 'https://cdn.bookaway.com/media/files/' + p.url : ''; }).filter(Boolean),
            stops: stops,
            matchKeys: matchKeys,
            stopSetKey: buildStopSetKey(matchKeys),
            raw: { trip: trip, leg: leg, journey: journey }
          });
        }
      }
    }
    rowsBySide[side.label].sort(function (a, b) { return a.departure < b.departure ? -1 : 1; });

    const byScore = rowsBySide[side.label].slice().sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.departure < b.departure ? -1 : 1;
    });
    for (let i = 0; i < byScore.length; i++) {
      byScore[i].scoreRank = i + 1;
    }
  }

  const tcRows = rowsBySide.tc;
  const bawRows = rowsBySide.baw;

  const bawStopSets = new Set(bawRows.map((row) => row.stopSetKey));
  const tcStopSets = new Set(tcRows.map((row) => row.stopSetKey));
  const matchedTcRows = tcRows.filter((row) => bawStopSets.has(row.stopSetKey));
  const matchedBawRows = bawRows.filter((row) => tcStopSets.has(row.stopSetKey));
  const groupIdByStopSet = buildMatchGroupIds(matchedTcRows.concat(matchedBawRows));

  const matchedTc = [];
  const tcOnly = [];
  for (const row of tcRows) {
    if (matchedTcRows.includes(row)) {
      matchedTc.push({ ...row, stops: markMatchedStops(row, true), groupId: groupIdByStopSet.get(row.stopSetKey) });
    } else {
      tcOnly.push({ ...row, stops: markMatchedStops(row, false) });
    }
  }

  const matchedBaw = [];
  const bawOnly = [];
  for (const row of bawRows) {
    if (matchedBawRows.includes(row)) {
      const tcMatchCount = matchedTc.filter((tcRow) => tcRow.stopSetKey === row.stopSetKey).length;
      matchedBaw.push({ ...row, stops: markMatchedStops(row, true), groupId: groupIdByStopSet.get(row.stopSetKey), tcMatchCount: tcMatchCount });
    } else {
      bawOnly.push({ ...row, stops: markMatchedStops(row, false) });
    }
  }

  assignMatchedScoreRank(matchedBaw);
  assignMatchedScoreRank(matchedTc);

  return {
    matchedTc: matchedTc,
    matchedBaw: matchedBaw,
    tcOnly: tcOnly,
    bawOnly: bawOnly,
    sections: buildBoardSections({ matchedBaw: matchedBaw, matchedTc: matchedTc, bawOnly: bawOnly, tcOnly: tcOnly }),
    tcCount: tcRows.length,
    bawCount: bawRows.length,
    matchedGroups: groupIdByStopSet.size,
    tcIsPartial: Boolean((tcRaw || {}).isPartial)
  };
}
