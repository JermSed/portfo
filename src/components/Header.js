import React from 'react';
import { ReactComponent as TwitterLogo } from '../logos/twitter-svgrepo-com.svg';
import { ReactComponent as LinkedInLogo } from '../logos/linkedin-svgrepo-com.svg';

export default function Header({ name, socials }) {
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <header className="py-4 flex justify-between items-center">
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">{name}</h1>
          <nav className="flex gap-4 md:gap-6 items-center text-ink-900/80">
              {/* <a href={socials?.twitter || '#'} aria-label="Twitter" className="inline-flex hover:opacity-100 opacity-80">
                <TwitterLogo className="w-5 h-5" />
              </a> */}
            <a href={socials?.linkedin || 'https://www.linkedin.com/in/jeremy-sedillo/'} aria-label="LinkedIn" className="inline-flex hover:opacity-100 opacity-80">
              <LinkedInLogo className="w-5 h-5" />
            </a>
          </nav>
        </header>
      </div>
    </div>
  );
}


