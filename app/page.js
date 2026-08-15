'use client';

import { useEffect, useRef, useState } from 'react';
import { PRESETS } from './presets';

function flatten(response) {
  const rows = [];
  const trips = (response.trips || []).concat(response.alternativeTrips || []);
  for (const trip of trips) {
    const tripId = trip._id;
    for (const leg of trip.legs || []) {
      for (const j of leg.journeys || []) {
        const dep = new Date(j.departure.date).toLocaleString('sv-SE', { timeZone: j.departure.timezone }).slice(0, 16);
        const arr = new Date(j.arrival.date).toLocaleString('sv-SE', { timeZone: j.arrival.timezone }).slice(0, 16);
        rows.push({
          tripId: tripId,
          company: leg.companyName || '',
          lineClass: leg.lineClass || '',
          fromStation: leg.from ? leg.from.name : '',
          departure: dep,
          arrival: arr,
          price: j.price ? j.price.amount : null,
          score: typeof trip.originalScore === 'number' ? trip.originalScore : (typeof trip.score === 'number' ? trip.score : 0)
        });
      }
    }
  }
  rows.sort(function (a, b) { return a.departure < b.departure ? -1 : 1; });
  return rows;
}

function matchKey(row) {
  return row.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '|' + row.departure;
}

function Card({ row, side, unmatched, pairId, activePair, onActivate }) {
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
      onClick={onActivate ? () => onActivate(pairId) : undefined}
    >
      <span className="price">{row.price != null ? '$' + row.price.toFixed(2) : '—'}</span>
      <span className="time">{row.departure.slice(11)}</span> → {row.arrival.slice(11)}{' '}
      <span className="op">{row.company}</span>
      <div className="meta">
        {row.lineClass}{row.fromStation ? ' · ' + row.fromStation : ''}
        {typeof row.score === 'number' && row.score > 0 ? ' · score ' + row.score : ''}
      </div>
      {row.tripId && (
        <div className="meta">
          <a
            className="triplink"
            href={'https://admin.bookaway.com/transports/edit/' + row.tripId}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {row.tripId} ↗
          </a>
        </div>
      )}
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

  function sortSide(pairs, side) {
    const copy = pairs.slice();
    if (sortBy === 'score') {
      copy.sort(function (a, b) {
        if (b[side].score !== a[side].score) return b[side].score - a[side].score;
        return a[side].departure < b[side].departure ? -1 : 1;
      });
    } else {
      copy.sort(function (a, b) { return a[side].departure < b[side].departure ? -1 : 1; });
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
    const rightByPair = new Map();
    for (const el of bawColRef.current.children) {
      if (el.dataset && el.dataset.pair != null) rightByPair.set(el.dataset.pair, el);
    }
    const paths = [];
    for (const el of tcColRef.current.children) {
      if (!el.dataset || el.dataset.pair == null) continue;
      const other = rightByPair.get(el.dataset.pair);
      if (!other) continue;
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
    setWires({ viewBox: '0 0 ' + boardRect.width + ' ' + boardRect.height, paths: paths });
  }

  useEffect(() => {
    if (!result) return;
    const raf = requestAnimationFrame(drawWires);
    window.addEventListener('resize', drawWires);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', drawWires);
    };
  }, [result, sortBy]);

  async function run() {
    setLoading(true);
    setStatus('Searching both sources…');
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

      const tcRows = flatten(data.tc);
      const bawRows = flatten(data.baw);

      const bawByKey = new Map();
      for (const row of bawRows) bawByKey.set(matchKey(row), row);

      const pairs = [];
      const tcOnly = [];
      const usedBawKeys = new Set();
      for (const row of tcRows) {
        const key = matchKey(row);
        if (bawByKey.has(key) && !usedBawKeys.has(key)) {
          pairs.push({ tc: row, baw: bawByKey.get(key) });
          usedBawKeys.add(key);
        } else {
          tcOnly.push(row);
        }
      }
      const bawOnly = bawRows.filter(function (row) { return !usedBawKeys.has(matchKey(row)); });

      pairs.sort(function (a, b) { return a.tc.departure < b.tc.departure ? -1 : 1; });
      pairs.forEach(function (p, i) { p.id = i; });

      setActivePair(null);
      setResult({ pairs, tcOnly, bawOnly });
      setStatus('TC: ' + tcRows.length + ' journeys · BAW: ' + bawRows.length + ' journeys · matched: ' + pairs.length);
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <main>
      <h1>TC vs BAW Journey Matcher</h1>
      <p className="sub">Fires both composite searches, matches journeys by operator + departure time, links the pairs.</p>

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
          <div className="colheads"><span className="tc">TC (TRV)</span><span className="baw">BAW (PIN)</span></div>
          <div className="board" ref={boardRef}>
            <svg className="wires" viewBox={wires.viewBox} preserveAspectRatio="none">
              {wires.paths.map((p) => (
                <path
                  key={p.pairId}
                  d={p.d}
                  fill="none"
                  stroke="var(--match)"
                  strokeWidth={activePair === p.pairId ? 2.5 : 1.5}
                  opacity={activePair == null ? 0.7 : (activePair === p.pairId ? 1 : 0.12)}
                />
              ))}
            </svg>
            <div className="cols">
              <div className="col" ref={tcColRef}>
                {result.pairs.length === 0 && <div className="empty">No matches</div>}
                {sortSide(result.pairs, 'tc').map((p) => (
                  <Card key={p.id} row={p.tc} side="tc" unmatched={false} pairId={p.id} activePair={activePair} onActivate={setActivePair} />
                ))}
              </div>
              <div className="col" ref={bawColRef}>
                {result.pairs.length === 0 && <div className="empty">No matches</div>}
                {sortSide(result.pairs, 'baw').map((p) => (
                  <Card key={p.id} row={p.baw} side="baw" unmatched={false} pairId={p.id} activePair={activePair} onActivate={setActivePair} />
                ))}
              </div>
            </div>
          </div>
          <div className="divider">Unmatched — no counterpart on the other side</div>
          <div className="cols">
            <div className="col">
              {result.tcOnly.length === 0 && <div className="empty">None</div>}
              {result.tcOnly.map((r, i) => <Card key={i} row={r} side="tc" unmatched={true} />)}
            </div>
            <div className="col">
              {result.bawOnly.length === 0 && <div className="empty">None</div>}
              {result.bawOnly.map((r, i) => <Card key={i} row={r} side="baw" unmatched={true} />)}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
