import React, { useState } from 'react';

function Logo({ src, alt, fallback }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        className="w-9 h-9 rounded-lg object-contain bg-white border border-slate-200 p-0"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-ink-900 font-semibold border border-slate-200">
      {fallback}
    </div>
  );
}

export default function WorkList({ items }) {
  return (
    <section className="mb-16">
      <h2 className="section-title">Work</h2>
      <div className="divide-y divide-slate-200/70">
        {items.map((job, idx) => (
          <div key={idx} className="flex items-center py-4">
            <div className="mr-4">
              <Logo
                src={job.logo}
                alt={job.company || job.name}
                fallback={(job.company || job.name || '?').slice(0, 1)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-ink-900">{job.name}</span>
              <span className="ml-2 text-ink-500 text-sm">{job.role}</span>
              <span className="ml-2 text-slate-400 text-sm">{job.area}</span>
            </div>
            <div className="text-slate-500 text-sm min-w-fit">{job.period}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


