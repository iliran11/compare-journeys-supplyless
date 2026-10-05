// Supplier's own station identity, exposed by supplier-api on leg.from / leg.to (Clickbus only for now).
export default function buildRemoteStation(station) {
  const source = station || {};
  return { id: source.remoteStationId || '', name: source.remoteStationName || '' };
}
