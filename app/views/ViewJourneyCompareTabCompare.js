'use client';

import buildFilterParams from '../logic/buildFilterParams';
import buildDataProviderUrl from '../logic/buildDataProviderUrl';
import ViewJourneyDetailCard from './ViewJourneyDetailCard';

export default function ViewJourneyCompareTabCompare({ bawRows, tcRows, groupRow, bawResultsUrl, route, date }) {
  const filterParams = groupRow ? buildFilterParams(groupRow).filterParams : '';
  const dataProviderUrl = buildDataProviderUrl(route, date);

  return (
    <>
      <div className="colheads"><span className="baw">BAW</span><span className="tc">TC</span></div>
      <div className="cols modal-cols">
        <div className="col">
          {bawRows.map((r, i) => (
            <ViewJourneyDetailCard key={i} row={r} side="baw" />
          ))}
          {groupRow && (
            <a className="secondary links-cta" href={bawResultsUrl('PIN-BAW') + filterParams} target="_blank" rel="noreferrer">
              Open BAW search results ↗
            </a>
          )}
        </div>
        <div className="col">
          {tcRows.map((r, i) => (
            <ViewJourneyDetailCard key={i} row={r} side="tc" />
          ))}
          {groupRow && (
            <a className="secondary links-cta" href={bawResultsUrl('PIN-TC') + filterParams} target="_blank" rel="noreferrer">
              Open TC search results ↗
            </a>
          )}
        </div>
      </div>
      <div className="divider">Links</div>
      <div className="links-section">
        {dataProviderUrl && (
          <a className="secondary links-cta" href={dataProviderUrl} target="_blank" rel="noreferrer">
            Open PinBus search ↗
          </a>
        )}
        {!dataProviderUrl && <span className="empty">No data provider link for this route.</span>}
      </div>
    </>
  );
}
