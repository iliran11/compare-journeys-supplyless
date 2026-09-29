import bawAvgPrice from './bawAvgPrice';
import tcAvgPrice from './tcAvgPrice';

export default function priceClosenessPercent(result) {
  const bawAvg = bawAvgPrice(result);
  const tcAvg = tcAvgPrice(result);
  if (bawAvg == null || tcAvg == null || tcAvg === 0) return null;
  return Math.round((bawAvg / tcAvg) * 100);
}
