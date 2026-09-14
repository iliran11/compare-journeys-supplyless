import { BASE_URL } from '../config';

export default function buildBawResultsUrl(route, date, debugValue) {
  return BASE_URL + '/s/' + route.countrySlug + '/' + route.fromSlug + '-to-' + route.toSlug + '?departuredate=' + date.trim() + '&debug=' + debugValue;
}
