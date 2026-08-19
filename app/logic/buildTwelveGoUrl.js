export default function buildTwelveGoUrl(route) {
  if (!route || !route.twelveGoLink) return null;
  return route.twelveGoLink;
}
