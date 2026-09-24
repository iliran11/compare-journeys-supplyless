'use client';

import { useRouter, useParams } from 'next/navigation';
import useRoutes from '../../logic/useRoutes';
import useTcIntegrationFilter from '../../logic/useTcIntegrationFilter';
import ViewRouteDetail from '../../views/ViewRouteDetail';

export default function RouteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const routeId = decodeURIComponent(params.routeId);
  const { findRoute, date, configForRoute } = useRoutes();
  const route = findRoute(routeId);
  const tcIntegrationFilter = useTcIntegrationFilter(route);

  function goBack() {
    router.push('/');
  }

  function openJourney(groupId) {
    router.push('/route/' + encodeURIComponent(routeId) + '/journey/' + encodeURIComponent(groupId) + tcIntegrationFilter.querySuffix);
  }

  if (!route || route.status !== 'done') {
    return (
      <main>
        <div className="page">
          <div className="page-head">
            <div className="config-title">Route not found</div>
            <button className="secondary" onClick={goBack}>← Back to list</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <ViewRouteDetail
        route={route}
        date={date}
        config={configForRoute(route)}
        tcIntegrationFilter={tcIntegrationFilter}
        onBack={goBack}
        onOpenJourney={openJourney}
      />
    </main>
  );
}
