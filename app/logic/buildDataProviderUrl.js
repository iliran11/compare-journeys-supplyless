export default function buildDataProviderUrl(route, date) {
  if (!route || !route.dataProviderLink) return null;
  return route.dataProviderLink + '&salida=' + date.trim();
}
