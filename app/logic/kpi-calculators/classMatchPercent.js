export default function classMatchPercent(result) {
  const tcByGroup = new Map();
  for (const row of result.matchedTc) {
    if (!tcByGroup.has(row.groupId)) tcByGroup.set(row.groupId, []);
    tcByGroup.get(row.groupId).push(row);
  }

  let total = 0;
  let matchCount = 0;

  for (const bawRow of result.matchedBaw) {
    const tcRows = tcByGroup.get(bawRow.groupId) || [];
    const pairs = tcRows.length > 0 ? tcRows : [null];
    for (const tcRow of pairs) {
      const bawClass = (bawRow.lineClass || '').trim() || '—';
      const tcClass = tcRow ? (tcRow.lineClass || '').trim() || '—' : '—';
      total += 1;
      if (bawClass.trim().toLowerCase() === tcClass.trim().toLowerCase()) matchCount += 1;
    }
  }

  return total === 0 ? 0 : Math.round((matchCount / total) * 100);
}
