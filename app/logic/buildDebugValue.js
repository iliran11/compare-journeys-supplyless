// `debug` query param on bookaway.com search is <source of data>-<integration provider>, e.g. PIN-BAW / PIN-TC.
export default function buildDebugValue(route, side) {
  const integration = (route && route.integration) || 'PIN';
  return integration + '-' + (side === 'tc' ? 'TC' : 'BAW');
}
