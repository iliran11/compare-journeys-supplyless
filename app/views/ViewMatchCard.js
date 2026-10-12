import buildStopRanges from '../logic/buildStopRanges';

function StopList({ title, stops }) {
  return (
    <div className="rc-stops">
      <div className="rc-remote-title">{title}</div>
      {stops.map((stop, i) => (
        <div key={i} className={'rc-misc-row rc-stop' + (stop.matched ? ' matched' : '')}>
          <span className="time">{stop.time.slice(11)}</span>
          <span className="rc-station" title={stop.name}>{stop.name || '—'}</span>
        </div>
      ))}
    </div>
  );
}

function RangeList({ ranges }) {
  return (
    <div className="rc-stops">
      <div className="rc-remote-title">Times</div>
      {ranges.map((range, i) => (
        <div key={i} className={'rc-misc-row rc-stop rc-range' + (range.matched ? ' matched' : '')}>
          <span className="time">{range.departure.slice(11)} → {range.arrival.slice(11)}</span>
          <span className="rc-station" title={range.label}>{range.label || '—'}</span>
        </div>
      ))}
    </div>
  );
}

// A multistation card drops the main stop's header times and lists every time range instead.
export default function ViewMatchCard({ row, side, unmatched, multistation, index, pairId, activePair, onActivate, onOpen }) {
  let className = 'card ' + side + (unmatched ? ' unmatched' : '');
  if (pairId != null && activePair != null) {
    className += pairId === activePair ? ' highlight' : ' dim';
  }
  return (
    <div
      className={className}
      data-pair={pairId != null ? pairId : undefined}
      data-index={index}
      onMouseEnter={onActivate ? () => onActivate(pairId) : undefined}
      onMouseLeave={onActivate ? () => onActivate(null) : undefined}
      onClick={onOpen ? () => onOpen(pairId) : undefined}
    >
      <div className={'rc-key' + (multistation ? ' multistation' : '')}>
        {!multistation && (
          <span className="rc-times">
            <span className="time">{row.departure.slice(11)}</span>
            <span className="rc-arrow">→</span>
            <span className="time">{row.arrival.slice(11)}</span>
          </span>
        )}
        <span className="rc-op">{row.company}</span>
        <span className="rc-class">{row.lineClass || '—'}</span>
      </div>
      <div className="rc-misc">
        <div className="rc-misc-row">
          <span className="rc-station" title={row.fromStation}>{row.fromStation || '—'}</span>
          <span className="rc-arrow">→</span>
          <span className="rc-station" title={row.toStation}>{row.toStation || '—'}</span>
        </div>
        <div className="rc-misc-row">
          {row.tripId && (
            <a
              className="triplink"
              href={'https://admin.bookaway.com/transports/edit/' + row.tripId}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {row.tripId} ↗
            </a>
          )}
          {side === 'tc' && <span className="rc-integration">{row.integrationCode}</span>}
          <span className="rc-spacer" />
          <span className="rc-pics" title="Pictures">📷 {row.pictures ? row.pictures.length : 0}</span>
          <span className="rc-price">{row.price != null ? '$' + row.price.toFixed(2) : '—'}</span>
        </div>
        {multistation && <RangeList ranges={buildStopRanges(row.stops)} />}
        {!multistation && row.stops.boarding.length > 1 && <StopList title="Boarding stops" stops={row.stops.boarding} />}
        {!multistation && row.stops.dropoff.length > 1 && <StopList title="Drop-off stops" stops={row.stops.dropoff} />}
        <div className="rc-remote">
          <div className="rc-remote-title">Remote</div>
          <div className="rc-misc-row">
            <span className="lbl">from</span>
            <span className="rc-station" title={row.remoteFrom.name}>{row.remoteFrom.name || '—'}</span>
            <span className="rc-remote-id">{row.remoteFrom.id || '—'}</span>
          </div>
          <div className="rc-misc-row">
            <span className="lbl">to</span>
            <span className="rc-station" title={row.remoteTo.name}>{row.remoteTo.name || '—'}</span>
            <span className="rc-remote-id">{row.remoteTo.id || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
