import {
  getComponentChunkLinks,
  getFontFaceStyles,
  getFontLinks,
  getIconLinks,
  getInitialStyles,
  getMetaTagsAndIconLinks,
} from '@porsche-design-system/components-angular/partials';

// https://github.com/just-jeb/angular-builders/blob/fdd7c8ed00b7eb7e1761aaa6cb5bda41693ceb5d/packages/custom-webpack/README.md#index-transform
export default (_, html) => {
  const headPartials = [
    // injects stylesheet which defines visibility of pre-hydrated PDS components
    getInitialStyles(),
    // injects stylesheet which defines Porsche Next CSS font-face definition (=> minimize FOUT)
    getFontFaceStyles(),
    // preloads Porsche Next font (=> minimize FOUT)
    getFontLinks(),
    // preloads PDS component core chunk from CDN for PDS component hydration (=> improve loading performance)
    getComponentChunkLinks(),
    // preloads Porsche icons (=> minimize FOUC)
    getIconLinks(),
    // injects favicon, apple touch icons, android touch icons, etc.
    getMetaTagsAndIconLinks({ appTitle: 'Porsche' }),
  ].join('');

  return html.replace(/<\/head>/, `${headPartials}$&`);
};
