import { ADMIN_URL } from '../config';

// Admin supplier-api live search page for a route, searched against the given supplier-api supplier.
export default function buildAdminLiveSearchUrl(route, date, supplierName) {
  return ADMIN_URL + '/supplier-api?supplier=' + supplierName + '&fromCity=' + route.fromCityId + '&toCity=' + route.toCityId + '&date=' + date.trim();
}
