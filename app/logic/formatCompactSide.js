import round from 'lodash/round';
import sumBy from 'lodash/sumBy';
import formatCompactJourney from './formatCompactJourney';
import formatCompactRemoteStation from './formatCompactRemoteStation';

// Transport-level digest of one search-results response, in response (rank) order.
export default function formatCompactSide(title, raw) {
  const response = raw || {};
  const trips = (response.trips || []).concat(response.alternativeTrips || []);
  const journeyCount = sumBy(trips, (trip) => sumBy(trip.legs || [], (leg) => (leg.journeys || []).length));

  const lines = ['## ' + title + ' — ' + trips.length + ' transports, ' + journeyCount + ' journeys'];
  for (const trip of trips) {
    const review = (trip.review && trip.review.group) || {};
    const luggage = (trip.luggage && trip.luggage.openText) || '—';
    lines.push(
      '- ' + trip._id +
      ' | originalScore ' + round(trip.originalScore || 0) + ' · score ' + trip.score +
      ' | reviews ' + (review.totalReviews ? round(review.averageScore, 2) + ' (' + review.totalReviews + ')' : '—') +
      ' | approval ' + (trip.approvalInputDefinitions || '—')
    );
    lines.push('  luggage: ' + luggage);
    for (const leg of trip.legs || []) {
      const amenities = (leg.amenities || []).map((a) => a.englishLabel || a.label);
      lines.push('  ' + leg.companyName + ' [' + (leg.supplier && leg.supplier.id) + '] | ' + leg.lineType + ' · ' + leg.lineClass);
      lines.push('  from: ' + leg.from.name + ' [' + leg.from.id + ']' + formatCompactRemoteStation(leg.from));
      lines.push('  to:   ' + leg.to.name + ' [' + leg.to.id + ']' + formatCompactRemoteStation(leg.to));
      lines.push(
        '  pictures ' + (leg.pictures || []).length +
        ' · amenities ' + (amenities.length ? amenities.join(', ') : '—') +
        ' · refundable ' + (leg.isRefundable ? 'yes' : 'no') +
        ' · flexible cancellation ' + (leg.isFlexibleCancellation ? 'yes' : 'no')
      );
      for (const journey of leg.journeys || []) {
        lines.push('    ' + formatCompactJourney(journey));
      }
    }
  }
  return lines.join('\n');
}
