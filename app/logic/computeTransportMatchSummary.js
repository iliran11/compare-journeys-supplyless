export default function computeTransportMatchSummary(result) {
  const bawRows = result.matchedBaw.concat(result.bawOnly);

  const tcTripsByGroup = new Map();
  for (const row of result.matchedTc) {
    if (!tcTripsByGroup.has(row.groupId)) {
      tcTripsByGroup.set(row.groupId, new Map());
    }
    tcTripsByGroup.get(row.groupId).set(row.tripId, { tripId: row.tripId, lineClass: row.lineClass || '' });
  }

  const byTripId = new Map();
  for (const row of bawRows) {
    const tripId = row.tripId;
    if (!byTripId.has(tripId)) {
      byTripId.set(tripId, {
        tripId: tripId,
        company: row.company,
        lineClass: row.lineClass || '',
        matchedCount: 0,
        unmatchedCount: 0,
        rows: []
      });
    }
    const entry = byTripId.get(tripId);
    const matched = row.groupId != null;
    if (matched) {
      entry.matchedCount += 1;
    } else {
      entry.unmatchedCount += 1;
    }
    const tcTrips = matched ? Array.from((tcTripsByGroup.get(row.groupId) || new Map()).values()) : [];
    entry.rows.push({
      matched: matched,
      departure: row.departure,
      arrival: row.arrival,
      lineClass: row.lineClass || '',
      tcMatchCount: matched ? row.tcMatchCount : 0,
      tcTripIds: tcTrips.map((t) => t.tripId),
      tcTrips: tcTrips
    });
  }

  const transports = Array.from(byTripId.values()).sort(function (a, b) {
    if (a.unmatchedCount !== b.unmatchedCount) return b.unmatchedCount - a.unmatchedCount;
    return a.company < b.company ? -1 : 1;
  });

  return {
    transports: transports,
    fullyMatchedCount: transports.filter((t) => t.unmatchedCount === 0).length,
    partiallyMatchedCount: transports.filter((t) => t.matchedCount > 0 && t.unmatchedCount > 0).length,
    unmatchedCount: transports.filter((t) => t.matchedCount === 0).length
  };
}
