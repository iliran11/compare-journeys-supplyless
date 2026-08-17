'use client';

import { useEffect, useState } from 'react';

function DetailCard({ row, side }) {
  return (
    <div className={'card detail ' + side}>
      <span className="price"><span className="lbl">price</span>{row.price != null ? '$' + row.price.toFixed(2) : '—'}</span>
      <span className="lbl">operator</span><span className="op">{row.company}</span>
      <div className="detail-sections">
        <div className="detail-section">
          <div className="section-title">Departure</div>
          <div><span className="lbl">time</span><span className="time">{row.departure.slice(11)}</span></div>
          <div><span className="lbl">station</span><span className="val">{row.fromStation || '—'}</span></div>
        </div>
        <div className="detail-section">
          <div className="section-title">Arrival</div>
          <div><span className="lbl">time</span><span className="time">{row.arrival.slice(11)}</span></div>
          <div><span className="lbl">station</span><span className="val">{row.toStation || '—'}</span></div>
        </div>
      </div>
      <div className="detail-section">
        <div className="section-title">Ranking</div>
        <div><span className="lbl">score</span><span className="val">{typeof row.score === 'number' && row.score > 0 ? row.score : '—'}</span></div>
        <div><span className="lbl">rank by score</span><span className="val">{row.scoreRank != null ? '#' + row.scoreRank : '—'}</span></div>
      </div>
      <div className="detail-grid">
        <div><span className="lbl">vehicle class</span><span className="val">{row.lineClass || '—'}</span></div>
        <div><span className="lbl">vehicle type</span><span className="val">{row.vehicleType || '—'}</span></div>
        {row.tripId && (
          <div>
            <span className="lbl">admin</span>
            <a
              className="triplink"
              href={'https://admin.bookaway.com/transports/edit/' + row.tripId}
              target="_blank"
              rel="noreferrer"
            >
              {row.tripId} ↗
            </a>
          </div>
        )}
      </div>
      {row.pictures && row.pictures.length > 0 && (
        <div className="detail-section pictures-section">
          <div className="section-title">Pictures</div>
          <div className="pictures">
            {row.pictures.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer">
                <img src={url} alt={row.company + ' picture ' + (i + 1)} loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JourneyCompare({ result, detailGroup, onClose, bawResultsUrl }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const bawRows = result.matchedBaw.filter((r) => r.groupId === detailGroup);
  const tcRows = result.matchedTc.filter((r) => r.groupId === detailGroup);
  const groupRow = bawRows[0] || tcRows[0];

  function scoreText(rows) {
    return rows.map((r) => {
      const score = typeof r.score === 'number' && r.score > 0 ? Math.round(r.score) : '—';
      const rank = r.scoreRank != null ? '#' + r.scoreRank : '—';
      return score + ' (rank ' + rank + ')';
    }).join(' · ') || '—';
  }
  function classText(rows) {
    return rows.map((r) => r.lineClass || '—').join(' · ') || '—';
  }
  function picturesText(rows) {
    return rows.map((r) => (r.pictures ? r.pictures.length : 0) + ' pictures').join(' · ') || '—';
  }
  function stationsText(rows) {
    return rows.map((r) => (r.fromStation || '—') + ' → ' + (r.toStation || '—')).join(' · ') || '—';
  }
  function vehicleTypeText(rows) {
    return rows.map((r) => r.vehicleType || '—').join(' · ') || '—';
  }

  function padTime(time, minutesDelta) {
    const parts = time.split(':');
    let total = Number(parts[0]) * 60 + Number(parts[1]) + minutesDelta;
    if (total < 0) total = 0;
    if (total > 1439) total = 1439;
    const h = String(Math.floor(total / 60)).padStart(2, '0');
    const m = String(total % 60).padStart(2, '0');
    return h + ':' + m;
  }

  let links = null;
  if (groupRow) {
    const departureTime = groupRow.departure.slice(11);
    const timeWindow = padTime(departureTime, -30) + '-' + padTime(departureTime, 30);
    const supplierParam = groupRow.supplierFilterId ? '&suppliers=' + encodeURIComponent(groupRow.supplierFilterId) : '';
    const filterParams = supplierParam + '&departureTime=' + timeWindow;
    links = (
      <div className="explain">
        <span className="lbl">links</span>
        <a href={bawResultsUrl('PIN-BAW') + filterParams} target="_blank" rel="noreferrer">BAW search results (operator + {timeWindow}) ↗</a>
        {' · '}
        <a href={bawResultsUrl('PIN-TC') + filterParams} target="_blank" rel="noreferrer">TC search results (operator + {timeWindow}) ↗</a>
      </div>
    );
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="config-title">Matching group — side by side</div>
          <button className="secondary" onClick={onClose}>Close ✕</button>
        </div>
        {groupRow && (
          <div className="explain">
            <span className="lbl">matching key</span>
            <b>{groupRow.company}</b> · departure <b>{groupRow.departure.slice(11)}</b> · arrival <b>{groupRow.arrival.slice(11)}</b>
          </div>
        )}
        <div className="colheads"><span className="baw">BAW</span><span className="tc">TC</span></div>
        <div className="cols modal-cols">
          <div className="col">
            {bawRows.map((r, i) => (
              <DetailCard key={i} row={r} side="baw" />
            ))}
          </div>
          <div className="col">
            {tcRows.map((r, i) => (
              <DetailCard key={i} row={r} side="tc" />
            ))}
          </div>
        </div>
        <div className="explain diff">
          <span className="lbl">diff</span>
          <table className="diff-table">
            <thead>
              <tr><th></th><th className="baw">BAW</th><th className="tc">TC</th></tr>
            </thead>
            <tbody>
              <tr><td>Price</td><td>{bawRows.map((r) => (r.price != null ? '$' + r.price.toFixed(2) : '—')).join(' · ') || '—'}</td><td>{tcRows.map((r) => (r.price != null ? '$' + r.price.toFixed(2) : '—')).join(' · ') || '—'}</td></tr>
              <tr><td>Ranking</td><td>{scoreText(bawRows)}</td><td>{scoreText(tcRows)}</td></tr>
              <tr><td>Stations</td><td>{stationsText(bawRows)}</td><td>{stationsText(tcRows)}</td></tr>
              <tr><td>Class</td><td>{classText(bawRows)}</td><td>{classText(tcRows)}</td></tr>
              <tr><td>Vehicle type</td><td>{vehicleTypeText(bawRows)}</td><td>{vehicleTypeText(tcRows)}</td></tr>
              <tr><td>Pictures</td><td>{picturesText(bawRows)}</td><td>{picturesText(tcRows)}</td></tr>
            </tbody>
          </table>
        </div>
        {links}
        <div className="explain data-section">
          <span className="lbl">data</span>
          <button
            className="secondary"
            onClick={() => {
              const raw = JSON.stringify({ baw: bawRows, tc: tcRows }, null, 2);
              navigator.clipboard.writeText(raw).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
          >
            {copied ? 'Copied ✓' : 'Copy raw data 📋'}
          </button>
        </div>
      </div>
    </div>
  );
}
