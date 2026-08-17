import padTime from './padTime';

export default function buildFilterParams(groupRow) {
  const departureTime = groupRow.departure.slice(11);
  const timeWindow = padTime(departureTime, -30) + '-' + padTime(departureTime, 30);
  const supplierParam = groupRow.supplierFilterId ? '&suppliers=' + encodeURIComponent(groupRow.supplierFilterId) : '';
  return { timeWindow, filterParams: supplierParam + '&departureTime=' + timeWindow };
}
