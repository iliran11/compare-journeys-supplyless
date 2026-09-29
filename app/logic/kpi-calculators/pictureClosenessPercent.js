import bawAvgPictures from './bawAvgPictures';
import tcAvgPictures from './tcAvgPictures';

export default function pictureClosenessPercent(result) {
  const bawAvg = bawAvgPictures(result);
  const tcAvg = tcAvgPictures(result);
  if (bawAvg == null || tcAvg == null || bawAvg === 0) return null;
  return Math.round((tcAvg / bawAvg) * 100);
}
