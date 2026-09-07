'use client';

export default function ViewProgressBar({ percent, color }) {
  const pct = percent == null ? 0 : Math.max(0, Math.min(100, percent));
  return (
    <div className="progressbar">
      <div className="progressbar-track">
        <div className="progressbar-fill" style={{ width: pct + '%', background: color }} />
      </div>
      <div className="progressbar-text">{percent == null ? '—' : pct + '%'}</div>
    </div>
  );
}
