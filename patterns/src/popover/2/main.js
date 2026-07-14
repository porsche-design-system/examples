import './style.css';
import { componentsReady } from '@porsche-design-system/components-js';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const navList = document.getElementById('nav-primary');
const navListItems = Array.from(navList.querySelectorAll('&>li:not(#nav-more-item)'));
const navListItemMore = document.getElementById('nav-more-item');
const navListMore = document.getElementById('more-list');

const fits = () => navList.scrollWidth <= navList.clientWidth;

const recalc = () => {
  // 1. Reset: every item back into the bar (before the "More" trigger), overflow hidden.
  navListItemMore.hidden = true;
  for (const listItem of navListItems) {
    navList.insertBefore(listItem, navListItemMore);
  }

  // 2. Everything fits on one line → nothing to collapse.
  if (fits()) {
    return;
  }

  // 3. Reveal the "More" trigger, then push items from the end into the popover until the bar fits again.
  navListItemMore.hidden = false;
  for (let i = navListItems.length - 1; i >= 0; i--) {
    navListMore.insertBefore(navListItems[i], navListMore.firstChild);

    if (fits()) {
      break;
    }
  }
};

componentsReady(navList).then(recalc);

// Recompute whenever the available width changes.
new ResizeObserver(recalc).observe(navList);
