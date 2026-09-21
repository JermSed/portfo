export default function SiteFooter({ socials, email }) {
  const links = [
    socials?.twitter && socials.twitter !== '#' && { label: 'X', href: socials.twitter },
    socials?.github && { label: 'GitHub', href: socials.github },
    socials?.linkedin && { label: 'LinkedIn', href: socials.linkedin },
    email && { label: 'Email', href: `mailto:${email}` },
  ].filter(Boolean);

  return (
    <footer className="mt-16 flex items-center justify-between gap-4 font-sans text-[length:var(--text-small)] text-[color:var(--text-secondary)]">
      <ul className="flex flex-wrap items-center gap-2 p-0">
        {links.map((link, idx) => (
          <li key={link.label} className="flex items-center gap-2">
            {idx > 0 && (
              <span aria-hidden="true" className="text-[color:var(--text-quaternary)]">
                ·
              </span>
            )}
            <a href={link.href} className="body-link no-underline hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <span className="text-[color:var(--text-tertiary)]">Fight on ✌️</span>
    </footer>
  );
}
