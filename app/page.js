'use client';

import { useEffect, useState } from 'react';
import { PRESETS, BASE_URL } from './config';
import { prepareComparison } from './prepare';
import ViewRoot from './views/ViewRoot';
import ViewJourneyCompare from './views/ViewJourneyCompare';
import ViewTabBar from './views/ViewTabBar';

export default function Page() {
  const [fromSlug, setFromSlug] = useState('barranquilla');
  const [toSlug, setToSlug] = useState('riohacha');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
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
  const [activeTab, setActiveTab] = useState('compare');

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

  function bawResultsUrl(debugValue) {
    const route = currentRoute();
    const country = route && route.countrySlug ? route.countrySlug : 'colombia';
    return BASE_URL + '/s/' + country + '/' + fromSlug + '-to-' + toSlug + '?departureDate=' + date.trim() + '&debug=' + debugValue;
  }

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

      {result && <ViewTabBar activeTab={activeTab} setActiveTab={setActiveTab} />}

      {result && activeTab === 'compare' && (
        <ViewRoot
          result={result}
          sortBy={sortBy}
          setSortBy={setSortBy}
          activePair={activePair}
          setActivePair={setActivePair}
          onOpenJourney={setDetailGroup}
        />
      )}

      {result && activeTab === 'scoring' && (
        <div className="explain">Scoring — coming soon.</div>
      )}

      {result && detailGroup != null && (
        <ViewJourneyCompare
          result={result}
          detailGroup={detailGroup}
          onClose={() => setDetailGroup(null)}
          bawResultsUrl={bawResultsUrl}
        />
      )}
    </main>
  );
}
