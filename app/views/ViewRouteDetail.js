'use client';

import { useState } from 'react';
import buildBawResultsUrl from '../logic/buildBawResultsUrl';
import ViewTabBar from './ViewTabBar';
import ViewRoot from './ViewRoot';
import ViewVehicleClassCompare from './ViewVehicleClassCompare';
import ViewPriceCompare from './ViewPriceCompare';

export default function ViewRouteDetail({ route, date, config, onBack, onOpenJourney }) {
  const [showConfig, setShowConfig] = useState(false);
  const [showCommon, setShowCommon] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);
  const [sortBy, setSortBy] = useState('departure');
  const [activePair, setActivePair] = useState(null);
  const [activeTab, setActiveTab] = useState('compare');

  const result = route.result;

  function bawResultsUrl(debugValue) {
    return buildBawResultsUrl(route, date, debugValue);
  }

  const botPrompt =
    '#RAW RESULTS FROM TC\n' + JSON.stringify(route.rawTc, null, 2) +
    '\n\n#RAW RESULTS FROM BAW\n' + JSON.stringify(route.rawBaw, null, 2);

  return (
    <div className="page">
      <div className="page-head">
        <div className="config-title">
          {route.fromSlug} → {route.toSlug} <b>{date}</b>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="iconbtn"
            onClick={() => setShowConfig(!showConfig)}
            aria-expanded={showConfig}
            aria-label="Request configuration"
            title="Request configuration"
          >
            ⚙
          </button>
          <button className="secondary" onClick={onBack}>← Back to list</button>
        </div>
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
              readOnly
              onKeyDown={(e) => { if (e.key === 'Escape') setPromptExpanded(false); }}
            />
            {promptExpanded && (
              <button className="prompt-close" onClick={() => setPromptExpanded(false)}>Collapse ✕</button>
            )}
          </div>
        </div>
      )}

      <ViewTabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'compare' && (
        <ViewRoot
          result={result}
          sortBy={sortBy}
          setSortBy={setSortBy}
          activePair={activePair}
          setActivePair={setActivePair}
          onOpenJourney={onOpenJourney}
        />
      )}

      {activeTab === 'vehicleClass' && (
        <ViewVehicleClassCompare result={result} />
      )}

      {activeTab === 'price' && (
        <ViewPriceCompare result={result} />
      )}
    </div>
  );
}
