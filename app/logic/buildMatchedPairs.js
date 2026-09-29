// One pair per BAW × TC journey inside a match group: a BAW journey matching two TC journeys yields two pairs.
export default function buildMatchedPairs(result) {
  const tcByGroup = new Map();
  for (const row of result.matchedTc) {
    if (!tcByGroup.has(row.groupId)) tcByGroup.set(row.groupId, []);
    tcByGroup.get(row.groupId).push(row);
  }

  return result.matchedBaw.flatMap((bawRow) =>
    (tcByGroup.get(bawRow.groupId) || []).map((tcRow) => ({ groupId: bawRow.groupId, baw: bawRow, tc: tcRow }))
  );
}
