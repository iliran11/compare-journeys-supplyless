import buildAdminLiveSearchUrl from './buildAdminLiveSearchUrl';
import buildDataProviderUrl from './buildDataProviderUrl';
import buildTwelveGoUrl from './buildTwelveGoUrl';
import resolveSearchConfig from './resolveSearchConfig';

// External links for a route: admin live search per side, plus the data provider and 12GO pages.
export default function buildRouteSearchLinks(route, date) {
  const { integrationName, adminSupplierName, tcAdminSupplierName, dataProviderName } = resolveSearchConfig(route && route.integration);
  const links = [
    { key: 'baw', side: 'baw', label: 'BAW live search (' + integrationName + ')', href: buildAdminLiveSearchUrl(route, date, adminSupplierName) },
    { key: 'tc', side: 'tc', label: 'TC live search (Travelier Connect)', href: buildAdminLiveSearchUrl(route, date, tcAdminSupplierName) }
  ];
  const dataProviderUrl = buildDataProviderUrl(route, date);
  if (dataProviderUrl) links.push({ key: 'provider', side: null, label: dataProviderName + ' search', href: dataProviderUrl });
  const twelveGoUrl = buildTwelveGoUrl(route);
  if (twelveGoUrl) links.push({ key: '12go', side: null, label: '12GO search', href: twelveGoUrl });
  return links;
}
