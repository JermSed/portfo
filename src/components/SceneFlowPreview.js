import ProductVideo from './ProductVideo';
export default function SceneFlowPreview({ hero = false }) {
  return <ProductVideo hero={hero} className={`sceneflow-preview${hero ? ' sceneflow-demo-player' : ''}`} src="/sceneflow/sceneflow-demo.mp4?v=3" poster="/sceneflow/sceneflow-poster.jpg?v=3" label="SceneFlow: footage and storyboard to an editable DaVinci Resolve timeline" />;
}
