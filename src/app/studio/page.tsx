import { notFound } from 'next/navigation';
import { getPhotos } from '../../lib/photos';
import ContentEditor from '../../components/studio/ContentEditor';
import { studioAuthorized } from '../../lib/studio-auth';
export const dynamic = 'force-dynamic';
export const metadata = { title:'Private studio', robots:{index:false,follow:false} };
export default async function StudioPage() {
  if (!await studioAuthorized()) notFound();
  const places = [...new Map(getPhotos().map(p=>[p.location,{location:p.location,coordinates:p.coordinates}])).values()];
  return <><header className="page-header"><p className="eyebrow">Only on this computer</p><h1>Your studio.</h1><p className="lede mt-6">Write something down. Add somewhere you’ve been.</p><p className="studio-hint">Saves update your local preview. Your live site changes only after you commit and deploy.</p></header><ContentEditor places={places} /></>;
}
