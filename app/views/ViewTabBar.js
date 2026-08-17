'use client';

export default function ViewTabBar({ activeTab, setActiveTab }) {
  return (
    <div className="tabbar">
      <button
        className={'tab' + (activeTab === 'compare' ? ' active' : '')}
        onClick={() => setActiveTab('compare')}
      >
        Compare results
      </button>
      <button
        className={'tab' + (activeTab === 'scoring' ? ' active' : '')}
        onClick={() => setActiveTab('scoring')}
      >
        Scoring
      </button>
    </div>
  );
}
