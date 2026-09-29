import buildPricedMatchedPairs from '../buildPricedMatchedPairs';

export default function bawAvgPrice(result) {
  const values = buildPricedMatchedPairs(result).map((pair) => pair.baw.price);
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}
