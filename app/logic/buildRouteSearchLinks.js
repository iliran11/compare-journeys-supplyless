import buildBawResultsUrl from './buildBawResultsUrl';
import buildDebugValue from './buildDebugValue';
import buildDataProviderUrl from './buildDataProviderUrl';
import buildTwelveGoUrl from './buildTwelveGoUrl';
import resolveSearchConfig from './resolveSearchConfig';

// External search-page links for a route, one per debug filter plus the data provider and 12GO pages.
export default function buildRouteSearchLinks(route, date) {
  const { dataProviderName } = resolveSearchConfig(route && route.integration);
  const debugBaw = buildDebugValue(route, 'baw');
  const debugTc = buildDebugValue(route, 'tc');
  const links = [
    { key: 'baw', side: 'baw', label: 'BAW search (?debug=' + debugBaw + ')', href: buildBawResultsUrl(route, date, debugBaw) },
    { key: 'tc', side: 'tc', label: 'TC search (?debug=' + debugTc + ')', href: buildBawResultsUrl(route, date, debugTc) },
    { key: 'all', side: null, label: 'Bookaway search (no filter)', href: buildBawResultsUrl(route, date, '').replace(/&debug=$/, '') }
  ];
  const dataProviderUrl = buildDataProviderUrl(route, date);
  if (dataProviderUrl) links.push({ key: 'provider', side: null, label: dataProviderName + ' search', href: dataProviderUrl });
  const twelveGoUrl = buildTwelveGoUrl(route);
  if (twelveGoUrl) links.push({ key: '12go', side: null, label: '12GO search', href: twelveGoUrl });
  return links;
}
