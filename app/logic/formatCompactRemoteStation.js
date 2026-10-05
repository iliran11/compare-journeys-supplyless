import buildRemoteStation from './buildRemoteStation';

// Suffix for a compact from/to line; empty when the supplier exposes no remote station.
export default function formatCompactRemoteStation(station) {
  const remote = buildRemoteStation(station);
  if (!remote.id && !remote.name) return '';
  return ' · remote: ' + remote.name + ' [' + remote.id + ']';
}
