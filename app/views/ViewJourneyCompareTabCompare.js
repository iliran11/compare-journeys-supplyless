'use client';

import { useState } from 'react';
import buildFilterParams from '../logic/buildFilterParams';
import ViewJourneyDetailCard from './ViewJourneyDetailCard';

export default function ViewJourneyCompareTabCompare({ bawRows, tcRows, groupRow, bawResultsUrl }) {
  const filterParams = groupRow ? buildFilterParams(groupRow).filterParams : '';
  const [hoveredSection, setHoveredSection] = useState(null);

  return (
    <>
      <div className="colheads"><span className="baw">BAW</span><span className="tc">TC</span></div>
      <div className="cols modal-cols">
        <div className="col col-baw">
          {bawRows.map((r, i) => (
            <ViewJourneyDetailCard key={i} row={r} side="baw" hoveredSection={hoveredSection} onHoverSection={setHoveredSection} />
          ))}
          {groupRow && (
            <a className="secondary links-cta" href={bawResultsUrl('PIN-BAW') + filterParams} target="_blank" rel="noreferrer">
              Open BAW search results ↗
            </a>
          )}
        </div>
        <div className="col col-tc">
          {tcRows.map((r, i) => (
            <ViewJourneyDetailCard key={i} row={r} side="tc" hoveredSection={hoveredSection} onHoverSection={setHoveredSection} />
          ))}
          {groupRow && (
            <a className="secondary links-cta" href={bawResultsUrl('PIN-TC') + filterParams} target="_blank" rel="noreferrer">
              Open TC search results ↗
            </a>
          )}
        </div>
      </div>
    </>
  );
}
