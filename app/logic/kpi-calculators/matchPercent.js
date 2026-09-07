export default function matchPercent(result) {
  const bawTotal = result.bawCount;
  const matchedCount = result.matchedBaw.length;
  return bawTotal === 0 ? 0 : Math.round((matchedCount / bawTotal) * 100);
}
