'use client';

import computeTransportMatchSummary from '../logic/computeTransportMatchSummary';

export default function ViewTransportMatchTab({ result }) {
  const summary = computeTransportMatchSummary(result);

  return (
    <div>
      <div className="explain">
        <span className="lbl">grouped by</span>
        <b>BAW transport id</b>
        <span style={{ marginLeft: 16 }}>
          {summary.fullyMatchedCount} fully matched · {summary.partiallyMatchedCount} partially matched · {summary.unmatchedCount} unmatched
        </span>
      </div>
      <table className="transport-table">
        <thead>
          <tr>
            <th>Transport id</th>
            <th>Operator</th>
            <th>Class</th>
            <th>Matched</th>
            <th>Unmatched</th>
            <th>BAW journey (current)</th>
            <th>Candidate TC transport(s) for migration</th>
          </tr>
        </thead>
        <tbody>
          {summary.transports.length === 0 && (
            <tr><td colSpan={7} className="empty">No BAW transports</td></tr>
          )}
          {summary.transports.map((t) => (
            <tr key={t.tripId} className={t.unmatchedCount === 0 ? 'row-match' : t.matchedCount === 0 ? 'row-nomatch' : 'row-partial'}>
              <td>
                <a href={'https://admin.bookaway.com/transports/edit/' + t.tripId} target="_blank" rel="noreferrer">
                  {t.tripId}
                </a>
              </td>
              <td>{t.company}</td>
              <td>{t.lineClass || '—'}</td>
              <td>{t.matchedCount}</td>
              <td>{t.unmatchedCount}</td>
              <td>
                <div className="journey-list">
                  {t.rows.map((r, i) => (
                    <div key={i} className={'journey-line' + (r.matched ? ' matched' : ' unmatched')}>
                      <span className="journey-time">{r.departure.slice(11)}</span>
                      <span className="journey-class">{r.lineClass || '—'}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td>
                <div className="journey-list">
                  {t.rows.map((r, i) => (
                    <div key={i} className={'journey-line' + (r.matched ? ' matched' : ' unmatched')}>
                      {r.matched ? (
                        <span className="journey-tc-ids">
                          {r.tcTrips.map((t, j) => (
                            <span key={t.tripId}>
                              {j > 0 && ', '}
                              {t.tripId}
                              <span className={'journey-class' + (t.lineClass && t.lineClass !== r.lineClass ? ' class-diff' : '')} title={t.lineClass !== r.lineClass ? 'Class differs from BAW' : undefined}>
                                {t.lineClass || '—'}
                              </span>
                            </span>
                          ))}
                          {r.tcTrips.length > 1 && (
                            <span className="multi-warn" title="Matched more than one TC transport">×{r.tcTrips.length}</span>
                          )}
                        </span>
                      ) : (
                        <span className="journey-tc-ids no-match">no TC match</span>
                      )}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
