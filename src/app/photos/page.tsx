import type { Metadata } from 'next';
import Link from 'next/link';

import PhotoGallery from '../../components/PhotoGallery';
import SiteFooter from '../../components/SiteFooter';
import SiteNav from '../../components/SiteNav';
import { photos, profile } from '../../data/resume';

export const metadata: Metadata = {
  title: 'Photos · Jeremy Sedillo',
  description: 'Photo gallery',
};

export default function PhotosPage() {
  return (
    <main className="container-page">
      <SiteNav />

      <header className="mt-16 md:mt-24">
        <h1 className="text-4xl md:text-5xl leading-tight">Photos</h1>
        <p className="eyebrow mt-3">Photography · {photos.length} photos</p>
      </header>

      <p className="mt-10 text-[19px] leading-8 text-neutral-700">
        Things I&apos;ve pointed my camera at. You can find them on my instagram @jermpegs (dm for inquiry) or on the{' '}
        <Link href="/#photo-map" className="body-link">
          map
        </Link>
        .
      </p>

      <div className="mt-14">
        <PhotoGallery items={photos} />
      </div>

      <SiteFooter socials={profile.socials} email={profile.email} />
    </main>
  );
}
