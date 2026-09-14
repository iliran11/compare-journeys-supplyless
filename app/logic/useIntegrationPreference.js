import { useState } from 'react';
import { DEFAULT_INTEGRATION, INTEGRATIONS, INTEGRATION_STORAGE_KEY } from '../config';

export default function useIntegrationPreference() {
  const [integration, setIntegrationState] = useState(function () {
    if (typeof window === 'undefined') return DEFAULT_INTEGRATION;
    try {
      const stored = window.localStorage.getItem(INTEGRATION_STORAGE_KEY);
      return stored && INTEGRATIONS[stored] ? stored : DEFAULT_INTEGRATION;
    } catch {
      return DEFAULT_INTEGRATION;
    }
  });

  function setIntegration(value) {
    if (!INTEGRATIONS[value]) return;
    setIntegrationState(value);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(INTEGRATION_STORAGE_KEY, value);
    } catch {
      // ignore quota/serialization errors — persistence is best-effort
    }
  }

  return [integration, setIntegration];
}
