export default function gaugeColorForCloseness(percent) {
  if (percent == null) return 'var(--line)';
  const distance = Math.abs(percent - 100);
  if (distance <= 5) return 'var(--match)';
  if (distance <= 10) return 'var(--accent)';
  return 'var(--baw)';
}
