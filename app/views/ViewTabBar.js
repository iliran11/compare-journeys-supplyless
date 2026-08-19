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
        className={'tab' + (activeTab === 'vehicleClass' ? ' active' : '')}
        onClick={() => setActiveTab('vehicleClass')}
      >
        Vehicle class
      </button>
    </div>
  );
}
