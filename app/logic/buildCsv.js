import keys from 'lodash/keys';

// Header row from the first record's keys; every cell quoted, embedded quotes doubled.
export default function buildCsv(records) {
  const headers = keys(records[0]);
  const lines = [headers].concat(records.map((record) => headers.map((header) => record[header])));
  return lines.map((cells) => cells.map((cell) => '"' + String(cell == null ? '' : cell).replace(/"/g, '""') + '"').join(',')).join('\n');
}
