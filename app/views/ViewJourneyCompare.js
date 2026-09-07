'use client';

import { useState } from 'react';
import ViewJourneyCompareTabCompare from './ViewJourneyCompareTabCompare';
import ViewJourneyCompareTabDiff from './ViewJourneyCompareTabDiff';
import ViewJourneyCompareTabMisc from './ViewJourneyCompareTabMisc';

const TABS = [
  { key: 'compare', label: 'Compare' },
  { key: 'diff', label: 'Diff' },
  { key: 'misc', label: 'Misc' },
];

export default function ViewJourneyCompare({ result, detailGroup, onBack, bawResultsUrl, route, date }) {
  const [activeTab, setActiveTab] = useState('compare');

  const bawRows = result.matchedBaw.filter((r) => r.groupId === detailGroup);
  const tcRows = result.matchedTc.filter((r) => r.groupId === detailGroup);
  const groupRow = bawRows[0] || tcRows[0];

  return (
    <div className="page">
      <div className="page-head">
        <div className="config-title">
          {route ? route.fromSlug : ''} <b>{groupRow ? groupRow.departure.slice(11) : ''}</b>
          {' → '}
          {route ? route.toSlug : ''} <b>{groupRow ? groupRow.arrival.slice(11) : ''}</b>
        </div>
        <button className="secondary" onClick={onBack}>← Back to route</button>
      </div>
      <div className="tabbar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={'tab' + (activeTab === tab.key ? ' active' : '')}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'compare' && (
        <ViewJourneyCompareTabCompare
          bawRows={bawRows}
          tcRows={tcRows}
          groupRow={groupRow}
          bawResultsUrl={bawResultsUrl}
          route={route}
          date={date}
        />
      )}
      {activeTab === 'diff' && <ViewJourneyCompareTabDiff bawRows={bawRows} tcRows={tcRows} />}
      {activeTab === 'misc' && <ViewJourneyCompareTabMisc bawRows={bawRows} tcRows={tcRows} />}
    </div>
  );
}
