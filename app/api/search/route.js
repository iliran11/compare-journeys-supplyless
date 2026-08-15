const SEARCH_URL = 'https://www.bookaway.com/_api/search/composite/v1/search-results';

const SUPPLIERS = {
  tc: { code: 'TRV', supplierId: '64cb7cafdff7a93b3203f82b' },
  baw: { code: 'PIN', supplierId: '660d57d138198f88d7da905c' }
};

export async function POST(request) {
  try {
    const input = await request.json();
    console.log('[search] ' + input.fromSlug + ' -> ' + input.toSlug + ' on ' + input.date);

    const results = {};
    for (const side of ['tc', 'baw']) {
      const supplier = SUPPLIERS[side];
      const body = {
        fromSlug: input.fromSlug,
        toSlug: input.toSlug,
        legs: [{ date: input.date, fromSlug: input.fromSlug, toSlug: input.toSlug }],
        departureDate: input.date,
        filter: { passengersAmount: 2, passengerTypes: [{ slug: 'adult', defaultAge: '35' }, { slug: 'adult', defaultAge: '35' }] },
        resultsOrder: false,
        searchRadiusInMeters: 1000,
        supplier: { supplier: supplier },
        suppliers: [{ supplier: supplier }],
        skipEnrichment: false,
        mode: 'origin',
        filterBySourceOfData: 'PIN'
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
