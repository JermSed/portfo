import type { Metadata, Viewport } from 'next';

import SiteFooter from '../components/SiteFooter';
import SiteNav from '../components/SiteNav';
import SandBackground from '../components/SandBackground';
import { profile } from '../data/resume';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${profile.name} · Engineer`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
  authors: [{ name: profile.name }],
  openGraph: {
    title: profile.name,
    description: profile.tagline,
    type: 'website',
  },
};

export const viewport: Viewport = {
  // The browser chrome should follow the page rather than fight it.
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <SandBackground />
        {/* Never trap a keyboard user in the chrome. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="container-page">
          <main id="main">{children}</main>
          <SiteFooter socials={profile.socials} email={profile.email} />
        </div>
        <SiteNav />
      </body>
    </html>
  );
}
