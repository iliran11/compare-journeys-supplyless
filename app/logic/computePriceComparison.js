function formatPrice(value) {
  return value == null ? '—' : '$' + value.toFixed(2);
}

export default function computePriceComparison(result) {
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
    if (bawRows.length !== 1 || tcRows.length !== 1) continue;

    const bawRow = bawRows[0];
    const tcRow = tcRows[0];
    const bawPrice = bawRow.price;
    const tcPrice = tcRow.price;
    const gap = bawPrice != null && tcPrice != null ? bawPrice - tcPrice : null;
    const gapPercent = gap != null && tcPrice ? Math.round((gap / tcPrice) * 100) : null;

    rows.push({
      groupId,
      company: bawRow.company,
      departure: bawRow.departure,
      arrival: bawRow.arrival,
      bawPrice,
      tcPrice,
      bawPriceText: formatPrice(bawPrice),
      tcPriceText: formatPrice(tcPrice),
      gap,
      gapPercent
    });
  }
  rows.sort((a, b) => (a.departure < b.departure ? -1 : 1));

  const withGap = rows.filter((r) => r.gap != null);
  const avgGap = withGap.length === 0
    ? null
    : withGap.reduce((sum, r) => sum + r.gap, 0) / withGap.length;

  return {
    rows,
    total: rows.length,
    avgGap
  };
}
