const TOP_N = 10;

export default function top10RetainedPercent(result) {
  const tcByGroup = new Map();
  for (const row of result.matchedTc) {
    if (!tcByGroup.has(row.groupId)) tcByGroup.set(row.groupId, []);
    tcByGroup.get(row.groupId).push(row);
  }

  const allBawRows = result.matchedBaw.concat(result.bawOnly);
  const bawTopRows = allBawRows.filter((r) => r.scoreRank <= TOP_N);

  let retainedCount = 0;
  for (const bawRow of bawTopRows) {
    const tcRows = bawRow.groupId != null ? tcByGroup.get(bawRow.groupId) || [] : [];
    if (tcRows.some((r) => r.scoreRank <= TOP_N)) {
      retainedCount += 1;
    }
  }

  return bawTopRows.length === 0 ? null : Math.round((retainedCount / bawTopRows.length) * 100);
}
