import React from 'react';

import Logo from './Logo';

export default function InvolvementList({ items }) {
  if (!items?.length) return null;

  return (
    <section aria-labelledby="involvement-heading">
      <h2 id="involvement-heading" className="eyebrow">
        Involvement
      </h2>
      <div className="mt-6 space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="entry-row">
            <Logo src={item.logo} alt={item.name} fallback={(item.name || '?').slice(0, 1)} />
            <div className="min-w-0 flex-1">
              <div className="entry-name">{item.name}</div>
              <div className="meta mt-1">{item.role}</div>
            </div>
            <div className="meta shrink-0 pt-1">{item.period}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
