import uniq from 'lodash/uniq';

// A row is multistation when it covers more than one boarding × drop-off time range.
export default function isMultistationRow(row) {
  return uniq(row.matchKeys).length > 1;
}
