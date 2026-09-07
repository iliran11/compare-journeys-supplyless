import { ROUTES_STORAGE_KEY } from '../config';

export default function saveRoutesToStorage(routes) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(routes));
  } catch {
    // ignore quota/serialization errors — persistence is best-effort
  }
}
