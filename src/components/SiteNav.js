'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links = [
  { href: '/', label: 'Work' },
  { href: '/thoughts', label: 'Writing' },
  { href: '/media', label: 'Media' },
];

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <ul className="bottom-nav-list">
        {links.map(({ href, label }) => {
          const current = href === '/' ? pathname === '/' || pathname.startsWith('/work/') : pathname === href || pathname.startsWith(`${href}/`);
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
