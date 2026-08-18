'use client';

import ViewJourneyDetailCard from './ViewJourneyDetailCard';

export default function ViewJourneyCompareTabCompare({ bawRows, tcRows }) {
  return (
    <>
      <div className="colheads"><span className="baw">BAW</span><span className="tc">TC</span></div>
      <div className="cols modal-cols">
        <div className="col">
          {bawRows.map((r, i) => (
            <ViewJourneyDetailCard key={i} row={r} side="baw" />
          ))}
        </div>
        <div className="col">
          {tcRows.map((r, i) => (
            <ViewJourneyDetailCard key={i} row={r} side="tc" />
          ))}
        </div>
      </div>
    </>
  );
}
