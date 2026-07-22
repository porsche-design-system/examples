import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const steps = Array.from(document.querySelectorAll('[data-tour-step]'));
const restartButton = document.getElementById('restart-tour');

let current = 0;

// A step's coachmark (the p-button/p-button-pure inside the flyout) is only rendered once its popover is open, so we
// wait two frames before moving focus into it — one for the open state to apply, one for the flyout to be laid out.
const focusAfterRender = (element) => {
  if (!element) {
    return;
  }
  requestAnimationFrame(() => requestAnimationFrame(() => element.focus()));
};

// The p-button/p-button-pure that toggles a step (lives in the button slot).
const getTrigger = (step) => step?.querySelector('[slot="button"]');
// The primary "Next"/"Done" action of a step — the natural place to land so the tour can continue via keyboard.
const getPrimaryAction = (step) => step?.querySelector('[data-tour="next"]');

// Heuristic to tell keyboard from pointer activation: pressing Enter/Space on a button synthesizes a click with
// detail 0, while mouse/touch clicks report detail >= 1. We only pull focus into the tour for keyboard users so
// mouse users aren't yanked into the coachmark.
const isKeyboardActivation = (event) => event.detail === 0;

// Controlled mode: we own every step's open state, so exactly one coachmark is visible at a time. An index outside
// the range (e.g. -1) closes them all and ends the tour.
const showStep = (index, moveFocus = false) => {
  current = index;
  for (const [i, step] of steps.entries()) {
    step.open = i === index;
  }
  // Move keyboard focus into the freshly opened step. Without this, closing the current popover removes the button
  // that was clicked, focus falls back to <body>, and the next Tab restarts tab order at the top of the page.
  if (moveFocus) {
    focusAfterRender(getPrimaryAction(steps[index]));
  }
};

// Ending the tour returns focus to the control the last step pointed at, keeping the user oriented in the header
// instead of dropping focus to <body>.
const endTour = (moveFocus = false) => {
  const lastTrigger = getTrigger(steps[current]);
  showStep(-1);
  if (moveFocus) {
    lastTrigger?.focus();
  }
};

// Delegated controls inside the coachmarks (retargeted to the p-button/p-button-pure host at the shadow boundary).
document.addEventListener('click', (e) => {
  const control = e.target.closest?.('[data-tour]');
  if (!control) {
    return;
  }
  const viaKeyboard = isKeyboardActivation(e);
  const action = control.getAttribute('data-tour');
  if (action === 'next') {
    if (current + 1 < steps.length) {
      showStep(current + 1, viaKeyboard);
    } else {
      endTour(viaKeyboard);
    }
  } else if (action === 'back') {
    showStep(Math.max(0, current - 1), viaKeyboard);
  } else if (action === 'skip') {
    endTour(viaKeyboard);
  }
});

// Escape / outside click on the current step ends the tour. p-popover already restores focus to its trigger on
// keyboard dismissal, so we don't force focus here.
for (const step of steps) {
  step.addEventListener('dismiss', () => endTour());
}

restartButton.addEventListener('click', (e) => showStep(0, isKeyboardActivation(e)));
