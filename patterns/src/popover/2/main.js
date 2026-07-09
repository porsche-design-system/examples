import './style.css';
import { componentsReady } from '@porsche-design-system/components-js';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const primary = document.getElementById('nav-primary');
const overflow = document.getElementById('nav-overflow');
const moreItem = document.getElementById('nav-more-item');

// Captured once, in their original order, so we can freely move them between the bar and the overflow popover.
const items = Array.from(primary.querySelectorAll('[data-nav-item]'));

const fits = () => primary.scrollWidth <= primary.clientWidth;

// Items with a submenu render as a dropdown popover in the bar, but as an inline indented group once inside the
// "More" popover — a popover nested inside a popover does not behave well, so we swap representations instead.
const setMode = (item, inOverflow) => {
  const bar = item.querySelector('[data-bar]');
  const overflowView = item.querySelector('[data-overflow]');
  if (!bar || !overflowView) {
    return; // plain item without a submenu
  }
  bar.hidden = inOverflow;
  overflowView.hidden = !inOverflow;
};

const recalc = () => {
  // 1. Reset: every item back into the bar (before the "More" trigger), overflow hidden.
  for (const item of items) {
    primary.insertBefore(item, moreItem);
    setMode(item, false);
  }
  moreItem.hidden = true;

  // 2. Everything fits on one line → nothing to collapse.
  if (fits()) {
    return;
  }

  // 3. Reveal the "More" trigger, then push items from the end into the popover until the bar fits again.
  moreItem.hidden = false;
  for (let i = items.length - 1; i >= 0; i--) {
    if (fits()) {
      break;
    }
    overflow.insertBefore(items[i], overflow.firstChild);
    setMode(items[i], true);
  }
};

componentsReady().then(recalc);

// Recompute whenever the available width changes.
new ResizeObserver(recalc).observe(primary);
