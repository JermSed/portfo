import type { Metadata, Viewport } from 'next';

import SiteFooter from '../components/SiteFooter';
import SiteNav from '../components/SiteNav';
import StickWorld from '../components/StickWorld';
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ed' },
    { media: '(prefers-color-scheme: dark)', color: '#1b1a18' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html: `(function(){try{var t=localStorage.getItem('portfolio-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})()`}} /></head>
      <body>
        {/* Never trap a keyboard user in the chrome. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* Chrome lives in one place, so it is in the same spot on every page. */}
        <SiteNav />
        <StickWorld />
        <div className="container-page">
          <main id="main">{children}</main>
          <SiteFooter socials={profile.socials} email={profile.email} />
        </div>
      </body>
    </html>
  );
}
