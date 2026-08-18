'use client';

import buildFilterParams from '../logic/buildFilterParams';

export default function ViewJourneyCompareTabLinks({ groupRow, bawResultsUrl }) {
  if (!groupRow) return null;

  const { timeWindow, filterParams } = buildFilterParams(groupRow);

  return (
    <div className="links-grid">
      <div className="config-section side baw-side links-card">
        <div className="config-title baw">BAW</div>
        <div className="links-card-desc">Live search results filtered by operator and departure window <b>{timeWindow}</b>.</div>
        <a className="secondary links-cta" href={bawResultsUrl('PIN-BAW') + filterParams} target="_blank" rel="noreferrer">
          Open BAW search results ↗
        </a>
      </div>
      <div className="config-section side tc-side links-card">
        <div className="config-title tc">TC</div>
        <div className="links-card-desc">Live search results filtered by operator and departure window <b>{timeWindow}</b>.</div>
        <a className="secondary links-cta" href={bawResultsUrl('PIN-TC') + filterParams} target="_blank" rel="noreferrer">
          Open TC search results ↗
        </a>
      </div>
    </div>
  );
}
