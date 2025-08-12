import React from 'react';

export default function WritingList({ items }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12" id="writing">
      <h2 className="section-title">Writing</h2>
      <ul className="divide-y divide-slate-200/70">
        {items.map((post, idx) => (
          <li key={idx} className="py-3">
            <a href={post.url} className="block hover:underline">
              <div className="font-medium text-ink-900">{post.title}</div>
              {post.subtitle && (
                <div className="text-ink-500 text-sm">{post.subtitle}</div>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}


