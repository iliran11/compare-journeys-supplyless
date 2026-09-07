export default function bawAvgPictures(result) {
  const allBawRows = result.matchedBaw.concat(result.bawOnly);
  const values = allBawRows.map((r) => (r.pictures ? r.pictures.length : 0));
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}
