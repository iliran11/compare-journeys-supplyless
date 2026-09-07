import { ROUTES_STORAGE_KEY } from '../config';

export default function clearRoutesStorage() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ROUTES_STORAGE_KEY);
  } catch {
    // ignore
  }
}
