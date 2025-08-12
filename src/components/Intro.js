import React from 'react';

export default function Intro({ summary, email }) {
  return (
    <section className="mb-12 text-ink-700 leading-relaxed">
      <p className="mb-4 text-lg">{summary}</p>
      <p>
        See more on my{' '}
        <a className="link-solid" href="https://docs.google.com/document/d/1ueA_AW2jxeR8oP_DnJGNbExW9v3LZfEy9fqgQypD1Yc/edit?usp=sharing">
          resume
        </a>{' '}
        or contact me at{' '}
        <a className="link-solid" href={`mailto:${email}`}>
          {email}
        </a>
        .
      </p>
    </section>
  );
}


