import flatMap from 'lodash/flatMap';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import buildRemoteStationRecord from './buildRemoteStationRecord';

// Remote-station records of every BAW journey with no TC counterpart, across searched routes (unfiltered results).
// Journeys of one transport differ only by time, so identical records collapse into one.
export default function buildUnmatchedBawRecords(routes) {
  const doneRoutes = routes.filter((route) => route.status === 'done');
  const records = flatMap(doneRoutes, (route) => route.result.bawOnly.map((row) => buildRemoteStationRecord(route, row)));
  return uniqWith(records, isEqual);
}
