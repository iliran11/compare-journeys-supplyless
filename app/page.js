'use client';

import { useRouter } from 'next/navigation';
import { INTEGRATIONS } from './config';
import buildCsv from './logic/buildCsv';
import buildUnmatchedBawRecords from './logic/buildUnmatchedBawRecords';
import downloadCsv from './logic/downloadCsv';
import useRoutes from './logic/useRoutes';
import ViewHealthDashboard from './views/ViewHealthDashboard';
import ViewRouteList from './views/ViewRouteList';

export default function Page() {
  const router = useRouter();
  const { routes, integration, setIntegration, useCache, setUseCache, date, setDate, searchingAll, searchAllProgress, onSearchRoute, onSearchAll } = useRoutes();
  const visibleRoutes = routes.filter((r) => r.integration === integration);
  const presetNames = [...new Set(visibleRoutes.map((r) => r.presetName))].join(', ');
  const unmatchedBawRecords = buildUnmatchedBawRecords(visibleRoutes);

  function openRoute(id) {
    router.push('/route/' + encodeURIComponent(id));
  }

  function downloadUnmatchedBawCsv() {
    downloadCsv('unmatched-baw-' + integration + '-' + date + '.csv', buildCsv(unmatchedBawRecords));
  }

  return (
    <main>
      <h1>TC vs BAW Journey Matcher</h1>
      <div className="sub">Supply-parity health dashboard across {INTEGRATIONS[integration].name} routes ({presetNames})</div>

      <ViewHealthDashboard routes={visibleRoutes} />

      <ViewRouteList
        routes={visibleRoutes}
        integration={integration}
        setIntegration={setIntegration}
        useCache={useCache}
        setUseCache={setUseCache}
        date={date}
        setDate={setDate}
        searchingAll={searchingAll}
        searchAllProgress={searchAllProgress}
        onSearchRoute={onSearchRoute}
        onSearchAll={onSearchAll}
        onOpenRoute={openRoute}
        unmatchedBawCount={unmatchedBawRecords.length}
        onDownloadUnmatchedBawCsv={downloadUnmatchedBawCsv}
      />
    </main>
  );
}
