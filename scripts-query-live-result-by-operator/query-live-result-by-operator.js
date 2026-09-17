async function queryLiveResultsByOperator() {
  try {
    const Config = require('../app/config.js');
    const Dayjs = require('dayjs');
    const routes = Config.PRESETS[1].routes;
    const date = Dayjs().add(3, 'day').format('YYYY-MM-DD');

    for (const route of [routes[0]]) {
      console.log('[city] From:', route.fromSlug);
      console.log('[city] To:', route.toSlug);

      const url = new URL('/_api/inventory/v1/supplier-api/travelier/live-results', Config.BASE_URL);
      url.searchParams.set('fromCityId', route.fromCityId);
      url.searchParams.set('toCityId', route.toCityId);
      url.searchParams.set('date', date);

      const response = await fetch(url, {
        headers: {
          authorization: 'Bearer ' + process.env.BAW_ADMIN_TOKEN,
          accept: 'application/json'
        }
      });
      if (!response.ok) throw new Error('Live results returned HTTP ' + response.status);

      const results = await response.json();
      console.log('[live-results]', results);
    }
  } catch (error) {
    throw new Error('Live results query failed: ' + error.message);
  }
}

queryLiveResultsByOperator();
