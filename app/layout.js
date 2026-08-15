import './globals.css';

export const metadata = {
  title: 'TC vs BAW Journey Matcher',
  description: 'Compare supplyless journeys between TC and BAW side by side'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
