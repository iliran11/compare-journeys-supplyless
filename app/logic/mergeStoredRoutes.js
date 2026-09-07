export default function mergeStoredRoutes(baseRoutes, storedRoutes) {
  if (!storedRoutes) return baseRoutes;
  const storedById = new Map(storedRoutes.map((r) => [r.id, r]));
  return baseRoutes.map((route) => {
    const stored = storedById.get(route.id);
    return stored ? { ...route, ...stored } : route;
  });
}
