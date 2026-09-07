export default function computeRankDiffComparison(result) {
  const tcByGroup = new Map();
  for (const row of result.matchedTc) {
    if (!tcByGroup.has(row.groupId)) tcByGroup.set(row.groupId, []);
    tcByGroup.get(row.groupId).push(row);
  }

  let rankDiffSum = 0;
  let comparedCount = 0;
  for (const bawRow of result.matchedBaw) {
    const tcRows = tcByGroup.get(bawRow.groupId) || [];
    if (tcRows.length === 0) continue;
    const minDiff = Math.min(...tcRows.map((r) => Math.abs(bawRow.matchedScoreRank - r.matchedScoreRank)));
    rankDiffSum += minDiff;
    comparedCount += 1;
  }

  return {
    comparedCount,
    rankDiffSum,
    avgRankDiff: comparedCount === 0 ? null : rankDiffSum / comparedCount
  };
}
