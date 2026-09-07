const TOP_N = 10;

export default function computeScoreMatchComparison(result) {
  const tcByGroup = new Map();
  for (const row of result.matchedTc) {
    if (!tcByGroup.has(row.groupId)) tcByGroup.set(row.groupId, []);
    tcByGroup.get(row.groupId).push(row);
  }

  const bawTopRows = result.matchedBaw.filter((r) => r.scoreRank <= TOP_N);

  let retainedCount = 0;
  for (const bawRow of bawTopRows) {
    const tcRows = tcByGroup.get(bawRow.groupId) || [];
    if (tcRows.some((r) => r.scoreRank <= TOP_N)) {
      retainedCount += 1;
    }
  }

  const top10Total = bawTopRows.length;

  return {
    top10Total,
    top10RetainedCount: retainedCount,
    top10RetainedPercent: top10Total === 0 ? null : Math.round((retainedCount / top10Total) * 100)
  };
}
