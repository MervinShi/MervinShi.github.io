/* ==========================================================================
   Mervin Shi — Personal Site
   Interactions, animations, and feature logic
   ========================================================================== */

// ---------------------------------------------------------------------------
// 0. Utilities
// ---------------------------------------------------------------------------
const Device = {
  mobile: () => window.innerWidth <= 768,
  tablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
  desktop: () => window.innerWidth > 1024,
  touch: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  slowConnection: () => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g');
  },
  reducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

// ---------------------------------------------------------------------------
// 1. Language System
// ---------------------------------------------------------------------------
const translations = {
  zh: {
    currentLang: '中文',
    resumeText: '下载个人简历 PDF',
  },
  en: {
    currentLang: 'English',
    resumeText: 'Download Resume PDF',
  },
};

let currentLanguage = localStorage.getItem('siteLanguage') || 'zh';

function setLanguage(lang) {
  applyLanguage(lang);
  const dropdown = document.querySelector('.nav-dropdown');
  if (dropdown) dropdown.classList.remove('active');
}

function toggleLangDropdown() {
  document.querySelector('.nav-dropdown')?.classList.toggle('active');
}

function applyLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('siteLanguage', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  document.querySelectorAll('[data-lang-zh]').forEach((el) => {
    const zhText = el.getAttribute('data-lang-zh');
    const enText = el.getAttribute('data-lang-en');
    if (zhText && enText) el.textContent = lang === 'zh' ? zhText : enText;
  });

  const currentLangEl = document.querySelector('.current-lang');
  if (currentLangEl) currentLangEl.textContent = translations[lang].currentLang;

  const resumeLink = document.getElementById('resumeLink');
  if (resumeLink) {
    resumeLink.href = lang === 'zh' ? './resume/Resume_CN.pdf' : './resume/Resume_EN.pdf';
  }

  window.dispatchEvent(new CustomEvent('languagechanged', { detail: lang }));
}

// Close lang dropdown on outside click
document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('.nav-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

// Apply saved language on load
window.addEventListener('load', () => {
  const scrollY = sessionStorage.getItem('scrollPosition');
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY));
    sessionStorage.removeItem('scrollPosition');
  }
  applyLanguage(currentLanguage);
});

// ---------------------------------------------------------------------------
// 2. Mobile Navigation
// ---------------------------------------------------------------------------
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (Device.desktop() && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ---------------------------------------------------------------------------
// 3. Smooth Scroll for Anchor Links
// ---------------------------------------------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 4. Navigation Scroll Effects
// ---------------------------------------------------------------------------
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.pageYOffset > 30);
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
}

// ---------------------------------------------------------------------------
// 5. Active Nav Link Tracking
// ---------------------------------------------------------------------------
function initActiveNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          let current = '';
          sections.forEach((s) => {
            if (window.pageYOffset >= s.offsetTop - 120) {
              current = s.getAttribute('id');
            }
          });
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
          });
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
}

// ---------------------------------------------------------------------------
// 6. Scroll-Triggered Animations
// ---------------------------------------------------------------------------
function initScrollAnimations() {
  if (Device.reducedMotion()) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          });
        }
      });
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.08 },
  );

  const targets = document.querySelectorAll(
    '.interest-item, .education-card, .contact-item, .project-card, .gallery-item, .tech-stack-section, .skill-tags-section, .gallery-section-label',
  );
  targets.forEach((el) => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// ---------------------------------------------------------------------------
// 7. Hero Animation
// ---------------------------------------------------------------------------
function initHeroAnimation() {
  const name = document.getElementById('heroName');
  if (!name) return;

  const subtitle = document.querySelector('.hero-subtitle');
  const description = document.querySelector('.hero-description');
  const actions = document.querySelector('.hero-actions');
  const contact = document.querySelector('.hero-contact');

  const isMobile = Device.mobile();
  const fontTimeout = isMobile ? 800 : 2000;

  function showContent() {
    const delays = [
      { el: subtitle, delay: 150 },
      { el: description, delay: isMobile ? 250 : 350 },
      { el: actions, delay: isMobile ? 350 : 500 },
      { el: contact, delay: isMobile ? 450 : 700 },
    ];

    delays.forEach(({ el, delay }) => {
      if (el) setTimeout(() => el.classList.add('visible'), delay);
    });
  }

  // Try font loading, fallback on timeout
  const fallback = setTimeout(() => {
    name.classList.add('visible');
    showContent();
  }, fontTimeout);

  document.fonts.ready
    .then(() => {
      clearTimeout(fallback);
      name.classList.add('visible');
      setTimeout(showContent, 250);
    })
    .catch(() => {
      clearTimeout(fallback);
      name.classList.add('visible');
      showContent();
    });
}

// ---------------------------------------------------------------------------
// 8. Cursor Glow on Hero (desktop only)
// ---------------------------------------------------------------------------
function initCursorGlow() {
  if (Device.mobile() || Device.reducedMotion()) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--cursor-x', `${e.clientX - rect.left}px`);
    hero.style.setProperty('--cursor-y', `${e.clientY - rect.top}px`);
    hero.classList.add('glow-active');
  });

  hero.addEventListener('mouseleave', () => {
    hero.classList.remove('glow-active');
  });
}

// ---------------------------------------------------------------------------
// 9. Stats Counter Animation
// ---------------------------------------------------------------------------
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 2000;
          const startTime = performance.now();

          function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
          observer.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
}

// ---------------------------------------------------------------------------
// 10. Gallery System
// ---------------------------------------------------------------------------
function initGallery() {
  const galleryScroll = document.getElementById('galleryScroll');
  if (!galleryScroll) return;

  const imageFiles = [
    { file: '1.JPG', orientation: 'horizontal' },
    { file: '2.JPG', orientation: 'horizontal' },
    { file: '3.JPG', orientation: 'vertical' },
    { file: '4.JPG', orientation: 'vertical' },
    { file: '5.JPG', orientation: 'vertical' },
    { file: '6.JPG', orientation: 'horizontal' },
    { file: '7.JPG', orientation: 'vertical' },
    { file: 'IMG_4449.JPG', orientation: 'horizontal' },
    { file: 'IMG_4450.JPG', orientation: 'horizontal' },
    { file: 'IMG_4451.JPG', orientation: 'horizontal' },
    { file: 'IMG_8467.JPG', orientation: 'horizontal' },
    { file: 'IMG_8469.JPG', orientation: 'horizontal' },
    { file: 'IMG_8961.JPG', orientation: 'vertical' },
  ];

  const galleryItems = document.createElement('div');
  galleryItems.className = 'gallery-items';

  // Group by orientation
  const horizontalFiles = imageFiles.filter((f) => f.orientation === 'horizontal');
  const verticalFiles = imageFiles.filter((f) => f.orientation === 'vertical');

  function buildSection(labelZh, labelEn, files, itemClass, itemsContainerClass) {
    const section = document.createElement('div');
    section.className = 'gallery-section';

    const label = document.createElement('div');
    label.className = 'gallery-section-label';
    label.innerHTML = `<span data-lang-zh="${labelZh}" data-lang-en="${labelEn}">${labelZh}</span>`;
    section.appendChild(label);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = itemsContainerClass;

    files.forEach((img, idx) => {
      const item = document.createElement('div');
      item.className = `gallery-item ${itemClass}`;

      const image = document.createElement('img');
      image.alt = `Photo ${idx + 1}`;
      image.dataset.src = `./images/${img.file}`;
      image.loading = 'lazy';
      image.decoding = 'async';

      item.appendChild(image);
      item.addEventListener('click', () => openLightbox(`./images/${img.file}`), { passive: true });
      itemsContainer.appendChild(item);
    });

    section.appendChild(itemsContainer);
    return section;
  }

  galleryItems.appendChild(
    buildSection('横向摄影', 'Horizontal', horizontalFiles, 'gallery-item-horizontal', 'gallery-items-horizontal'),
  );
  galleryItems.appendChild(
    buildSection('纵向摄影', 'Vertical', verticalFiles, 'gallery-item-vertical', 'gallery-items-vertical'),
  );
  galleryScroll.appendChild(galleryItems);

  // Lazy-load images
  const imgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src && !img.src) {
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
            img.onerror = () => {
              img.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e8e8ed" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E📷%3C/text%3E%3C/svg%3E';
              img.classList.add('loaded');
            };
          }
          imgObserver.unobserve(img);
        }
      });
    },
    { rootMargin: '80px', threshold: 0.05 },
  );

  galleryScroll.querySelectorAll('img[data-src]').forEach((img) => imgObserver.observe(img));

  // Re-apply language to gallery labels
  applyLanguage(currentLanguage);
}

function scrollGallery(direction) {
  const scroll = document.getElementById('galleryScroll');
  if (!scroll) return;
  scroll.scrollBy({ left: direction * 380, behavior: 'smooth' });
}

// Lightbox
function openLightbox(src) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close" aria-label="关闭">&times;</span>
      <img src="${src}" alt="Gallery Image">
    </div>`;

  document.body.appendChild(lb);
  document.body.style.overflow = 'hidden';

  const close = () => {
    lb.remove();
    document.body.style.overflow = '';
  };

  lb.querySelector('.lightbox-close').addEventListener('click', close);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });

  // Close on Escape
  const onKey = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onKey);
    }
  };
  document.addEventListener('keydown', onKey);
}

// ---------------------------------------------------------------------------
// 11. Background Image Preloader
// ---------------------------------------------------------------------------
function preloadBackground() {
  const img = new Image();
  let loaded = false;

  img.onload = () => {
    if (!loaded) {
      loaded = true;
      document.querySelector('.hero')?.classList.add('background-loaded');
    }
  };

  // Try relative path first (works for GitHub Pages)
  img.src = './images/background.jpg';

  // Mobile/slow-connection timeout for fallback CSS gradient
  if (Device.slowConnection() || Device.mobile()) {
    setTimeout(() => {
      if (!loaded) console.log('Background: using CSS gradient fallback');
    }, 3000);
  }
}

// ---------------------------------------------------------------------------
// 12. Bootstrap
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmoothScroll();
  initNavScroll();
  initActiveNavTracking();
  initScrollAnimations();
  initHeroAnimation();
  initCursorGlow();
  initStatsCounter();
  initGallery();
  preloadBackground();
});
