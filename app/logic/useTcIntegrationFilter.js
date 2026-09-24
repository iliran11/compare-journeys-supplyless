'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TC_INTEGRATIONS_QUERY_PARAM } from '../config';
import { prepareComparison } from '../prepare';
import collectIntegrationCodes from './collectIntegrationCodes';
import filterTripsByIntegrationCodes from './filterTripsByIntegrationCodes';

// TC-side integration-code filter for a route. Lives in the URL so the journey page rebuilds the same match groups.
export default function useTcIntegrationFilter(route) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get(TC_INTEGRATIONS_QUERY_PARAM);
  const rawTc = route && route.rawTc;
  const rawBaw = route && route.rawBaw;

  const options = useMemo(() => collectIntegrationCodes(rawTc), [rawTc]);
  const allCodes = options.map((o) => o.code);
  const isFiltered = param !== null;
  const selectedCodes = isFiltered ? param.split(',').filter(Boolean) : allCodes;

  const result = useMemo(() => {
    if (!route || !isFiltered) return route && route.result;
    return prepareComparison(filterTripsByIntegrationCodes(rawTc || {}, param.split(',').filter(Boolean)), rawBaw);
  }, [route, rawTc, rawBaw, isFiltered, param]);

  const querySuffix = isFiltered ? '?' + new URLSearchParams({ [TC_INTEGRATIONS_QUERY_PARAM]: param }).toString() : '';

  function setSelectedCodes(codes) {
    const params = new URLSearchParams(searchParams.toString());
    const selectsAll = allCodes.every((code) => codes.includes(code));
    if (selectsAll) {
      params.delete(TC_INTEGRATIONS_QUERY_PARAM);
    } else {
      params.set(TC_INTEGRATIONS_QUERY_PARAM, codes.join(','));
    }
    const query = params.toString();
    router.replace(pathname + (query ? '?' + query : ''), { scroll: false });
  }

  function toggleCode(code) {
    const next = selectedCodes.includes(code) ? selectedCodes.filter((c) => c !== code) : selectedCodes.concat(code);
    setSelectedCodes(next);
  }

  return { options, selectedCodes, result, querySuffix, toggleCode };
}
