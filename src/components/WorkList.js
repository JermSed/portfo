import React from 'react';

import Logo from './Logo';

export default function WorkList({ items }) {
  if (!items?.length) return null;

  return (
    <section aria-labelledby="experience-heading">
      <h2 id="experience-heading" className="eyebrow">
        02 / Experience
      </h2>
      <div className="mt-6 space-y-7">
        {items.map((job, idx) => (
          <div key={idx} className="entry-row">
            <Logo
              src={job.logo}
              alt={job.company || job.name}
              fallback={(job.company || job.name || '?').slice(0, 1)}
            />
            <div className="min-w-0 flex-1">
              <div className="entry-name">{job.name}</div>
              <div className="meta mt-1">{job.role}</div>
            </div>
            <div className="meta shrink-0 pt-1">{job.period}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
