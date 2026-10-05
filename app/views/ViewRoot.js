'use client';

import sortRows from '../logic/sortRows';
import useWireDrawing from '../logic/useWireDrawing';
import ViewBawIntegrationFilter from './ViewBawIntegrationFilter';
import ViewTcIntegrationFilter from './ViewTcIntegrationFilter';

function Card({ row, side, unmatched, pairId, activePair, onActivate, onOpen }) {
  let className = 'card ' + side + (unmatched ? ' unmatched' : '');
  if (pairId != null && activePair != null) {
    className += pairId === activePair ? ' highlight' : ' dim';
  }
  return (
    <div
      className={className}
      data-pair={pairId != null ? pairId : undefined}
      onMouseEnter={onActivate ? () => onActivate(pairId) : undefined}
      onMouseLeave={onActivate ? () => onActivate(null) : undefined}
      onClick={onOpen ? () => onOpen(pairId) : undefined}
    >
      <div className="rc-key">
        <span className="rc-times">
          <span className="time">{row.departure.slice(11)}</span>
          <span className="rc-arrow">→</span>
          <span className="time">{row.arrival.slice(11)}</span>
        </span>
        <span className="rc-op">{row.company}</span>
        <span className="rc-class">{row.lineClass || '—'}</span>
      </div>
      <div className="rc-misc">
        <div className="rc-misc-row">
          <span className="rc-station" title={row.fromStation}>{row.fromStation || '—'}</span>
          <span className="rc-arrow">→</span>
          <span className="rc-station" title={row.toStation}>{row.toStation || '—'}</span>
        </div>
        <div className="rc-misc-row">
          {row.tripId && (
            <a
              className="triplink"
              href={'https://admin.bookaway.com/transports/edit/' + row.tripId}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {row.tripId} ↗
            </a>
          )}
          {side === 'tc' && <span className="rc-integration">{row.integrationCode}</span>}
          <span className="rc-spacer" />
          <span className="rc-pics" title="Pictures">📷 {row.pictures ? row.pictures.length : 0}</span>
          <span className="rc-price">{row.price != null ? '$' + row.price.toFixed(2) : '—'}</span>
        </div>
        <div className="rc-remote">
          <div className="rc-remote-title">Remote</div>
          <div className="rc-misc-row">
            <span className="lbl">from</span>
            <span className="rc-station" title={row.remoteFrom.name}>{row.remoteFrom.name || '—'}</span>
            <span className="rc-remote-id">{row.remoteFrom.id || '—'}</span>
          </div>
          <div className="rc-misc-row">
            <span className="lbl">to</span>
            <span className="rc-station" title={row.remoteTo.name}>{row.remoteTo.name || '—'}</span>
            <span className="rc-remote-id">{row.remoteTo.id || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewRoot({ result, sortBy, setSortBy, activePair, setActivePair, onOpenJourney, tcIntegrationFilter, bawIntegrationName }) {
  const { wires, boardRef, tcColRef, bawColRef } = useWireDrawing(result, sortBy);

  return (
    <div>
      <div className="explain">
        <span className="lbl">matching key</span>
        <b>operator + departure time + arrival time</b>
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
          <ViewBawIntegrationFilter integrationName={bawIntegrationName} count={result.bawCount} />
        </div>
        <div className="colfilter">
          <ViewTcIntegrationFilter filter={tcIntegrationFilter} />
        </div>
      </div>
      <div className="colheads"><span className="baw">BAW</span><span className="tc">TC</span></div>
      <div className="board" ref={boardRef}>
        <svg className="wires" viewBox={wires.viewBox} preserveAspectRatio="none">
          {wires.paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke="var(--match)"
              strokeWidth={activePair === p.pairId ? 2.5 : 1.5}
              opacity={activePair == null ? 0.7 : (activePair === p.pairId ? 1 : 0.12)}
            />
          ))}
        </svg>
        <div className="cols">
          <div className="col" ref={bawColRef}>
            {result.matchedBaw.length === 0 && <div className="empty">No matches</div>}
            {sortRows(result.matchedBaw, sortBy).map((row, i) => (
              <Card key={i} row={row} side="baw" unmatched={false} pairId={row.groupId} activePair={activePair} onActivate={setActivePair} onOpen={onOpenJourney} />
            ))}
          </div>
          <div className="col" ref={tcColRef}>
            {result.matchedTc.length === 0 && <div className="empty">No matches</div>}
            {sortRows(result.matchedTc, sortBy).map((row, i) => (
              <Card key={i} row={row} side="tc" unmatched={false} pairId={row.groupId} activePair={activePair} onActivate={setActivePair} onOpen={onOpenJourney} />
            ))}
          </div>
        </div>
      </div>
      <div className="divider">Unmatched — no counterpart on the other side</div>
      <div className="cols">
        <div className="col">
          {result.bawOnly.length === 0 && <div className="empty">None</div>}
          {result.bawOnly.map((r, i) => <Card key={i} row={r} side="baw" unmatched={true} />)}
        </div>
        <div className="col">
          {result.tcOnly.length === 0 && <div className="empty">None</div>}
          {result.tcOnly.map((r, i) => <Card key={i} row={r} side="tc" unmatched={true} />)}
        </div>
      </div>
    </div>
  );
}
