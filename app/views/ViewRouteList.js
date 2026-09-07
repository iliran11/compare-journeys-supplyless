'use client';

import { useState } from 'react';
import gaugeColorForPercent from '../logic/gaugeColorForPercent';
import sortRoutes from '../logic/sortRoutes';
import ViewProgressBar from './ViewProgressBar';

const COLUMNS = [
  { key: 'route', label: 'Route' },
  { key: 'status', label: 'Status' },
  { key: 'match', label: 'Journey match' },
  { key: 'duplicates', label: 'Duplicates' },
  { key: 'avgPictures', label: 'Avg pictures/journey' },
  { key: 'classMatch', label: 'Class match' },
  { key: 'avgRankDiff', label: 'Avg rank diff' }
];

function SortableHeader({ column, sortKey, sortDir, onSort }) {
  const active = sortKey === column.key;
  return (
    <th className="sortable-th" onClick={() => onSort(column.key)}>
      {column.label}
      <span className="sort-arrow">{active ? (sortDir === 'desc' ? ' ▼' : ' ▲') : ''}</span>
    </th>
  );
}

function StatusBadge({ status }) {
  const label = status === 'idle' ? 'Idle' : status === 'loading' ? 'Searching…' : status === 'done' ? 'Done' : 'Error';
  return <span className={'route-status route-status-' + status}>{label}</span>;
}

function RouteRow({ route, onSearchRoute, onOpenRoute, searchingAll }) {
  const health = route.health;
  const clickable = route.status === 'done';

  return (
    <tr
      className={'route-row' + (clickable ? ' route-row-clickable' : '')}
      onClick={clickable ? () => onOpenRoute(route.id) : undefined}
    >
      <td>{route.fromSlug} → {route.toSlug}</td>
      <td><StatusBadge status={route.status} /></td>
      <td>
        {health ? health.matchedCount + '/' + health.bawTotal + ' · ' + health.matchPercent + '%' : '—'}
      </td>
      <td>{health ? health.duplicateCount + '/' + health.bawTotal + ' · ' + health.duplicatePercent + '%' : '—'}</td>
      <td>{health && health.bawAvgPictures != null ? health.bawAvgPictures.toFixed(1) : '—'}</td>
      <td>
        {health ? health.classMatchCount + '/' + health.classTotal + ' · ' + health.classMatchPercent + '%' : '—'}
      </td>
      <td>
        {health && health.avgRankDiff != null ? health.avgRankDiff.toFixed(1) + ' (' + health.rankDiffComparedCount + ')' : '—'}
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        {route.status === 'loading' && <span className="route-inline-hint">…</span>}
        {(route.status === 'idle' || route.status === 'error') && (
          <button className="secondary" disabled={searchingAll} onClick={() => onSearchRoute(route.id)}>
            {route.status === 'error' ? 'Retry' : 'Search'}
          </button>
        )}
        {route.status === 'done' && (
          <button className="secondary" onClick={() => onOpenRoute(route.id)}>View →</button>
        )}
        {route.error && <div className="route-error">{route.error}</div>}
      </td>
    </tr>
  );
}

export default function ViewRouteList({ routes, date, setDate, searchingAll, searchAllProgress, onSearchRoute, onSearchAll, onOpenRoute }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const groups = new Map();
  for (const route of routes) {
    if (!groups.has(route.presetName)) groups.set(route.presetName, []);
    groups.get(route.presetName).push(route);
  }

  return (
    <div>
      <div className="controls">
        <div>
          <label htmlFor="date">Date</label>
          <input id="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button onClick={onSearchAll} disabled={searchingAll}>
          {searchingAll ? 'Searching all… ' + searchAllProgress.done + '/' + searchAllProgress.total : 'Search all'}
        </button>
      </div>

      {[...groups.entries()].map(([presetName, presetRoutes]) => {
        const doneCount = presetRoutes.filter((r) => r.status === 'done').length;
        const searchedPercent = Math.round((doneCount / presetRoutes.length) * 100);
        const sortedRoutes = sortRoutes(presetRoutes, sortKey, sortDir);

        return (
        <div key={presetName} className="route-group">
          <h2 className="route-group-title">{presetName}</h2>
          <div className="route-group-progress">
            <ViewProgressBar percent={searchedPercent} color={gaugeColorForPercent(searchedPercent)} />
          </div>
          <div className="route-table-wrap">
            <table className="route-table">
              <thead>
                <tr>
                  {COLUMNS.map((column) => (
                    <SortableHeader key={column.key} column={column} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedRoutes.map((route) => (
                  <RouteRow
                    key={route.id}
                    route={route}
                    searchingAll={searchingAll}
                    onSearchRoute={onSearchRoute}
                    onOpenRoute={onOpenRoute}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        );
      })}
    </div>
  );
}
