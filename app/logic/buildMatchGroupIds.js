// Group id per stop set: rows with an identical set of stop keys form one group.
// Ids follow the order of the given rows.
export default function buildMatchGroupIds(rows) {
  const groupIdByStopSet = new Map();
  for (const row of rows) {
    if (!groupIdByStopSet.has(row.stopSetKey)) groupIdByStopSet.set(row.stopSetKey, groupIdByStopSet.size);
  }
  return groupIdByStopSet;
}
