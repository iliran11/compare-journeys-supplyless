import journeyIntegrationCode from './journeyIntegrationCode';

// Keeps only journeys served by one of the given integration codes; trips left without journeys are dropped.
export default function filterTripsByIntegrationCodes(raw, codes) {
  const filterTrips = (trips) => (trips || [])
    .map((trip) => ({
      ...trip,
      legs: (trip.legs || []).map((leg) => ({
        ...leg,
        journeys: (leg.journeys || []).filter((journey) => codes.includes(journeyIntegrationCode(journey)))
      }))
    }))
    .filter((trip) => trip.legs.some((leg) => leg.journeys.length > 0));
  return { ...raw, trips: filterTrips(raw.trips), alternativeTrips: filterTrips(raw.alternativeTrips) };
}
