import buildMatchedPairs from '../buildMatchedPairs';

export default function tcAvgPictures(result) {
  const values = buildMatchedPairs(result).map((pair) => pair.tc.pictures.length);
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}
