export default function gaugeColorForPercent(percent, { invert = false } = {}) {
  if (percent == null) return 'var(--line)';
  const good = invert ? 100 - percent : percent;
  if (good >= 90) return 'var(--match)';
  if (good >= 70) return 'var(--accent)';
  return 'var(--baw)';
}
