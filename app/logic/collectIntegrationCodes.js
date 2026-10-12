import countBy from 'lodash/countBy';
import flatMap from 'lodash/flatMap';
import orderBy from 'lodash/orderBy';
import journeyIntegrationCode from './journeyIntegrationCode';

// Distinct integration codes across a search response's journeys, most frequent first, with how many of them matched the other side.
export default function collectIntegrationCodes(raw, matchedRows) {
  const trips = ((raw && raw.trips) || []).concat((raw && raw.alternativeTrips) || []);
  const journeys = flatMap(trips, (trip) => flatMap(trip.legs || [], (leg) => leg.journeys || []));
  const counts = countBy(journeys, journeyIntegrationCode);
  const matchedCounts = countBy(matchedRows, 'integrationCode');
  const options = Object.keys(counts).map((code) => ({ code: code, count: counts[code], matchedCount: matchedCounts[code] || 0 }));
  return orderBy(options, ['count', 'code'], ['desc', 'asc']);
}
