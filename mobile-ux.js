/**
 * Mobile UX Optimization Script
 * Sticky buy button, scroll to top, va boshqa mobil-specific funksiyalar
 */

// Sticky Buy Button Functionality
function initStickyBuyButton() {
    const stickyBuyButton = document.getElementById('stickyBuyButton');
    const stickyBuyBtn = document.getElementById('stickyBuyBtn');
    const stickyBuyText = document.getElementById('stickyBuyText');

    if (!stickyBuyButton || !stickyBuyBtn) return;

    // Sticky tugma bosilganda
    stickyBuyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Agar savat bo'sh bo'lsa - mahsulotlar bo'limiga o'tish
        if (!cart || cart.length === 0) {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Agar savat to'liq bo'lsa - cart.html'ga o'tish
        window.location.href = 'cart.html';
    });

    // Savat holati o'zgarishi bilan tugma matnini yangilash
    const updateStickyButton = () => {
        if (!cart || cart.length === 0) {
            stickyBuyText.textContent = 'Savat';
            stickyBuyButton.classList.remove('show');
        } else {
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            stickyBuyText.textContent = `Savat (${totalItems})`;
            stickyBuyButton.classList.add('show');
        }
    };

    // Dastlabki holat
    updateStickyButton();

    // Cart o'zgarishi bilan yangilash
    window.addEventListener('cartUpdated', updateStickyButton);
    window.addEventListener('storage', updateStickyButton);

    // Har 500ms'da tekshirish (backup)
    setInterval(updateStickyButton, 500);
}

// Scroll to Top Button Functionality
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (!scrollToTopBtn) return;

    // Scroll hodisasi
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Tugma bosilganda
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile Navigation Active State
function initMobileNavigation() {
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    const sections = {
        '#home': 'home',
        '#products': 'products',
        'cart.html': 'cart',
        'profile.html': 'profile'
    };

    const updateActiveNav = () => {
        const currentPage = window.location.pathname;
        const currentHash = window.location.hash;

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            let isActive = false;

            if (currentPage.includes('cart.html') && href === 'cart.html') {
                isActive = true;
            } else if (currentPage.includes('profile.html') && href === 'profile.html') {
                isActive = true;
            } else if (href === currentHash && currentHash) {
                isActive = true;
            } else if (!currentHash && href === '#home') {
                isActive = true;
            }

            item.classList.toggle('active', isActive);
        });
    };

    // Dastlabki holat
    updateActiveNav();

    // Hash o'zgarishi bilan yangilash
    window.addEventListener('hashchange', updateActiveNav);

    // Page load bilan yangilash
    window.addEventListener('load', updateActiveNav);
}

// Touch-friendly adjustments
function initTouchOptimizations() {
    // Barmoq bilan bosish maydoni kengaytirish
    const buttons = document.querySelectorAll('button, a[role="button"]');

    buttons.forEach(button => {
        // Minimal touch target size 48x48px
        const rect = button.getBoundingClientRect();
        if (rect.width < 48 || rect.height < 48) {
            button.style.minWidth = '48px';
            button.style.minHeight = '48px';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
        }
    });

    // Hover effektlarini o'chirish (touch devices uchun)
    if (window.matchMedia('(hover: none)').matches) {
        document.body.style.setProperty('--transition-fast', '0.1s ease');
    }
}

// Smooth scroll behavior optimization
function initSmoothScrollOptimization() {
    // Scroll padding top - header uchun
    const header = document.querySelector('.header');
    if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.scrollPaddingTop = (headerHeight + 10) + 'px';
    }
}

// Initialize all mobile UX features
function initMobileUX() {
    // Faqat mobil qurilmalarda ishlatish
    if (window.innerWidth > 768) return;

    initStickyBuyButton();
    initScrollToTop();
    initMobileNavigation();
    initTouchOptimizations();
    initSmoothScrollOptimization();
}

// DOMContentLoaded bo'lganda ishga tushirish
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileUX);
} else {
    initMobileUX();
}

// Resize bo'lganda qayta tekshirish
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        initMobileUX();
    }
});
