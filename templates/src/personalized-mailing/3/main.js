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
// Two variants: the current full-bleed video hero, and a video-less hero where the hero collapses
// to just the ghost title so the red chapter below slides up right beneath it.
const HERO_VARIANT_STORAGE_KEY = 'pm3-hero-variant';
const HERO_VARIANTS = {
  fullbleedCenter: {
    label: '1 · Mit Video',
    ratioW: 16,
    ratioH: 9,
    parallax: 0,
    overlap: 0,
    fullbleed: true,
  },
  noVideo: {
    label: '2 · Ohne Video',
    noVideo: true,
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
    'fullbleedCenter';

  const applyVariantChrome = () => {
    const variant = HERO_VARIANTS[heroVariantKey];
    hero.classList.toggle('pm2-hero--fullbleed', !!variant.fullbleed);
    hero.classList.toggle('pm2-hero--no-video', !!variant.noVideo);
    // Page-level hook so the chapter (a sibling section) can reorder/pull up the car in no-video mode.
    document.documentElement.classList.toggle('pm3-no-video', !!variant.noVideo);
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

    // "Ohne Video": collapse the hero to the ghost title's bottom so the red chapter (reordered to
    // lead with the car, pulled up via CSS) slides up and the car cuts into the title's second line.
    if (variant.noVideo) {
      const titleH = heroTitle.offsetHeight;
      hero.style.minHeight = `${0.16 * vp.h + titleH}px`;
      heroTitle.style.transform = '';
      return;
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
// Observe the KPI grid itself, not the whole (much taller) chapter section — observing the section
// fired the count-up as soon as its lead text/car stage appeared, long before the numbers themselves
// had scrolled into view, so the animation was already finished by the time they became visible.
const kpiGrid = document.querySelector('.pm2-kpis');

if (chapterSection && kpiGrid) {
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
    { threshold: 0.4 }
  );
  countUpObserver.observe(kpiGrid);
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

  // p-button-pure is action-only (renders a <button>, no href) — navigate manually for the two
  // contact actions instead of using p-link-pure, per explicit request.
  contactBar.querySelector('[data-tel]')?.addEventListener('click', (e) => {
    window.location.href = `tel:${e.currentTarget.dataset.tel}`;
  });
  contactBar.querySelector('[data-mailto]')?.addEventListener('click', (e) => {
    window.location.href = `mailto:${e.currentTarget.dataset.mailto}`;
  });
}

// Feedback pattern (ported from patterns/src/feedback/1) ----------------------------------------------------
const feedbackQuestion = document.getElementById('feedback-question');
const feedbackForm = document.getElementById('feedback-form');
const feedbackRating = document.getElementById('feedback-rating');
const feedbackComment = document.getElementById('feedback-comment');
const feedbackSubmit = document.getElementById('feedback-submit');
const feedbackThanks = document.getElementById('feedback-thanks');
const feedbackThanksHeading = document.getElementById('feedback-thanks-heading');
const feedbackRestart = document.getElementById('feedback-restart');

if (feedbackRating) {
  // Choosing a rating reveals the optional free-text field and the submit button.
  feedbackRating.addEventListener('change', () => {
    feedbackComment.hidden = false;
    feedbackSubmit.hidden = false;
  });

  feedbackSubmit.addEventListener('click', () => {
    // Simulate a short server round-trip: show a loading spinner while "submitting",
    // then reveal the confirmation. In a real integration the request would happen here.
    feedbackSubmit.loading = true;
    window.setTimeout(() => {
      feedbackSubmit.loading = false;
      feedbackForm.hidden = true;
      feedbackQuestion.hidden = true;
      feedbackThanks.hidden = false;
      // Move focus to the confirmation so keyboard and screen reader users are informed.
      feedbackThanksHeading.focus();
    }, 1200);
  });

  feedbackRestart.addEventListener('click', () => {
    feedbackRating.value = '';
    feedbackComment.value = '';
    feedbackSubmit.loading = false;
    feedbackSubmit.hidden = true;
    feedbackComment.hidden = true;
    feedbackThanks.hidden = true;
    feedbackQuestion.hidden = false;
    feedbackForm.hidden = false;
    // Return focus to the question so the flow is re-announced and can be repeated from the start.
    feedbackQuestion.focus();
  });
}

// Video testimonials: open each clip in a p-modal ----------------------------------------
// One reusable modal holds a YouTube iframe whose src is set on open and cleared on dismiss,
// so playback stops the moment the modal closes (removing the iframe is the reliable way to
// halt a cross-origin YouTube player).
const videoModal = document.getElementById('pm2-video-modal');
const videoIframe = document.getElementById('pm2-video-iframe');

if (videoModal && videoIframe) {
  const openVideo = (id) => {
    // youtube-nocookie + autoplay: start playback immediately once the modal is shown.
    videoIframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    videoModal.open = true;
  };

  const closeVideo = () => {
    videoModal.open = false;
    // Clearing the src unloads the player and stops the sound.
    videoIframe.src = '';
  };

  for (const card of document.querySelectorAll('.pm2-voice-card')) {
    card.addEventListener('click', () => {
      openVideo(card.dataset.videoId);
    });
  }

  videoModal.addEventListener('dismiss', closeVideo);
}

// Motorsound: inline audio player ---------------------------------------------------------
// The .is-playing class on the player crossfades title->waveform and widens the pill (see style.css).
const soundCard = document.querySelector('.pm2-sound-player');
const soundAudio = document.getElementById('pm2-sound-audio');
const soundToggle = document.getElementById('pm2-sound-toggle');

if (soundCard && soundAudio && soundToggle) {
  const reflect = (playing) => {
    soundCard.classList.toggle('is-playing', playing);
    soundToggle.setAttribute('icon', playing ? 'pause' : 'play-filled');
    soundToggle.textContent = playing ? 'Motorsound pausieren' : 'Motorsound abspielen';
  };

  soundToggle.addEventListener('click', () => {
    if (soundAudio.paused) soundAudio.play();
    else soundAudio.pause();
  });

  soundAudio.addEventListener('play', () => reflect(true));
  soundAudio.addEventListener('pause', () => reflect(false));
  soundAudio.addEventListener('ended', () => reflect(false));
}
