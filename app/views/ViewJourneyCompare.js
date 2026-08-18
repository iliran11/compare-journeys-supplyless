'use client';

import { useState } from 'react';
import useEscapeKey from '../logic/useEscapeKey';
import ViewJourneyCompareTabCompare from './ViewJourneyCompareTabCompare';
import ViewJourneyCompareTabDiff from './ViewJourneyCompareTabDiff';
import ViewJourneyCompareTabMisc from './ViewJourneyCompareTabMisc';

const TABS = [
  { key: 'compare', label: 'Compare' },
  { key: 'diff', label: 'Diff' },
  { key: 'misc', label: 'Misc' },
];

export default function ViewJourneyCompare({ result, detailGroup, onClose, bawResultsUrl }) {
  const [activeTab, setActiveTab] = useState('compare');
  useEscapeKey(onClose);

  const bawRows = result.matchedBaw.filter((r) => r.groupId === detailGroup);
  const tcRows = result.matchedTc.filter((r) => r.groupId === detailGroup);
  const groupRow = bawRows[0] || tcRows[0];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="config-title">Matching group — side by side</div>
          <button className="secondary" onClick={onClose}>Close ✕</button>
        </div>
        {groupRow && (
          <div className="explain">
            <span className="lbl">matching key</span>
            <b>{groupRow.company}</b> · departure <b>{groupRow.departure.slice(11)}</b> · arrival <b>{groupRow.arrival.slice(11)}</b>
          </div>
        )}
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
          />
        )}
        {activeTab === 'diff' && <ViewJourneyCompareTabDiff bawRows={bawRows} tcRows={tcRows} />}
        {activeTab === 'misc' && <ViewJourneyCompareTabMisc bawRows={bawRows} tcRows={tcRows} />}
      </div>
    </div>
  );
}
