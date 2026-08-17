'use client';

import sortRows from '../logic/sortRows';
import useWireDrawing from '../logic/useWireDrawing';

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
      <span className="price"><span className="lbl">price</span>{row.price != null ? '$' + row.price.toFixed(2) : '—'}</span>
      <span className="lbl">operator</span><span className="op">{row.company}</span>
      <div className="detail-sections">
        <div className="detail-section">
          <div className="section-title">Departure</div>
          <div><span className="lbl">time</span><span className="time">{row.departure.slice(11)}</span></div>
          <div><span className="lbl">station</span><span className="val">{row.fromStation || '—'}</span></div>
        </div>
        <div className="detail-section">
          <div className="section-title">Arrival</div>
          <div><span className="lbl">time</span><span className="time">{row.arrival.slice(11)}</span></div>
          <div><span className="lbl">station</span><span className="val">{row.toStation || '—'}</span></div>
        </div>
      </div>
    </div>
  );
}

export default function ViewRoot({ result, sortBy, setSortBy, activePair, setActivePair, onOpenJourney }) {
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
