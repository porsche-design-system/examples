import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

// The desktop popover manages itself (uncontrolled). Below the `sm` breakpoint the popover trigger is hidden via CSS
// and the mobile trigger is shown instead, which opens the bottom sheet.
const sheet = document.getElementById('profile-sheet');
const sheetTrigger = document.getElementById('sheet-trigger');

sheetTrigger.addEventListener('click', () => {
  sheet.open = true;
});

sheet.addEventListener('dismiss', () => {
  sheet.open = false;
});
