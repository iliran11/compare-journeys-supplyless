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
    case 'classMismatch':
      return route.health ? route.health.classMismatchPercent : null;
    default:
      return null;
  }
}

export default function sortRoutes(routes, sortKey, sortDir) {
  if (!sortKey) return routes;
  const dir = sortDir === 'desc' ? -1 : 1;

  return routes.slice().sort((a, b) => {
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
