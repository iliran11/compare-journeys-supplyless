export const BASE_URL = 'https://www.bookaway.com';

export const DEPARTURE_TIME_WINDOW_PADDING_MINUTES = 5;

export const PRESETS = [
  {
    name: 'Pinbus Colombia',
    routes: [
      {
        fromSlug: 'barranquilla',
        toSlug: 'riohacha',
        countrySlug: 'colombia',
        dataProvider: 'https://pinbus.com/busqueda?origen=Barranquilla,+ATL+(Todas)&origen_id=28&destino=Riohacha,+LAG+(Todas)&destino_id=46'
      },
      { fromSlug: 'riohacha', toSlug: 'barranquilla', countrySlug: 'colombia' },
      { fromSlug: 'cartagena', toSlug: 'santa-marta', countrySlug: 'colombia' },
      { fromSlug: 'santa-marta', toSlug: 'cartagena', countrySlug: 'colombia' }
    ]
  }
];
