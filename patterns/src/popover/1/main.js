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

navButton.addEventListener('click', () => {
  navDrilldown.open = true;
});

navDrilldown.addEventListener('dismiss', (e) => {
  e.target.open = false;
});

navDrilldown.addEventListener('update', (e) => {
  e.target.activeIdentifier = e.detail.activeIdentifier;
});

// The local market popover is shown on load, profile starts closed.
// Opening one always closes the other.
marketPopover.open = true;
profilePopover.open = false;
profileSheet.open = false;

marketButton.addEventListener('click', () => {
  marketPopover.open = !marketPopover.open;
  profilePopover.open = false;
  profileSheet.open = false;
});

marketDismiss.addEventListener('click', () => {
  marketPopover.open = false;
});

marketPopover.addEventListener('dismiss', () => {
  marketPopover.open = false;
});

profileButton.addEventListener('click', () => {
  marketPopover.open = false;
  if (desktopQuery.matches) {
    profilePopover.open = !profilePopover.open;
    profileSheet.open = false;
  } else {
    profileSheet.open = !profileSheet.open;
    profilePopover.open = false;
  }
});

profilePopover.addEventListener('dismiss', () => {
  profilePopover.open = false;
});

profileSheet.addEventListener('dismiss', () => {
  profileSheet.open = false;
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
});

if (pauseButton && video instanceof HTMLVideoElement) {
  pauseButton.addEventListener('click', () => {
    const isPaused = video.paused;
    video[isPaused ? 'play' : 'pause']();
    pauseButton.textContent = isPaused ? 'Pause Video' : 'Play Video';
    pauseButton.icon = isPaused ? 'pause' : 'play';
  });
}
