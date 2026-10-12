'use client';

import sortRows from '../logic/sortRows';
import useWireDrawing from '../logic/useWireDrawing';
import ViewMatchCard from './ViewMatchCard';

// One section of the route page: matched BAW / TC columns joined by wires, then the rows without a counterpart.
export default function ViewMatchBoard({ rows, multistation, unmatchedLabel, sortBy, activePair, setActivePair, onOpenJourney }) {
  const { wires, boardRef, tcColRef, bawColRef } = useWireDrawing(rows, sortBy);

  return (
    <>
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
            {rows.matchedBaw.length === 0 && <div className="empty">No matches</div>}
            {sortRows(rows.matchedBaw, sortBy).map((row, i) => (
              <ViewMatchCard key={i} row={row} side="baw" unmatched={false} multistation={multistation} index={i} pairId={row.groupId} activePair={activePair} onActivate={setActivePair} onOpen={onOpenJourney} />
            ))}
          </div>
          <div className="col" ref={tcColRef}>
            {rows.matchedTc.length === 0 && <div className="empty">No matches</div>}
            {sortRows(rows.matchedTc, sortBy).map((row, i) => (
              <ViewMatchCard key={i} row={row} side="tc" unmatched={false} multistation={multistation} index={i} pairId={row.groupId} activePair={activePair} onActivate={setActivePair} onOpen={onOpenJourney} />
            ))}
          </div>
        </div>
      </div>
      <div className="divider">{unmatchedLabel}</div>
      <div className="cols">
        <div className="col">
          {rows.bawOnly.length === 0 && <div className="empty">None</div>}
          {sortRows(rows.bawOnly, sortBy).map((r, i) => <ViewMatchCard key={i} row={r} side="baw" unmatched={true} multistation={multistation} />)}
        </div>
        <div className="col">
          {rows.tcOnly.length === 0 && <div className="empty">None</div>}
          {sortRows(rows.tcOnly, sortBy).map((r, i) => <ViewMatchCard key={i} row={r} side="tc" unmatched={true} multistation={multistation} />)}
        </div>
      </div>
    </>
  );
}
