'use client';

import { useRouter } from 'next/navigation';
import useRoutes from './logic/useRoutes';
import ViewHealthDashboard from './views/ViewHealthDashboard';
import ViewRouteList from './views/ViewRouteList';

export default function Page() {
  const router = useRouter();
  const { routes, date, setDate, searchingAll, searchAllProgress, onSearchRoute, onSearchAll } = useRoutes();

  function openRoute(id) {
    router.push('/route/' + encodeURIComponent(id));
  }

  return (
    <main>
      <h1>TC vs BAW Journey Matcher</h1>
      <div className="sub">Supply-parity health dashboard across Pinbus Colombia routes</div>

      <ViewHealthDashboard routes={routes} />

      <ViewRouteList
        routes={routes}
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
