import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Boarding and drop-off stops of a journey. search-service folds the same bus at nearby stations into one journey
// (bookTimes.fromStations / toStations); the leg's own station is always one of them. Stops are in time order.
export default function buildJourneyStops(leg, journey) {
  const bookTimes = journey.bookTimes || {};

  function collect(mainStation, mainDate, stations, tz) {
    const main = { id: mainStation.id, name: mainStation.name || '', time: dayjs(mainDate).tz(tz).format('YYYY-MM-DD HH:mm') };
    const others = (stations || [])
      .filter((station) => station.id !== mainStation.id)
      .map((station) => ({ id: station.id, name: station.name || '', time: dayjs(station.date).tz(tz).format('YYYY-MM-DD HH:mm') }));
    return sortBy([main].concat(others), 'time');
  }

  return {
    boarding: collect(leg.from || {}, journey.departure.date, bookTimes.fromStations, journey.departure.timezone),
    dropoff: collect(leg.to || {}, journey.arrival.date, bookTimes.toStations, journey.arrival.timezone)
  };
}
