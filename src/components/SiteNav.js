'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Named for what each page actually holds. "Home" tells you nothing about
// where it goes; "Work" is a promise the page can keep.
const links = [
  { href: '/', label: 'Work' },
  { href: '/thoughts', label: 'Thoughts' },
  { href: '/photos', label: 'Photos' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      let saved; try { saved = localStorage.getItem('portfolio-theme'); } catch {}
      const next = saved === 'light' || saved === 'dark' ? saved : query.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    sync(); query.addEventListener('change', sync); window.addEventListener('storage', sync);
    return () => { query.removeEventListener('change', sync); window.removeEventListener('storage', sync); };
  }, []);
  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; setTheme(next);
    try { localStorage.setItem('portfolio-theme', next); } catch {}
  };
  const [overlapping, setOverlapping] = useState(false);

  // The edge treatment only earns its place once content is actually passing
  // underneath the bar — a permanent divider would be drawing a line under
  // nothing.
  useEffect(() => {
    const onScroll = () => setOverlapping(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`site-nav${overlapping ? ' site-nav-overlapping' : ''}`} aria-label="Primary">
      <Link href="/" className="site-wordmark" aria-label="Jeremy Sedillo home"><span>Jeremy</span>{' '}<span>Sedillo</span></Link>
      <div className="nav-actions"><ul className="site-nav-list">
        {links.map(({ href, label }) => {
          const current = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`site-nav-link${current ? ' site-nav-link-current' : ''}`}
                aria-current={current ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul><button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{theme === 'dark' ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> : <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>}</svg></button></div>
    </nav>
  );
}
