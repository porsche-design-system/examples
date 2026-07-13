import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const steps = Array.from(document.querySelectorAll('[data-tour-step]'));
const restartButton = document.getElementById('restart-tour');

let current = 0;

// Controlled mode: we own every step's open state, so exactly one coachmark is visible at a time. An index outside
// the range (e.g. -1) closes them all and ends the tour.
const showStep = (index) => {
  current = index;
  steps.forEach((step, i) => {
    step.open = i === index;
  });
};

const endTour = () => showStep(-1);

// Delegated controls inside the coachmarks (retargeted to the p-button/p-button-pure host at the shadow boundary).
document.addEventListener('click', (e) => {
  const control = e.target.closest?.('[data-tour]');
  if (!control) {
    return;
  }
  const action = control.getAttribute('data-tour');
  if (action === 'next') {
    showStep(current + 1 < steps.length ? current + 1 : -1);
  } else if (action === 'back') {
    showStep(Math.max(0, current - 1));
  } else if (action === 'skip') {
    endTour();
  }
});

// Escape / outside click on the current step ends the tour.
for (const step of steps) {
  step.addEventListener('dismiss', endTour);
}

restartButton.addEventListener('click', () => showStep(0));
