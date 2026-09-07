export default function tcAvgPrice(result) {
  const values = result.matchedTc.map((r) => r.price).filter((p) => p != null);
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}
