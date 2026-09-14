// True when a route finished searching and BAW returned no journeys at all (nothing to compare).
export default function hasZeroJourneys(route) {
  return route.status === 'done' && route.health != null && route.health.bawTotal === 0;
}
