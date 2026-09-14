'use client';

import buildRouteSearchLinks from '../logic/buildRouteSearchLinks';

export default function ViewRouteLinks({ route, date }) {
  const links = buildRouteSearchLinks(route, date);
  return (
    <div className="route-links">
      <span className="route-links-label">Search pages</span>
      {links.map((l) => (
        <a
          key={l.key}
          className={'secondary links-cta route-link' + (l.side ? ' ' + l.side : '')}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          title={l.href}
        >
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}
