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
          const companyLower = String(leg.companyName || '').toLowerCase();
          let companyKey = '';
          for (const ch of companyLower) {
            const isLetter = ch >= 'a' && ch <= 'z';
            const isDigit = ch >= '0' && ch <= '9';
            if (isLetter || isDigit) {
              companyKey += ch;
            }
          }
          rowsBySide[side.label].push({
            tripId: trip._id,
            company: leg.companyName || '',
            lineClass: leg.lineClass || '',
            fromStation: leg.from ? leg.from.name : '',
            departure: departure,
            arrival: arrival,
            price: journey.price ? journey.price.amount : null,
            score: typeof trip.originalScore === 'number' ? trip.originalScore : (typeof trip.score === 'number' ? trip.score : 0),
            matchKey: companyKey + '|' + departure
          });
        }
      }
    }
    rowsBySide[side.label].sort(function (a, b) { return a.departure < b.departure ? -1 : 1; });
  }

  const tcRows = rowsBySide.tc;
  const bawRows = rowsBySide.baw;

  const bawByKey = new Map();
  for (const row of bawRows) {
    bawByKey.set(row.matchKey, row);
  }

  const pairs = [];
  const tcOnly = [];
  const usedBawKeys = new Set();
  for (const row of tcRows) {
    if (bawByKey.has(row.matchKey) && !usedBawKeys.has(row.matchKey)) {
      pairs.push({ tc: row, baw: bawByKey.get(row.matchKey) });
      usedBawKeys.add(row.matchKey);
    } else {
      tcOnly.push(row);
    }
  }
  const bawOnly = bawRows.filter(function (row) { return !usedBawKeys.has(row.matchKey); });

  pairs.sort(function (a, b) { return a.tc.departure < b.tc.departure ? -1 : 1; });
  pairs.forEach(function (pair, index) { pair.id = index; });

  return {
    pairs: pairs,
    tcOnly: tcOnly,
    bawOnly: bawOnly,
    tcCount: tcRows.length,
    bawCount: bawRows.length
  };
}
