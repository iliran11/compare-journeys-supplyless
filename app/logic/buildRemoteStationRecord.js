// Flat CSV record of one prepared journey row: transport, operator, schedule, class and its remote from/to stations.
export default function buildRemoteStationRecord(route, row) {
  return {
    transportId: row.tripId,
    operator: row.company,
    departureTime: row.departure,
    class: row.lineClass,
    fromRemoteStationId: row.remoteFrom.id,
    toRemoteStationId: row.remoteTo.id,
    fromRemoteStationName: row.remoteFrom.name,
    toRemoteStationName: row.remoteTo.name,
    route: route.fromSlug + ' → ' + route.toSlug
  };
}
