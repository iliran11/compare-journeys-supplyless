export default function computeAggregateHealthMetrics(routes) {
  const total = routes.length;
  const done = routes.filter((r) => r.status === 'done' && r.health);
  const doneCount = done.length;

  const bawTotal = done.reduce((sum, r) => sum + r.health.bawTotal, 0);
  const matchedCount = done.reduce((sum, r) => sum + r.health.matchedCount, 0);
  const matchPercent = bawTotal === 0 ? null : Math.round((matchedCount / bawTotal) * 100);

  const duplicateCount = done.reduce((sum, r) => sum + r.health.duplicateCount, 0);
  const duplicatePercent = bawTotal === 0 ? null : Math.round((duplicateCount / bawTotal) * 100);

  const bawPictureCount = done.reduce((sum, r) => sum + r.health.bawPictureCount, 0);
  const bawPictureTotal = done.reduce((sum, r) => sum + r.health.bawAvgPictures * r.health.bawPictureCount, 0);
  const bawAvgPictures = bawPictureCount === 0 ? null : bawPictureTotal / bawPictureCount;

  const tcPictureCount = done.reduce((sum, r) => sum + r.health.tcPictureCount, 0);
  const tcPictureTotal = done.reduce((sum, r) => sum + r.health.tcAvgPictures * r.health.tcPictureCount, 0);
  const tcAvgPictures = tcPictureCount === 0 ? null : tcPictureTotal / tcPictureCount;

  const pictureClosenessPercent =
    bawAvgPictures == null || tcAvgPictures == null || bawAvgPictures === 0
      ? null
      : Math.round((tcAvgPictures / bawAvgPictures) * 100);

  const bawPriceCount = done.reduce((sum, r) => sum + r.health.bawPriceCount, 0);
  const bawPriceTotal = done.reduce((sum, r) => sum + r.health.bawAvgPrice * r.health.bawPriceCount, 0);
  const bawAvgPrice = bawPriceCount === 0 ? null : bawPriceTotal / bawPriceCount;

  const tcPriceCount = done.reduce((sum, r) => sum + r.health.tcPriceCount, 0);
  const tcPriceTotal = done.reduce((sum, r) => sum + r.health.tcAvgPrice * r.health.tcPriceCount, 0);
  const tcAvgPrice = tcPriceCount === 0 ? null : tcPriceTotal / tcPriceCount;

  const priceClosenessPercent =
    bawAvgPrice == null || tcAvgPrice == null || tcAvgPrice === 0
      ? null
      : Math.round((bawAvgPrice / tcAvgPrice) * 100);

  const classTotal = done.reduce((sum, r) => sum + r.health.classTotal, 0);
  const classMismatchCount = done.reduce((sum, r) => sum + r.health.classMismatchCount, 0);
  const classMatchCount = classTotal - classMismatchCount;
  const classMatchPercent = classTotal === 0 ? null : Math.round((classMatchCount / classTotal) * 100);

  const rankDiffComparedCount = done.reduce((sum, r) => sum + (r.health.rankDiffComparedCount || 0), 0);
  const rankDiffSum = done.reduce((sum, r) => sum + (r.health.rankDiffSum || 0), 0);
  const avgRankDiff = rankDiffComparedCount === 0 ? null : rankDiffSum / rankDiffComparedCount;

  return {
    total,
    doneCount,
    bawTotal,
    matchedCount,
    matchPercent,
    duplicateCount,
    duplicatePercent,
    bawAvgPictures,
    tcAvgPictures,
    pictureClosenessPercent,
    bawAvgPrice,
    tcAvgPrice,
    priceClosenessPercent,
    classTotal,
    classMatchCount,
    classMatchPercent,
    rankDiffComparedCount,
    avgRankDiff
  };
}
