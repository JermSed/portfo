import React from 'react';

export default function ProjectsGrid({ items }) {
  return (
    <section>
      <h2 className="section-title">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((project, idx) => (
          <a
            key={idx}
            href={project.url}
            className="group block card p-5 border border-slate-200 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 transition-colors no-underline hover:no-underline decoration-transparent hover:decoration-transparent text-inherit"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-ink-900 text-lg">{project.name}</span>
              <span className="text-slate-300 group-hover:text-ink-400 transition-colors ml-2">↗</span>
            </div>
            <div className="text-ink-500 group-hover:text-ink-700 transition-colors text-sm leading-snug">{project.description}</div>
          </a>
        ))}
      </div>
    </section>
  );
}


