import fs from 'node:fs';
import path from 'node:path';
import { photos, type Photo } from '../data/resume';
export function getPhotos(): Photo[] {
  const file=path.join(process.cwd(),'content/photos.json');
  const additions: Photo[]=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):[];
  return [...additions,...photos];
}
