'use client';

import useCopyToClipboard from '../logic/useCopyToClipboard';

export default function ViewJourneyCompareTabMisc({ bawRows, tcRows }) {
  const { copied, copy } = useCopyToClipboard(1500);

  return (
    <div className="explain data-section">
      <span className="lbl">data</span>
      <button
        className="secondary"
        onClick={() => copy(JSON.stringify({ baw: bawRows.map((r) => r.raw), tc: tcRows.map((r) => r.raw) }, null, 2))}
      >
        {copied ? 'Copied ✓' : 'Copy raw data 📋'}
      </button>
    </div>
  );
}
