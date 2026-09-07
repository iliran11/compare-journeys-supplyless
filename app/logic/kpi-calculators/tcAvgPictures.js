export default function tcAvgPictures(result) {
  const values = result.matchedTc.map((r) => (r.pictures ? r.pictures.length : 0));
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}
