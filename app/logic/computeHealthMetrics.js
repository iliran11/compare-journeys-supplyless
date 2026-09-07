import computeVehicleClassComparison from './computeVehicleClassComparison';
import computeRankDiffComparison from './computeRankDiffComparison';
import matchPercent from './kpi-calculators/matchPercent';
import duplicatePercent from './kpi-calculators/duplicatePercent';
import bawAvgPictures from './kpi-calculators/bawAvgPictures';
import tcAvgPictures from './kpi-calculators/tcAvgPictures';
import bawAvgPrice from './kpi-calculators/bawAvgPrice';
import tcAvgPrice from './kpi-calculators/tcAvgPrice';
import classMatchPercent from './kpi-calculators/classMatchPercent';
import avgRankDiff from './kpi-calculators/avgRankDiff';
import priceClosenessPercent from './kpi-calculators/priceClosenessPercent';
import pictureClosenessPercent from './kpi-calculators/pictureClosenessPercent';

export default function computeHealthMetrics(result) {
  const bawTotal = result.bawCount;
  const matchedCount = result.matchedBaw.length;

  const duplicateCount = result.matchedBaw.filter((r) => r.tcMatchCount > 1).length;

  const allBawRows = result.matchedBaw.concat(result.bawOnly);
  const bawPictureCount = allBawRows.length;
  const tcPictureCount = result.matchedTc.length;
  const bawPriceCount = allBawRows.map((r) => r.price).filter((p) => p != null).length;
  const tcPriceCount = result.matchedTc.map((r) => r.price).filter((p) => p != null).length;

  const vclass = computeVehicleClassComparison(result);
  const rankDiff = computeRankDiffComparison(result);

  return {
    bawTotal,
    matchedCount,
    matchPercent: matchPercent(result),
    duplicateCount,
    duplicatePercent: duplicatePercent(result),
    bawPictureCount,
    bawAvgPictures: bawAvgPictures(result),
    tcPictureCount,
    tcAvgPictures: tcAvgPictures(result),
    pictureClosenessPercent: pictureClosenessPercent(result),
    bawPriceCount,
    bawAvgPrice: bawAvgPrice(result),
    tcPriceCount,
    tcAvgPrice: tcAvgPrice(result),
    priceClosenessPercent: priceClosenessPercent(result),
    classMismatchCount: vclass.mismatchCount,
    classMatchCount: vclass.matchCount,
    classMatchPercent: classMatchPercent(result),
    classTotal: vclass.total,
    rankDiffComparedCount: rankDiff.comparedCount,
    rankDiffSum: rankDiff.rankDiffSum,
    avgRankDiff: avgRankDiff(result)
  };
}
