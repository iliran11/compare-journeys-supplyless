'use client';

import { useRouter, useParams } from 'next/navigation';
import buildBawResultsUrl from '../../../../logic/buildBawResultsUrl';
import useRoutes from '../../../../logic/useRoutes';
import ViewJourneyCompare from '../../../../views/ViewJourneyCompare';

export default function JourneyComparePage() {
  const router = useRouter();
  const params = useParams();
  const routeId = decodeURIComponent(params.routeId);
  const groupId = Number(params.groupId);
  const { findRoute, date } = useRoutes();
  const route = findRoute(routeId);

  function goBack() {
    router.push('/route/' + encodeURIComponent(routeId));
  }

  if (!route || route.status !== 'done') {
    return (
      <main>
        <div className="page">
          <div className="page-head">
            <div className="config-title">Journey not found</div>
            <button className="secondary" onClick={goBack}>← Back to route</button>
          </div>
        </div>
      </main>
    );
  }

  function bawResultsUrl(debugValue) {
    return buildBawResultsUrl(route, date, debugValue);
  }

  return (
    <main>
      <ViewJourneyCompare
        result={route.result}
        detailGroup={groupId}
        onBack={goBack}
        bawResultsUrl={bawResultsUrl}
        route={route}
        date={date}
      />
    </main>
  );
}
