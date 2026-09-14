'use client';

import { useRouter } from 'next/navigation';
import { INTEGRATIONS } from './config';
import useRoutes from './logic/useRoutes';
import ViewHealthDashboard from './views/ViewHealthDashboard';
import ViewRouteList from './views/ViewRouteList';

export default function Page() {
  const router = useRouter();
  const { routes, integration, setIntegration, date, setDate, searchingAll, searchAllProgress, onSearchRoute, onSearchAll } = useRoutes();
  const visibleRoutes = routes.filter((r) => r.integration === integration);
  const presetNames = [...new Set(visibleRoutes.map((r) => r.presetName))].join(', ');

  function openRoute(id) {
    router.push('/route/' + encodeURIComponent(id));
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
        date={date}
        setDate={setDate}
        searchingAll={searchingAll}
        searchAllProgress={searchAllProgress}
        onSearchRoute={onSearchRoute}
        onSearchAll={onSearchAll}
        onOpenRoute={openRoute}
      />
    </main>
  );
}
