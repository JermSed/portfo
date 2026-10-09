import ProductVideo from './ProductVideo';
import BuckitPreview from './BuckitPreview';
import SceneFlowPreview from './SceneFlowPreview';

const labels = {
  'fccw-crm': 'FCCW: finance overview to Shopify sales records',
  'climate-cents': 'Climate Cents: search local projects and navigate the map',
  delphi: 'Delphi: a spoken request becomes a browser action and a spoken answer',
  raiseachild: 'RaiseAChild: filter a report by preferred language',
  tally: 'Tally: review products, variants, and linked materials',
};
export default function ProjectDemo({ slug, hero = false }) {
  if (slug === 'buckit') return <BuckitPreview hero={hero} />;
  if (slug === 'sceneflow') return <SceneFlowPreview hero={hero} />;
  return <ProductVideo hero={hero} className="project-demo" src={`/demos/${slug}.mp4?v=real-app-1`} poster={`/demos/${slug}.jpg?v=real-app-1`} label={labels[slug]} />;
}
