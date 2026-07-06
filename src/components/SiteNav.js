import Link from 'next/link';

export default function SiteNav() {
  return (
    <nav className="flex justify-end gap-6 font-sans text-sm text-neutral-700">
      <Link href="/" className="no-underline hover:underline underline-offset-4">
        Home
      </Link>
      <Link href="/photos" className="no-underline hover:underline underline-offset-4">
        Photos
      </Link>
    </nav>
  );
}
