import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';

// One key for a row's whole set of stop keys: two rows match only when their sets are identical, whichever stop each side made its main one.
export default function buildStopSetKey(matchKeys) {
  return sortBy(uniq(matchKeys)).join(',');
}
