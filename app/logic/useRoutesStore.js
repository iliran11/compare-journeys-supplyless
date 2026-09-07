'use client';

import { useEffect, useState } from 'react';
import { PRESETS, SEARCH_CONFIG } from '../config';
import { prepareComparison } from '../prepare';
import clearRoutesStorage from './clearRoutesStorage';
import computeHealthMetrics from './computeHealthMetrics';
import flattenPresetRoutes from './flattenPresetRoutes';
import loadStoredRoutes from './loadStoredRoutes';
import mergeStoredRoutes from './mergeStoredRoutes';
import saveRoutesToStorage from './saveRoutesToStorage';

export default function useRoutesStore() {
  const [routes, setRoutes] = useState(() => mergeStoredRoutes(flattenPresetRoutes(PRESETS), loadStoredRoutes()));
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [searchingAll, setSearchingAll] = useState(false);
  const [searchAllProgress, setSearchAllProgress] = useState({ done: 0, total: 0 });

  useEffect(() => {
    saveRoutesToStorage(routes);
  }, [routes]);

  function updateRoute(id, patch) {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function searchRoute(route) {
    updateRoute(route.id, { status: 'loading', error: null });
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fromSlug: route.fromSlug,
          toSlug: route.toSlug,
          date: date.trim(),
          config: {
            tcSupplier: { code: SEARCH_CONFIG.tcCode, supplierId: SEARCH_CONFIG.tcSupplierId },
            bawSupplier: { code: SEARCH_CONFIG.bawCode, supplierId: SEARCH_CONFIG.bawSupplierId },
            passengersAmount: Number(SEARCH_CONFIG.passengersAmount) || 1,
            searchRadiusInMeters: Number(SEARCH_CONFIG.searchRadiusInMeters) || 1000,
            mode: SEARCH_CONFIG.mode,
            skipEnrichment: SEARCH_CONFIG.skipEnrichment,
            filterBySourceOfData: SEARCH_CONFIG.filterBySourceOfData
          }
        })
      });
      if (!res.ok) throw new Error('search API returned ' + res.status);
      const data = await res.json();

      const prepared = prepareComparison(data.tc, data.baw);
      const health = computeHealthMetrics(prepared);

      updateRoute(route.id, {
        status: 'done',
        result: prepared,
        health: health,
        rawTc: data.tc,
        rawBaw: data.baw,
        error: null
      });
    } catch (err) {
      updateRoute(route.id, { status: 'error', error: err.message });
    }
  }

  async function searchAll() {
    clearRoutesStorage();
    const freshRoutes = flattenPresetRoutes(PRESETS);
    setRoutes(freshRoutes);

    setSearchingAll(true);
    setSearchAllProgress({ done: 0, total: freshRoutes.length });
    for (let i = 0; i < freshRoutes.length; i++) {
      await searchRoute(freshRoutes[i]);
      setSearchAllProgress({ done: i + 1, total: freshRoutes.length });
    }
    setSearchingAll(false);
  }

  function handleSearchRoute(id) {
    const route = routes.find((r) => r.id === id);
    if (route) searchRoute(route);
  }

  function findRoute(id) {
    return routes.find((r) => r.id === id) || null;
  }

  return {
    routes,
    date,
    setDate,
    searchingAll,
    searchAllProgress,
    onSearchRoute: handleSearchRoute,
    onSearchAll: searchAll,
    findRoute,
    config: SEARCH_CONFIG
  };
}
