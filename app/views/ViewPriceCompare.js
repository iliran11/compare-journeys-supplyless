'use client';

import computePriceComparison from '../logic/computePriceComparison';

function gapText(row) {
  if (row.gap == null) return '—';
  const sign = row.gap > 0 ? '+' : '';
  const pct = row.gapPercent != null ? ' (' + sign + row.gapPercent + '%)' : '';
  return sign + '$' + row.gap.toFixed(2) + pct;
}

function gapClass(row) {
  if (row.gap == null) return '';
  if (row.gap > 0) return 'vclass-row-mismatch';
  if (row.gap < 0) return 'vclass-row-match';
  return '';
}

export default function ViewPriceCompare({ result }) {
  const comparison = computePriceComparison(result);

  return (
    <div>
      <div className="explain">
        <span className="lbl">matching key</span>
        <b>operator + departure time + arrival time</b> — comparing price per 1:1 matched journey
      </div>

      <div className="vclass-summary">
        <span className="vclass-summary-text">
          {comparison.avgGap == null
            ? 'No priced 1:1 matches'
            : (
              <>
                avg gap <b>{comparison.avgGap > 0 ? '+' : ''}${comparison.avgGap.toFixed(2)}</b> (BAW − TC)
                {' '}across {comparison.total} matched journeys
              </>
            )}
        </span>
      </div>

      <table className="diff-table">
        <thead>
          <tr>
            <th>Operator</th>
            <th>Departure</th>
            <th className="baw">BAW price</th>
            <th className="tc">TC price</th>
            <th>Gap</th>
          </tr>
        </thead>
        <tbody>
          {comparison.rows.length === 0 && (
            <tr><td colSpan={5}>No 1:1 matched journeys</td></tr>
          )}
          {comparison.rows.map((row, i) => (
            <tr key={i} className={gapClass(row)}>
              <td>{row.company}</td>
              <td>{row.departure.slice(11)}</td>
              <td>{row.bawPriceText}</td>
              <td>{row.tcPriceText}</td>
              <td>{gapText(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
