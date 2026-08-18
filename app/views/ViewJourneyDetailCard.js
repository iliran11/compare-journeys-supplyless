'use client';

export default function ViewJourneyDetailCard({ row, side }) {
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
