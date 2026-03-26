import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const selectRegion = document.querySelector('p-select[name="region"]');
const selectRegionSelectedSlot = selectRegion?.querySelector('[slot="selected"]');

const regionMap = {
  cn: 'China',
  jp: 'Japan',
  kr: 'South Korea',
  at: 'Austria',
  fr: 'France',
  de: 'Germany',
  gb: 'Great Britain',
  it: 'Italy',
  pt: 'Portugal',
  es: 'Spain',
  ca: 'Canada',
  us: 'USA',
};

const updateSelectedRegionDisplay = (regionCode) => {
  if (!selectRegionSelectedSlot || typeof regionCode !== 'string') {
    return;
  }

  const regionLabel = regionMap[regionCode];

  if (regionLabel) {
    const flag = document.createElement('p-flag');
    flag.setAttribute('name', regionCode);
    selectRegionSelectedSlot.replaceChildren(flag, document.createTextNode(regionLabel));
    return;
  }

  selectRegionSelectedSlot.replaceChildren(document.createTextNode('Unknown region'));
};

if (selectRegion && selectRegionSelectedSlot) {
  selectRegion.addEventListener('change', (e) => {
    updateSelectedRegionDisplay(e.detail?.value);
  });
}
