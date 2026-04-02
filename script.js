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
    currentLanguage = lang;
    localStorage.setItem('siteLanguage', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    
    // Update navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        const zhText = link.getAttribute('data-lang-zh');
        const enText = link.getAttribute('data-lang-en');
        if (zhText && enText) {
            link.textContent = lang === 'zh' ? zhText : enText;
        }
    });
    
    // Update language button
    document.querySelector('.current-lang').textContent = translations[lang].currentLang;
    
    // Update resume link
    const resumeLink = document.getElementById('resumeLink');
    const resumeText = document.getElementById('resumeText');
    if (resumeLink && resumeText) {
        resumeLink.href = lang === 'zh' ? './resume/Resume_CN.pdf' : './resume/Resume_EN.pdf';
        resumeText.textContent = translations[lang].resumeText;
    }
    
    // Update scroll text
    const scrollText = document.querySelector('.scroll-indicator span');
    if (scrollText) {
        scrollText.textContent = translations[lang].scrollText;
    }
    
    // Update hero tags
    const tags = document.querySelectorAll('.tag');
    if (tags[0]) tags[0].textContent = translations[lang].heroTag1;
    if (tags[1]) tags[1].textContent = translations[lang].heroTag2;
    if (tags[2]) tags[2].textContent = translations[lang].heroTag3;
    
    // Update buttons
    const contactBtn = document.querySelector('.hero-actions .btn-primary');
    if (contactBtn) contactBtn.textContent = translations[lang].contactBtn;
    
    // Update contact section labels
    const contactLabels = document.querySelectorAll('.contact-item strong');
    if (contactLabels[0]) contactLabels[0].textContent = translations[lang].contactEmail;
    if (contactLabels[1]) contactLabels[1].textContent = translations[lang].contactPhone;
    if (contactLabels[2]) contactLabels[2].textContent = translations[lang].contactGithub;
    
    // Close dropdown
    const dropdown = document.querySelector('.nav-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
    
    // Save scroll position and reload page
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    sessionStorage.setItem('scrollPosition', scrollPosition);
    location.reload();
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
    
    // Update all elements with language attributes
    document.querySelectorAll('[data-lang-zh]').forEach(element => {
        const zhText = element.getAttribute('data-lang-zh');
        const enText = element.getAttribute('data-lang-en');
        if (zhText && enText) {
            element.textContent = lang === 'zh' ? zhText : enText;
        }
    });
    
    // Update navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        const zhText = link.getAttribute('data-lang-zh');
        const enText = link.getAttribute('data-lang-en');
        if (zhText && enText) {
            link.textContent = lang === 'zh' ? zhText : enText;
        }
    });
    
    // Update language button
    document.querySelector('.current-lang').textContent = translations[lang].currentLang;
    
    // Update resume link
    const resumeLink = document.getElementById('resumeLink');
    const resumeText = document.getElementById('resumeText');
    if (resumeLink && resumeText) {
        resumeLink.href = lang === 'zh' ? './resume/Resume_CN.pdf' : './resume/Resume_EN.pdf';
        // Resume text is updated via data-lang attributes
    }
    
    // Update scroll text
    const scrollText = document.querySelector('.scroll-indicator span');
    if (scrollText) {
        scrollText.textContent = translations[lang].scrollText;
    }
    
    // Update hero tags (backup if data-lang not set)
    const tags = document.querySelectorAll('.tag');
    if (tags[0] && !tags[0].getAttribute('data-lang-zh')) tags[0].textContent = translations[lang].heroTag1;
    if (tags[1] && !tags[1].getAttribute('data-lang-zh')) tags[1].textContent = translations[lang].heroTag2;
    if (tags[2] && !tags[2].getAttribute('data-lang-zh')) tags[2].textContent = translations[lang].heroTag3;
    
    // Update buttons (backup if data-lang not set)
    const contactBtn = document.querySelector('.hero-actions .btn-primary');
    if (contactBtn && !contactBtn.getAttribute('data-lang-zh')) contactBtn.textContent = translations[lang].contactBtn;
    
    // Update contact section labels (backup if data-lang not set)
    const contactLabels = document.querySelectorAll('.contact-item strong');
    if (contactLabels[0] && !contactLabels[0].getAttribute('data-lang-zh')) contactLabels[0].textContent = translations[lang].contactEmail;
    if (contactLabels[1] && !contactLabels[1].getAttribute('data-lang-zh')) contactLabels[1].textContent = translations[lang].contactPhone;
    if (contactLabels[2] && !contactLabels[2].getAttribute('data-lang-zh')) contactLabels[2].textContent = translations[lang].contactGithub;
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

// Simple fade-in animation for hero name
const heroName = document.getElementById('heroName');
if (heroName) {
    setTimeout(() => {
        heroName.classList.add('visible');
    }, 300);
}

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
        img.src = `./images/${imageData.file}`;
        img.alt = `Photo ${index + 1}`;
        img.loading = 'lazy';
        img.decoding = 'async'; // Add for better loading performance

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

// Load gallery images on page load
window.addEventListener('DOMContentLoaded', loadGalleryImages);
