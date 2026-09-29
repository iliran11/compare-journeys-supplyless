import buildPricedMatchedPairs from '../buildPricedMatchedPairs';

export default function tcAvgPrice(result) {
  const values = buildPricedMatchedPairs(result).map((pair) => pair.tc.price);
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}
