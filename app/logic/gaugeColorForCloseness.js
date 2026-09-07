export default function gaugeColorForCloseness(percent, { greenThreshold = 5, accentThreshold = 10 } = {}) {
  if (percent == null) return 'var(--line)';
  const distance = Math.abs(percent - 100);
  if (distance <= greenThreshold) return 'var(--match)';
  if (distance <= accentThreshold) return 'var(--accent)';
  return 'var(--baw)';
}
