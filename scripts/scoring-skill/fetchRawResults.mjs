// Fires the BAW and TC searches for one route from app/config.js and writes both raw
// responses (untouched) into this folder.
//
// Usage (from compare-search-supplyless):
//   node scripts/scoring-skill/fetchRawResults.mjs <fromSlug> <toSlug> [YYYY-MM-DD]
//   node scripts/scoring-skill/fetchRawResults.mjs --index 0 [YYYY-MM-DD]
//   node scripts/scoring-skill/fetchRawResults.mjs --list
//
// Date defaults to two days from today (same default as the UI).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dayjs from 'dayjs';
import { COMMON_SEARCH_CONFIG, INTEGRATIONS, PRESETS } from '../../app/config.js';

const SEARCH_URL = 'https://www.bookaway.com/_api/search/composite/v1/search-results';
const OUT_DIR = path.dirname(fileURLToPath(import.meta.url));
const RETRYABLE_STATUSES = [408, 425, 429, 500, 502, 503, 504];

function flattenRoutes() {
  const routes = [];
  for (const preset of PRESETS) {
    for (const route of preset.routes) {
      routes.push({ ...route, presetName: preset.name, integration: preset.integration });
    }
  }
  return routes;
}

function parseArgs(argv) {
  const args = { list: false, index: null, fromSlug: null, toSlug: null, date: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--list') args.list = true;
    else if (argv[i] === '--index') args.index = Number(argv[++i]);
    else rest.push(argv[i]);
  }
  if (args.index === null) {
    args.fromSlug = rest.shift() || null;
    args.toSlug = rest.shift() || null;
  }
  args.date = rest.shift() || dayjs().add(2, 'day').format('YYYY-MM-DD');
  return args;
}

function pickRoute(routes, args) {
  if (args.index !== null) {
    const route = routes[args.index];
    if (!route) throw new Error('No route at index ' + args.index + ' (have ' + routes.length + ')');
    return route;
  }
  if (!args.fromSlug || !args.toSlug) throw new Error('Provide <fromSlug> <toSlug>, --index N, or --list');
  const route = routes.find((r) => r.fromSlug === args.fromSlug && r.toSlug === args.toSlug);
  if (!route) throw new Error('Route ' + args.fromSlug + ' -> ' + args.toSlug + ' not found in config');
  return route;
}

async function fetchWithRetry(url, options, retries = 3, baseDelayMs = 700) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || !RETRYABLE_STATUSES.includes(res.status) || attempt === retries) return res;
      lastError = new Error('HTTP ' + res.status);
    } catch (err) {
      lastError = err;
      if (attempt === retries) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, baseDelayMs * Math.pow(2, attempt)));
  }
  throw lastError;
}

function buildBody(route, date, supplier, filterBySourceOfData) {
  const passengerTypes = [];
  for (let i = 0; i < COMMON_SEARCH_CONFIG.passengersAmount; i++) {
    passengerTypes.push({ slug: 'adult', defaultAge: '35' });
  }
  return {
    fromSlug: route.fromSlug,
    toSlug: route.toSlug,
    legs: [{ date: date, fromSlug: route.fromSlug, toSlug: route.toSlug }],
    departureDate: date,
    filter: { passengersAmount: COMMON_SEARCH_CONFIG.passengersAmount, passengerTypes: passengerTypes },
    resultsOrder: false,
    searchRadiusInMeters: COMMON_SEARCH_CONFIG.searchRadiusInMeters,
    supplier: { supplier: supplier },
    suppliers: [{ supplier: supplier }],
    skipEnrichment: COMMON_SEARCH_CONFIG.skipEnrichment,
    mode: COMMON_SEARCH_CONFIG.mode,
    filterBySourceOfData: filterBySourceOfData
  };
}

async function search(side, route, date, supplier, filterBySourceOfData) {
  const headers = {
    accept: 'application/json, text/plain, */*',
    'content-type': 'application/json',
    origin: 'https://www.bookaway.com',
    referer: 'https://www.bookaway.com/s/search',
    'x-distribution-channel': 'bookaway',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'
  };
  const body = buildBody(route, date, supplier, filterBySourceOfData);
  console.log('[' + side + '] POST ' + SEARCH_URL + ' supplier=' + JSON.stringify(supplier));
  const res = await fetchWithRetry(SEARCH_URL, { method: 'POST', headers: headers, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(side + ' upstream HTTP ' + res.status + ': ' + text.slice(0, 300));
  return { request: body, response: JSON.parse(text) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const routes = flattenRoutes();

  if (args.list) {
    routes.forEach((r, i) => console.log(String(i).padStart(3) + '  ' + r.integration + '  ' + r.fromSlug + ' -> ' + r.toSlug + '  (' + r.presetName + ')'));
    return;
  }

  const route = pickRoute(routes, args);
  const integration = INTEGRATIONS[route.integration];
  if (!integration) throw new Error('Unknown integration ' + route.integration);

  const tcSupplier = { code: COMMON_SEARCH_CONFIG.tcCode, supplierId: COMMON_SEARCH_CONFIG.tcSupplierId };
  const bawSupplier = { code: integration.code, supplierId: integration.bawSupplierId };

  console.log('Route: ' + route.fromSlug + ' -> ' + route.toSlug + ' (' + integration.name + ') on ' + args.date);

  const tc = await search('tc', route, args.date, tcSupplier, integration.filterBySourceOfData);
  const baw = await search('baw', route, args.date, bawSupplier, integration.filterBySourceOfData);

  const stem = route.fromSlug + '__' + route.toSlug + '__' + args.date;
  const files = {
    tc: path.join(OUT_DIR, stem + '.tc.raw.txt'),
    baw: path.join(OUT_DIR, stem + '.baw.raw.txt')
  };
  fs.writeFileSync(files.tc, JSON.stringify(tc, null, 2));
  fs.writeFileSync(files.baw, JSON.stringify(baw, null, 2));

  console.log('tc  trips: ' + (tc.response.trips || []).length + ' -> ' + files.tc);
  console.log('baw trips: ' + (baw.response.trips || []).length + ' -> ' + files.baw);
}

main().catch((err) => {
  console.error('Error: ' + err.message);
  process.exit(1);
});
