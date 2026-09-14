export const BASE_URL = "https://www.bookaway.com";

export const ROUTES_STORAGE_KEY = "compare-search-supplyless:routes";

export const SORT_BY_STORAGE_KEY = "compare-search-supplyless:sortBy";

export const INTEGRATION_STORAGE_KEY = "compare-search-supplyless:integration";

export const DEPARTURE_TIME_WINDOW_PADDING_MINUTES = 5;

// Settings shared by every integration type.
export const COMMON_SEARCH_CONFIG = {
  tcCode: 'TRV',
  tcSupplierId: '64cb7cafdff7a93b3203f82b',
  passengersAmount: 2,
  searchRadiusInMeters: 1000,
  mode: 'origin',
  skipEnrichment: false
};

// One entry per supplier-api integration being migrated. Keyed by BAW supplier code.
// - bawSupplierId: the supplier company id in BAW (users-service companies).
// - filterBySourceOfData: search-service operator allow-list key (debug-migration-data.js).
// - dataProviderDateParam: query param appended to dataProviderLink with the search date, or null.
export const INTEGRATIONS = {
  PIN: {
    code: 'PIN',
    name: 'Pinbus',
    bawSupplierId: '660d57d138198f88d7da905c',
    filterBySourceOfData: 'PIN',
    dataProviderName: 'PinBus',
    dataProviderDateParam: 'salida'
  },
  GBB: {
    code: 'GBB',
    name: 'GetByBus',
    bawSupplierId: '60cf2e027ea1b80001552ba6',
    filterBySourceOfData: 'GBB',
    dataProviderName: 'GetByBus',
    dataProviderDateParam: null
  }
};

export const DEFAULT_INTEGRATION = 'PIN';

// Each preset must declare `integration` (a key of INTEGRATIONS).
// Each route entry should include dataProviderLink and twelveGoLink. Use null if no link is available.
export const PRESETS = [
  {
    name: "Pinbus Colombia",
    integration: "PIN",
    routes: [
      {
        fromSlug: "barranquilla",
        toSlug: "riohacha",
        countrySlug: "colombia",
        dataProviderLink:
          "https://pinbus.com/busqueda?origen=Barranquilla,+ATL+(Todas)&origen_id=28&destino=Riohacha,+LAG+(Todas)&destino_id=46",
        twelveGoLink:
          "https://12go.com/en/travel/barranquilla/riohacha",
      },
      {
        fromSlug: "riohacha",
        toSlug: "barranquilla",
        countrySlug: "colombia",
        dataProviderLink: 'https://pinbus.com/busqueda?origen=Riohacha,+LAG+(Todas)&origen_id=46&destino=Barranquilla,+ATL+(Todas)&destino_id=28',
        twelveGoLink: 'https://12go.com/en/travel/riohacha/barranquilla',
      },
      {
        fromSlug: "cartagena",
        toSlug: "santa-marta",
        countrySlug: "colombia",
        dataProviderLink:
          "https://pinbus.com/busqueda?origen=Cartagena,+BOL+(Todas)&origen_id=29&destino=Santa+marta,+MAG+(Todas)&destino_id=31",
        twelveGoLink:
          "https://12go.asia/en/travel/cartagena-de-indias/santa-marta",
      },
      {
        fromSlug: "santa-marta",
        toSlug: "cartagena",
        countrySlug: "colombia",
        dataProviderLink: 'https://pinbus.com/busqueda?origen=Santa+marta,+MAG+(Todas)&origen_id=31&destino=Cartagena,+BOL+(Todas)&destino_id=29',
        twelveGoLink:
          "https://12go.asia/en/travel/santa-marta/cartagena-de-indias",
      },
      // Top 30 Pinbus routes by Bookaway revenue (Sep 2025 - Sep 2026). Links TBD.
      {
        fromSlug: "santa-marta",
        toSlug: "medellin",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #1
      {
        fromSlug: "bogota",
        toSlug: "medellin",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #3
      {
        fromSlug: "bogota",
        toSlug: "armenia",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #4
      {
        fromSlug: "medellin",
        toSlug: "cartagena",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #5
      {
        fromSlug: "medellin",
        toSlug: "santa-marta",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #6
      {
        fromSlug: "medellin",
        toSlug: "bogota",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #7
      {
        fromSlug: "cartagena",
        toSlug: "medellin",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #8
      {
        fromSlug: "jardin",
        toSlug: "medellin",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #9
      {
        fromSlug: "cali",
        toSlug: "medellin",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #11
      {
        fromSlug: "pereira",
        toSlug: "medellin",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #12
      {
        fromSlug: "medellin",
        toSlug: "cali",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #15
      {
        fromSlug: "bogota",
        toSlug: "neiva",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #16
      {
        fromSlug: "bogota",
        toSlug: "pereira",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #17
      {
        fromSlug: "armenia",
        toSlug: "bogota",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #18
      {
        fromSlug: "armenia",
        toSlug: "medellin",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #20
      {
        fromSlug: "armenia",
        toSlug: "cali",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #21
      {
        fromSlug: "cali",
        toSlug: "armenia",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #22
      {
        fromSlug: "santa-marta",
        toSlug: "bogota",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #23
      {
        fromSlug: "cali",
        toSlug: "bogota",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #24
      {
        fromSlug: "medellin",
        toSlug: "pereira",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #25
      {
        fromSlug: "pereira",
        toSlug: "bogota",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #26
      {
        fromSlug: "bogota",
        toSlug: "cali",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #27
      {
        fromSlug: "neiva",
        toSlug: "bogota",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #28
      {
        fromSlug: "medellin",
        toSlug: "jardin",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #29
      {
        fromSlug: "cartagena",
        toSlug: "bogota",
        countrySlug: "colombia",
        dataProviderLink: null,
        twelveGoLink: null,
      }, // #30
      {
        fromSlug: "bogota",
        toSlug: "villa-de-leyva",
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
      { fromSlug: "sarajevo", toSlug: "belgrade", countrySlug: "bosnia-and-herzegovina", dataProviderLink: null, twelveGoLink: null }, // #1
      { fromSlug: "shkoder", toSlug: "tirana", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #2
      { fromSlug: "mostar", toSlug: "kotor", countrySlug: "bosnia-and-herzegovina", dataProviderLink: null, twelveGoLink: null }, // #3
      { fromSlug: "mostar", toSlug: "sarajevo", countrySlug: "bosnia-and-herzegovina", dataProviderLink: null, twelveGoLink: null }, // #4
      { fromSlug: "tirana", toSlug: "shkoder", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #5
      { fromSlug: "belgrade", toSlug: "sarajevo", countrySlug: "serbia", dataProviderLink: null, twelveGoLink: null }, // #6
      { fromSlug: "split", toSlug: "hvar", countrySlug: "croatia", dataProviderLink: null, twelveGoLink: null }, // #7
      { fromSlug: "tirana", toSlug: "saranda", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #8
      { fromSlug: "dubrovnik", toSlug: "kotor", countrySlug: "croatia", dataProviderLink: null, twelveGoLink: null }, // #9
      { fromSlug: "kotor", toSlug: "budva", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #10
      { fromSlug: "kotor", toSlug: "dubrovnik", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #11
      { fromSlug: "dubrovnik", toSlug: "korcula", countrySlug: "croatia", dataProviderLink: null, twelveGoLink: null }, // #12
      { fromSlug: "ohrid", toSlug: "skopje", countrySlug: "north-macedonia", dataProviderLink: null, twelveGoLink: null }, // #13
      { fromSlug: "kotor", toSlug: "mostar", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #14
      { fromSlug: "saranda", toSlug: "tirana", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #15
      { fromSlug: "kotor", toSlug: "podgorica", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #16
      { fromSlug: "budva", toSlug: "podgorica", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #17
      { fromSlug: "budva", toSlug: "tirana", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #18
      { fromSlug: "sarajevo", toSlug: "mostar", countrySlug: "bosnia-and-herzegovina", dataProviderLink: null, twelveGoLink: null }, // #19
      { fromSlug: "skopje", toSlug: "ohrid", countrySlug: "north-macedonia", dataProviderLink: null, twelveGoLink: null }, // #20
      { fromSlug: "budva", toSlug: "shkoder", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #21
      { fromSlug: "budva", toSlug: "kotor", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #22
      { fromSlug: "dubrovnik", toSlug: "hvar", countrySlug: "croatia", dataProviderLink: null, twelveGoLink: null }, // #23
      { fromSlug: "hvar", toSlug: "split", countrySlug: "croatia", dataProviderLink: null, twelveGoLink: null }, // #24
      { fromSlug: "split", toSlug: "dubrovnik", countrySlug: "croatia", dataProviderLink: null, twelveGoLink: null }, // #25
      { fromSlug: "shkoder", toSlug: "budva", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #26
      { fromSlug: "sarajevo", toSlug: "podgorica", countrySlug: "bosnia-and-herzegovina", dataProviderLink: null, twelveGoLink: null }, // #27
      { fromSlug: "podgorica", toSlug: "budva", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #28
      { fromSlug: "shkoder", toSlug: "kotor", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #29
      { fromSlug: "skopje", toSlug: "sofia", countrySlug: "north-macedonia", dataProviderLink: null, twelveGoLink: null }, // #30
      { fromSlug: "hvar", toSlug: "dubrovnik", countrySlug: "croatia", dataProviderLink: null, twelveGoLink: null }, // #31
      { fromSlug: "tirana", toSlug: "himare", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #32
      { fromSlug: "podgorica", toSlug: "kotor", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #33
      { fromSlug: "kotor", toSlug: "zabljak", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #34
      { fromSlug: "dubrovnik", toSlug: "split", countrySlug: "croatia", dataProviderLink: null, twelveGoLink: null }, // #35
      { fromSlug: "tirana", toSlug: "budva", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #36
      { fromSlug: "kotor", toSlug: "tirana", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #37
      { fromSlug: "belgrade", toSlug: "pristina", countrySlug: "serbia", dataProviderLink: null, twelveGoLink: null }, // #38
      { fromSlug: "shkoder", toSlug: "podgorica", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #39
      { fromSlug: "himare", toSlug: "tirana", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #40
      { fromSlug: "tirana", toSlug: "kotor", countrySlug: "albania", dataProviderLink: null, twelveGoLink: null }, // #41
      { fromSlug: "podgorica", toSlug: "shkoder", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #42
      { fromSlug: "kotor", toSlug: "shkoder", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #43
      { fromSlug: "podgorica", toSlug: "tirana", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #44
      { fromSlug: "pristina", toSlug: "skopje", countrySlug: "kosovo", dataProviderLink: null, twelveGoLink: null }, // #45
      { fromSlug: "skopje", toSlug: "pristina", countrySlug: "north-macedonia", dataProviderLink: null, twelveGoLink: null }, // #46
      { fromSlug: "dubrovnik", toSlug: "mostar", countrySlug: "croatia", dataProviderLink: null, twelveGoLink: null }, // #47
      { fromSlug: "podgorica", toSlug: "sarajevo", countrySlug: "montenegro", dataProviderLink: null, twelveGoLink: null }, // #48
      { fromSlug: "sarajevo", toSlug: "mostar-east", countrySlug: "bosnia-and-herzegovina", dataProviderLink: null, twelveGoLink: null }, // #49
      { fromSlug: "mostar", toSlug: "budva", countrySlug: "bosnia-and-herzegovina", dataProviderLink: null, twelveGoLink: null }, // #50
    ],
  },
];
