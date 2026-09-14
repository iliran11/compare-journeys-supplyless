'use client';

import { useEffect, useState } from 'react';
import { PRESETS } from '../config';
import { prepareComparison } from '../prepare';
import computeHealthMetrics from './computeHealthMetrics';
import flattenPresetRoutes from './flattenPresetRoutes';
import loadStoredRoutes from './loadStoredRoutes';
import mergeStoredRoutes from './mergeStoredRoutes';
import useIntegrationPreference from './useIntegrationPreference';
import resolveSearchConfig from './resolveSearchConfig';
import saveRoutesToStorage from './saveRoutesToStorage';

export default function useRoutesStore() {
  const [routes, setRoutes] = useState(() => mergeStoredRoutes(flattenPresetRoutes(PRESETS), loadStoredRoutes()));
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [integration, setIntegration] = useIntegrationPreference();
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
    const searchConfig = resolveSearchConfig(route.integration);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fromSlug: route.fromSlug,
          toSlug: route.toSlug,
          date: date.trim(),
          config: {
            tcSupplier: { code: searchConfig.tcCode, supplierId: searchConfig.tcSupplierId },
            bawSupplier: { code: searchConfig.bawCode, supplierId: searchConfig.bawSupplierId },
            passengersAmount: Number(searchConfig.passengersAmount) || 1,
            searchRadiusInMeters: Number(searchConfig.searchRadiusInMeters) || 1000,
            mode: searchConfig.mode,
            skipEnrichment: searchConfig.skipEnrichment,
            filterBySourceOfData: searchConfig.filterBySourceOfData
          }
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'search API returned ' + res.status);

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

  // Resets and re-searches only the routes of the selected integration; other integrations keep their results.
  async function searchAll() {
    const freshRoutes = flattenPresetRoutes(PRESETS);
    const targets = freshRoutes.filter((r) => r.integration === integration);
    setRoutes((prev) => prev.map((r) => (r.integration === integration ? freshRoutes.find((f) => f.id === r.id) || r : r)));

    setSearchingAll(true);
    setSearchAllProgress({ done: 0, total: targets.length });
    for (let i = 0; i < targets.length; i++) {
      await searchRoute(targets[i]);
      setSearchAllProgress({ done: i + 1, total: targets.length });
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
    integration,
    setIntegration,
    date,
    setDate,
    searchingAll,
    searchAllProgress,
    onSearchRoute: handleSearchRoute,
    onSearchAll: searchAll,
    findRoute,
    configForRoute: (route) => resolveSearchConfig(route && route.integration)
  };
}
