'use client';

import computeVehicleClassComparison from '../logic/computeVehicleClassComparison';

export default function ViewVehicleClassCompare({ result }) {
  const comparison = computeVehicleClassComparison(result);

  return (
    <div>
      <div className="explain">
        <span className="lbl">matching key</span>
        <b>operator + departure time + arrival time</b> — comparing vehicle class per matched journey
      </div>

      <div className="vclass-summary">
        <div className="vclass-bar">
          <div
            className="vclass-bar-match"
            style={{ width: comparison.matchPercent + '%' }}
          />
        </div>
        <span className="vclass-summary-text">
          <b>{comparison.matchPercent}%</b> vehicle class match
          {' '}({comparison.matchCount} of {comparison.total} matched journeys agree)
        </span>
      </div>

      <table className="diff-table">
        <thead>
          <tr>
            <th>Operator</th>
            <th>Departure</th>
            <th className="baw">BAW class</th>
            <th className="tc">TC class</th>
            <th>Match</th>
          </tr>
        </thead>
        <tbody>
          {comparison.rows.length === 0 && (
            <tr><td colSpan={5}>No matched journeys</td></tr>
          )}
          {comparison.rows.map((row, i) => (
            <tr key={i} className={row.isMatch ? 'vclass-row-match' : 'vclass-row-mismatch'}>
              <td>{row.company}</td>
              <td>{row.departure.slice(11)}</td>
              <td>{row.bawClass}</td>
              <td>{row.tcClass}</td>
              <td>{row.isMatch ? '✓' : '✗'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
