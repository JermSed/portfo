import React from 'react';

export default function ThoughtsList({ items }) {
  if (!items?.length) return null;

  return (
    <section className="space-y-6">
      <p className="eyebrow">Thoughts</p>
      <div className="space-y-7">
        {items.map((thought, idx) => (
          <div key={idx}>
            <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">
              {thought.date}
            </div>
            <p className="mt-1.5 text-[17px] leading-relaxed text-neutral-700">{thought.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
