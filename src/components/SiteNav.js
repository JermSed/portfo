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
      <ul className="site-nav-list">
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
      </ul>
    </nav>
  );
}
