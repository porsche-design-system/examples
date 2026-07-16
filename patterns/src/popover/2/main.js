import './style.css';
import { componentsReady } from '@porsche-design-system/components-js';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const navBar = document.getElementById('nav-bar');
const moreTrigger = document.getElementById('more-trigger');
const morePopover = document.getElementById('more-popover');
const moreButton = document.getElementById('more-button');
const overflowList = document.getElementById('overflow-list');

const fits = () => navBar.scrollWidth <= navBar.clientWidth;

// Keep the trigger button's `aria-expanded` in sync with the open state of the popover it controls.
const setExpanded = (isExpanded) => {
  moreButton.aria = { 'aria-expanded': isExpanded };
};

// Controlled mode: we own the popover's open state so we always know whether it is expanded. Setting `open` (even to
// `false` on load) opts the popover into controlled mode, where visibility follows the prop and we drive it via the
// slotted button. This lets us mirror the state onto `aria-expanded` for assistive technology.
morePopover.open = false;
setExpanded(false);

moreButton.addEventListener('click', () => {
  morePopover.open = !morePopover.open;
  setExpanded(morePopover.open);
});

// Escape, outside click or focus leaving the popover requests a close in controlled mode.
morePopover.addEventListener('dismiss', () => {
  morePopover.open = false;
  setExpanded(false);
});

// The trigger needs to be visible to reserve its own space while we measure overflow. It is only hidden again once
// the overflow list ends up empty. A hidden trigger can't be expanded, so close the popover and reset its ARIA state.
const syncTrigger = () => {
  moreTrigger.hidden = overflowList.children.length === 0;
  if (moreTrigger.hidden && morePopover.open) {
    morePopover.open = false;
    setExpanded(false);
  }
};

// Incremental & idempotent: instead of emptying the overflow list on every resize (which makes an open popover
// flicker), we only move the minimum number of items needed for the current width. When the boundary doesn't change,
// no DOM mutation happens at all — so an open popover stays perfectly still.
const recalc = () => {
  // Reveal the trigger so its width is accounted for while measuring.
  moreTrigger.hidden = false;

  // Too wide → push items from the end of the bar into the overflow list until it fits again.
  while (!fits()) {
    const lastVisible = moreTrigger.previousElementSibling;
    if (!lastVisible) {
      break; // Nothing left to collapse.
    }
    overflowList.insertBefore(lastVisible, overflowList.firstChild);
  }

  // Spare room → try pulling items back out of the overflow list, one at a time. If the pulled item no longer fits,
  // put it straight back and stop (prevents oscillation/flicker at the boundary).
  while (overflowList.firstElementChild) {
    navBar.insertBefore(overflowList.firstElementChild, moreTrigger);
    if (!fits()) {
      overflowList.insertBefore(moreTrigger.previousElementSibling, overflowList.firstChild);
      break;
    }
  }

  syncTrigger();
};

componentsReady(navBar).then(recalc);

// Coalesce bursts of resize events into a single measurement per animation frame.
//
// A ResizeObserver can fire many times in quick succession (e.g. while the user drags the browser edge, dozens of
// callbacks per second). Running the (layout-reading) `recalc` on every single one is wasteful and can cause visible
// jitter. Instead, we debounce to at most one run per frame:
//   - `pendingFrame` holds the id of a pending requestAnimationFrame, or `null` when none is scheduled.
//   - The first event schedules a frame; any further events that arrive before it runs are ignored (early return),
//     because a recalc is already queued and will read the *latest* layout when it executes.
//   - Inside the frame we reset `pendingFrame` to `null` first, so the *next* burst of events can schedule a fresh run.
// This aligns the work with the browser's paint cycle, avoiding layout thrashing and keeping resizing smooth.
//
// Skipping events is safe (no stale/wrong results): the observer is only a "something changed" signal — it never
// feeds a size into `recalc`. Instead, `recalc` re-measures the live layout (`fits()` reads scrollWidth/clientWidth)
// whenever it runs, so the single queued run always reflects the final width. This works precisely because `recalc`
// is idempotent; do NOT capture a width here and pass it in, as that would drop data on the skipped events.
let pendingFrame = null;
const scheduleRecalc = () => {
  if (pendingFrame !== null) {
    return; // A recalc is already queued for the next frame — nothing more to do.
  }
  pendingFrame = requestAnimationFrame(() => {
    pendingFrame = null;
    recalc();
  });
};

// Recompute whenever the available width changes.
new ResizeObserver(scheduleRecalc).observe(navBar);
