// Language management
const translations = {
    zh: {
        navAbout: '关于',
        navEducation: '教育',
        navSkills: '技能',
        navGallery: '摄影',
        navInterests: '兴趣',
        navContact: '联系',
        currentLang: '中文',
        resumeText: '下载个人简历 PDF',
        scrollText: '向下滚动',
        contactBtn: '联系我',
        contactEmail: '邮箱',
        contactPhone: '电话',
        contactGithub: 'GitHub'
    },
    en: {
        navAbout: 'About',
        navEducation: 'Education',
        navSkills: 'Skills',
        navGallery: 'Gallery',
        navInterests: 'Interests',
        navContact: 'Contact',
        currentLang: 'English',
        resumeText: 'Download Resume PDF',
        scrollText: 'Scroll Down',
        contactBtn: 'Contact Me',
        contactEmail: 'Email',
        contactPhone: 'Phone',
        contactGithub: 'GitHub'
    }
};

// Initialize language from localStorage or default to Chinese
let currentLanguage = localStorage.getItem('siteLanguage') || 'zh';

// Set language function
function setLanguage(lang) {
    // Use applyLanguage instead of reloading
    applyLanguage(lang);

    // Close dropdown
    const dropdown = document.querySelector('.nav-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// Toggle language dropdown
function toggleLangDropdown() {
    const dropdown = document.querySelector('.nav-dropdown');
    dropdown.classList.toggle('active');
}

// Apply language on page load (without reload)
window.addEventListener('load', () => {
    // Restore scroll position after reload
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('scrollPosition');
    }
    
    // Apply saved language without reloading
    applyLanguage(currentLanguage);
});

// Apply language without reloading the page
function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('siteLanguage', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Update all elements with language attributes (including nested elements)
    document.querySelectorAll('[data-lang-zh]').forEach(element => {
        const zhText = element.getAttribute('data-lang-zh');
        const enText = element.getAttribute('data-lang-en');
        if (zhText && enText) {
            element.textContent = lang === 'zh' ? zhText : enText;
        }
    });

    // Update language button
    const currentLangEl = document.querySelector('.current-lang');
    if (currentLangEl) {
        currentLangEl.textContent = translations[lang].currentLang;
    }

    // Update resume link
    const resumeLink = document.getElementById('resumeLink');
    if (resumeLink) {
        resumeLink.href = lang === 'zh' ? './resume/Resume_CN.pdf' : './resume/Resume_EN.pdf';
    }

    console.log(`Language changed to: ${lang}. Updated ${document.querySelectorAll('[data-lang-zh]').length} elements.`);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.nav-dropdown');
    
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navigation with better performance
let lastScroll = 0;
const nav = document.querySelector('.nav');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true }); // Use passive event listener

// Animate elements on scroll with better performance
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px', // Only trigger when element is 50px into viewport
    threshold: 0.05 // Lower threshold for better performance
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            requestAnimationFrame(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Unobserve after animation
            });
        }
    });
}, observerOptions);

// Observe all interest items, education card, contact items, and gallery items
document.querySelectorAll('.interest-item, .tech-stack-section, .education-card, .contact-item, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.willChange = 'opacity, transform'; // Hint for browser optimization
    observer.observe(el);
});

// Device detection helper
const DeviceUtils = {
    isMobile: () => window.innerWidth <= 768,
    isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: () => window.innerWidth > 1024,
    getTouchSupport: () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0),
    // Check for slow connection (mobile data)
    isSlowConnection: () => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');
    }
};

// Hero animation manager - handles device-specific animations
const HeroAnimation = {
    elements: {
        name: document.getElementById('heroName'),
        subtitle: document.querySelector('.hero-subtitle'),
        description: document.querySelector('.hero-description'),
        actions: document.querySelector('.hero-actions'),
        contact: document.querySelector('.hero-contact')
    },

    // Get animation timing based on device
    getTimings() {
        const isMobile = DeviceUtils.isMobile();

        return {
            fontLoadTimeout: isMobile ? 800 : 2000,
            contentDelay: 300,
            subtitleDelay: 200,
            descriptionDelay: isMobile ? 300 : 400,
            actionsDelay: isMobile ? 400 : 600,
            contactDelay: isMobile ? 500 : 800
        };
    },

    // Show hero content with staggered animation
    showContent(timings) {
        const { subtitleDelay, descriptionDelay, actionsDelay, contactDelay } = timings;

        const elements = this.elements;
        const delays = [
            { el: elements.subtitle, delay: subtitleDelay, name: 'subtitle' },
            { el: elements.description, delay: descriptionDelay, name: 'description' },
            { el: elements.actions, delay: actionsDelay, name: 'actions' },
            { el: elements.contact, delay: contactDelay, name: 'contact' }
        ];

        delays.forEach(({ el, delay, name }) => {
            if (el) {
                setTimeout(() => {
                    el.classList.add('visible');
                    console.log(`Hero ${name} shown`);
                }, delay);
            }
        });
    },

    // Initialize hero animation
    init() {
        const { name } = this.elements;
        if (!name) return;

        const timings = this.getTimings();
        const { fontLoadTimeout, contentDelay } = timings;

        // Fallback timeout
        const fallbackTimeout = setTimeout(() => {
            name.classList.add('visible');
            this.showContent(timings);
            console.log('Hero content shown via fallback');
        }, fontLoadTimeout);

        // Wait for font to load
        document.fonts.ready.then(() => {
            clearTimeout(fallbackTimeout);
            name.classList.add('visible');
            console.log('Hero name shown (font ready)');

            // Show content after font is loaded
            setTimeout(() => {
                this.showContent(timings);
            }, contentDelay);
        }).catch(() => {
            clearTimeout(fallbackTimeout);
            name.classList.add('visible');
            this.showContent(timings);
            console.log('Hero content shown (font error)');
        });
    }
};

// Background image loader - ensures compatibility across devices
const BackgroundLoader = {
    init() {
        // Try to preload background image
        const bgImage = new Image();

        // Use multiple paths to ensure compatibility
        const possiblePaths = [
            './images/background.jpg',
            'images/background.jpg',
            '/images/background.jpg'
        ];

        let loaded = false;

        const tryLoad = (index) => {
            if (index >= possiblePaths.length) {
                console.error('Background image failed to load, using CSS fallback');
                return;
            }

            bgImage.src = possiblePaths[index];

            bgImage.onload = () => {
                if (!loaded) {
                    loaded = true;
                    console.log('Background image loaded from:', possiblePaths[index]);
                    const hero = document.querySelector('.hero');
                    if (hero) {
                        hero.classList.add('background-loaded');
                    }
                }
            };

            bgImage.onerror = () => {
                console.warn('Failed to load from:', possiblePaths[index]);
                // Try next path
                tryLoad(index + 1);
            };
        };

        // Start trying to load
        tryLoad(0);

        // For mobile with slow connection, add a timeout
        if (DeviceUtils.isSlowConnection() || DeviceUtils.isMobile()) {
            setTimeout(() => {
                if (!loaded) {
                    console.log('Background image timeout, using CSS fallback gradient');
                    // CSS already has fallback gradient
                }
            }, 3000);
        }
    }
};

// Gallery functionality - load images from images folder with performance optimization
async function loadGalleryImages() {
    const galleryScroll = document.getElementById('galleryScroll');
    if (!galleryScroll) return;

    // Use DocumentFragment for better performance
    const galleryItems = document.createElement('div');
    galleryItems.className = 'gallery-items';

    // List of image files in the images folder with orientation information
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
        { file: 'IMG_8961.JPG', orientation: 'vertical' }
    ];

    // Create separate sections for horizontal and vertical images
    const horizontalSection = document.createElement('div');
    horizontalSection.className = 'gallery-section gallery-section-horizontal';
    const horizontalLabel = document.createElement('div');
    horizontalLabel.className = 'gallery-section-label';
    horizontalLabel.innerHTML = '<span data-lang-zh="横向摄影" data-lang-en="Horizontal Photography">横向摄影</span>';
    horizontalSection.appendChild(horizontalLabel);

    const horizontalItems = document.createElement('div');
    horizontalItems.className = 'gallery-items-horizontal';

    const verticalSection = document.createElement('div');
    verticalSection.className = 'gallery-section gallery-section-vertical';
    const verticalLabel = document.createElement('div');
    verticalLabel.className = 'gallery-section-label';
    verticalLabel.innerHTML = '<span data-lang-zh="纵向摄影" data-lang-en="Vertical Photography">纵向摄影</span>';
    verticalSection.appendChild(verticalLabel);

    const verticalItems = document.createElement('div');
    verticalItems.className = 'gallery-items-vertical';

    // Batch create gallery items for better performance
    const itemsToObserve = [];

    imageFiles.forEach((imageData, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item gallery-item-${imageData.orientation}`;

        const img = document.createElement('img');
        img.alt = `Photo ${index + 1}`;
        // Use data-src for lazy loading
        img.dataset.src = `./images/${imageData.file}`;
        img.loading = 'lazy';
        img.decoding = 'async';

        galleryItem.appendChild(img);

        // Store click handler in data attribute for memory efficiency
        galleryItem.addEventListener('click', () => {
            openLightbox(`./images/${imageData.file}`);
        }, { passive: true }); // Use passive event listener for better scroll performance

        // Add to appropriate section
        if (imageData.orientation === 'horizontal') {
            horizontalItems.appendChild(galleryItem);
        } else {
            verticalItems.appendChild(galleryItem);
        }

        itemsToObserve.push(galleryItem);
    });

    horizontalSection.appendChild(horizontalItems);
    verticalSection.appendChild(verticalItems);
    galleryItems.appendChild(horizontalSection);
    galleryItems.appendChild(verticalSection);
    galleryScroll.appendChild(galleryItems);

    // Observe gallery items for scroll animation (batched)
    requestAnimationFrame(() => {
        itemsToObserve.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Observe section labels for animation
        document.querySelectorAll('.gallery-section-label').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    });

    // Implement lazy loading for gallery images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src && !img.src) {
                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.classList.add('loaded');
                    };
                    img.onerror = () => {
                        // Fallback placeholder on error
                        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                        img.classList.add('loaded');
                    };
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.1
    });

    // Observe all gallery images for lazy loading
    galleryScroll.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Scroll gallery function
function scrollGallery(direction) {
    const galleryScroll = document.getElementById('galleryScroll');
    if (!galleryScroll) return;

    const scrollAmount = 420; // larger scroll amount for better UX
    galleryScroll.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Lightbox functionality (optional enhancement)
function openLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imageSrc}" alt="Gallery Image">
        </div>
    `;

    document.body.appendChild(lightbox);

    // Close lightbox on click
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.remove();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.remove();
        }
    });
}

// Initialize all components on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    console.log(`Device: ${DeviceUtils.isMobile() ? 'Mobile' : DeviceUtils.isTablet() ? 'Tablet' : 'Desktop'}`);
    console.log(`Touch support: ${DeviceUtils.getTouchSupport() ? 'Yes' : 'No'}`);
    console.log(`Slow connection: ${DeviceUtils.isSlowConnection() ? 'Yes' : 'No'}`);

    // Initialize components
    BackgroundLoader.init();
    HeroAnimation.init();
    loadGalleryImages();
});
