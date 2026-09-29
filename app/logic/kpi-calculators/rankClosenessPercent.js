import buildRankClosenessRatios from '../buildRankClosenessRatios';

export default function rankClosenessPercent(result) {
  const ratios = buildRankClosenessRatios(result);
  return ratios.length === 0 ? null : Math.round((ratios.reduce((sum, v) => sum + v, 0) / ratios.length) * 100);
}
