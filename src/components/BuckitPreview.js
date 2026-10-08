import ProductVideo from './ProductVideo';
export default function BuckitPreview({ hero = false }) {
  return <ProductVideo hero={hero} className={`buckit-card-preview${hero ? ' buckit-demo-player' : ''}`} src="/buckit/buckit-preview.mp4" poster="/buckit/buckit-preview.jpg" label="Buckit: drag a resume from a Job Search Space into an application" />;
}
