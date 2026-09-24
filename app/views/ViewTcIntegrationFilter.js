'use client';

export default function ViewTcIntegrationFilter({ filter }) {
  return (
    <div className="sortbar integration-filter">
      <span className="sortbar-label tc">Integration</span>
      {filter.options.length === 0 && <span className="muted">No TC journeys</span>}
      {filter.options.map((option) => (
        <label key={option.code}>
          <input
            type="checkbox"
            checked={filter.selectedCodes.includes(option.code)}
            onChange={() => filter.toggleCode(option.code)}
          />
          {' '}{option.code} <span className="muted">({option.count})</span>
        </label>
      ))}
    </div>
  );
}
