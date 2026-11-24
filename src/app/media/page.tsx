import type { Metadata } from 'next';

import PhotoGallery from '../../components/PhotoGallery';
import { getPhotos } from '../../lib/photos';

export const metadata: Metadata = {
  title: 'Media',
  description: 'Photography and color-graded videos by Jeremy Sedillo.',
};

export default function MediaPage() {
  const photos = getPhotos();
  return (
    <div className="photo-gallery-page">
      <header className="gallery-header">
        <div>
          <h1>Media</h1>
          <p>Photography and color-graded video</p>
        </div>
        <a className="body-link" href="https://www.instagram.com/jermpegs/">Instagram ↗</a>
      </header>
      <PhotoGallery items={photos} />
    </div>
  );
}
