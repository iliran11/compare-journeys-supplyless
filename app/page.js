'use client';

import { useEffect, useRef, useState } from 'react';
import { PRESETS } from './presets';
import { prepareComparison } from './prepare';

function DetailCard({ row, side }) {
  return (
    <div className={'card detail ' + side}>
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
      <div className="detail-section">
        <div className="section-title">Ranking</div>
        <div><span className="lbl">score</span><span className="val">{typeof row.score === 'number' && row.score > 0 ? row.score : '—'}</span></div>
        <div><span className="lbl">rank by score</span><span className="val">{row.scoreRank != null ? '#' + row.scoreRank : '—'}</span></div>
      </div>
      <div className="detail-grid">
        <div><span className="lbl">vehicle class</span><span className="val">{row.lineClass || '—'}</span></div>
        <div><span className="lbl">vehicle type</span><span className="val">{row.vehicleType || '—'}</span></div>
        {row.tripId && (
          <div>
            <span className="lbl">admin</span>
            <a
              className="triplink"
              href={'https://admin.bookaway.com/transports/edit/' + row.tripId}
              target="_blank"
              rel="noreferrer"
            >
              {row.tripId} ↗
            </a>
          </div>
        )}
      </div>
      {row.pictures && row.pictures.length > 0 && (
        <div className="detail-section pictures-section">
          <div className="section-title">Pictures</div>
          <div className="pictures">
            {row.pictures.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer">
                <img src={url} alt={row.company + ' picture ' + (i + 1)} loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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

export default function Page() {
  const [fromSlug, setFromSlug] = useState('barranquilla');
  const [toSlug, setToSlug] = useState('riohacha');
  const [date, setDate] = useState('2026-08-16');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showCommon, setShowCommon] = useState(false);
  const [botPrompt, setBotPrompt] = useState('');
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [sortBy, setSortBy] = useState('departure');
  const [activePair, setActivePair] = useState(null);
  const [detailGroup, setDetailGroup] = useState(null);

  useEffect(() => {
    if (detailGroup == null) return;
    function onKey(e) { if (e.key === 'Escape') setDetailGroup(null); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detailGroup]);

  const config = {
    tcCode: 'TRV',
    tcSupplierId: '64cb7cafdff7a93b3203f82b',
    bawCode: 'PIN',
    bawSupplierId: '660d57d138198f88d7da905c',
    passengersAmount: 2,
    searchRadiusInMeters: 1000,
    mode: 'origin',
    skipEnrichment: false,
    filterBySourceOfData: 'PIN'
  };

  function selectRoute(value) {
    const parts = value.split('|');
    setFromSlug(parts[0]);
    setToSlug(parts[1]);
  }

  function currentRoute() {
    for (const preset of PRESETS) {
      for (const route of preset.routes) {
        if (route.fromSlug === fromSlug && route.toSlug === toSlug) return route;
      }
    }
    return null;
  }

  function sortRows(rows) {
    const copy = rows.slice();
    if (sortBy === 'score') {
      copy.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.departure < b.departure ? -1 : 1;
      });
    } else {
      copy.sort(function (a, b) { return a.departure < b.departure ? -1 : 1; });
    }
    return copy;
  }

  function bawResultsUrl(debugValue) {
    const route = currentRoute();
    const country = route && route.countrySlug ? route.countrySlug : 'colombia';
    return 'https://www.bookaway.com/s/' + country + '/' + fromSlug + '-to-' + toSlug + '?departureDate=' + date.trim() + '&debug=' + debugValue;
  }
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

  useEffect(() => {
    run();
  }, []);

  async function run() {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fromSlug: fromSlug.trim(),
          toSlug: toSlug.trim(),
          date: date.trim(),
          config: {
            tcSupplier: { code: config.tcCode.trim(), supplierId: config.tcSupplierId.trim() },
            bawSupplier: { code: config.bawCode.trim(), supplierId: config.bawSupplierId.trim() },
            passengersAmount: Number(config.passengersAmount) || 1,
            searchRadiusInMeters: Number(config.searchRadiusInMeters) || 1000,
            mode: config.mode.trim(),
            skipEnrichment: config.skipEnrichment,
            filterBySourceOfData: config.filterBySourceOfData.trim()
          }
        })
      });
      if (!res.ok) throw new Error('search API returned ' + res.status);
      const data = await res.json();

      setBotPrompt(
        '#RAW RESULTS FROM TC\n' + JSON.stringify(data.tc, null, 2) +
        '\n\n#RAW RESULTS FROM BAW\n' + JSON.stringify(data.baw, null, 2)
      );

      const prepared = prepareComparison(data.tc, data.baw);

      setActivePair(null);
      setResult(prepared);
      setStatus('TC: ' + prepared.tcCount + ' journeys · BAW: ' + prepared.bawCount + ' journeys · matched groups: ' + prepared.matchedGroups);
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <main>
      <h1>TC vs BAW Journey Matcher</h1>
      <p className="sub">Fires both composite searches, matches journeys by operator + departure + arrival time, links every counterpart (many-to-many).</p>

      <div className="controls">
        <div>
          <label htmlFor="route">Route</label>
          <select id="route" value={fromSlug + '|' + toSlug} onChange={(e) => selectRoute(e.target.value)}>
            {PRESETS.map((p) => (
              <optgroup key={p.name} label={p.name}>
                {p.routes.map((r) => (
                  <option key={r.fromSlug + '|' + r.toSlug} value={r.fromSlug + '|' + r.toSlug}>
                    {r.fromSlug} → {r.toSlug}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input id="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button onClick={run} disabled={loading}>Search both</button>
        <button
          className="iconbtn"
          onClick={() => setShowConfig(!showConfig)}
          aria-expanded={showConfig}
          aria-label="Request configuration"
          title="Request configuration"
        >
          ⚙
        </button>
        <span className="status">{status}</span>
      </div>

      {loading && (
        <div className="loader-overlay">
          <div className="loader-box">
            <svg className="spinner" width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="21" stroke="var(--line)" strokeWidth="4" />
              <path d="M 26 5 A 21 21 0 0 1 47 26" stroke="var(--tc)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 26 47 A 21 21 0 0 1 5 26" stroke="var(--baw)" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="loader-title">Comparing live inventory</div>
            <div className="loader-hint">Fetching results from the TC and BAW integrations…</div>
          </div>
        </div>
      )}

      {showConfig && (
        <div className="config">
          <div className="config-section">
            <button className="config-toggle" onClick={() => setShowCommon(!showCommon)} aria-expanded={showCommon}>
              <span className="config-title">Common</span>
              <span className="chevron">{showCommon ? '▾' : '▸'}</span>
            </button>
            {showCommon && (
              <div className="config-grid">
                <div>
                  <label htmlFor="passengersAmount">Passengers</label>
                  <input id="passengersAmount" value={config.passengersAmount} readOnly />
                </div>
                <div>
                  <label htmlFor="searchRadiusInMeters">Search radius (m)</label>
                  <input id="searchRadiusInMeters" value={config.searchRadiusInMeters} readOnly />
                </div>
                <div>
                  <label htmlFor="mode">Mode</label>
                  <input id="mode" value={config.mode} readOnly />
                </div>
                <div>
                  <label htmlFor="filterBySourceOfData">Filter by source of data</label>
                  <input id="filterBySourceOfData" value={config.filterBySourceOfData} readOnly />
                </div>
              </div>
            )}
          </div>

          <div className="config-section side tc-side">
            <div className="config-title tc">TC request</div>
            <div className="config-grid">
              <div>
                <label htmlFor="tcCode">Supplier code</label>
                <input id="tcCode" value={config.tcCode} readOnly />
              </div>
              <div>
                <label htmlFor="tcSupplierId">Supplier ID</label>
                <input id="tcSupplierId" className="wide" value={config.tcSupplierId} readOnly />
              </div>
              <div className="openlink">
                <button className="secondary" onClick={() => window.open(bawResultsUrl('PIN-TC'), '_blank')} title={bawResultsUrl('PIN-TC')}>
                  BAW search results (?debug=PIN-TC) ↗
                </button>
              </div>
            </div>
          </div>

          <div className="config-section side baw-side">
            <div className="config-title baw">BAW request</div>
            <div className="config-grid">
              <div>
                <label htmlFor="bawCode">Supplier code</label>
                <input id="bawCode" value={config.bawCode} readOnly />
              </div>
              <div>
                <label htmlFor="bawSupplierId">Supplier ID</label>
                <input id="bawSupplierId" className="wide" value={config.bawSupplierId} readOnly />
              </div>
              <div className="openlink">
                <button className="secondary" onClick={() => window.open(bawResultsUrl('PIN-BAW'), '_blank')} title={bawResultsUrl('PIN-BAW')}>
                  BAW search results (?debug=PIN-BAW) ↗
                </button>
              </div>
            </div>
          </div>

          <div className="config-section">
            <div className="prompt-head">
              <div className="config-title">Prompt for bot</div>
              <button className="secondary" onClick={() => setPromptExpanded(!promptExpanded)}>
                {promptExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
            <textarea
              className={'prompt-area' + (promptExpanded ? ' expanded' : '')}
              value={botPrompt}
              onChange={(e) => setBotPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setPromptExpanded(false); }}
              placeholder="Run a search to pre-populate with the raw TC and BAW responses."
            />
            {promptExpanded && (
              <button className="prompt-close" onClick={() => setPromptExpanded(false)}>Collapse ✕</button>
            )}
          </div>
        </div>
      )}

      {result && (
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
          <div className="colheads"><span className="baw">BAW (PIN)</span><span className="tc">TC (TRV)</span></div>
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
                  <Card key={i} row={row} side="baw" unmatched={false} pairId={row.groupId} activePair={activePair} onActivate={setActivePair} onOpen={setDetailGroup} />
                ))}
              </div>
              <div className="col" ref={tcColRef}>
                {result.matchedTc.length === 0 && <div className="empty">No matches</div>}
                {sortRows(result.matchedTc).map((row, i) => (
                  <Card key={i} row={row} side="tc" unmatched={false} pairId={row.groupId} activePair={activePair} onActivate={setActivePair} onOpen={setDetailGroup} />
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
      )}

      {result && detailGroup != null && (
        <div className="overlay" onClick={() => setDetailGroup(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="config-title">Matching group — side by side</div>
              <button className="secondary" onClick={() => setDetailGroup(null)}>Close ✕</button>
            </div>
            {(() => {
              const groupRow = result.matchedBaw.find((r) => r.groupId === detailGroup) || result.matchedTc.find((r) => r.groupId === detailGroup);
              if (!groupRow) return null;
              return (
                <div className="explain">
                  <span className="lbl">matching key</span>
                  <b>{groupRow.company}</b> · departure <b>{groupRow.departure.slice(11)}</b> · arrival <b>{groupRow.arrival.slice(11)}</b>
                </div>
              );
            })()}
            {(() => {
              const groupRow = result.matchedBaw.find((r) => r.groupId === detailGroup) || result.matchedTc.find((r) => r.groupId === detailGroup);
              if (!groupRow) return null;
              function padTime(time, minutesDelta) {
                const parts = time.split(':');
                let total = Number(parts[0]) * 60 + Number(parts[1]) + minutesDelta;
                if (total < 0) total = 0;
                if (total > 1439) total = 1439;
                const h = String(Math.floor(total / 60)).padStart(2, '0');
                const m = String(total % 60).padStart(2, '0');
                return h + ':' + m;
              }
              const departureTime = groupRow.departure.slice(11);
              const timeWindow = padTime(departureTime, -30) + '-' + padTime(departureTime, 30);
              const supplierParam = groupRow.supplierFilterId ? '&suppliers=' + encodeURIComponent(groupRow.supplierFilterId) : '';
              const filterParams = supplierParam + '&departureTime=' + timeWindow;
              return (
                <div className="explain">
                  <span className="lbl">links</span>
                  <a href={bawResultsUrl('PIN-BAW') + filterParams} target="_blank" rel="noreferrer">BAW search results (operator + {timeWindow}) ↗</a>
                  {' · '}
                  <a href={bawResultsUrl('PIN-TC') + filterParams} target="_blank" rel="noreferrer">TC search results (operator + {timeWindow}) ↗</a>
                </div>
              );
            })()}
            <div className="colheads"><span className="baw">BAW (PIN)</span><span className="tc">TC (TRV)</span></div>
            <div className="cols modal-cols">
              <div className="col">
                {result.matchedBaw.filter((r) => r.groupId === detailGroup).map((r, i) => (
                  <DetailCard key={i} row={r} side="baw" />
                ))}
              </div>
              <div className="col">
                {result.matchedTc.filter((r) => r.groupId === detailGroup).map((r, i) => (
                  <DetailCard key={i} row={r} side="tc" />
                ))}
              </div>
            </div>
            {(() => {
              const bawRows = result.matchedBaw.filter((r) => r.groupId === detailGroup);
              const tcRows = result.matchedTc.filter((r) => r.groupId === detailGroup);
              function scoreText(rows) {
                return rows.map((r) => {
                  const score = typeof r.score === 'number' && r.score > 0 ? Math.round(r.score) : '—';
                  const rank = r.scoreRank != null ? '#' + r.scoreRank : '—';
                  return score + ' (rank ' + rank + ')';
                }).join(' · ') || '—';
              }
              function classText(rows) {
                return rows.map((r) => r.lineClass || '—').join(' · ') || '—';
              }
              function picturesText(rows) {
                return rows.map((r) => (r.pictures ? r.pictures.length : 0) + ' pictures').join(' · ') || '—';
              }
              function stationsText(rows) {
                return rows.map((r) => (r.fromStation || '—') + ' → ' + (r.toStation || '—')).join(' · ') || '—';
              }
              function vehicleTypeText(rows) {
                return rows.map((r) => r.vehicleType || '—').join(' · ') || '—';
              }
              return (
                <div className="explain diff">
                  <span className="lbl">diff</span>
                  <table className="diff-table">
                    <thead>
                      <tr><th></th><th className="baw">BAW (PIN)</th><th className="tc">TC (TRV)</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Price</td><td>{bawRows.map((r) => (r.price != null ? '$' + r.price.toFixed(2) : '—')).join(' · ') || '—'}</td><td>{tcRows.map((r) => (r.price != null ? '$' + r.price.toFixed(2) : '—')).join(' · ') || '—'}</td></tr>
                      <tr><td>Ranking</td><td>{scoreText(bawRows)}</td><td>{scoreText(tcRows)}</td></tr>
                      <tr><td>Stations</td><td>{stationsText(bawRows)}</td><td>{stationsText(tcRows)}</td></tr>
                      <tr><td>Class</td><td>{classText(bawRows)}</td><td>{classText(tcRows)}</td></tr>
                      <tr><td>Vehicle type</td><td>{vehicleTypeText(bawRows)}</td><td>{vehicleTypeText(tcRows)}</td></tr>
                      <tr><td>Pictures</td><td>{picturesText(bawRows)}</td><td>{picturesText(tcRows)}</td></tr>
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}
