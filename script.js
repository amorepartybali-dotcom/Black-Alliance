document.addEventListener('DOMContentLoaded', () => {
    console.log('Bali Marine Website Loaded');

    // =========================================
    // Telegram Mini App Integration
    // =========================================
    const tg = window.Telegram?.WebApp;

    if (tg) {
        // Initialize Telegram WebApp
        tg.ready();
        tg.expand(); // Expand to full height

        // Add class to body for CSS targeting
        document.body.classList.add('telegram-webapp');

        // Apply Telegram theme colors
        const root = document.documentElement;
        if (tg.themeParams) {
            if (tg.themeParams.bg_color) {
                root.style.setProperty('--tg-bg-color', tg.themeParams.bg_color);
            }
            if (tg.themeParams.text_color) {
                root.style.setProperty('--tg-text-color', tg.themeParams.text_color);
            }
        }

        // Show MainButton for booking
        tg.MainButton.setText('📞 Book via WhatsApp');
        tg.MainButton.color = '#FBBF24';
        tg.MainButton.textColor = '#0A192F';
        tg.MainButton.show();

        tg.MainButton.onClick(() => {
            tg.openLink('https://wa.me/6281338266077?text=Hello! I want to book a yacht from Bali Marine');
        });

        // Enable haptic feedback on button clicks
        document.querySelectorAll('.btn, .fleet-btn, .book-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (tg.HapticFeedback) {
                    tg.HapticFeedback.impactOccurred('light');
                }
            });
        });

        console.log('Telegram Mini App initialized');
    }

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    if (navLinks) navLinks.classList.remove('active');
                }
            }
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 25, 47, 0.95)';
                navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            } else {
                navbar.style.background = 'rgba(10, 25, 47, 0.85)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Enhanced Scroll Animations with Stagger Effect
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Apply stagger delays to fleet cards
    document.querySelectorAll('.fleet-card').forEach((el, index) => {
        el.classList.add('fade-in');
        el.classList.add(`delay-${(index % 6) + 1}`);
        observer.observe(el);
    });

    // Apply animations to other elements
    document.querySelectorAll('.section-title, .section-subtitle, .service-item, .hero-title, .hero-subtitle, .hero-cta, .route-note').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Apply scale-in to alliance card
    document.querySelectorAll('.card-glow').forEach(el => {
        el.classList.add('scale-in');
        observer.observe(el);
    });

    // ===== LIGHTBOX GALLERY =====
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">×</button>
            <button class="lightbox-nav lightbox-prev">‹</button>
            <button class="lightbox-nav lightbox-next">›</button>
            <img src="" alt="Yacht Photo">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    // Collect all fleet images
    function collectImages() {
        currentImages = [];
        document.querySelectorAll('.fleet-image img').forEach((img, index) => {
            currentImages.push({
                src: img.src,
                alt: img.alt,
                index: index
            });
        });
    }

    // Open lightbox
    function openLightbox(index) {
        collectImages();
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Update lightbox image
    function updateLightboxImage() {
        if (currentImages[currentIndex]) {
            lightboxImg.src = currentImages[currentIndex].src;
            lightboxCaption.textContent = currentImages[currentIndex].alt;
        }
    }

    // Navigate lightbox
    function navigateLightbox(direction) {
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = currentImages.length - 1;
        if (currentIndex >= currentImages.length) currentIndex = 0;
        updateLightboxImage();
    }

    // Event listeners for fleet images
    document.querySelectorAll('.fleet-image').forEach((fleetImage, index) => {
        fleetImage.addEventListener('click', () => openLightbox(index));
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
});
