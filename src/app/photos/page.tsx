import type { Metadata } from 'next';
import Link from 'next/link';

import PhotoMap from '../../components/PhotoMap';
import PhotoGallery from '../../components/PhotoGallery';
import { getPhotos } from '../../lib/photos';

export const metadata: Metadata = {
  title: 'Photos',
  description: 'Places I have pointed a camera at.',
};

export default function PhotosPage() {
  const photos = getPhotos();
  return (
    <>
      <header className="page-header">
        <h1>Photos</h1>
        <p className="eyebrow mt-3">Photography · {photos.length} photos</p>
      </header>

      <p className="lede mt-10">
        A few moments worth keeping. Find more on <a className="body-link" href="https://www.instagram.com/jermpegs/">@jermpegs</a>, or explore the{' '}
        <Link href="#photo-map" className="body-link">
          map
        </Link>
        .
      </p>

      <div id="photo-map" className="mt-14"><PhotoMap items={photos} /></div>
      <div className="mt-14">
        <PhotoGallery items={photos} />
      </div>
    </>
  );
}
