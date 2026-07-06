import React from 'react';

export default function ProjectsGrid({ items }) {
  return (
    <section className="space-y-6">
      <p className="eyebrow">Projects</p>
      <div className="grid items-start gap-3 sm:grid-cols-2">
        {items.map((project, idx) => (
          <div key={idx} className="rounded-lg border border-neutral-200 px-4 py-4 transition-colors hover:border-neutral-400">
            <div className="text-lg text-neutral-900">{project.name}</div>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
              {project.description}
            </p>
            {project.url && (
              <a href={project.url} className="body-link mt-3 inline-block font-sans text-sm">
                Visit ↗
              </a>
            )}
            {project.tech?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tech.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-sans text-[11px] text-neutral-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
