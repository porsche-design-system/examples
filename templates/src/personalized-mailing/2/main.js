// Styles are loaded as a render-blocking <link> in index.html (prevents FOUC), not imported here.

// DO NOT USE IN PRODUCTION!
// EXAMPLE CODE FOR DEMONSTRATION PURPOSE ONLY.

const clamp01 = (n) => Math.min(1, Math.max(0, n));
// easeInOutQuad — used for the hero's scroll-driven video crop/widen.
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// Reveal elements as they scroll into view — plays once (same "animate in view" pattern as "1").
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

// Hero: scroll-driven video card ----------------------------------------------------
// The video is a plain, non-sticky absolutely-positioned card: it shrinks toward a rounded
// card as the hero scrolls, then widens back to full-bleed exactly when its own top edge
// reaches the viewport top (no snap — eased over a small run-up window before that point).
// Six variants (mirrors the PfmV2 React prototype's hidden dev menu) — swap via the wrench icon.
const HERO_VARIANT_STORAGE_KEY = 'pm2-hero-variant';
const HERO_VARIANTS = {
  standard: { label: 'A · Standard 16:9', ratioW: 16, ratioH: 9, parallax: 24, overlap: 0.42 },
  wide: { label: 'B · Breitbild 21:9', ratioW: 21, ratioH: 9, parallax: 24, overlap: 0.42 },
  classic: { label: 'C · Klassisch 4:3', ratioW: 4, ratioH: 3, parallax: 24, overlap: 0.3 },
  static: {
    label: 'D · Ohne Parallax, tiefer Anschnitt',
    ratioW: 16,
    ratioH: 9,
    parallax: 0,
    overlap: 0.55,
    videoOffsetPx: 60,
    widenAtTop: true,
    captionBottom: true,
  },
  fullbleedCenter: {
    label: 'E · Vollflächig, Text mittig (PFM v4)',
    ratioW: 16,
    ratioH: 9,
    parallax: 0,
    overlap: 0,
    fullbleed: true,
  },
  clearText: {
    label: 'F · 90vh Abstand, Text frei lesbar',
    ratioW: 16,
    ratioH: 9,
    parallax: 24,
    overlap: 0,
    videoTopVh: 0.9,
  },
};

const hero = document.getElementById('pm2-hero');
const heroTitle = document.getElementById('pm2-hero-heading');
const videoWrap = document.getElementById('pm2-video-wrap');
const videoScrim = document.getElementById('pm2-video-scrim');
const videoCaption = document.getElementById('pm2-video-caption');
const scrollHint = document.querySelector('.pm2-scroll-hint');

if (hero && heroTitle && videoWrap) {
  const WIDEN_RANGE = 260; // px run-up before the video's top edge reaches the viewport top

  // URL hash (e.g. #static) wins over localStorage so a variant link can be shared/bookmarked.
  const hashVariant = location.hash.slice(1);
  let heroVariantKey =
    (hashVariant in HERO_VARIANTS && hashVariant) ||
    (localStorage.getItem(HERO_VARIANT_STORAGE_KEY) in HERO_VARIANTS &&
      localStorage.getItem(HERO_VARIANT_STORAGE_KEY)) ||
    'static';

  const applyVariantChrome = () => {
    const variant = HERO_VARIANTS[heroVariantKey];
    hero.classList.toggle('pm2-hero--fullbleed', !!variant.fullbleed);
    videoScrim?.classList.toggle('pm2-video-scrim--fullbleed', !!variant.fullbleed);
    videoCaption?.classList.toggle('pm2-video-caption--center', !!variant.fullbleed);
    videoCaption?.classList.toggle('pm2-video-caption--bottom', !!variant.captionBottom);
  };

  let raf = 0;

  const updateHero = () => {
    const variant = HERO_VARIANTS[heroVariantKey];
    const isFullbleed = !!variant.fullbleed;
    const vp = { w: window.innerWidth, h: window.innerHeight };
    const small = vp.w < 760;

    const heroTop = hero.getBoundingClientRect().top;
    const progress = clamp01(-heroTop / (vp.h * 0.85));
    const e = easeInOut(progress);

    if (scrollHint) {
      // Fades out well before the hero has fully scrolled past — a fixed-position element with no
      // opacity control would otherwise linger visible all the way down to the footer.
      const hintOpacity = clamp01(1 - progress * 2.5);
      scrollHint.style.opacity = String(hintOpacity);
      scrollHint.style.pointerEvents = hintOpacity === 0 ? 'none' : '';
    }

    const titleH = heroTitle.offsetHeight;
    const titleTopPx = 0.16 * vp.h; // matches the title's own margin-top: 16vh
    const overlapPx = isFullbleed || variant.videoTopVh !== undefined ? 0 : variant.overlap * (titleH / 2);
    const videoTopPx = isFullbleed
      ? 0
      : variant.videoTopVh !== undefined
        ? variant.videoTopVh * vp.h
        : titleTopPx + titleH - overlapPx - e * (0.05 * vp.h) + (variant.videoOffsetPx ?? 0);

    // Derived from the freshly computed videoTopPx (converted to a viewport-relative coordinate via
    // heroTop) rather than a live re-read of the video wrap's current DOM position — reading the DOM
    // here would pick up whatever the PREVIOUS Hero variant last rendered (stale for one frame right
    // after a variant switch), briefly forcing the video to its fully widened/edge-to-edge state
    // until the next scroll event corrected it.
    const widenProgress = variant.widenAtTop ? clamp01(1 - (heroTop + videoTopPx) / WIDEN_RANGE) : 0;

    const vSide = isFullbleed ? e * 6 : ((small ? 4 : 6) - e * (small ? 2.5 : 4)) * (1 - widenProgress); // vw
    const vInset = isFullbleed ? e * 6 : 0; // vh
    const radius = isFullbleed ? e * 24 : (20 - e * 8) * (1 - widenProgress); // px

    videoWrap.style.top = isFullbleed ? `${vInset}vh` : `${videoTopPx}px`;
    videoWrap.style.left = `${vSide}vw`;
    videoWrap.style.right = `${vSide}vw`;
    videoWrap.style.bottom = isFullbleed ? `${vInset}vh` : '';
    videoWrap.style.borderRadius = `${radius}px`;
    videoWrap.style.aspectRatio = isFullbleed ? '' : small ? '3 / 4' : `${variant.ratioW} / ${variant.ratioH}`;

    // Hero min-height is coupled to the video's CURRENT (live) width/height so the gap to the
    // next section never collapses while the video is widening.
    const cardHeightNow =
      vp.w * (1 - (2 * vSide) / 100) * (small ? 4 / 3 : variant.ratioH / variant.ratioW);
    hero.style.minHeight = isFullbleed ? `${vp.h}px` : `${videoTopPx + cardHeightNow + 0.04 * vp.h}px`;

    if (!isFullbleed) {
      heroTitle.style.transform = `translateY(${progress * variant.parallax}vh)`;
    }
  };

  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateHero);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  applyVariantChrome();
  updateHero();

  // Web fonts swap in after the initial layout (fallback font metrics differ from "Porsche Next"),
  // which changes the measured title height — re-measure once fonts are actually ready, otherwise
  // the video card visibly jumps into place a moment after first paint.
  if (document.fonts?.ready) {
    document.fonts.ready.then(updateHero);
  }

  // Opening animation, triggered after the first frame (mirrors the "1" template's fade-in-up delays).
  requestAnimationFrame(() => hero.classList.add('is-mounted'));

  // Hidden dev menu: swap Hero variants (review/testing aid, not part of the actual design).
  const devMenuToggle = document.getElementById('pm2-dev-menu-toggle');
  const devMenu = document.getElementById('pm2-dev-menu');
  const devMenuItems = devMenu ? [...devMenu.querySelectorAll('[data-variant]')] : [];

  const setActiveMenuItem = () => {
    for (const btn of devMenuItems) {
      btn.setAttribute('aria-pressed', String(btn.dataset.variant === heroVariantKey));
    }
  };
  setActiveMenuItem();

  devMenuToggle?.addEventListener('click', () => {
    devMenu.hidden = !devMenu.hidden;
  });

  for (const btn of devMenuItems) {
    btn.addEventListener('click', () => {
      heroVariantKey = btn.dataset.variant;
      localStorage.setItem(HERO_VARIANT_STORAGE_KEY, heroVariantKey);
      history.replaceState(null, '', `#${heroVariantKey}`);
      setActiveMenuItem();
      applyVariantChrome();
      updateHero();
    });
  }

  // Also react to the hash being changed directly (shared link, back/forward, manual edit).
  window.addEventListener('hashchange', () => {
    const key = location.hash.slice(1);
    if (!(key in HERO_VARIANTS) || key === heroVariantKey) return;
    heroVariantKey = key;
    localStorage.setItem(HERO_VARIANT_STORAGE_KEY, heroVariantKey);
    setActiveMenuItem();
    applyVariantChrome();
    updateHero();
  });
}

// Hero: video play/pause toggle ----------------------------------------------------
const video = document.getElementById('pm2-video');
const videoToggle = document.getElementById('pm2-video-toggle');

if (video && videoToggle) {
  videoToggle.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      videoToggle.dataset.playing = 'true';
      videoToggle.setAttribute('aria-label', 'Video pausieren');
      videoToggle.querySelector('p-icon')?.setAttribute('name', 'pause');
    } else {
      video.pause();
      videoToggle.dataset.playing = 'false';
      videoToggle.setAttribute('aria-label', 'Video abspielen');
      videoToggle.querySelector('p-icon')?.setAttribute('name', 'play');
    }
  });
}

// Hero: scroll-hint button ----------------------------------------------------
document.getElementById('pm2-scroll-next')?.addEventListener('click', () => {
  window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
});

// Chapter: count-up KPIs, once the section scrolls into view ----------------------------------------------------
const chapterSection = document.querySelector('.pm2-chapter');

if (chapterSection) {
  const countUpObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.disconnect();

        for (const el of chapterSection.querySelectorAll('[data-countup]')) {
          const to = Number.parseFloat(el.dataset.countup);
          const decimals = Number.parseInt(el.dataset.decimals ?? '0', 10);
          const duration = 1400;
          let rafId = 0;
          let start = null;

          const tick = (t) => {
            if (start === null) start = t;
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - (1 - p) ** 3;
            el.textContent = (to * eased).toFixed(decimals).replace('.', ',');
            if (p < 1) rafId = requestAnimationFrame(tick);
            else el.textContent = to.toFixed(decimals).replace('.', ',');
          };
          rafId = requestAnimationFrame(tick);
          // Kept for potential future cancellation (e.g. if the section were re-observed).
          void rafId;
        }
      }
    },
    { threshold: 0.2 }
  );
  countUpObserver.observe(chapterSection);
}

// "Freude, die man teilt.": reveal the fan of share cards once in view ----------------------------------------------------
const fan = document.querySelector('.pm2-fan');

if (fan) {
  const fanObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          fan.classList.add('pm2-fan--in-view');
          observer.disconnect();
        }
      }
    },
    { threshold: 0.15 }
  );
  fanObserver.observe(fan);
}

// Sticky contact bar — reveal once the hero has been scrolled past, hide again once the footer
// (with its legal links) scrolls into view so the fixed bar never covers them, and also hide it
// while the inline "Ihr persönlicher Ansprechpartner" section is in view (advisor contact is
// already front and center there, so the floating bar would just be redundant clutter). ----------
const contactBar = document.querySelector('[data-contact-bar]');
const footer = document.querySelector('footer');
const contactSection = document.querySelector('[aria-label="Ihr persönlicher Ansprechpartner"]');

if (contactBar) {
  let footerVisible = false;
  let contactSectionVisible = false;

  const updateContactBar = () => {
    const show = window.scrollY > window.innerHeight * 0.7 && !footerVisible && !contactSectionVisible;
    contactBar.classList.toggle('is-visible', show);
    contactBar.setAttribute('aria-hidden', show ? 'false' : 'true');
    // inert when hidden so the off-canvas contact buttons aren't focusable (aria-hidden on an
    // element with focusable descendants is itself an a11y violation).
    contactBar.toggleAttribute('inert', !show);
  };

  window.addEventListener('scroll', updateContactBar, { passive: true });
  window.addEventListener('resize', updateContactBar);

  if (footer) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          footerVisible = entry.isIntersecting;
        }
        updateContactBar();
      },
      { rootMargin: '0px 0px -1px 0px' }
    );
    footerObserver.observe(footer);
  }

  if (contactSection) {
    const contactSectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        contactSectionVisible = entry.isIntersecting;
      }
      updateContactBar();
    });
    contactSectionObserver.observe(contactSection);
  }

  updateContactBar();
}

// Advisor flyout + mocked contact forms ----------------------------------------------------
const flyout = document.getElementById('pm2-flyout');

if (flyout) {
  for (const btn of document.querySelectorAll('[data-open-flyout]')) {
    btn.addEventListener('click', () => {
      flyout.open = true;
    });
  }

  flyout.addEventListener('dismiss', () => {
    flyout.open = false;
  });
}

// Shared wiring for the flyout's and the inline section's mocked "send message" forms.
function wireContactForm({ nameId, emailId, messageId, errorId, formId, sentId, sentTextId, sendId, advisorName }) {
  const nameInput = document.getElementById(nameId);
  const emailInput = document.getElementById(emailId);
  const messageInput = document.getElementById(messageId);
  const errorText = document.getElementById(errorId);
  const formWrap = document.getElementById(formId);
  const sentWrap = document.getElementById(sentId);
  const sentText = document.getElementById(sentTextId);
  const sendButton = document.getElementById(sendId);

  sendButton?.addEventListener('click', () => {
    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const message = messageInput?.value.trim();

    if (!name || !email || !message) {
      errorText?.removeAttribute('hidden');
      return;
    }

    errorText?.setAttribute('hidden', '');
    formWrap?.setAttribute('hidden', '');
    sentWrap?.removeAttribute('hidden');
    if (sentText) {
      sentText.textContent = `Danke, ${name}! Ihre Nachricht ist unterwegs zu ${advisorName}. Er meldet sich zeitnah bei Ihnen.`;
    }
    sendButton.setAttribute('icon', 'check');
    sendButton.setAttribute('disabled', 'true');
    sendButton.textContent = 'Gesendet';
  });
}

wireContactForm({
  nameId: 'pm2-contact-name',
  emailId: 'pm2-contact-email',
  messageId: 'pm2-contact-message',
  errorId: 'pm2-contact-error',
  formId: 'pm2-contact-form',
  sentId: 'pm2-contact-sent',
  sentTextId: 'pm2-contact-sent-text',
  sendId: 'pm2-contact-send',
  advisorName: 'Scott Lee',
});
