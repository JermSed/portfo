export default function SiteFooter({ socials, email }) {
  const links = [
    socials?.twitter && socials.twitter !== '#' && { label: 'X', href: socials.twitter },
    socials?.github && { label: 'GitHub', href: socials.github },
    socials?.linkedin && { label: 'LinkedIn', href: socials.linkedin },
    email && { label: 'Email', href: `mailto:${email}` },
  ].filter(Boolean);

  return (
    <footer className="flex items-center justify-between pt-16 font-sans text-sm text-neutral-700">
      <div className="flex items-center gap-2">
        {links.map((link, idx) => (
          <span key={link.label} className="flex items-center gap-2">
            {idx > 0 && <span className="text-neutral-300">·</span>}
            <a href={link.href} className="no-underline hover:underline underline-offset-4">
              {link.label}
            </a>
          </span>
        ))}
      </div>
      <span className="text-neutral-500">Fight on ✌️</span>
    </footer>
  );
}
