import buildMatchedPairs from '../buildMatchedPairs';

export default function bawAvgPictures(result) {
  const values = buildMatchedPairs(result).map((pair) => pair.baw.pictures.length);
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}
