// Flat CSV record of one prepared journey row: transport and its remote from/to stations.
export default function buildRemoteStationRecord(route, row) {
  return {
    transportId: row.tripId,
    fromRemoteStationId: row.remoteFrom.id,
    toRemoteStationId: row.remoteTo.id,
    fromRemoteStationName: row.remoteFrom.name,
    toRemoteStationName: row.remoteTo.name,
    route: route.fromSlug + ' → ' + route.toSlug
  };
}
