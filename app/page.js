'use client';

import { useEffect, useRef, useState } from 'react';

function flatten(response) {
  const rows = [];
  const trips = (response.trips || []).concat(response.alternativeTrips || []);
  for (const trip of trips) {
    for (const leg of trip.legs || []) {
      for (const j of leg.journeys || []) {
        const dep = new Date(j.departure.date).toLocaleString('sv-SE', { timeZone: j.departure.timezone }).slice(0, 16);
        const arr = new Date(j.arrival.date).toLocaleString('sv-SE', { timeZone: j.arrival.timezone }).slice(0, 16);
        rows.push({
          company: leg.companyName || '',
          lineClass: leg.lineClass || '',
          fromStation: leg.from ? leg.from.name : '',
          departure: dep,
          arrival: arr,
          price: j.price ? j.price.amount : null
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

function Card({ row, side, unmatched }) {
  return (
    <div className={'card ' + side + (unmatched ? ' unmatched' : '')}>
      <span className="price">{row.price != null ? '$' + row.price.toFixed(2) : '—'}</span>
      <span className="time">{row.departure.slice(11)}</span> → {row.arrival.slice(11)}{' '}
      <span className="op">{row.company}</span>
      <div className="meta">{row.lineClass}{row.fromStation ? ' · ' + row.fromStation : ''}</div>
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
  const [config, setConfig] = useState({
    tcCode: 'TRV',
    tcSupplierId: '64cb7cafdff7a93b3203f82b',
    bawCode: 'PIN',
    bawSupplierId: '660d57d138198f88d7da905c',
    passengersAmount: 2,
    searchRadiusInMeters: 1000,
    mode: 'origin',
    skipEnrichment: false,
    filterBySourceOfData: 'PIN'
  });

  function setConfigField(field, value) {
    setConfig(function (prev) {
      const next = Object.assign({}, prev);
      next[field] = value;
      return next;
    });
  }
  const [wires, setWires] = useState({ viewBox: '0 0 0 0', paths: [] });

  const boardRef = useRef(null);
  const tcColRef = useRef(null);
  const bawColRef = useRef(null);

  function drawWires() {
    const board = boardRef.current;
    if (!board || !tcColRef.current || !bawColRef.current) return;
    const boardRect = board.getBoundingClientRect();
    const left = tcColRef.current.children;
    const right = bawColRef.current.children;
    const paths = [];
    const count = Math.min(left.length, right.length);
    for (let i = 0; i < count; i++) {
      const a = left[i].getBoundingClientRect();
      const b = right[i].getBoundingClientRect();
      const x1 = a.right - boardRect.left;
      const y1 = a.top + a.height / 2 - boardRect.top;
      const x2 = b.left - boardRect.left;
      const y2 = b.top + b.height / 2 - boardRect.top;
      const mx = (x1 + x2) / 2;
      paths.push('M ' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2);
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
  }, [result]);

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
          <label htmlFor="from">From slug</label>
          <input id="from" value={fromSlug} onChange={(e) => setFromSlug(e.target.value)} />
        </div>
        <div>
          <label htmlFor="to">To slug</label>
          <input id="to" value={toSlug} onChange={(e) => setToSlug(e.target.value)} />
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
          <div className="config-title">Request configuration</div>
          <div className="config-grid">
            <div>
              <label htmlFor="tcCode">TC supplier code</label>
              <input id="tcCode" value={config.tcCode} onChange={(e) => setConfigField('tcCode', e.target.value)} />
            </div>
            <div>
              <label htmlFor="tcSupplierId">TC supplier ID</label>
              <input id="tcSupplierId" className="wide" value={config.tcSupplierId} onChange={(e) => setConfigField('tcSupplierId', e.target.value)} />
            </div>
            <div>
              <label htmlFor="bawCode">BAW supplier code</label>
              <input id="bawCode" value={config.bawCode} onChange={(e) => setConfigField('bawCode', e.target.value)} />
            </div>
            <div>
              <label htmlFor="bawSupplierId">BAW supplier ID</label>
              <input id="bawSupplierId" className="wide" value={config.bawSupplierId} onChange={(e) => setConfigField('bawSupplierId', e.target.value)} />
            </div>
            <div>
              <label htmlFor="passengersAmount">Passengers</label>
              <input id="passengersAmount" value={config.passengersAmount} onChange={(e) => setConfigField('passengersAmount', e.target.value)} />
            </div>
            <div>
              <label htmlFor="searchRadiusInMeters">Search radius (m)</label>
              <input id="searchRadiusInMeters" value={config.searchRadiusInMeters} onChange={(e) => setConfigField('searchRadiusInMeters', e.target.value)} />
            </div>
            <div>
              <label htmlFor="mode">Mode</label>
              <input id="mode" value={config.mode} onChange={(e) => setConfigField('mode', e.target.value)} />
            </div>
            <div>
              <label htmlFor="filterBySourceOfData">Filter by source of data</label>
              <input id="filterBySourceOfData" value={config.filterBySourceOfData} onChange={(e) => setConfigField('filterBySourceOfData', e.target.value)} />
            </div>
            <div className="check">
              <label htmlFor="skipEnrichment">
                <input
                  id="skipEnrichment"
                  type="checkbox"
                  checked={config.skipEnrichment}
                  onChange={(e) => setConfigField('skipEnrichment', e.target.checked)}
                />{' '}
                Skip enrichment
              </label>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div>
          <div className="colheads"><span className="tc">TC (TRV)</span><span className="baw">BAW (PIN)</span></div>
          <div className="board" ref={boardRef}>
            <svg className="wires" viewBox={wires.viewBox} preserveAspectRatio="none">
              {wires.paths.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="var(--match)" strokeWidth="1.5" opacity="0.7" />
              ))}
            </svg>
            <div className="cols">
              <div className="col" ref={tcColRef}>
                {result.pairs.length === 0 && <div className="empty">No matches</div>}
                {result.pairs.map((p, i) => <Card key={i} row={p.tc} side="tc" unmatched={false} />)}
              </div>
              <div className="col" ref={bawColRef}>
                {result.pairs.length === 0 && <div className="empty">No matches</div>}
                {result.pairs.map((p, i) => <Card key={i} row={p.baw} side="baw" unmatched={false} />)}
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
