export default function computeTransportMatchSummary(result) {
  const bawRows = result.matchedBaw.concat(result.bawOnly);

  const tcTripIdsByGroup = new Map();
  for (const row of result.matchedTc) {
    if (!tcTripIdsByGroup.has(row.groupId)) {
      tcTripIdsByGroup.set(row.groupId, new Set());
    }
    tcTripIdsByGroup.get(row.groupId).add(row.tripId);
  }

  const byTripId = new Map();
  for (const row of bawRows) {
    const tripId = row.tripId;
    if (!byTripId.has(tripId)) {
      byTripId.set(tripId, {
        tripId: tripId,
        company: row.company,
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
    const tcTripIds = matched ? Array.from(tcTripIdsByGroup.get(row.groupId) || []) : [];
    entry.rows.push({
      matched: matched,
      departure: row.departure,
      arrival: row.arrival,
      tcMatchCount: matched ? row.tcMatchCount : 0,
      tcTripIds: tcTripIds
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
