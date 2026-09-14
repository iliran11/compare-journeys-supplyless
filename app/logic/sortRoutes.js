import hasZeroJourneys from './hasZeroJourneys';

function sortValue(route, key) {
  switch (key) {
    case 'route':
      return route.fromSlug + ' → ' + route.toSlug;
    case 'status':
      return route.status;
    case 'match':
      return route.health ? route.health.matchPercent : null;
    case 'duplicates':
      return route.health ? route.health.duplicateCount : null;
    case 'avgPictures':
      return route.health ? route.health.bawAvgPictures : null;
    case 'classMatch':
      return route.health ? route.health.classMatchPercent : null;
    case 'avgRankDiff':
      return route.health ? route.health.avgRankDiff : null;
    default:
      return null;
  }
}

// Routes with zero BAW journeys always sink to the bottom; within each group the chosen column sort applies.
export default function sortRoutes(routes, sortKey, sortDir) {
  const dir = sortDir === 'desc' ? -1 : 1;

  return routes.slice().sort((a, b) => {
    const az = hasZeroJourneys(a);
    const bz = hasZeroJourneys(b);
    if (az !== bz) return az ? 1 : -1;
    if (!sortKey) return 0;
    const av = sortValue(a, sortKey);
    const bv = sortValue(b, sortKey);
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}
