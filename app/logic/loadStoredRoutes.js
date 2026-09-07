import { ROUTES_STORAGE_KEY } from '../config';

export default function loadStoredRoutes() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ROUTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
