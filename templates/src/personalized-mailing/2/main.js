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
const hero = document.getElementById('pm2-hero');
const heroTitle = document.getElementById('pm2-hero-heading');
const videoWrap = document.getElementById('pm2-video-wrap');

if (hero && heroTitle && videoWrap) {
  const WIDEN_RANGE = 260; // px run-up before the video's top edge reaches the viewport top
  let raf = 0;

  const updateHero = () => {
    const vp = { w: window.innerWidth, h: window.innerHeight };
    const small = vp.w < 760;

    const heroTop = hero.getBoundingClientRect().top;
    const progress = clamp01(-heroTop / (vp.h * 0.85));
    const e = easeInOut(progress);

    const videoTopNow = videoWrap.getBoundingClientRect().top;
    const widenProgress = clamp01(1 - videoTopNow / WIDEN_RANGE);

    const vSide = ((small ? 4 : 6) - e * (small ? 2.5 : 4)) * (1 - widenProgress); // vw
    const radius = (20 - e * 8) * (1 - widenProgress); // px

    const titleH = heroTitle.offsetHeight;
    const titleTopPx = 0.16 * vp.h; // matches the title's own margin-top: 16vh
    const overlapPx = 0.55 * (titleH / 2); // how deep the video crops into the 2nd title line
    const videoTopPx = titleTopPx + titleH - overlapPx - e * (0.05 * vp.h) + 60; // +60px fixed offset

    videoWrap.style.top = `${videoTopPx}px`;
    videoWrap.style.left = `${vSide}vw`;
    videoWrap.style.right = `${vSide}vw`;
    videoWrap.style.borderRadius = `${radius}px`;
    videoWrap.style.aspectRatio = small ? '3 / 4' : '16 / 9';

    // Hero min-height is coupled to the video's CURRENT (live) width/height so the gap to the
    // next section never collapses while the video is widening.
    const cardHeightNow = vp.w * (1 - (2 * vSide) / 100) * (small ? 4 / 3 : 9 / 16);
    hero.style.minHeight = `${videoTopPx + cardHeightNow + 0.04 * vp.h}px`;
  };

  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateHero);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateHero();

  // Opening animation, triggered after the first frame (mirrors the "1" template's fade-in-up delays).
  requestAnimationFrame(() => hero.classList.add('is-mounted'));
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

// Sticky contact bar — reveal once the hero has been scrolled past ----------------------------------------------------
const contactBar = document.querySelector('[data-contact-bar]');

if (contactBar) {
  const updateContactBar = () => {
    const show = window.scrollY > window.innerHeight * 0.7;
    contactBar.classList.toggle('is-visible', show);
    contactBar.setAttribute('aria-hidden', show ? 'false' : 'true');
  };

  window.addEventListener('scroll', updateContactBar, { passive: true });
  window.addEventListener('resize', updateContactBar);
  updateContactBar();
}

// Advisor flyout + mocked contact form ----------------------------------------------------
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

  const nameInput = document.getElementById('pm2-contact-name');
  const emailInput = document.getElementById('pm2-contact-email');
  const messageInput = document.getElementById('pm2-contact-message');
  const errorText = document.getElementById('pm2-contact-error');
  const formWrap = document.getElementById('pm2-contact-form');
  const sentWrap = document.getElementById('pm2-contact-sent');
  const sentText = document.getElementById('pm2-contact-sent-text');
  const sendButton = document.getElementById('pm2-contact-send');

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
      sentText.textContent = `Danke, ${name}! Ihre Nachricht ist unterwegs zu Scott Lee. Er meldet sich zeitnah bei Ihnen.`;
    }
    sendButton.setAttribute('icon', 'check');
    sendButton.setAttribute('disabled', 'true');
    sendButton.textContent = 'Gesendet';
  });
}
