'use client';

import { useEffect, useRef, useState } from 'react';

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

export default function RootCompare({ result, sortBy, setSortBy, activePair, setActivePair, onOpenJourney }) {
  const [wires, setWires] = useState({ viewBox: '0 0 0 0', paths: [] });

  const boardRef = useRef(null);
  const tcColRef = useRef(null);
  const bawColRef = useRef(null);

  function drawWires() {
    const board = boardRef.current;
    if (!board || !tcColRef.current || !bawColRef.current) return;
    const boardRect = board.getBoundingClientRect();
    const rightByGroup = new Map();
    for (const el of tcColRef.current.children) {
      if (!el.dataset || el.dataset.pair == null) continue;
      if (!rightByGroup.has(el.dataset.pair)) rightByGroup.set(el.dataset.pair, []);
      rightByGroup.get(el.dataset.pair).push(el);
    }
    const paths = [];
    for (const el of bawColRef.current.children) {
      if (!el.dataset || el.dataset.pair == null) continue;
      const others = rightByGroup.get(el.dataset.pair) || [];
      for (const other of others) {
        const a = el.getBoundingClientRect();
        const b = other.getBoundingClientRect();
        const x1 = a.right - boardRect.left;
        const y1 = a.top + a.height / 2 - boardRect.top;
        const x2 = b.left - boardRect.left;
        const y2 = b.top + b.height / 2 - boardRect.top;
        const mx = (x1 + x2) / 2;
        paths.push({
          pairId: Number(el.dataset.pair),
          d: 'M ' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2
        });
      }
    }
    setWires({ viewBox: '0 0 ' + boardRect.width + ' ' + boardRect.height, paths: paths });
  }

  useEffect(() => {
    if (!result) return;
    const raf = requestAnimationFrame(drawWires);
    window.addEventListener('resize', drawWires);
    const observer = new ResizeObserver(drawWires);
    if (boardRef.current) observer.observe(boardRef.current);
    if (tcColRef.current) observer.observe(tcColRef.current);
    if (bawColRef.current) observer.observe(bawColRef.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', drawWires);
      observer.disconnect();
    };
  }, [result, sortBy]);

  function sortRows(rows) {
    const copy = rows.slice();
    if (sortBy === 'score') {
      copy.sort(function (a, b) {
        const rankA = a.scoreRank != null ? a.scoreRank : Infinity;
        const rankB = b.scoreRank != null ? b.scoreRank : Infinity;
        if (rankA !== rankB) return rankA - rankB;
        return a.departure < b.departure ? -1 : 1;
      });
    } else {
      copy.sort(function (a, b) { return a.departure < b.departure ? -1 : 1; });
    }
    return copy;
  }

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
            {sortRows(result.matchedBaw).map((row, i) => (
              <Card key={i} row={row} side="baw" unmatched={false} pairId={row.groupId} activePair={activePair} onActivate={setActivePair} onOpen={onOpenJourney} />
            ))}
          </div>
          <div className="col" ref={tcColRef}>
            {result.matchedTc.length === 0 && <div className="empty">No matches</div>}
            {sortRows(result.matchedTc).map((row, i) => (
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
