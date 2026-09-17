export const BASE_URL = "https://www.bookaway.com";

export const ROUTES_STORAGE_KEY = "compare-search-supplyless:routes";

export const SORT_BY_STORAGE_KEY = "compare-search-supplyless:sortBy";

export const INTEGRATION_STORAGE_KEY = "compare-search-supplyless:integration";

export const DEPARTURE_TIME_WINDOW_PADDING_MINUTES = 5;

// Settings shared by every integration type.
export const COMMON_SEARCH_CONFIG = {
  tcCode: "TRV",
  tcSupplierId: "64cb7cafdff7a93b3203f82b",
  passengersAmount: 2,
  searchRadiusInMeters: 1000,
  mode: "origin",
  skipEnrichment: false,
};

// One entry per supplier-api integration being migrated. Keyed by BAW supplier code.
// - bawSupplierId: the supplier company id in BAW (users-service companies).
// - filterBySourceOfData: search-service operator allow-list key (debug-migration-data.js).
// - dataProviderDateParam: query param appended to dataProviderLink with the search date, or null.
export const INTEGRATIONS = {
  PIN: {
    code: "PIN",
    name: "Pinbus",
    bawSupplierId: "660d57d138198f88d7da905c",
    filterBySourceOfData: "PIN",
    dataProviderName: "PinBus",
    dataProviderDateParam: "salida",
  },
  GBB: {
    code: "GBB",
    name: "GetByBus",
    bawSupplierId: "60cf2e027ea1b80001552ba6",
    filterBySourceOfData: "GBB",
    dataProviderName: "GetByBus",
    dataProviderDateParam: null,
  },
};

export const DEFAULT_INTEGRATION = "PIN";

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
];
