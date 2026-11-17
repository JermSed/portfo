import type { Metadata } from 'next';

import PhotoGallery from '../../components/PhotoGallery';
import { getPhotos } from '../../lib/photos';

export const metadata: Metadata = {
  title: 'Photos',
  description: 'Photography by Jeremy Sedillo.',
};

export default function PhotosPage() {
  const photos = getPhotos();
  return (
    <div className="photo-gallery-page">
      <header className="gallery-header">
        <div>
          <h1>Photos</h1>
          <p>{photos.length} photographs</p>
        </div>
        <a className="body-link" href="https://www.instagram.com/jermpegs/">Instagram ↗</a>
      </header>
      <PhotoGallery items={photos} />
    </div>
  );
}
