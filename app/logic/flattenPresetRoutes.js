import { DEFAULT_INTEGRATION } from '../config';

export default function flattenPresetRoutes(presets) {
  const routes = [];
  for (const preset of presets) {
    const integration = preset.integration || DEFAULT_INTEGRATION;
    for (const route of preset.routes) {
      routes.push({
        id: preset.name + '::' + route.fromSlug + '|' + route.toSlug,
        presetName: preset.name,
        integration: integration,
        fromSlug: route.fromSlug,
        toSlug: route.toSlug,
        countrySlug: route.countrySlug || 'colombia',
        dataProviderLink: route.dataProviderLink,
        twelveGoLink: route.twelveGoLink,
        status: 'idle',
        result: null,
        health: null,
        rawTc: null,
        rawBaw: null,
        error: null
      });
    }
  }
  return routes;
}
