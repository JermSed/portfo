import ProductVideo from './ProductVideo';
import BuckitPreview from './BuckitPreview';
import SceneFlowPreview from './SceneFlowPreview';

const labels = {
  'fccw-crm': 'FCCW: finance overview to Shopify sales records',
  'climate-cents': 'Climate Cents: filter local projects and explore environmental map layers',
  delphi: 'Delphi: a spoken request becomes a browser action and a spoken answer',
  raiseachild: 'RaiseAChild: filter constituents, save the selection, and view a report',
  tally: 'Tally: review product variants and update an inventory buffer',
};
export default function ProjectDemo({ slug, hero = false }) {
  if (slug === 'buckit') return <BuckitPreview hero={hero} />;
  if (slug === 'sceneflow') return <SceneFlowPreview hero={hero} />;
  return <ProductVideo hero={hero} className="project-demo" src={`/demos/${slug}.mp4`} poster={`/demos/${slug}.jpg`} label={labels[slug]} />;
}
