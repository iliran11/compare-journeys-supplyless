function normalizeClass(value) {
  return (value || '').trim().toLowerCase();
}

function classOf(row) {
  return (row.lineClass || '').trim() || '—';
}

export default function computeVehicleClassComparison(result) {
  const bawByGroup = new Map();
  for (const row of result.matchedBaw) {
    if (!bawByGroup.has(row.groupId)) bawByGroup.set(row.groupId, []);
    bawByGroup.get(row.groupId).push(row);
  }
  const tcByGroup = new Map();
  for (const row of result.matchedTc) {
    if (!tcByGroup.has(row.groupId)) tcByGroup.set(row.groupId, []);
    tcByGroup.get(row.groupId).push(row);
  }

  const rows = [];
  for (const [groupId, bawRows] of bawByGroup) {
    const tcRows = tcByGroup.get(groupId) || [];
    for (const bawRow of bawRows) {
      const pairs = tcRows.length > 0 ? tcRows : [null];
      for (const tcRow of pairs) {
        const bawClass = classOf(bawRow);
        const tcClass = tcRow ? classOf(tcRow) : '—';
        rows.push({
          groupId,
          company: bawRow.company,
          departure: bawRow.departure,
          arrival: bawRow.arrival,
          bawClass,
          tcClass,
          isMatch: normalizeClass(bawClass) === normalizeClass(tcClass)
        });
      }
    }
  }
  rows.sort((a, b) => (a.departure < b.departure ? -1 : 1));

  const matchCount = rows.filter((r) => r.isMatch).length;
  const total = rows.length;

  return {
    rows,
    matchCount,
    mismatchCount: total - matchCount,
    total,
    matchPercent: total === 0 ? 0 : Math.round((matchCount / total) * 100)
  };
}
