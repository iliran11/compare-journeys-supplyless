'use client';

export default function ViewBawIntegrationFilter({ integrationName, count }) {
  return (
    <div className="sortbar integration-filter">
      <span className="sortbar-label baw">Integration</span>
      <label className="locked" title="BAW side is always searched against this integration">
        <input type="checkbox" checked disabled readOnly />
        {' '}{integrationName} <span className="muted">({count})</span>
      </label>
    </div>
  );
}
