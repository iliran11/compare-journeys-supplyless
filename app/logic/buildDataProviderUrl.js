import resolveSearchConfig from './resolveSearchConfig';

export default function buildDataProviderUrl(route, date) {
  if (!route || !route.dataProviderLink) return null;
  const { dataProviderDateParam } = resolveSearchConfig(route.integration);
  if (!dataProviderDateParam) return route.dataProviderLink;
  const separator = route.dataProviderLink.includes('?') ? '&' : '?';
  return route.dataProviderLink + separator + dataProviderDateParam + '=' + date.trim();
}
