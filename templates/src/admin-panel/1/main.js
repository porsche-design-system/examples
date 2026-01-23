import './style.css';

for (const canvas of document.querySelectorAll('p-canvas')) {
  canvas.addEventListener('sidebarStartUpdate', (e) => {
    e.target.sidebarStartOpen = e.detail.open;
  });
  canvas.addEventListener('sidebarEndDismiss', (e) => {
    e.target.sidebarEndOpen = false;
  });
}

for (const accordion of document.querySelectorAll('p-accordion')) {
  accordion.addEventListener('update', (e) => {
    e.target.open = e.detail.open;
  });
}

for (const tabsBar of document.querySelectorAll('p-tabs-bar')) {
  tabsBar.addEventListener('update', (e) => {
    e.target.activeTabIndex = e.detail.activeTabIndex;
  });
}

for (const modal of document.querySelectorAll('p-modal')) {
  modal.addEventListener('dismiss', (e) => {
    e.target.open = false;
  });
}

// initially, p-canvas sidebar-start should be closed on mobile and opened on desktop
if (window.matchMedia('(min-width: 760px)').matches) {
  document.querySelector('p-canvas').sidebarStartOpen = true;
}
