export default function buildDataProviderUrl(route, date) {
  if (!route || !route.dataProvider) return null;
  return route.dataProvider + '&salida=' + date.trim();
}
