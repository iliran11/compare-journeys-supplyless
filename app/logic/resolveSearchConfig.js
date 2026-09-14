import { COMMON_SEARCH_CONFIG, DEFAULT_INTEGRATION, INTEGRATIONS } from '../config';

// Builds the flat search config for a route's integration type (falls back to the default integration).
export default function resolveSearchConfig(integrationCode) {
  const integration = INTEGRATIONS[integrationCode] || INTEGRATIONS[DEFAULT_INTEGRATION];
  return {
    ...COMMON_SEARCH_CONFIG,
    integration: integration.code,
    integrationName: integration.name,
    bawCode: integration.code,
    bawSupplierId: integration.bawSupplierId,
    filterBySourceOfData: integration.filterBySourceOfData,
    dataProviderName: integration.dataProviderName,
    dataProviderDateParam: integration.dataProviderDateParam
  };
}
