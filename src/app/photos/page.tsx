import type { Metadata } from 'next';

import PhotoSpace from '../../components/PhotoSpace';
import { getPhotos } from '../../lib/photos';

export const metadata: Metadata = {
  title: 'Photos',
  description: 'Places I have pointed a camera at.',
};

export default function PhotosPage() {
  const photos = getPhotos();
  return (
    <>
      <header className="page-header photo-page-header">
        <h1>Photos</h1>
        <p className="eyebrow mt-3">Photography · {photos.length} photos</p>
      </header>

      <p className="lede photo-page-intro">Somewhere between here and there. Photographs by me, with more on <a className="body-link" href="https://www.instagram.com/jermpegs/">@jermpegs</a>.</p>
      <PhotoSpace items={photos} />
    </>
  );
}
