import { permanentRedirect } from 'next/navigation';

export default function PhotosPage() {
  permanentRedirect('/media');
}
