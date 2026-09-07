'use client';

const SIZE = 84;
const STROKE = 9;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export default function ViewGauge({ percent, color, label }) {
  const pct = percent == null ? 0 : Math.max(0, Math.min(100, percent));
  const dash = (pct / 100) * C;

  return (
    <div className="gauge">
      <svg width={SIZE} height={SIZE} viewBox={'0 0 ' + SIZE + ' ' + SIZE}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="var(--miss-bg)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={dash + ' ' + (C - dash)}
          strokeLinecap="round"
          transform={'rotate(-90 ' + SIZE / 2 + ' ' + SIZE / 2 + ')'}
          style={{ transition: 'stroke-dasharray 0.3s ease' }}
        />
        <text x={SIZE / 2} y={SIZE / 2 + 5} textAnchor="middle" className="gauge-text">
          {percent == null ? '—' : percent + '%'}
        </text>
      </svg>
      {label && <div className="gauge-label">{label}</div>}
    </div>
  );
}
