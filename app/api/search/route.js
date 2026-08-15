const SEARCH_URL = 'https://www.bookaway.com/_api/search/composite/v1/search-results';

const DEFAULT_CONFIG = {
  tcSupplier: { code: 'TRV', supplierId: '64cb7cafdff7a93b3203f82b' },
  bawSupplier: { code: 'PIN', supplierId: '660d57d138198f88d7da905c' },
  passengersAmount: 2,
  searchRadiusInMeters: 1000,
  mode: 'origin',
  skipEnrichment: false,
  filterBySourceOfData: 'PIN'
};

export async function POST(request) {
  try {
    const input = await request.json();
    const config = Object.assign({}, DEFAULT_CONFIG, input.config || {});
    console.log('[search] ' + input.fromSlug + ' -> ' + input.toSlug + ' on ' + input.date + ' config=' + JSON.stringify(config));

    const passengerTypes = [];
    for (let i = 0; i < config.passengersAmount; i++) {
      passengerTypes.push({ slug: 'adult', defaultAge: '35' });
    }

    const results = {};
    for (const side of ['tc', 'baw']) {
      const supplier = side === 'tc' ? config.tcSupplier : config.bawSupplier;
      const body = {
        fromSlug: input.fromSlug,
        toSlug: input.toSlug,
        legs: [{ date: input.date, fromSlug: input.fromSlug, toSlug: input.toSlug }],
        departureDate: input.date,
        filter: { passengersAmount: config.passengersAmount, passengerTypes: passengerTypes },
        resultsOrder: false,
        searchRadiusInMeters: config.searchRadiusInMeters,
        supplier: { supplier: supplier },
        suppliers: [{ supplier: supplier }],
        skipEnrichment: config.skipEnrichment,
        mode: config.mode,
        filterBySourceOfData: config.filterBySourceOfData
      };
      console.log('[search] fetching ' + side + ' (' + supplier.code + ')');
      const upstream = await fetch(SEARCH_URL, {
        method: 'POST',
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/json',
          origin: 'https://www.bookaway.com',
          referer: 'https://www.bookaway.com/s/search',
          'x-distribution-channel': 'bookaway',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'
        },
        body: JSON.stringify(body)
      });
      if (!upstream.ok) {
        throw new Error(side + ' upstream HTTP ' + upstream.status);
      }
      results[side] = await upstream.json();
      console.log('[search] ' + side + ' ok, trips: ' + (results[side].trips || []).length);
    }

    return Response.json(results);
  } catch (err) {
    console.log('[search] error: ' + err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
