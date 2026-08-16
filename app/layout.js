import './globals.css';

export const metadata = {
  title: 'TC vs BAW Journey Matcher',
  description: 'Compare supplyless journeys between TC and BAW side by side',
  icons: {
    icon: 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" rx="14" fill="#f6f5f2"/>' +
      '<rect x="8" y="14" width="20" height="36" rx="4" fill="#1f6f8b"/>' +
      '<rect x="36" y="14" width="20" height="36" rx="4" fill="#b3541e"/>' +
      '<path d="M26 32 H38" stroke="#4d7c4a" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
    )
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
