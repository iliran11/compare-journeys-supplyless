// Departure order uses each row's earliest boarding stop, so a multistation bus sorts the same on both sides whichever stop is its main one.
export default function sortRows(rows, sortBy) {
  const copy = rows.slice();
  if (sortBy === 'score') {
    copy.sort(function (a, b) {
      const rankA = a.matchedScoreRank != null ? a.matchedScoreRank : Infinity;
      const rankB = b.matchedScoreRank != null ? b.matchedScoreRank : Infinity;
      if (rankA !== rankB) return rankA - rankB;
      return a.stops.boarding[0].time < b.stops.boarding[0].time ? -1 : 1;
    });
  } else {
    copy.sort(function (a, b) { return a.stops.boarding[0].time < b.stops.boarding[0].time ? -1 : 1; });
  }
  return copy;
}
