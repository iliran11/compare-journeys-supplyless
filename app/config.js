export const BASE_URL = 'https://www.bookaway.com';

export const DEPARTURE_TIME_WINDOW_PADDING_MINUTES = 5;

export const PRESETS = [
  {
    name: 'Pinbus Colombia',
    routes: [
      { fromSlug: 'barranquilla', toSlug: 'riohacha', countrySlug: 'colombia' },
      { fromSlug: 'riohacha', toSlug: 'barranquilla', countrySlug: 'colombia' },
      { fromSlug: 'cartagena', toSlug: 'santa-marta', countrySlug: 'colombia' },
      { fromSlug: 'santa-marta', toSlug: 'cartagena', countrySlug: 'colombia' }
    ]
  }
];
