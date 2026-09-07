import computeVehicleClassComparison from './computeVehicleClassComparison';
import computeScoreMatchComparison from './computeScoreMatchComparison';

function average(values) {
  return values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;
}

export default function computeHealthMetrics(result) {
  const bawTotal = result.bawCount;
  const matchedCount = result.matchedBaw.length;
  const matchPercent = bawTotal === 0 ? 0 : Math.round((matchedCount / bawTotal) * 100);

  const duplicateCount = result.matchedBaw.filter((r) => r.tcMatchCount > 1).length;
  const duplicatePercent = bawTotal === 0 ? 0 : Math.round((duplicateCount / bawTotal) * 100);

  const allBawRows = result.matchedBaw.concat(result.bawOnly);

  const bawPictureCount = allBawRows.length;
  const bawAvgPictures = average(allBawRows.map((r) => (r.pictures ? r.pictures.length : 0)));

  const tcPictureCount = result.matchedTc.length;
  const tcAvgPictures = average(result.matchedTc.map((r) => (r.pictures ? r.pictures.length : 0)));

  const bawPrices = allBawRows.map((r) => r.price).filter((p) => p != null);
  const bawPriceCount = bawPrices.length;
  const bawAvgPrice = average(bawPrices);

  const tcPrices = result.matchedTc.map((r) => r.price).filter((p) => p != null);
  const tcPriceCount = tcPrices.length;
  const tcAvgPrice = average(tcPrices);

  const vclass = computeVehicleClassComparison(result);
  const scoreMatch = computeScoreMatchComparison(result);

  return {
    bawTotal,
    matchedCount,
    matchPercent,
    duplicateCount,
    duplicatePercent,
    bawPictureCount,
    bawAvgPictures,
    tcPictureCount,
    tcAvgPictures,
    bawPriceCount,
    bawAvgPrice,
    tcPriceCount,
    tcAvgPrice,
    classMismatchCount: vclass.mismatchCount,
    classMatchPercent: vclass.matchPercent,
    classTotal: vclass.total,
    top10Total: scoreMatch.top10Total,
    top10RetainedCount: scoreMatch.top10RetainedCount,
    top10RetainedPercent: scoreMatch.top10RetainedPercent
  };
}
