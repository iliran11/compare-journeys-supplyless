'use client';

export default function ViewBawIntegrationFilter({ integrationName, matchedCount, count }) {
  return (
    <div className="sortbar integration-filter">
      <span className="sortbar-label baw">Integration</span>
      <label className="locked" title="BAW side is always searched against this integration">
        <input type="checkbox" checked disabled readOnly />
        {' '}{integrationName} <span className="muted" title="Matched / total journeys">({matchedCount}/{count})</span>
      </label>
    </div>
  );
}
