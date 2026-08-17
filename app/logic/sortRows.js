export default function sortRows(rows, sortBy) {
  const copy = rows.slice();
  if (sortBy === 'score') {
    copy.sort(function (a, b) {
      const rankA = a.scoreRank != null ? a.scoreRank : Infinity;
      const rankB = b.scoreRank != null ? b.scoreRank : Infinity;
      if (rankA !== rankB) return rankA - rankB;
      return a.departure < b.departure ? -1 : 1;
    });
  } else {
    copy.sort(function (a, b) { return a.departure < b.departure ? -1 : 1; });
  }
  return copy;
}
