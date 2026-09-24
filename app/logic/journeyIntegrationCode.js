import { NO_INTEGRATION_CODE } from '../config';

// 12go integration serving a journey, as attached by search-service to TRV journeys.
export default function journeyIntegrationCode(journey) {
  return (journey.supplierApiData && journey.supplierApiData.integrationCode) || NO_INTEGRATION_CODE;
}
