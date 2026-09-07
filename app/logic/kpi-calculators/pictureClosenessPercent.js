export default function pictureClosenessPercent(result) {
  const allBawRows = result.matchedBaw.concat(result.bawOnly);
  const bawPictureCounts = allBawRows.map((r) => (r.pictures ? r.pictures.length : 0));
  const bawAvgPictures =
    bawPictureCounts.length === 0 ? null : bawPictureCounts.reduce((sum, v) => sum + v, 0) / bawPictureCounts.length;

  const tcPictureCounts = result.matchedTc.map((r) => (r.pictures ? r.pictures.length : 0));
  const tcAvgPictures =
    tcPictureCounts.length === 0 ? null : tcPictureCounts.reduce((sum, v) => sum + v, 0) / tcPictureCounts.length;

  if (bawAvgPictures == null || tcAvgPictures == null || bawAvgPictures === 0) return null;
  return Math.round((tcAvgPictures / bawAvgPictures) * 100);
}
