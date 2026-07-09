import './style.css';

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const navDrilldown = document.getElementById('nav-drilldown');
const navButton = document.getElementById('nav-button');
const marketPopover = document.getElementById('market-popover');
const marketButton = document.getElementById('market-button');
const marketClose = document.getElementById('market-close');
const profilePopover = document.getElementById('profile-popover');
const profileButton = document.getElementById('profile-button');
const video = document.querySelector('video');
const pauseButton = document.getElementById('pause-button');

navButton.addEventListener('click', () => {
  navDrilldown.open = true;
});

navDrilldown.addEventListener('dismiss', (e) => {
  e.target.open = false;
});

navDrilldown.addEventListener('update', (e) => {
  e.target.activeIdentifier = e.detail.activeIdentifier;
});

// Both popovers run in controlled mode so we own their open state. The local market popover is shown on load, the
// profile popover starts closed. Opening one always closes the other, so only a single popover is ever open.
marketPopover.open = true;
profilePopover.open = false;

marketButton.addEventListener('click', () => {
  marketPopover.open = !marketPopover.open;
  profilePopover.open = false;
});

profileButton.addEventListener('click', () => {
  profilePopover.open = !profilePopover.open;
  marketPopover.open = false;
});

marketPopover.addEventListener('dismiss', (e) => {
  e.target.open = false;
});

profilePopover.addEventListener('dismiss', (e) => {
  e.target.open = false;
});

marketClose.addEventListener('click', () => {
  marketPopover.open = false;
});

for (const button of marketPopover.querySelectorAll('p-button')) {
  button.addEventListener('click', () => {
    marketPopover.open = false;
  });
}

for (const button of profilePopover.querySelectorAll('p-button')) {
  button.addEventListener('click', () => {
    profilePopover.open = false;
  });
}

if (pauseButton && video instanceof HTMLVideoElement) {
  pauseButton.addEventListener('click', () => {
    const isPaused = video.paused;
    video[isPaused ? 'play' : 'pause']();
    pauseButton.textContent = isPaused ? 'Pause Video' : 'Play Video';
    pauseButton.icon = isPaused ? 'pause' : 'play';
  });
}
