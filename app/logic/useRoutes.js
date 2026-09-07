'use client';

import { useContext } from 'react';
import RoutesContext from '../RoutesContext';

export default function useRoutes() {
  return useContext(RoutesContext);
}
