// Styles are loaded as a render-blocking <link> in index.html (prevents FOUC), not imported here.

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const stage = document.getElementById('pm-stage');
const backdrop = document.getElementById('pm-backdrop');
const environmentControl = document.getElementById('pm-environment-control');
const lightingControl = document.getElementById('pm-lighting-control');

const environments = {
  studio: '/assets/pm-env-studio.svg',
  garage: '/assets/pm-env-garage.svg',
  courtyard: '/assets/pm-env-courtyard.svg',
};

if (backdrop && environmentControl && stage) {
  environmentControl.addEventListener('click', (e) => {
    const btn = e.target.closest('.pm-env-btn');
    if (!btn) return;

    for (const b of environmentControl.querySelectorAll('.pm-env-btn')) {
      b.setAttribute('aria-pressed', 'false');
    }
    btn.setAttribute('aria-pressed', 'true');

    const env = btn.dataset.value;
    const src = environments[env];
    if (src) {
      backdrop.src = src;
      stage.dataset.environment = env;
    }
  });
}

if (stage && lightingControl) {
  lightingControl.addEventListener('update', (e) => {
    // p-tabs-bar is controlled — reflect the active tab back onto the component.
    lightingControl.activeTabIndex = e.detail.activeTabIndex;
    stage.dataset.lighting = e.detail.activeTabIndex === 1 ? 'night' : 'day';
  });
}

// Reveal elements as they scroll into view — plays once (commissions "animate in view" pattern).
const revealObserver = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('animation-play');
      observer.unobserve(entry.target);
    }
  }
});

for (const el of document.querySelectorAll('[data-animation]')) {
  revealObserver.observe(el);
}

// Telescope zoom — drive the pinned section's `--progress` (0→1) from its scroll position.
// Dependency-free (no GSAP): the scroll position sets a *target*, and a rAF loop eases the
// current value toward it (lerp) so the effect glides to a stop instead of snapping when
// scrolling stops. Disabled when the user prefers reduced motion.
const telescope = document.querySelector('[data-telescope]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (telescope && !prefersReducedMotion) {
  // Quadratic in/out — approximates GSAP's "power1.inOut" scrub feel.
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
  // Lerp factor per frame — lower = more inertia/glide, higher = snappier.
  const SMOOTHING = 0.09;

  let target = 0;
  let current = 0;
  let rafId = null;

  const computeTarget = () => {
    const total = telescope.offsetHeight - window.innerHeight;
    const scrolled = total <= 0 ? 0 : Math.min(Math.max(-telescope.getBoundingClientRect().top, 0), total);
    target = total <= 0 ? 0 : easeInOut(scrolled / total);
  };

  const render = () => {
    current += (target - current) * SMOOTHING;
    if (Math.abs(target - current) < 0.0005) {
      current = target;
      rafId = null;
    } else {
      rafId = requestAnimationFrame(render);
    }
    telescope.style.setProperty('--progress', current.toFixed(4));
  };

  const onScroll = () => {
    computeTarget();
    if (rafId === null) {
      rafId = requestAnimationFrame(render);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Prime the initial value without animating from 0.
  computeTarget();
  current = target;
  telescope.style.setProperty('--progress', current.toFixed(4));
}

// Footer region select — reflect the chosen country (flag + label) into the selected slot.
const selectRegion = document.querySelector('p-select[name="region"]');
const selectRegionSelectedSlot = selectRegion?.querySelector('[slot="selected"]');

const regionMap = {
  cn: 'China',
  jp: 'Japan',
  kr: 'South Korea',
  at: 'Austria',
  fr: 'France',
  de: 'Germany',
  gb: 'Great Britain',
  it: 'Italy',
  pt: 'Portugal',
  es: 'Spain',
  ca: 'Canada',
  us: 'USA',
};

const updateSelectedRegionDisplay = (regionCode) => {
  if (!selectRegionSelectedSlot || typeof regionCode !== 'string') {
    return;
  }

  const regionLabel = regionMap[regionCode];

  if (regionLabel) {
    const flag = document.createElement('p-flag');
    flag.setAttribute('name', regionCode);
    selectRegionSelectedSlot.replaceChildren(flag, document.createTextNode(regionLabel));
    return;
  }

  selectRegionSelectedSlot.replaceChildren(document.createTextNode('Unknown region'));
};

if (selectRegion && selectRegionSelectedSlot) {
  selectRegion.addEventListener('change', (e) => {
    updateSelectedRegionDisplay(e.detail?.value);
  });
}

// Sticky CTA bar — slide it up once the user has scrolled past a threshold.
const ctaBar = document.querySelector('[data-cta-bar]');

if (ctaBar) {
  const SHOW_AFTER = 600; // px scrolled before the bar reveals
  let ctaTicking = false;

  const updateCtaBar = () => {
    const show = window.scrollY > SHOW_AFTER;
    ctaBar.classList.toggle('is-visible', show);
    ctaBar.setAttribute('aria-hidden', show ? 'false' : 'true');
    ctaTicking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ctaTicking) {
        ctaTicking = true;
        requestAnimationFrame(updateCtaBar);
      }
    },
    { passive: true }
  );

  updateCtaBar();
}
