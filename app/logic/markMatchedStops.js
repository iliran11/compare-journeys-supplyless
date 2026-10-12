// Flags every boarding / drop-off stop with whether its row matched: a match covers all of the row's stops or none.
export default function markMatchedStops(row, isMatched) {
  return {
    boarding: row.stops.boarding.map((stop) => ({ ...stop, matched: isMatched })),
    dropoff: row.stops.dropoff.map((stop) => ({ ...stop, matched: isMatched }))
  };
}
