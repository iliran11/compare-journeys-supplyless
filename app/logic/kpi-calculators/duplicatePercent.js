export default function duplicatePercent(result) {
  const bawTotal = result.bawCount;
  const duplicateCount = result.matchedBaw.filter((r) => r.tcMatchCount > 1).length;
  return bawTotal === 0 ? 0 : Math.round((duplicateCount / bawTotal) * 100);
}
