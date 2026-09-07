'use client';

import RoutesContext from './RoutesContext';
import useRoutesStore from './logic/useRoutesStore';

export default function RoutesProvider({ children }) {
  const store = useRoutesStore();
  return <RoutesContext.Provider value={store}>{children}</RoutesContext.Provider>;
}
