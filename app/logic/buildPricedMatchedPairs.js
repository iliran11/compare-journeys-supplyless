import buildMatchedPairs from './buildMatchedPairs';

// Matched pairs where both sides carry a price, so BAW and TC averages cover the same journeys.
export default function buildPricedMatchedPairs(result) {
  return buildMatchedPairs(result).filter((pair) => pair.baw.price != null && pair.tc.price != null);
}
