import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getMetaTagsAndIconLinks,
} from '@porsche-design-system/components-angular/partials';

const headPartials = [
  // preloads Porsche Next font (=> minimize FOUT)
  getFontLinks(),
  // preloads PDS component core chunk from CDN for PDS component hydration (=> improve loading performance)
  getComponentChunkLinks(),
  // preloads Porsche icons (=> minimize FOUC)
  getIconLinks(),
  // injects favicon, apple touch icons, android touch icons, etc.
  getMetaTagsAndIconLinks({ appTitle: 'Porsche' }),
].join('\n');

const html = readFileSync('src/index.html', 'utf-8');
const transformed = html.replace(/<\/head>/, `${headPartials}\n$&`);

mkdirSync('.generated', { recursive: true });
writeFileSync('.generated/index.html', transformed);

console.log('Generated .generated/index.html with PDS partials.');

