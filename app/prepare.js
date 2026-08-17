import kebabCase from 'lodash/kebabCase';

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
          rowsBySide[side.label].push({
            tripId: trip._id,
            company: leg.companyName || '',
            supplierFilterId: leg.supplier && leg.supplier.id ? leg.supplier.id : companyKey,
            lineClass: leg.lineClass || '',
            vehicleType: leg.lineType || leg.type || '',
            fromStation: leg.from ? leg.from.name : '',
            toStation: leg.to ? leg.to.name : '',
            departure: departure,
            arrival: arrival,
            price: journey.price ? journey.price.amount : null,
            score: typeof trip.originalScore === 'number' ? trip.originalScore : (typeof trip.score === 'number' ? trip.score : 0),
            pictures: (leg.pictures || []).map(function (p) { return p && p.url ? 'https://cdn.bookaway.com/media/files/' + p.url : ''; }).filter(Boolean),
            matchKey: companyKey + '|' + departure + '|' + arrival,
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

  const bawKeys = new Set();
  for (const row of bawRows) {
    bawKeys.add(row.matchKey);
  }
  const tcKeys = new Set();
  for (const row of tcRows) {
    tcKeys.add(row.matchKey);
  }

  const groupIdByKey = new Map();
  const matchedTc = [];
  const tcOnly = [];
  for (const row of tcRows) {
    if (bawKeys.has(row.matchKey)) {
      if (!groupIdByKey.has(row.matchKey)) {
        groupIdByKey.set(row.matchKey, groupIdByKey.size);
      }
      matchedTc.push({ ...row, groupId: groupIdByKey.get(row.matchKey) });
    } else {
      tcOnly.push(row);
    }
  }

  const tcCountByGroup = new Map();
  for (const row of matchedTc) {
    tcCountByGroup.set(row.groupId, (tcCountByGroup.get(row.groupId) || 0) + 1);
  }

  const matchedBaw = [];
  const bawOnly = [];
  for (const row of bawRows) {
    if (tcKeys.has(row.matchKey)) {
      const groupId = groupIdByKey.get(row.matchKey);
      matchedBaw.push({ ...row, groupId: groupId, tcMatchCount: tcCountByGroup.get(groupId) || 0 });
    } else {
      bawOnly.push(row);
    }
  }

  return {
    matchedTc: matchedTc,
    matchedBaw: matchedBaw,
    tcOnly: tcOnly,
    bawOnly: bawOnly,
    tcCount: tcRows.length,
    bawCount: bawRows.length,
    matchedGroups: groupIdByKey.size
  };
}
