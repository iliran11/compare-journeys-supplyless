export const BASE_URL = "https://www.bookaway.com";

export const DEPARTURE_TIME_WINDOW_PADDING_MINUTES = 5;

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
    ],
  },
];
