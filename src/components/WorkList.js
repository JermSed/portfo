import React from 'react';

import Logo from './Logo';

export default function WorkList({ items }) {
  return (
    <section className="space-y-6">
      <p className="eyebrow">Experience</p>
      <div className="space-y-7">
        {items.map((job, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <Logo
              src={job.logo}
              alt={job.company || job.name}
              fallback={(job.company || job.name || '?').slice(0, 1)}
            />
            <div className="min-w-0 flex-1">
              <div className="text-lg leading-snug text-neutral-900">{job.name}</div>
              <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                {job.role}
              </div>
            </div>
            <div className="shrink-0 pt-1 font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">
              {job.period}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}