import type { Metadata } from 'next';

import AsciiMargins from '../components/AsciiMargins';

import './globals.css';

export const metadata: Metadata = {
  title: 'Jeremy Sedillo',
  description: 'Portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AsciiMargins />
        {children}
      </body>
    </html>
  );
}

