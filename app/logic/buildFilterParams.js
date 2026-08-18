import padTime from './padTime';
import { DEPARTURE_TIME_WINDOW_PADDING_MINUTES } from '../config';

export default function buildFilterParams(groupRow) {
  const departureTime = groupRow.departure.slice(11);
  const timeWindow = padTime(departureTime, -DEPARTURE_TIME_WINDOW_PADDING_MINUTES) + '-' + padTime(departureTime, DEPARTURE_TIME_WINDOW_PADDING_MINUTES);
  const supplierParam = groupRow.supplierFilterId ? '&suppliers=' + encodeURIComponent(groupRow.supplierFilterId) : '';
  return { timeWindow, filterParams: supplierParam + '&departureTime=' + timeWindow };
}
