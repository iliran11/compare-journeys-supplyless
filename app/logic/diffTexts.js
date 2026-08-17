export function scoreText(rows) {
  return rows.map((r) => {
    const score = typeof r.score === 'number' && r.score > 0 ? Math.round(r.score) : '—';
    const rank = r.scoreRank != null ? '#' + r.scoreRank : '—';
    return score + ' (rank ' + rank + ')';
  }).join(' · ') || '—';
}

export function classText(rows) {
  return rows.map((r) => r.lineClass || '—').join(' · ') || '—';
}

export function picturesText(rows) {
  return rows.map((r) => (r.pictures ? r.pictures.length : 0) + ' pictures').join(' · ') || '—';
}

export function stationsText(rows) {
  return rows.map((r) => (r.fromStation || '—') + ' → ' + (r.toStation || '—')).join(' · ') || '—';
}

export function vehicleTypeText(rows) {
  return rows.map((r) => r.vehicleType || '—').join(' · ') || '—';
}

export function priceText(rows) {
  return rows.map((r) => (r.price != null ? '$' + r.price.toFixed(2) : '—')).join(' · ') || '—';
}
