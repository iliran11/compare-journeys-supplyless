// One time range per boarding × drop-off stop, in time order: the same pairs the match keys are built from.
export default function buildStopRanges(stops) {
  const hasManyDropoffs = stops.dropoff.length > 1;
  return stops.boarding.flatMap((boarding) =>
    stops.dropoff.map((dropoff) => {
      const range = {
        departure: boarding.time,
        arrival: dropoff.time,
        label: hasManyDropoffs ? boarding.name + ' → ' + dropoff.name : boarding.name,
        matched: boarding.matched && dropoff.matched
      };
      return range;
    })
  );
}
