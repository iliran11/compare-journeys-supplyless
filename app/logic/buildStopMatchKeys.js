// One match key per boarding × drop-off stop, so the same bus matches whichever stop each side made its main one.
export default function buildStopMatchKeys(companyKey, stops) {
  return stops.boarding.flatMap((boarding) => stops.dropoff.map((dropoff) => companyKey + '|' + boarding.time + '|' + dropoff.time));
}
