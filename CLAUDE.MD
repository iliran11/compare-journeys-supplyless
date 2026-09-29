# Look and feel
backoffice system. Not a normal site. Prefer functionality and ease of navigation.

# Business situation:

Our goal is to transition supply from Bookaway to 12go. 

Today, 12GO supply is routed through a multi-layer flow of BAW → TC → 12GO, with substantial mapping, enrichment, and override logic required to make it usable in Bookaway. In practice, parity is not native yet — it is being maintained through translation layers on the Bookaway side, and also on the TC side, to bridge structural and functional gaps between the systems.

## How we will achieve it
1. Scripts - will help us 

# Way of conduct
1. Agent will never commit, will never push. Never start a server.
2. Those actions can be taken only by a human.
3. You will not place logic inside a views folder. 
4. Logic will be put in logic folder. one function per file (exemptions will be given by the human). if it's a hook, the filename should also start with "use..."
5. All date/time operations - use dayjs.

# SCRIPTS
Whenever writing scripts in ./scripts folder:
1. always have only 1 try ..catch clause.
2. Write the script in one function block. Do not create other files, other functions.
3. Functions will never mutate data. That's why drop all defensive programming pattern. have optimistic approach.
4. Do not add any logs until i ask to add.
5. Make it concise, short and human readable. i will have to understand it by myself and will run and debug it. So prefer readable code over comments.
6. As much as possible, use lodash functions in order to make the code more declerative.
7. Before starting to write the scripts - Ask me questions to understand if certain checks or logic is really necessary.
8. Avoid inline conditioning. Prefer procedural building an object line by line.


# Investigation sources

1. Bookaway Platform: /Users/lirancohen/projects/12go-platform
2. 12Go platform: /Users/lirancohen/projects/12go-platform

# Glossary

1. Bookaway - B2C brand of travelier
2. 12GO - A B2C brand that was acquired by travelier.
3. TC - Travelier connect. an attemp of travlier to create a platform that will centerlize search, inventory and booking for all other brands.
4. Consolidation - A business decision that was taken that 12go will become the central tech platform of travelier. TC will sunset. Bookaway frontend will continue to live, but all inventory will be drawn from 12go ultimately.
5. F3 - 12go native service.
6. Inventory types in BAW:
 6.1 online: We search against supplier endpoint in response in user requests. Baw entity: Transports
 6.2 synced lines - we scrape with jobs the supplier endpoint. then we create lines. bookings are against supplier api - entity: line, with isSupplierApi=true
 6.3 Manual lines - whole booking process is against BAW local system. entity: Line, with isSupplierApi=false
7. Stats - 12go admin system
* Root: The main page. "/". Over there we are showing a list of routes, search all, and the KPIs
* Raw data - Data as it arrives from the platform backend. before any modifications.
* KPIS - set of calculations we are running over the raw data of each route, creating an overview of the health of the migration.

# Comparison technical details

## Bookaway

### Search requests

- This app calls `POST https://www.bookaway.com/_api/search/composite/v1/search-results` twice: once for TC (`TRV`, supplier ID `64cb7cafdff7a93b3203f82b`) and once for the selected Bookaway integration (for example, `PIN` or `GBB`). Both sides use the same route, date, passengers, search radius and `filterBySourceOfData` value.
- TC requests also send `enable_clickbusmx_12gob2b: true` (`COMMON_SEARCH_CONFIG.enableClickbusmx12goB2bOnTc`). search-service forces that experiment and skips saving those trips to the shared online-journeys store; supplier-api drops TRV segments whose 12go `integration_code` is in `SUPPLIER_TRAVELIER_CONNECT_EXCLUDED_INTEGRATION_CODES` (default `clickbusmx`). Empty TC results on Clickbus MX routes are expected.
- The defaults are two adults aged 35, a 1,000-metre search radius, `resultsOrder: false`, `mode: 'origin'` and `skipEnrichment: false`. Integration settings come from `app/config.js`, are resolved by `app/logic/resolveSearchConfig.js`, and are sent through `app/logic/useRoutesStore.js` and `app/api/search/route.js`.
- The `baw` label here means the selected direct supplier-api integration. In search-service, these requests use `fetchOnlineTrips`, just like TRV. The separate Bookaway/local-inventory branch uses `fetchBookawayTrips`; its `suppliers` parameter excludes suppliers from local inventory rather than selecting the online provider.

### Filtering in search-service

- Source checkout: `/Users/lirancohen/projects/bookaway-platform/search-service`. Paths below are relative to that checkout.
- `src/composite/search-page-results/shared/search-results-handler.js` reads the debug field `filterBySourceOfData`. Before searching, it forces the corresponding migration feature flag in request context (`shared/debug-migration-data.js`, e.g. `PIN` → `ST_PinbusEnabled`). supplier-api's `getIsEnabledByContext()` then keeps that supplier in `online_suppliers` even when its kill switch is off. No operator filtering is applied to the response (removed in search-service #1687); both sides return every operator.
- `v1/service/searchResultGetter.js` rejects blocked routes; `fetchOnlineTrips.js` rejects blocked supplier IDs. The real-time pipeline also filters mapped trips by published status and blocked operator IDs.
- For requested dates before the start of the day two days ahead, search-service removes already-departed journeys from the first leg using the departure timezone, and drops trips with no upcoming first-leg journeys. This applies in both modes.
- `mode: 'origin'` retains grouped journeys. `disaggregation` splits trips by journeys and additionally checks first-leg availability for disaggregated trips or trips with `allJourneys`. Origin mode skips that final availability check; the comparison app does not add its own `isAvailable` filter.

### Enrichment and caching

- `src/composite/services/rt-service/rt-service.js` maps supplier responses into Bookaway trips, including stations, journeys, prices, amenities and scores. With the default `skipEnrichment: false`, it applies ride rules and Bookaway enrichment. “Raw data” in this app means this search-service response before local comparison preparation, not the untouched supplier response.
- `skipEnrichment: true` changes mapping for Travelier transports: it skips ride rules and selects raw TC fields for selected enriched fields, including the operator display name. It still performs Bookaway response mapping, so it is not a complete enrichment bypass. Other suppliers retain normal enrichment.
- `fetchOnlineTrips.js` bypasses its Redis result cache for TRV. Other online suppliers can use a one-hour cache. The app does not send `disableCache`, so the two sides can have different data freshness. This describes the search-service cache only.

### Matching in this app

- Search-service returns each side independently. `app/prepare.js` performs the cross-side comparison: it combines `trips` and `alternativeTrips`, then creates one row per journey in every leg.
- The exact match key is `kebabCase(leg.companyName) + '|' + departure + '|' + arrival`. Each timestamp is formatted in its own departure/arrival timezone to minute precision (`YYYY-MM-DD HH:mm`). There is no time tolerance.
- Operator IDs, station names, vehicle type/class, price and pictures are not part of the match key. Name or schedule differences can prevent a match; different classes or stations can share a match group.
- Matching is group-based, not one-to-one: every row whose key exists on the other side is matched. Multiple TC rows remain in the group, and each matched Bookaway row records their count as `tcMatchCount`. Other rows become `tcOnly` or `bawOnly`.
- Ranking uses numeric `trip.originalScore`, otherwise numeric `trip.score`, otherwise zero. Rows rank by descending score with departure as the tie-breaker. Matched rows also receive a separate rank within their side's matched subset.
- TRV journeys carry the serving 12go integration in `journey.supplierApiData.integrationCode` (journeys without it are labelled `none`). The route page exposes it on TC cards and offers a TC-side integration filter; the selection lives in the `tcIntegrations` URL param and re-runs `prepareComparison` on the filtered TC response, so the journey page rebuilds the same match groups. Root-page KPIs stay unfiltered.
- Counts and KPIs use flattened journey rows, not upstream trip counts. Match percentage is matched Bookaway rows divided by all Bookaway rows. Duplicate percentage is Bookaway rows with more than one TC match divided by all Bookaway rows.
- Picture and price KPIs compare matched pairs only (`app/logic/buildMatchedPairs.js`): one pair per Bookaway × TC row inside a match group, so a Bookaway row matching two TC rows yields two pairs. Unmatched rows are excluded on both sides. Price pairs also require a price on both sides (`buildPricedMatchedPairs.js`). Rank closeness is also per pair: the smaller of the two matched ranks over the larger (`buildRankClosenessRatios.js`), averaged. The journey page Diff tab renders one table per pair.
- See `app/logic/kpi-calculators/` for individual KPI formulas.
