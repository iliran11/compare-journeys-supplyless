import { useState } from 'react';
import { SORT_BY_STORAGE_KEY } from '../config';

export default function useSortByPreference(defaultValue) {
  const [sortBy, setSortByState] = useState(function () {
    if (typeof window === 'undefined') return defaultValue;
    try {
      return window.sessionStorage.getItem(SORT_BY_STORAGE_KEY) || defaultValue;
    } catch {
      return defaultValue;
    }
  });

  function setSortBy(value) {
    setSortByState(value);
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(SORT_BY_STORAGE_KEY, value);
    } catch {
      // ignore quota/serialization errors — persistence is best-effort
    }
  }

  return [sortBy, setSortBy];
}
