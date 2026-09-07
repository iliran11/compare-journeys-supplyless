export default function priceClosenessPercent(result) {
  const allBawRows = result.matchedBaw.concat(result.bawOnly);
  const bawPrices = allBawRows.map((r) => r.price).filter((p) => p != null);
  const bawAvgPrice = bawPrices.length === 0 ? null : bawPrices.reduce((sum, v) => sum + v, 0) / bawPrices.length;

  const tcPrices = result.matchedTc.map((r) => r.price).filter((p) => p != null);
  const tcAvgPrice = tcPrices.length === 0 ? null : tcPrices.reduce((sum, v) => sum + v, 0) / tcPrices.length;

  if (bawAvgPrice == null || tcAvgPrice == null || tcAvgPrice === 0) return null;
  return Math.round((bawAvgPrice / tcAvgPrice) * 100);
}
