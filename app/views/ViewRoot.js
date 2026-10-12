'use client';

import ViewBawIntegrationFilter from './ViewBawIntegrationFilter';
import ViewMatchBoard from './ViewMatchBoard';
import ViewTcIntegrationFilter from './ViewTcIntegrationFilter';

export default function ViewRoot({ result, sortBy, setSortBy, activePair, setActivePair, onOpenJourney, tcIntegrationFilter, bawIntegrationName }) {
  return (
    <div>
      <div className="explain">
        <span className="lbl">matching key</span>
        <b>operator + departure time + arrival time, identical at every boarding / drop-off stop</b>
      </div>
      <div className="sortbar">
        <span className="sortbar-label">Sort</span>
        <label>
          <input type="radio" name="sortBy" value="departure" checked={sortBy === 'departure'} onChange={() => setSortBy('departure')} />
          {' '}Departure time
        </label>
        <label>
          <input type="radio" name="sortBy" value="score" checked={sortBy === 'score'} onChange={() => setSortBy('score')} />
          {' '}Score
        </label>
      </div>
      <div className="colfilters">
        <div className="colfilter">
          <ViewBawIntegrationFilter integrationName={bawIntegrationName} matchedCount={result.matchedBaw.length} count={result.bawCount} />
        </div>
        <div className="colfilter">
          <ViewTcIntegrationFilter filter={tcIntegrationFilter} />
        </div>
      </div>
      <div className="colheads"><span className="baw">BAW</span><span className="tc">TC</span></div>
      <ViewMatchBoard
        rows={result.sections.singleStation}
        multistation={false}
        unmatchedLabel="Unmatched — no counterpart on the other side"
        sortBy={sortBy}
        activePair={activePair}
        setActivePair={setActivePair}
        onOpenJourney={onOpenJourney}
      />
      {!result.sections.multistation.isEmpty && (
        <>
          <div className="divider">Multistations — the same bus at several stops</div>
          <div className="colheads"><span className="baw">BAW</span><span className="tc">TC</span></div>
          <ViewMatchBoard
            rows={result.sections.multistation}
            multistation={true}
            unmatchedLabel="Unmatched multistations — no counterpart with the same times"
            sortBy="departure"
            activePair={activePair}
            setActivePair={setActivePair}
            onOpenJourney={onOpenJourney}
          />
        </>
      )}
    </div>
  );
}
