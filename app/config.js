export const BASE_URL = "https://www.bookaway.com";

export const ROUTES_STORAGE_KEY = "compare-search-supplyless:routes";

export const DEPARTURE_TIME_WINDOW_PADDING_MINUTES = 5;

export const SEARCH_CONFIG = {
  tcCode: 'TRV',
  tcSupplierId: '64cb7cafdff7a93b3203f82b',
  bawCode: 'PIN',
  bawSupplierId: '660d57d138198f88d7da905c',
  passengersAmount: 2,
  searchRadiusInMeters: 1000,
  mode: 'origin',
  skipEnrichment: false,
  filterBySourceOfData: 'PIN'
};

// Each route entry should include dataProviderLink and twelveGoLink. Use null if no link is available.
export const PRESETS = [
  {
    name: "Pinbus Colombia",
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
];
