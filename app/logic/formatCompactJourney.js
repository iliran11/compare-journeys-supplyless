import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// One line per journey: local times, price, supplier cost, cutoff and serving integration.
export default function formatCompactJourney(journey) {
  const departure = dayjs(journey.departure.date).tz(journey.departure.timezone);
  const arrival = dayjs(journey.arrival.date).tz(journey.arrival.timezone);
  const dayOffset = arrival.startOf('day').diff(departure.startOf('day'), 'day');
  const price = journey.price || {};
  const rawPrice = journey.rawPrice || {};
  const cutoffMinutes = journey.cutOff ? dayjs(journey.departure.date).diff(dayjs(journey.cutOff), 'minute') : null;
  const integrationCode = journey.supplierApiData && journey.supplierApiData.integrationCode;

  const parts = [
    departure.format('HH:mm') + '→' + arrival.format('HH:mm') + (dayOffset > 0 ? ' +' + dayOffset + 'd' : ''),
    price.amount + ' ' + price.currency
  ];
  if (rawPrice.supplierCurrency) {
    parts.push('cost ' + rawPrice.costInSupplierCurrency + ' ' + rawPrice.supplierCurrency + ' markup ' + rawPrice.markup + '%');
  }
  parts.push('cutoff ' + (cutoffMinutes === null ? '—' : cutoffMinutes + 'm before'));
  parts.push(journey.isAvailable ? 'available' : 'UNAVAILABLE');
  if (integrationCode) {
    parts.push('integration ' + integrationCode);
  }
  return parts.join(' · ');
}
