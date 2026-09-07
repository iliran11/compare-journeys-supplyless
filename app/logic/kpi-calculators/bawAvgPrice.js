export default function bawAvgPrice(result) {
  const allBawRows = result.matchedBaw.concat(result.bawOnly);
  const values = allBawRows.map((r) => r.price).filter((p) => p != null);
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}
