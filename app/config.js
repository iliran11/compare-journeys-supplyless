export const BASE_URL = "https://www.bookaway.com";

export const ADMIN_URL = "https://admin.bookaway.com";

// Host the search API route sends search-results requests to (swap for a dev env like https://liran.bookaway.dev).
export const SEARCH_HOST = "https://www.bookaway.com";

export const DEPARTURE_TIME_WINDOW_PADDING_MINUTES = 5;

// Route-page URL param holding the selected TC integration codes (absent = all).
export const TC_INTEGRATIONS_QUERY_PARAM = "tcIntegrations";

// Label for TC journeys that carry no supplierApiData.integrationCode.
export const NO_INTEGRATION_CODE = "none";

// Settings shared by every integration type.
export const COMMON_SEARCH_CONFIG = {
  tcCode: "TRV",
  tcAdminSupplierName: "travelier",
  tcSupplierId: "64cb7cafdff7a93b3203f82b",
  passengersAmount: 2,
  searchRadiusInMeters: 1000,
  mode: "origin",
  skipEnrichment: false,
  // Sent as enable_clickbusmx_12gob2b on TC searches only: supplier-api drops TRV trips whose
  // integration_code is excluded (default "clickbusmx"), and search-service skips caching them.
  enableClickbusmx12goB2bOnTc: true,
};

// One entry per supplier-api integration being migrated. Keyed by BAW supplier code.
// - bawSupplierId: the supplier company id in BAW (users-service companies).
// - filterBySourceOfData: search-service feature-flag key (debug-migration-data.js), or null when the
//   integration has no flag. Until search-service #1687 is deployed, any code also trims results to its
//   operator allow-list, and a code without an allow-list (CLB, DSB) empties the response.
// - dataProviderDateParam: query param appended to dataProviderLink with the search date, or null.
// - adminSupplierName: supplier-api supplier name used by the admin live search page (?supplier=).
export const INTEGRATIONS = {
  PIN: {
    code: "PIN",
    name: "Pinbus",
    bawSupplierId: "660d57d138198f88d7da905c",
    filterBySourceOfData: "PIN",
    dataProviderName: "PinBus",
    dataProviderDateParam: "salida",
    adminSupplierName: "pinbus",
  },
  GBB: {
    code: "GBB",
    name: "GetByBus",
    bawSupplierId: "60cf2e027ea1b80001552ba6",
    filterBySourceOfData: null,
    dataProviderName: "GetByBus",
    dataProviderDateParam: null,
    adminSupplierName: "getbybus",
  },
  CLB: {
    code: "CLB",
    name: "Clickbus MX (clickbusmx)",
    bawSupplierId: "6182636e206d820001db5bc5",
    filterBySourceOfData: null,
    dataProviderName: "Clickbus MX",
    dataProviderDateParam: null,
    adminSupplierName: "clickbusmx",
  },
  DSB: {
    code: "DSB",
    name: "Distribusion",
    bawSupplierId: "5fe87b31e093910001cbcb16",
    filterBySourceOfData: null,
    dataProviderName: "Distribusion",
    dataProviderDateParam: null,
    adminSupplierName: "distribusion",
  },
};

export const DEFAULT_INTEGRATION = "CLB";

// Each preset must declare `integration` (a key of INTEGRATIONS).
// Each route entry should include dataProviderLink and twelveGoLink. Use null if no link is available.
export const PRESETS = [
  {
    name: "Pinbus Colombia",
    integration: "PIN",
    routes: [
      {
        fromSlug: "barranquilla",
        fromCityId: "5cab06e2db310a969185ed71",
        toSlug: "riohacha",
        toCityId: "5e9c61f2eab2aaeebb6a6f74",
        countrySlug: "colombia",
        dataProviderLink:
          "https://pinbus.com/busqueda?origen=Barranquilla,+ATL+(Todas)&origen_id=28&destino=Riohacha,+LAG+(Todas)&destino_id=46",
        twelveGoLink: "https://12go.com/en/travel/barranquilla/riohacha",
      },
      {
        fromSlug: "riohacha",
        fromCityId: "5e9c61f2eab2aaeebb6a6f74",
        toSlug: "barranquilla",
        toCityId: "5cab06e2db310a969185ed71",
        countrySlug: "colombia",
        dataProviderLink:
          "https://pinbus.com/busqueda?origen=Riohacha,+LAG+(Todas)&origen_id=46&destino=Barranquilla,+ATL+(Todas)&destino_id=28",
        twelveGoLink: "https://12go.com/en/travel/riohacha/barranquilla",
      },
      {
        fromSlug: "cartagena",
        fromCityId: "5cab051bb62a4461790333a6",
        toSlug: "santa-marta",
        toCityId: "5cb7327f273a9a43985f96e2",
        countrySlug: "colombia",
        dataProviderLink:
          "https://pinbus.com/busqueda?origen=Cartagena,+BOL+(Todas)&origen_id=29&destino=Santa+marta,+MAG+(Todas)&destino_id=31",
        twelveGoLink:
          "https://12go.asia/en/travel/cartagena-de-indias/santa-marta",
      },
      {
        fromSlug: "santa-marta",
        fromCityId: "5cb7327f273a9a43985f96e2",
        toSlug: "cartagena",
        toCityId: "5cab051bb62a4461790333a6",
        countrySlug: "colombia",
        dataProviderLink:
          "https://pinbus.com/busqueda?origen=Santa+marta,+MAG+(Todas)&origen_id=31&destino=Cartagena,+BOL+(Todas)&destino_id=29",
        twelveGoLink:
          "https://12go.asia/en/travel/santa-marta/cartagena-de-indias",
      },
      // Top 30 Pinbus routes by Bookaway revenue (Sep 2025 - Sep 2026). Links TBD.
      {
        fromSlug: "santa-marta",
        fromCityId: "5cb7327f273a9a43985f96e2",
        toSlug: "medellin",
        toCityId: "5cceb23dc36225aade112f26",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #1
      {
        fromSlug: "bogota",
        fromCityId: "5cab041e2a307eac4cea0cf2",
        toSlug: "medellin",
        toCityId: "5cceb23dc36225aade112f26",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #3
      {
        fromSlug: "bogota",
        fromCityId: "5cab041e2a307eac4cea0cf2",
        toSlug: "armenia",
        toCityId: "5e7394126251796815896a64",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #4
      {
        fromSlug: "medellin",
        fromCityId: "5cceb23dc36225aade112f26",
        toSlug: "cartagena",
        toCityId: "5cab051bb62a4461790333a6",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #5
      {
        fromSlug: "medellin",
        fromCityId: "5cceb23dc36225aade112f26",
        toSlug: "santa-marta",
        toCityId: "5cb7327f273a9a43985f96e2",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #6
      {
        fromSlug: "medellin",
        fromCityId: "5cceb23dc36225aade112f26",
        toSlug: "bogota",
        toCityId: "5cab041e2a307eac4cea0cf2",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #7
      {
        fromSlug: "cartagena",
        fromCityId: "5cab051bb62a4461790333a6",
        toSlug: "medellin",
        toCityId: "5cceb23dc36225aade112f26",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #8
      {
        fromSlug: "jardin",
        fromCityId: "5ccee197c36225d829117520",
        toSlug: "medellin",
        toCityId: "5cceb23dc36225aade112f26",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #9
      {
        fromSlug: "cali",
        fromCityId: "5e73966b47c5904e172342f4",
        toSlug: "medellin",
        toCityId: "5cceb23dc36225aade112f26",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #11
      {
        fromSlug: "pereira",
        fromCityId: "5e7396943046df336062f543",
        toSlug: "medellin",
        toCityId: "5cceb23dc36225aade112f26",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #12
      {
        fromSlug: "medellin",
        fromCityId: "5cceb23dc36225aade112f26",
        toSlug: "cali",
        toCityId: "5e73966b47c5904e172342f4",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #15
      {
        fromSlug: "bogota",
        fromCityId: "5cab041e2a307eac4cea0cf2",
        toSlug: "neiva",
        toCityId: "5f50be36d47483d8d5d78cf2",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #16
      {
        fromSlug: "bogota",
        fromCityId: "5cab041e2a307eac4cea0cf2",
        toSlug: "pereira",
        toCityId: "5e7396943046df336062f543",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #17
      {
        fromSlug: "armenia",
        fromCityId: "5e7394126251796815896a64",
        toSlug: "bogota",
        toCityId: "5cab041e2a307eac4cea0cf2",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #18
      {
        fromSlug: "armenia",
        fromCityId: "5e7394126251796815896a64",
        toSlug: "medellin",
        toCityId: "5cceb23dc36225aade112f26",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #20
      {
        fromSlug: "armenia",
        fromCityId: "5e7394126251796815896a64",
        toSlug: "cali",
        toCityId: "5e73966b47c5904e172342f4",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #21
      {
        fromSlug: "cali",
        fromCityId: "5e73966b47c5904e172342f4",
        toSlug: "armenia",
        toCityId: "5e7394126251796815896a64",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #22
      {
        fromSlug: "santa-marta",
        fromCityId: "5cb7327f273a9a43985f96e2",
        toSlug: "bogota",
        toCityId: "5cab041e2a307eac4cea0cf2",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #23
      {
        fromSlug: "cali",
        fromCityId: "5e73966b47c5904e172342f4",
        toSlug: "bogota",
        toCityId: "5cab041e2a307eac4cea0cf2",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #24
      {
        fromSlug: "medellin",
        fromCityId: "5cceb23dc36225aade112f26",
        toSlug: "pereira",
        toCityId: "5e7396943046df336062f543",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #25
      {
        fromSlug: "pereira",
        fromCityId: "5e7396943046df336062f543",
        toSlug: "bogota",
        toCityId: "5cab041e2a307eac4cea0cf2",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #26
      {
        fromSlug: "bogota",
        fromCityId: "5cab041e2a307eac4cea0cf2",
        toSlug: "cali",
        toCityId: "5e73966b47c5904e172342f4",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #27
      {
        fromSlug: "neiva",
        fromCityId: "5f50be36d47483d8d5d78cf2",
        toSlug: "bogota",
        toCityId: "5cab041e2a307eac4cea0cf2",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #28
      {
        fromSlug: "medellin",
        fromCityId: "5cceb23dc36225aade112f26",
        toSlug: "jardin",
        toCityId: "5ccee197c36225d829117520",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #29
      {
        fromSlug: "cartagena",
        fromCityId: "5cab051bb62a4461790333a6",
        toSlug: "bogota",
        toCityId: "5cab041e2a307eac4cea0cf2",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #30
      {
        fromSlug: "bogota",
        fromCityId: "5cab041e2a307eac4cea0cf2",
        toSlug: "villa-de-leyva",
        toCityId: "5ebd5baab0292c1b92a15d85",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #31
    ],
  },
  {
    name: "GetByBus Balkans",
    integration: "GBB",
    // Top 50 GetByBus routes by Bookaway bookings (BigQuery export, Sep 2026). Links TBD.
    routes: [
      {
        fromSlug: "budva",
        fromCityId: "5f15a67c91f08f21a36e4441",
        toSlug: "tirana",
        toCityId: "5f20176b25b0951769af09df",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #18
      {
        fromSlug: "sarajevo",
        fromCityId: "5f968220562650e2fd75a2c3",
        toSlug: "belgrade",
        toCityId: "5f96821e562650377375a2b4",
        countrySlug: "bosnia-and-herzegovina",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #1
      {
        fromSlug: "shkoder",
        fromCityId: "5f204025dd6add4417f6e347",
        toSlug: "tirana",
        toCityId: "5f20176b25b0951769af09df",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #2
      {
        fromSlug: "mostar",
        fromCityId: "5f4d0d425d59ac18b3b25ac0",
        toSlug: "kotor",
        toCityId: "5f15a702a3a2f1131759b7a1",
        countrySlug: "bosnia-and-herzegovina",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #3
      {
        fromSlug: "mostar",
        fromCityId: "5f4d0d425d59ac18b3b25ac0",
        toSlug: "sarajevo",
        toCityId: "5f968220562650e2fd75a2c3",
        countrySlug: "bosnia-and-herzegovina",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #4
      {
        fromSlug: "tirana",
        fromCityId: "5f20176b25b0951769af09df",
        toSlug: "shkoder",
        toCityId: "5f204025dd6add4417f6e347",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #5
      {
        fromSlug: "belgrade",
        fromCityId: "5f96821e562650377375a2b4",
        toSlug: "sarajevo",
        toCityId: "5f968220562650e2fd75a2c3",
        countrySlug: "serbia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #6
      {
        fromSlug: "split",
        fromCityId: "5936b1d1f831f10009d89508",
        toSlug: "hvar",
        toCityId: "5936b1de5e15d00008d5176a",
        countrySlug: "croatia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #7
      {
        fromSlug: "tirana",
        fromCityId: "5f20176b25b0951769af09df",
        toSlug: "saranda",
        toCityId: "61015c97dc6a1cc6ecabfba6",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #8
      {
        fromSlug: "dubrovnik",
        fromCityId: "5b3ca5865571a80001c0749a",
        toSlug: "kotor",
        toCityId: "5f15a702a3a2f1131759b7a1",
        countrySlug: "croatia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #9
      {
        fromSlug: "kotor",
        fromCityId: "5f15a702a3a2f1131759b7a1",
        toSlug: "budva",
        toCityId: "5f15a67c91f08f21a36e4441",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #10
      {
        fromSlug: "kotor",
        fromCityId: "5f15a702a3a2f1131759b7a1",
        toSlug: "dubrovnik",
        toCityId: "5b3ca5865571a80001c0749a",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #11
      {
        fromSlug: "dubrovnik",
        fromCityId: "5b3ca5865571a80001c0749a",
        toSlug: "korcula",
        toCityId: "5b3cae7a7314170001ce1d53",
        countrySlug: "croatia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #12
      {
        fromSlug: "ohrid",
        fromCityId: "610126cea285347ad1096ae3",
        toSlug: "skopje",
        toCityId: "61012a16a28534c1b4096b6c",
        countrySlug: "north-macedonia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #13
      {
        fromSlug: "kotor",
        fromCityId: "5f15a702a3a2f1131759b7a1",
        toSlug: "mostar",
        toCityId: "5f4d0d425d59ac18b3b25ac0",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #14
      {
        fromSlug: "saranda",
        fromCityId: "61015c97dc6a1cc6ecabfba6",
        toSlug: "tirana",
        toCityId: "5f20176b25b0951769af09df",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #15
      {
        fromSlug: "kotor",
        fromCityId: "5f15a702a3a2f1131759b7a1",
        toSlug: "podgorica",
        toCityId: "5f201518cee65a1eb47f3a65",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #16
      {
        fromSlug: "budva",
        fromCityId: "5f15a67c91f08f21a36e4441",
        toSlug: "podgorica",
        toCityId: "5f201518cee65a1eb47f3a65",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #17
      {
        fromSlug: "sarajevo",
        fromCityId: "5f968220562650e2fd75a2c3",
        toSlug: "mostar",
        toCityId: "5f4d0d425d59ac18b3b25ac0",
        countrySlug: "bosnia-and-herzegovina",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #19
      {
        fromSlug: "skopje",
        fromCityId: "61012a16a28534c1b4096b6c",
        toSlug: "ohrid",
        toCityId: "610126cea285347ad1096ae3",
        countrySlug: "north-macedonia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #20
      {
        fromSlug: "budva",
        fromCityId: "5f15a67c91f08f21a36e4441",
        toSlug: "shkoder",
        toCityId: "5f204025dd6add4417f6e347",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #21
      {
        fromSlug: "budva",
        fromCityId: "5f15a67c91f08f21a36e4441",
        toSlug: "kotor",
        toCityId: "5f15a702a3a2f1131759b7a1",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #22
      {
        fromSlug: "dubrovnik",
        fromCityId: "5b3ca5865571a80001c0749a",
        toSlug: "hvar",
        toCityId: "5936b1de5e15d00008d5176a",
        countrySlug: "croatia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #23
      {
        fromSlug: "hvar",
        fromCityId: "5936b1de5e15d00008d5176a",
        toSlug: "split",
        toCityId: "5936b1d1f831f10009d89508",
        countrySlug: "croatia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #24
      {
        fromSlug: "split",
        fromCityId: "5936b1d1f831f10009d89508",
        toSlug: "dubrovnik",
        toCityId: "5b3ca5865571a80001c0749a",
        countrySlug: "croatia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #25
      {
        fromSlug: "shkoder",
        fromCityId: "5f204025dd6add4417f6e347",
        toSlug: "budva",
        toCityId: "5f15a67c91f08f21a36e4441",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #26
      {
        fromSlug: "sarajevo",
        fromCityId: "5f968220562650e2fd75a2c3",
        toSlug: "podgorica",
        toCityId: "5f201518cee65a1eb47f3a65",
        countrySlug: "bosnia-and-herzegovina",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #27
      {
        fromSlug: "podgorica",
        fromCityId: "5f201518cee65a1eb47f3a65",
        toSlug: "budva",
        toCityId: "5f15a67c91f08f21a36e4441",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #28
      {
        fromSlug: "shkoder",
        fromCityId: "5f204025dd6add4417f6e347",
        toSlug: "kotor",
        toCityId: "5f15a702a3a2f1131759b7a1",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #29
      {
        fromSlug: "skopje",
        fromCityId: "61012a16a28534c1b4096b6c",
        toSlug: "sofia",
        toCityId: "600830c28b3dfa3342825586",
        countrySlug: "north-macedonia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #30
      {
        fromSlug: "hvar",
        fromCityId: "5936b1de5e15d00008d5176a",
        toSlug: "dubrovnik",
        toCityId: "5b3ca5865571a80001c0749a",
        countrySlug: "croatia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #31
      {
        fromSlug: "tirana",
        fromCityId: "5f20176b25b0951769af09df",
        toSlug: "himare",
        toCityId: "63b3f0676866a623ab7fa968",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #32
      {
        fromSlug: "podgorica",
        fromCityId: "5f201518cee65a1eb47f3a65",
        toSlug: "kotor",
        toCityId: "5f15a702a3a2f1131759b7a1",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #33
      {
        fromSlug: "kotor",
        fromCityId: "5f15a702a3a2f1131759b7a1",
        toSlug: "zabljak",
        toCityId: "5f3a91dd53c93514f2c630e6",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #34
      {
        fromSlug: "dubrovnik",
        fromCityId: "5b3ca5865571a80001c0749a",
        toSlug: "split",
        toCityId: "5936b1d1f831f10009d89508",
        countrySlug: "croatia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #35
      {
        fromSlug: "tirana",
        fromCityId: "5f20176b25b0951769af09df",
        toSlug: "budva",
        toCityId: "5f15a67c91f08f21a36e4441",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #36
      {
        fromSlug: "kotor",
        fromCityId: "5f15a702a3a2f1131759b7a1",
        toSlug: "tirana",
        toCityId: "5f20176b25b0951769af09df",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #37
      {
        fromSlug: "belgrade",
        fromCityId: "5f96821e562650377375a2b4",
        toSlug: "pristina",
        toCityId: "62011f3144a7f5b24d093874",
        countrySlug: "serbia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #38
      {
        fromSlug: "shkoder",
        fromCityId: "5f204025dd6add4417f6e347",
        toSlug: "podgorica",
        toCityId: "5f201518cee65a1eb47f3a65",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #39
      {
        fromSlug: "himare",
        fromCityId: "63b3f0676866a623ab7fa968",
        toSlug: "tirana",
        toCityId: "5f20176b25b0951769af09df",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #40
      {
        fromSlug: "tirana",
        fromCityId: "5f20176b25b0951769af09df",
        toSlug: "kotor",
        toCityId: "5f15a702a3a2f1131759b7a1",
        countrySlug: "albania",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #41
      {
        fromSlug: "podgorica",
        fromCityId: "5f201518cee65a1eb47f3a65",
        toSlug: "shkoder",
        toCityId: "5f204025dd6add4417f6e347",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #42
      {
        fromSlug: "kotor",
        fromCityId: "5f15a702a3a2f1131759b7a1",
        toSlug: "shkoder",
        toCityId: "5f204025dd6add4417f6e347",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #43
      {
        fromSlug: "podgorica",
        fromCityId: "5f201518cee65a1eb47f3a65",
        toSlug: "tirana",
        toCityId: "5f20176b25b0951769af09df",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #44
      {
        fromSlug: "pristina",
        fromCityId: "62011f3144a7f5b24d093874",
        toSlug: "skopje",
        toCityId: "61012a16a28534c1b4096b6c",
        countrySlug: "kosovo",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #45
      {
        fromSlug: "skopje",
        fromCityId: "61012a16a28534c1b4096b6c",
        toSlug: "pristina",
        toCityId: "62011f3144a7f5b24d093874",
        countrySlug: "north-macedonia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #46
      {
        fromSlug: "dubrovnik",
        fromCityId: "5b3ca5865571a80001c0749a",
        toSlug: "mostar",
        toCityId: "5f4d0d425d59ac18b3b25ac0",
        countrySlug: "croatia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #47
      {
        fromSlug: "podgorica",
        fromCityId: "5f201518cee65a1eb47f3a65",
        toSlug: "sarajevo",
        toCityId: "5f968220562650e2fd75a2c3",
        countrySlug: "montenegro",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #48
      {
        fromSlug: "sarajevo",
        fromCityId: "5f968220562650e2fd75a2c3",
        toSlug: "mostar-east",
        toCityId: "6162eb0647e66f54ac14adbd",
        countrySlug: "bosnia-and-herzegovina",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #49
      {
        fromSlug: "mostar",
        fromCityId: "5f4d0d425d59ac18b3b25ac0",
        toSlug: "budva",
        toCityId: "5f15a67c91f08f21a36e4441",
        countrySlug: "bosnia-and-herzegovina",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #50
    ],
  },
  {
    name: "Clickbus MX",
    integration: "CLB",
    // Top 50 Clickbus Mexico API routes by Bookaway bookings, last 90 days (Jarvis/BigQuery fact_booking, 2026-09-29).
    routes: [
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "puerto-escondido", toCityId: "5f50be3672492dd00b9f53e1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #1 (105 bookings)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "oaxaca", toCityId: "5d7e2a7914afa3da1a34fd85", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #2 (81 bookings)
      { fromSlug: "chiquila", fromCityId: "5f2173ea0074ba3c340bfd22", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #3 (71 bookings)
      { fromSlug: "puerto-escondido", fromCityId: "5f50be3672492dd00b9f53e1", toSlug: "oaxaca", toCityId: "5d7e2a7914afa3da1a34fd85", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #4 (68 bookings)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #5 (49 bookings)
      { fromSlug: "puerto-escondido", fromCityId: "5f50be3672492dd00b9f53e1", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #6 (37 bookings)
      { fromSlug: "san-cristobal-de-las-casas", fromCityId: "5f3401bb52a3e05225935aac", toSlug: "palenque", toCityId: "5f621acd878ad116d7211322", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #7 (35 bookings)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #8 (33 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "valladolid-2", toCityId: "5f21950f27cbc1bad30fce2f", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #9 (32 bookings)
      { fromSlug: "valladolid-2", fromCityId: "5f21950f27cbc1bad30fce2f", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #10 (30 bookings)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #11 (28 bookings)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #12 (26 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #13 (25 bookings)
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #14 (24 bookings)
      { fromSlug: "valladolid-2", fromCityId: "5f21950f27cbc1bad30fce2f", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #15 (22 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #16 (21 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "chiquila", toCityId: "5f2173ea0074ba3c340bfd22", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #17 (20 bookings)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "puebla", toCityId: "5f05cc0477e6ef38594f8d6d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #18 (20 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #19 (19 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #20 (18 bookings)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "bacalar", toCityId: "5d53e6ce85ba5918a07c903c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #21 (18 bookings)
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "belize-city", toCityId: "60f9797657ffb4835d5553d9", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #22 (17 bookings)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "valladolid-2", toCityId: "5f21950f27cbc1bad30fce2f", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #23 (16 bookings)
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #24 (15 bookings)
      { fromSlug: "merida", fromCityId: "5ed51b805c89c47960868e35", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #25 (15 bookings)
      { fromSlug: "puebla", fromCityId: "5f05cc0477e6ef38594f8d6d", toSlug: "oaxaca", toCityId: "5d7e2a7914afa3da1a34fd85", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #26 (14 bookings)
      { fromSlug: "chichen-itza", fromCityId: "5f5756f1d65fa6a77582b489", toSlug: "valladolid-2", toCityId: "5f21950f27cbc1bad30fce2f", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #27 (13 bookings)
      { fromSlug: "chiquila", fromCityId: "5f2173ea0074ba3c340bfd22", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #28 (13 bookings)
      { fromSlug: "merida", fromCityId: "5ed51b805c89c47960868e35", toSlug: "valladolid-2", toCityId: "5f21950f27cbc1bad30fce2f", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #29 (13 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "valladolid-2", toCityId: "5f21950f27cbc1bad30fce2f", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #30 (13 bookings)
      { fromSlug: "valladolid-2", fromCityId: "5f21950f27cbc1bad30fce2f", toSlug: "chichen-itza", toCityId: "5f5756f1d65fa6a77582b489", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #31 (13 bookings)
      { fromSlug: "chiquila", fromCityId: "5f2173ea0074ba3c340bfd22", toSlug: "valladolid-2", toCityId: "5f21950f27cbc1bad30fce2f", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #32 (12 bookings)
      { fromSlug: "palenque", fromCityId: "5f621acd878ad116d7211322", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #33 (12 bookings)
      { fromSlug: "san-cristobal-de-las-casas", fromCityId: "5f3401bb52a3e05225935aac", toSlug: "tuxtla-gutierrez", toCityId: "5f3406073c9b4a58c30fe045", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #34 (12 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "bacalar", toCityId: "5d53e6ce85ba5918a07c903c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #35 (11 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "merida", toCityId: "5ed51b805c89c47960868e35", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #36 (11 bookings)
      { fromSlug: "chetumal", fromCityId: "5f50be3994480b59204c8f04", toSlug: "belize-city", toCityId: "60f9797657ffb4835d5553d9", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #37 (11 bookings)
      { fromSlug: "valladolid-2", fromCityId: "5f21950f27cbc1bad30fce2f", toSlug: "bacalar", toCityId: "5d53e6ce85ba5918a07c903c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #38 (11 bookings)
      { fromSlug: "valladolid-2", fromCityId: "5f21950f27cbc1bad30fce2f", toSlug: "merida", toCityId: "5ed51b805c89c47960868e35", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #39 (11 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "belize-city", toCityId: "60f9797657ffb4835d5553d9", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #40 (10 bookings)
      { fromSlug: "tuxtla-gutierrez", fromCityId: "5f3406073c9b4a58c30fe045", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #41 (10 bookings)
      { fromSlug: "chetumal", fromCityId: "5f50be3994480b59204c8f04", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #42 (9 bookings)
      { fromSlug: "chetumal", fromCityId: "5f50be3994480b59204c8f04", toSlug: "merida", toCityId: "5ed51b805c89c47960868e35", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #43 (9 bookings)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "huatulco-1", toCityId: "65dde8e44206b323eca7c3b4", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #44 (9 bookings)
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "valladolid-2", toCityId: "5f21950f27cbc1bad30fce2f", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #45 (8 bookings)
      { fromSlug: "pochutla", fromCityId: "664eefc6c3d6842f5972d7a2", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #46 (8 bookings)
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "chetumal", toCityId: "5f50be3994480b59204c8f04", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #47 (7 bookings)
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #48 (7 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "chetumal", toCityId: "5f50be3994480b59204c8f04", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #49 (7 bookings)
      { fromSlug: "merida", fromCityId: "5ed51b805c89c47960868e35", toSlug: "chichen-itza", toCityId: "5f5756f1d65fa6a77582b489", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #50 (7 bookings)
      // Remaining Clickbus Mexico API routes with paid bookings, 2026-07-03 to 2026-10-01 (BAW bookings API, 2026-10-01).
      { fromSlug: "puerto-escondido", fromCityId: "5f50be3672492dd00b9f53e1", toSlug: "huatulco-1", toCityId: "65dde8e44206b323eca7c3b4", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #51 (7 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "chiquila", toCityId: "5f2173ea0074ba3c340bfd22", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #52 (7 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "bacalar", toCityId: "5d53e6ce85ba5918a07c903c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #53 (7 bookings)
      { fromSlug: "palenque", fromCityId: "5f621acd878ad116d7211322", toSlug: "bacalar", toCityId: "5d53e6ce85ba5918a07c903c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #54 (7 bookings)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "puerto-escondido", toCityId: "5f50be3672492dd00b9f53e1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #55 (7 bookings)
      { fromSlug: "san-cristobal-de-las-casas", fromCityId: "5f3401bb52a3e05225935aac", toSlug: "oaxaca", toCityId: "5d7e2a7914afa3da1a34fd85", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #56 (6 bookings)
      { fromSlug: "huatulco-1", fromCityId: "65dde8e44206b323eca7c3b4", toSlug: "puerto-escondido", toCityId: "5f50be3672492dd00b9f53e1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #57 (6 bookings)
      { fromSlug: "valladolid-2", fromCityId: "5f21950f27cbc1bad30fce2f", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #58 (5 bookings)
      { fromSlug: "tepoztlan", fromCityId: "5f33fc293c9b4a2b720fde89", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #59 (5 bookings)
      { fromSlug: "san-cristobal-de-las-casas", fromCityId: "5f3401bb52a3e05225935aac", toSlug: "puerto-escondido", toCityId: "5f50be3672492dd00b9f53e1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #60 (5 bookings)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "puebla", toCityId: "5f05cc0477e6ef38594f8d6d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #61 (5 bookings)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "tepoztlan", toCityId: "5f33fc293c9b4a2b720fde89", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #62 (5 bookings)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "san-miguel-de-allende", toCityId: "5e7b69b8151b51215ffb23eb", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #63 (5 bookings)
      { fromSlug: "chiquila", fromCityId: "5f2173ea0074ba3c340bfd22", toSlug: "merida", toCityId: "5ed51b805c89c47960868e35", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #64 (5 bookings)
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "palenque", toCityId: "5f621acd878ad116d7211322", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #65 (5 bookings)
      { fromSlug: "valladolid-2", fromCityId: "5f21950f27cbc1bad30fce2f", toSlug: "chiquila", toCityId: "5f2173ea0074ba3c340bfd22", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #66 (4 bookings)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "chiquila", toCityId: "5f2173ea0074ba3c340bfd22", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #67 (4 bookings)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "belize-city", toCityId: "60f9797657ffb4835d5553d9", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #68 (4 bookings)
      { fromSlug: "salina-cruz", fromCityId: "6034f30bf58489522271e34d", toSlug: "oaxaca", toCityId: "5d7e2a7914afa3da1a34fd85", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #69 (4 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "palenque", toCityId: "5f621acd878ad116d7211322", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #70 (4 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "merida", toCityId: "5ed51b805c89c47960868e35", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #71 (4 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "chetumal", toCityId: "5f50be3994480b59204c8f04", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #72 (4 bookings)
      { fromSlug: "palenque", fromCityId: "5f621acd878ad116d7211322", toSlug: "villahermosa", toCityId: "5f33e2f4938ee536497807d1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #73 (4 bookings)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "taxco", toCityId: "618a16af7b45450f98e7ad70", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #74 (4 bookings)
      { fromSlug: "merida", fromCityId: "5ed51b805c89c47960868e35", toSlug: "chiquila", toCityId: "5f2173ea0074ba3c340bfd22", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #75 (4 bookings)
      { fromSlug: "huatulco-1", fromCityId: "65dde8e44206b323eca7c3b4", toSlug: "oaxaca", toCityId: "5d7e2a7914afa3da1a34fd85", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #76 (4 bookings)
      { fromSlug: "chichen-itza", fromCityId: "5f5756f1d65fa6a77582b489", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #77 (4 bookings)
      { fromSlug: "villahermosa", fromCityId: "5f33e2f4938ee536497807d1", toSlug: "palenque", toCityId: "5f621acd878ad116d7211322", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #78 (3 bookings)
      { fromSlug: "puerto-escondido", fromCityId: "5f50be3672492dd00b9f53e1", toSlug: "santa-maria-huatulco", toCityId: "5f50be38427cbe8cdaa20514", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #79 (3 bookings)
      { fromSlug: "puerto-escondido", fromCityId: "5f50be3672492dd00b9f53e1", toSlug: "pochutla", toCityId: "664eefc6c3d6842f5972d7a2", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #80 (3 bookings)
      { fromSlug: "puerto-escondido", fromCityId: "5f50be3672492dd00b9f53e1", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #81 (3 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "puerto-morelos", toCityId: "5ea03a2c76a5e2b334d17126", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #82 (3 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "belize-city", toCityId: "60f9797657ffb4835d5553d9", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #83 (3 bookings)
      { fromSlug: "palenque", fromCityId: "5f621acd878ad116d7211322", toSlug: "tuxtla-gutierrez", toCityId: "5f3406073c9b4a58c30fe045", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #84 (3 bookings)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "salina-cruz", toCityId: "6034f30bf58489522271e34d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #85 (3 bookings)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "cuernavaca", toCityId: "618a17037b454560e8e7ad99", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #86 (3 bookings)
      { fromSlug: "merida", fromCityId: "5ed51b805c89c47960868e35", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #87 (3 bookings)
      { fromSlug: "tijuana", fromCityId: "5f50be34d47483725cd78ce8", toSlug: "ensenada", toCityId: "61eeaaba1b95fb68c9529296", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #88 (2 bookings)
      { fromSlug: "taxco", fromCityId: "618a16af7b45450f98e7ad70", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #89 (2 bookings)
      { fromSlug: "tapachula", fromCityId: "5f50be34d4748341a7d78cea", toSlug: "tuxtla-gutierrez", toCityId: "5f3406073c9b4a58c30fe045", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #90 (2 bookings)
      { fromSlug: "tapachula", fromCityId: "5f50be34d4748341a7d78cea", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #91 (2 bookings)
      { fromSlug: "santa-maria-huatulco", fromCityId: "5f50be38427cbe8cdaa20514", toSlug: "oaxaca", toCityId: "5d7e2a7914afa3da1a34fd85", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #92 (2 bookings)
      { fromSlug: "san-miguel-de-allende", fromCityId: "5e7b69b8151b51215ffb23eb", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #93 (2 bookings)
      { fromSlug: "salina-cruz", fromCityId: "6034f30bf58489522271e34d", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #94 (2 bookings)
      { fromSlug: "puerto-vallarta", fromCityId: "5ea5973fa79e79848c0c5c50", toSlug: "mazatlan", toCityId: "5f50be3672492dfd5f9f53e6", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #95 (2 bookings)
      { fromSlug: "puerto-escondido", fromCityId: "5f50be3672492dd00b9f53e1", toSlug: "tuxtla-gutierrez", toCityId: "5f3406073c9b4a58c30fe045", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #96 (2 bookings)
      { fromSlug: "puebla", fromCityId: "5f05cc0477e6ef38594f8d6d", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #97 (2 bookings)
      { fromSlug: "pochutla", fromCityId: "664eefc6c3d6842f5972d7a2", toSlug: "puerto-escondido", toCityId: "5f50be3672492dd00b9f53e1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #98 (2 bookings)
      { fromSlug: "pochutla", fromCityId: "664eefc6c3d6842f5972d7a2", toSlug: "oaxaca", toCityId: "5d7e2a7914afa3da1a34fd85", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #99 (2 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #100 (2 bookings)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "chichen-itza", toCityId: "5f5756f1d65fa6a77582b489", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #101 (2 bookings)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "tuxtla-gutierrez", toCityId: "5f3406073c9b4a58c30fe045", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #102 (2 bookings)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "santa-maria-huatulco", toCityId: "5f50be38427cbe8cdaa20514", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #103 (2 bookings)
      { fromSlug: "morelia", fromCityId: "5f50be37d4748330dfd78cf5", toSlug: "san-miguel-de-allende", toCityId: "5e7b69b8151b51215ffb23eb", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #104 (2 bookings)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "orizaba-veracruz", toCityId: "64e5a302bff0b05dfdcdeda6", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #105 (2 bookings)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "morelia", toCityId: "5f50be37d4748330dfd78cf5", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #106 (2 bookings)
      { fromSlug: "merida", fromCityId: "5ed51b805c89c47960868e35", toSlug: "chetumal", toCityId: "5f50be3994480b59204c8f04", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #107 (2 bookings)
      { fromSlug: "guadalajara", fromCityId: "5f50be38427cbe4cb3a20516", toSlug: "uruapan", toCityId: "5f50be34246564037c141bde", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #108 (2 bookings)
      { fromSlug: "cuernavaca", fromCityId: "618a17037b454560e8e7ad99", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #109 (2 bookings)
      { fromSlug: "chiquila", fromCityId: "5f2173ea0074ba3c340bfd22", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #110 (2 bookings)
      { fromSlug: "chetumal", fromCityId: "5f50be3994480b59204c8f04", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #111 (2 bookings)
      { fromSlug: "chetumal", fromCityId: "5f50be3994480b59204c8f04", toSlug: "corozal", toCityId: "64b8b6a17e564b27707c3f3e", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #112 (2 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "puerto-morelos", toCityId: "5ea03a2c76a5e2b334d17126", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #113 (2 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "corozal", toCityId: "64b8b6a17e564b27707c3f3e", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #114 (2 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "chichen-itza", toCityId: "5f5756f1d65fa6a77582b489", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #115 (2 bookings)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #116 (2 bookings)
      { fromSlug: "acapulco", fromCityId: "5d88705d3c5ecc14b2ed1044", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #117 (2 bookings)
      { fromSlug: "zihuatanejo", fromCityId: "6267fdff17b7a8302cd8b8b8", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #118 (1 booking)
      { fromSlug: "villahermosa", fromCityId: "5f33e2f4938ee536497807d1", toSlug: "puebla", toCityId: "5f05cc0477e6ef38594f8d6d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #119 (1 booking)
      { fromSlug: "veracruz", fromCityId: "5f33a50a350d6d717282cd31", toSlug: "tampico", toCityId: "5f50be35d47483fa90d78ceb", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #120 (1 booking)
      { fromSlug: "veracruz", fromCityId: "5f33a50a350d6d717282cd31", toSlug: "puebla", toCityId: "5f05cc0477e6ef38594f8d6d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #121 (1 booking)
      { fromSlug: "veracruz", fromCityId: "5f33a50a350d6d717282cd31", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #122 (1 booking)
      { fromSlug: "tuxtla-gutierrez", fromCityId: "5f3406073c9b4a58c30fe045", toSlug: "villahermosa", toCityId: "5f33e2f4938ee536497807d1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #123 (1 booking)
      { fromSlug: "tuxtla-gutierrez", fromCityId: "5f3406073c9b4a58c30fe045", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #124 (1 booking)
      { fromSlug: "tuxtla-gutierrez", fromCityId: "5f3406073c9b4a58c30fe045", toSlug: "pochutla", toCityId: "664eefc6c3d6842f5972d7a2", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #125 (1 booking)
      { fromSlug: "tuxtla-gutierrez", fromCityId: "5f3406073c9b4a58c30fe045", toSlug: "palenque", toCityId: "5f621acd878ad116d7211322", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #126 (1 booking)
      { fromSlug: "tuxtla-gutierrez", fromCityId: "5f3406073c9b4a58c30fe045", toSlug: "oaxaca", toCityId: "5d7e2a7914afa3da1a34fd85", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #127 (1 booking)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #128 (1 booking)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "mahahual", toCityId: "5fc653a9342ad83bab14210c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #129 (1 booking)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "chichen-itza", toCityId: "5f5756f1d65fa6a77582b489", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #130 (1 booking)
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "chetumal", toCityId: "5f50be3994480b59204c8f04", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #131 (1 booking)
      { fromSlug: "tepic", fromCityId: "5f50be34d47483441dd78ce7", toSlug: "ruiz", toCityId: "658444b8737fa1d3481880eb", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #132 (1 booking)
      { fromSlug: "tehuacan", fromCityId: "65891da155d632c981ed9f32", toSlug: "puebla", toCityId: "5f05cc0477e6ef38594f8d6d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #133 (1 booking)
      { fromSlug: "tehuacan", fromCityId: "65891da155d632c981ed9f32", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #134 (1 booking)
      { fromSlug: "taxco", fromCityId: "618a16af7b45450f98e7ad70", toSlug: "puebla", toCityId: "5f05cc0477e6ef38594f8d6d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #135 (1 booking)
      { fromSlug: "taxco", fromCityId: "618a16af7b45450f98e7ad70", toSlug: "cuernavaca", toCityId: "618a17037b454560e8e7ad99", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #136 (1 booking)
      { fromSlug: "tapachula", fromCityId: "5f50be34d4748341a7d78cea", toSlug: "veracruz", toCityId: "5f33a50a350d6d717282cd31", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #137 (1 booking)
      { fromSlug: "tapachula", fromCityId: "5f50be34d4748341a7d78cea", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #138 (1 booking)
      { fromSlug: "tapachula", fromCityId: "5f50be34d4748341a7d78cea", toSlug: "puebla", toCityId: "5f05cc0477e6ef38594f8d6d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #139 (1 booking)
      { fromSlug: "tampico", fromCityId: "5f50be35d47483fa90d78ceb", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #140 (1 booking)
      { fromSlug: "santa-maria-huatulco", fromCityId: "5f50be38427cbe8cdaa20514", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #141 (1 booking)
      { fromSlug: "santa-maria-huatulco", fromCityId: "5f50be38427cbe8cdaa20514", toSlug: "puerto-escondido", toCityId: "5f50be3672492dd00b9f53e1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #142 (1 booking)
      { fromSlug: "santa-maria-huatulco", fromCityId: "5f50be38427cbe8cdaa20514", toSlug: "pochutla", toCityId: "664eefc6c3d6842f5972d7a2", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #143 (1 booking)
      { fromSlug: "san-miguel-de-allende", fromCityId: "5e7b69b8151b51215ffb23eb", toSlug: "puebla", toCityId: "5f05cc0477e6ef38594f8d6d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #144 (1 booking)
      { fromSlug: "san-miguel-de-allende", fromCityId: "5e7b69b8151b51215ffb23eb", toSlug: "morelia", toCityId: "5f50be37d4748330dfd78cf5", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #145 (1 booking)
      { fromSlug: "san-luis-potosi", fromCityId: "5f50be35427cbe2685a20507", toSlug: "puebla", toCityId: "5f05cc0477e6ef38594f8d6d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #146 (1 booking)
      { fromSlug: "san-cristobal-de-las-casas", fromCityId: "5f3401bb52a3e05225935aac", toSlug: "tehuantepec", toCityId: "65891dd71bc8bbc8fb426ce1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #147 (1 booking)
      { fromSlug: "san-cristobal-de-las-casas", fromCityId: "5f3401bb52a3e05225935aac", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #148 (1 booking)
      { fromSlug: "san-cristobal-de-las-casas", fromCityId: "5f3401bb52a3e05225935aac", toSlug: "huatulco-1", toCityId: "65dde8e44206b323eca7c3b4", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #149 (1 booking)
      { fromSlug: "queretaro-1", fromCityId: "63783bbd1267c7d48b53e0e5", toSlug: "san-miguel-de-allende", toCityId: "5e7b69b8151b51215ffb23eb", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #150 (1 booking)
      { fromSlug: "puerto-vallarta", fromCityId: "5ea5973fa79e79848c0c5c50", toSlug: "sayulita", toCityId: "611d164088d53f0a9d7368d4", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #151 (1 booking)
      { fromSlug: "puerto-vallarta", fromCityId: "5ea5973fa79e79848c0c5c50", toSlug: "guadalajara", toCityId: "5f50be38427cbe4cb3a20516", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #152 (1 booking)
      { fromSlug: "puerto-morelos", fromCityId: "5ea03a2c76a5e2b334d17126", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #153 (1 booking)
      { fromSlug: "puerto-morelos", fromCityId: "5ea03a2c76a5e2b334d17126", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #154 (1 booking)
      { fromSlug: "puebla", fromCityId: "5f05cc0477e6ef38594f8d6d", toSlug: "taxco", toCityId: "618a16af7b45450f98e7ad70", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #155 (1 booking)
      { fromSlug: "puebla", fromCityId: "5f05cc0477e6ef38594f8d6d", toSlug: "santa-maria-huatulco", toCityId: "5f50be38427cbe8cdaa20514", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #156 (1 booking)
      { fromSlug: "pochutla", fromCityId: "664eefc6c3d6842f5972d7a2", toSlug: "huatulco-1", toCityId: "65dde8e44206b323eca7c3b4", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #157 (1 booking)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #158 (1 booking)
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #159 (1 booking)
      { fromSlug: "palenque", fromCityId: "5f621acd878ad116d7211322", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #160 (1 booking)
      { fromSlug: "palenque", fromCityId: "5f621acd878ad116d7211322", toSlug: "merida", toCityId: "5ed51b805c89c47960868e35", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #161 (1 booking)
      { fromSlug: "palenque", fromCityId: "5f621acd878ad116d7211322", toSlug: "chetumal", toCityId: "5f50be3994480b59204c8f04", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #162 (1 booking)
      { fromSlug: "palenque", fromCityId: "5f621acd878ad116d7211322", toSlug: "campeche", toCityId: "5f33f15080800048bb07482c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #163 (1 booking)
      { fromSlug: "pachuca", fromCityId: "618a1fe306df7ff7041ae0e3", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #164 (1 booking)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "villahermosa", toCityId: "5f33e2f4938ee536497807d1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #165 (1 booking)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "tehuacan", toCityId: "65891da155d632c981ed9f32", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #166 (1 booking)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "tapachula", toCityId: "5f50be34d4748341a7d78cea", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #167 (1 booking)
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "pochutla", toCityId: "664eefc6c3d6842f5972d7a2", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #168 (1 booking)
      { fromSlug: "nuevo-casas-grandes", fromCityId: "65e18867471271eb83bca661", toSlug: "chihuahua-1", toCityId: "5f50be3972492d60f29f53f0", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #169 (1 booking)
      { fromSlug: "monterrey", fromCityId: "5f50be3772492d88319f53e8", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #170 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "zihuatanejo", toCityId: "6267fdff17b7a8302cd8b8b8", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #171 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "tuxpan-veracruz", toCityId: "65891ef51bc8bb803f426e2d", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #172 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "tijuana", toCityId: "5f50be34d47483725cd78ce8", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #173 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "tecoman", toCityId: "65e847b46a642fa77ce9d957", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #174 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "san-cristobal-de-las-casas", toCityId: "5f3401bb52a3e05225935aac", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #175 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #176 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "pachuca", toCityId: "618a1fe306df7ff7041ae0e3", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #177 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "nuevo-laredo", toCityId: "5f50be36d474836989d78cf4", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #178 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "mazatlan", toCityId: "5f50be3672492dfd5f9f53e6", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #179 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "ixmiquilpan", toCityId: "65dea5aa4206b3a888a8c53b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #180 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "heroica-ciudad-de-huajuapan-de-leon", toCityId: "658918c955d632061eed9a4c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #181 (1 booking)
      { fromSlug: "mexico-city", fromCityId: "5d7e2a0a14afa3570c34fd3b", toSlug: "ciudad-valles", toCityId: "6267f583a559546a51d4caf2", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #182 (1 booking)
      { fromSlug: "merida", fromCityId: "5ed51b805c89c47960868e35", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #183 (1 booking)
      { fromSlug: "merida", fromCityId: "5ed51b805c89c47960868e35", toSlug: "palenque", toCityId: "5f621acd878ad116d7211322", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #184 (1 booking)
      { fromSlug: "merida", fromCityId: "5ed51b805c89c47960868e35", toSlug: "campeche", toCityId: "5f33f15080800048bb07482c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #185 (1 booking)
      { fromSlug: "mazatlan", fromCityId: "5f50be3672492dfd5f9f53e6", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #186 (1 booking)
      { fromSlug: "mazatlan", fromCityId: "5f50be3672492dfd5f9f53e6", toSlug: "los-mochis", toCityId: "5f50be37427cbe0632a20510", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #187 (1 booking)
      { fromSlug: "mahahual", fromCityId: "5fc653a9342ad83bab14210c", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #188 (1 booking)
      { fromSlug: "mahahual", fromCityId: "5fc653a9342ad83bab14210c", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #189 (1 booking)
      { fromSlug: "huatulco-1", fromCityId: "65dde8e44206b323eca7c3b4", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #190 (1 booking)
      { fromSlug: "hermosillo", fromCityId: "5f50be3872492d1b719f53ec", toSlug: "guaymas", toCityId: "5f50be3824656496c3141bf0", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #191 (1 booking)
      { fromSlug: "guadalajara", fromCityId: "5f50be38427cbe4cb3a20516", toSlug: "puerto-vallarta", toCityId: "5ea5973fa79e79848c0c5c50", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #192 (1 booking)
      { fromSlug: "guadalajara", fromCityId: "5f50be38427cbe4cb3a20516", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #193 (1 booking)
      { fromSlug: "guadalajara", fromCityId: "5f50be38427cbe4cb3a20516", toSlug: "lagos-de-moreno", toCityId: "63315d8bec3d5d19767b4094", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #194 (1 booking)
      { fromSlug: "cuernavaca", fromCityId: "618a17037b454560e8e7ad99", toSlug: "taxco", toCityId: "618a16af7b45450f98e7ad70", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #195 (1 booking)
      { fromSlug: "chilpancingo", fromCityId: "656de2e591f5771f0d7ca4e8", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #196 (1 booking)
      { fromSlug: "chihuahua-1", fromCityId: "5f50be3972492d60f29f53f0", toSlug: "ciudad-juarez", toCityId: "5f50be3924656470b0141bf5", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #197 (1 booking)
      { fromSlug: "chetumal", fromCityId: "5f50be3994480b59204c8f04", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #198 (1 booking)
      { fromSlug: "chetumal", fromCityId: "5f50be3994480b59204c8f04", toSlug: "palenque", toCityId: "5f621acd878ad116d7211322", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #199 (1 booking)
      { fromSlug: "chetumal", fromCityId: "5f50be3994480b59204c8f04", toSlug: "orange-walk", toCityId: "655ca1f3f4a3f892690ddb53", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #200 (1 booking)
      { fromSlug: "chetumal", fromCityId: "5f50be3994480b59204c8f04", toSlug: "bacalar", toCityId: "5d53e6ce85ba5918a07c903c", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #201 (1 booking)
      { fromSlug: "celaya", fromCityId: "61113135b7e9830d7bbde7da", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #202 (1 booking)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "palenque", toCityId: "5f621acd878ad116d7211322", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #203 (1 booking)
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "orange-walk", toCityId: "655ca1f3f4a3f892690ddb53", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #204 (1 booking)
      { fromSlug: "campeche", fromCityId: "5f33f15080800048bb07482c", toSlug: "palenque", toCityId: "5f621acd878ad116d7211322", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #205 (1 booking)
      { fromSlug: "campeche", fromCityId: "5f33f15080800048bb07482c", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #206 (1 booking)
      { fromSlug: "bucerias", fromCityId: "60a65737e4b3d6060a84a03f", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #207 (1 booking)
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "orange-walk", toCityId: "655ca1f3f4a3f892690ddb53", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #208 (1 booking)
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "merida", toCityId: "5ed51b805c89c47960868e35", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #209 (1 booking)
      { fromSlug: "asuncion-nochixtlan", fromCityId: "65891b7455d63216f8ed9ca7", toSlug: "mexico-city", toCityId: "5d7e2a0a14afa3570c34fd3b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #210 (1 booking)
      { fromSlug: "acapulco", fromCityId: "5d88705d3c5ecc14b2ed1044", toSlug: "puerto-escondido", toCityId: "5f50be3672492dd00b9f53e1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null }, // #211 (1 booking)
    ],
  },
  {
    name: "Distribusion Mexico",
    integration: "DSB",
    routes: [
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "chiquila", toCityId: "5f2173ea0074ba3c340bfd22", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
      { fromSlug: "cancun", fromCityId: "5bbf3d98d184be2dd45f011b", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
      { fromSlug: "chiquila", fromCityId: "5f2173ea0074ba3c340bfd22", toSlug: "cancun", toCityId: "5bbf3d98d184be2dd45f011b", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
      { fromSlug: "playa-del-carmen", fromCityId: "5b8f8a6078bfa27243335ccd", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
      { fromSlug: "tulum", fromCityId: "5d3d4554d533f4fc3ed5ae97", toSlug: "playa-del-carmen", toCityId: "5b8f8a6078bfa27243335ccd", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
      { fromSlug: "bacalar", fromCityId: "5d53e6ce85ba5918a07c903c", toSlug: "tulum", toCityId: "5d3d4554d533f4fc3ed5ae97", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
      { fromSlug: "oaxaca", fromCityId: "5d7e2a7914afa3da1a34fd85", toSlug: "puerto-escondido", toCityId: "5f50be3672492dd00b9f53e1", countrySlug: "mexico", dataProviderLink: null, twelveGoLink: null },
    ],
  },
];
