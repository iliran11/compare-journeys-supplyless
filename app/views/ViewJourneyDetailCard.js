'use client';

export default function ViewJourneyDetailCard({ row, side, hoveredSection, onHoverSection }) {
  const sectionProps = (key) => ({
    className:
      'hoverable-section' +
      (hoveredSection === key ? ' hl' : ''),
    onMouseEnter: () => onHoverSection(key),
    onMouseLeave: () => onHoverSection(null),
  });

  return (
    <div className={'card detail ' + side}>
      <div className={'detail-title ' + side}>{side === 'baw' ? 'BAW' : 'TC'}</div>
      <div {...sectionProps('header')} >
        <div className="detail-row detail-row-top">
          <div><span className="lbl">operator</span><span className="op">{row.company}</span></div>
          <div className="price"><span className="lbl">price</span><span className="val">{row.price != null ? '$' + row.price.toFixed(2) : '—'}</span></div>
        </div>
      </div>
      <div {...sectionProps('departure-arrival')}>
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
      </div>
      <div {...sectionProps('ranking')}>
        <div className="detail-sections">
          <div className="detail-section">
            <div className="section-title">Ranking</div>
            <div><span className="lbl">score</span><span className="val">{typeof row.score === 'number' && row.score > 0 ? row.score : '—'}</span></div>
          </div>
          <div className="detail-section detail-section-align">
            <div className="section-title">&nbsp;</div>
            <div><span className="lbl">rank by score</span><span className="val">{row.scoreRank != null ? '#' + row.scoreRank : '—'}</span></div>
          </div>
        </div>
      </div>
      <div {...sectionProps('vehicle')}>
        <div className="detail-sections">
          <div className="detail-section">
            <div className="section-title">Vehicle Details</div>
            <div><span className="lbl">vehicle class</span><span className="val">{row.lineClass || '—'}</span></div>
          </div>
          <div className="detail-section">
            <div className="section-title">Vehicle Type</div>
            <div><span className="val">{row.vehicleType || '—'}</span></div>
          </div>
        </div>
      </div>
      {row.tripId && (
        <div {...sectionProps('admin')}>
          <div className="detail-admin">
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
        </div>
      )}
      {row.pictures && row.pictures.length > 0 && (
        <div {...sectionProps('pictures')}>
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
        </div>
      )}
    </div>
  );
}
