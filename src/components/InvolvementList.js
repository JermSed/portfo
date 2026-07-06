import React from 'react';

import Logo from './Logo';

export default function InvolvementList({ items }) {
  if (!items?.length) return null;

  return (
    <section className="space-y-6">
      <p className="eyebrow">Involvement</p>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <Logo src={item.logo} alt={item.name} fallback={(item.name || '?').slice(0, 1)} />
            <div className="min-w-0 flex-1">
              <div className="text-lg leading-snug text-neutral-900">{item.name}</div>
              <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                {item.role}
              </div>
            </div>
            <div className="shrink-0 pt-1 font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">
              {item.period}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
