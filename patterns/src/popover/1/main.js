import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const navDrilldown = document.getElementById('nav-drilldown');
const navButton = document.getElementById('nav-button');
const marketPopover = document.getElementById('market-popover');
const marketButton = document.getElementById('market-button');
const marketDismiss = document.getElementById('market-dismiss');
const profilePopover = document.getElementById('profile-popover');
const profileSheet = document.getElementById('profile-sheet');
const profileButton = document.getElementById('profile-button');
const video = document.querySelector('video');
const pauseButton = document.getElementById('pause-button');

// Responsive: use popover on desktop (≥ 480px), sheet on mobile (< 480px)
const desktopQuery = window.matchMedia('(min-width: 480px)');

// Keep a trigger button's `aria-expanded` in sync with the open state of the disclosure it controls.
const setExpanded = (button, isExpanded) => {
  button.aria = { 'aria-haspopup': 'dialog', 'aria-expanded': isExpanded };
};

navButton.addEventListener('click', () => {
  navDrilldown.open = true;
  setExpanded(navButton, true);
});

navDrilldown.addEventListener('dismiss', (e) => {
  e.target.open = false;
  setExpanded(navButton, false);
});

navDrilldown.addEventListener('update', (e) => {
  e.target.activeIdentifier = e.detail.activeIdentifier;
});

// The local market popover is shown on load, profile starts closed.
// Opening one always closes the other.
marketPopover.open = true;
profilePopover.open = false;
profileSheet.open = false;
setExpanded(marketButton, true);
setExpanded(profileButton, false);

marketButton.addEventListener('click', () => {
  marketPopover.open = !marketPopover.open;
  profilePopover.open = false;
  profileSheet.open = false;
  setExpanded(marketButton, marketPopover.open);
  setExpanded(profileButton, false);
});

marketDismiss.addEventListener('click', (e) => {
  marketPopover.open = false;
  setExpanded(marketButton, false);
  // Return focus to the trigger only for keyboard activation (Enter/Space), where `detail` is 0. Mouse clicks report
  // `detail >= 1`, so pointer users aren't forced back onto the trigger.
  if (e.detail === 0) {
    marketButton.focus();
  }
});

marketPopover.addEventListener('dismiss', () => {
  marketPopover.open = false;
  setExpanded(marketButton, false);
});

profileButton.addEventListener('click', () => {
  marketPopover.open = false;
  setExpanded(marketButton, false);
  if (desktopQuery.matches) {
    profilePopover.open = !profilePopover.open;
    profileSheet.open = false;
  } else {
    profileSheet.open = !profileSheet.open;
    profilePopover.open = false;
  }
  setExpanded(profileButton, profilePopover.open || profileSheet.open);
});

profilePopover.addEventListener('dismiss', () => {
  profilePopover.open = false;
  setExpanded(profileButton, false);
});

profileSheet.addEventListener('dismiss', () => {
  profileSheet.open = false;
  setExpanded(profileButton, false);
});

// Transfer open state between popover and sheet when crossing the breakpoint
desktopQuery.addEventListener('change', (e) => {
  if (e.matches) {
    // Crossed to desktop: if sheet was open, close it and open popover
    if (profileSheet.open) {
      profileSheet.open = false;
      profilePopover.open = true;
    }
  } else {
    // Crossed to mobile: if popover was open, close it and open sheet
    if (profilePopover.open) {
      profilePopover.open = false;
      profileSheet.open = true;
    }
  }
  setExpanded(profileButton, profilePopover.open || profileSheet.open);
});

if (pauseButton && video instanceof HTMLVideoElement) {
  pauseButton.addEventListener('click', () => {
    const isPaused = video.paused;
    video[isPaused ? 'play' : 'pause']();
    pauseButton.textContent = isPaused ? 'Pause Video' : 'Play Video';
    pauseButton.icon = isPaused ? 'pause' : 'play';
  });
}
