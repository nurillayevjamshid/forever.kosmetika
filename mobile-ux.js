// ================================
// MOBILE UX OPTIMIZATION SCRIPT
// Conversion-focused mobile experience
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileUX();
});

function initializeMobileUX() {
    // Mobile Navigation
    setupMobileNavigation();
    
    // Sticky CTA Elements
    setupStickyElements();
    
    // Toast Notifications
    setupToastNotifications();
    
    // Mobile Optimizations
    setupMobileOptimizations();
    
    // Performance Optimizations
    setupPerformanceOptimizations();
}

// ================================
// MOBILE NAVIGATION
// ================================
function setupMobileNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const header = document.querySelector('.header');
    
    if (!menuToggle || !navMenuWrapper) return;
    
    // Create mobile menu overlay
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.className = 'mobile-menu-overlay';
    mobileMenuOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        z-index: 998;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    // Create mobile menu panel
    const mobileMenuPanel = document.createElement('div');
    mobileMenuPanel.className = 'mobile-menu-panel';
    mobileMenuPanel.innerHTML = `
        <div class="mobile-menu-header">
            <div class="mobile-menu-logo">
                <span class="logo-text">For.Ever</span>
            </div>
            <button class="mobile-menu-close" id="mobileMenuClose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <nav class="mobile-nav">
            <a href="#home" class="mobile-nav-link active">Bosh sahifa</a>
            <a href="#products" class="mobile-nav-link">Mahsulotlar</a>
            <a href="#about" class="mobile-nav-link">Biz haqimizda</a>
            <a href="#contact" class="mobile-nav-link">Bog'lanish</a>
        </nav>
        <div class="mobile-menu-footer">
            <div class="mobile-menu-actions">
                <a href="cart.html" class="mobile-menu-action">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
                        <path d="M3 6h18"></path>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Savat
                    <span class="cart-count">0</span>
                </a>
                <a href="wishlist.html" class="mobile-menu-action">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Sevimlilar
                </a>
                <a href="profile.html" class="mobile-menu-action">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profil
                </a>
            </div>
        </div>
    `;
    
    // Add styles for mobile menu
    const mobileMenuStyles = document.createElement('style');
    mobileMenuStyles.textContent = `
        .mobile-menu-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .mobile-menu-panel {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 320px;
            height: 100%;
            background: white;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
            z-index: 999;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .mobile-menu-panel.active {
            right: 0;
        }
        
        .mobile-menu-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(108, 59, 255, 0.1);
            background: rgba(248, 244, 240, 0.5);
        }
        
        .mobile-menu-logo .logo-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .mobile-menu-close {
            width: 44px;
            height: 44px;
            border: none;
            background: rgba(108, 59, 255, 0.1);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .mobile-menu-close:hover {
            background: rgba(108, 59, 255, 0.2);
            transform: scale(1.05);
        }
        
        .mobile-nav {
            flex: 1;
            padding: 20px 0;
        }
        
        .mobile-nav-link {
            display: block;
            padding: 16px 20px;
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 500;
            font-size: 1rem;
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
        }
        
        .mobile-nav-link:hover {
            background: rgba(108, 59, 255, 0.05);
            color: var(--accent-color);
            border-left-color: var(--accent-color);
        }
        
        .mobile-nav-link.active {
            background: rgba(108, 59, 255, 0.1);
            color: var(--accent-color);
            border-left-color: var(--accent-color);
            font-weight: 600;
        }
        
        .mobile-menu-footer {
            padding: 20px;
            border-top: 1px solid rgba(108, 59, 255, 0.1);
            background: rgba(248, 244, 240, 0.3);
        }
        
        .mobile-menu-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .mobile-menu-action {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: white;
            border: 1px solid rgba(108, 59, 255, 0.1);
            border-radius: 12px;
            text-decoration: none;
            color: var(--text-primary);
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .mobile-menu-action:hover {
            background: rgba(108, 59, 255, 0.05);
            border-color: var(--accent-color);
            color: var(--accent-color);
            transform: translateX(4px);
        }
        
        .mobile-menu-action .cart-count {
            margin-left: auto;
            background: var(--accent-color);
            color: white;
            font-size: 0.7rem;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 50%;
            min-width: 18px;
            text-align: center;
        }
        
        @media (max-width: 480px) {
            .mobile-menu-panel {
                width: 85%;
                max-width: 280px;
            }
        }
    `;
    
    document.head.appendChild(mobileMenuStyles);
    document.body.appendChild(mobileMenuOverlay);
    document.body.appendChild(mobileMenuPanel);
    
    // Menu toggle functionality
    menuToggle.addEventListener('click', function() {
        mobileMenuOverlay.classList.add('active');
        mobileMenuPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close menu functionality
    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('active');
        mobileMenuPanel.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking on nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            mobileNavLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            // Close menu
            closeMobileMenu();
        });
    });
    
    // Update mobile menu active state based on scroll
    updateMobileNavActive();
    window.addEventListener('scroll', updateMobileNavActive);
}

// ================================
// STICKY ELEMENTS
// ================================
function setupStickyElements() {
    setupStickyBuyButton();
    setupStickyCTABar();
    setupScrollToTop();
}

function setupStickyBuyButton() {
    const stickyBuyButton = document.getElementById('stickyBuyButton');
    const stickyBuyBtn = document.getElementById('stickyBuyBtn');
    
    if (!stickyBuyButton || !stickyBuyBtn) return;
    
    // Show/hide sticky buy button based on scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        const productsSection = document.getElementById('products');
        
        if (productsSection) {
            const productsRect = productsSection.getBoundingClientRect();
            const isInProductsSection = productsRect.top <= 100 && productsRect.bottom >= 100;
            
            if (isInProductsSection && currentScrollY > 200) {
                stickyBuyButton.style.display = 'block';
            } else {
                stickyBuyButton.style.display = 'none';
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Sticky buy button click handler
    stickyBuyBtn.addEventListener('click', function() {
        // Scroll to products section
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function setupStickyCTABar() {
    // Create sticky CTA bar for product detail
    const existingBar = document.querySelector('.sticky-cta-bar');
    if (existingBar) return;
    
    const stickyCTABar = document.createElement('div');
    stickyCTABar.className = 'sticky-cta-bar';
    stickyCTABar.innerHTML = `
        <div class="sticky-cta-content">
            <div class="sticky-cta-info">
                <div class="sticky-product-name">Mahsulot nomi</div>
                <div class="sticky-product-price">0 so'm</div>
            </div>
            <div class="sticky-cta-actions">
                <button class="sticky-qty-btn" id="stickyQtyMinus">-</button>
                <div class="sticky-qty-display" id="stickyQtyDisplay">1</div>
                <button class="sticky-qty-btn" id="stickyQtyPlus">+</button>
                <button class="sticky-add-cart" id="stickyAddCart">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Savatga qo'shish
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(stickyCTABar);
    
    // Initially hide the sticky bar
    stickyCTABar.style.display = 'none';
    
    // Quantity controls
    let stickyQty = 1;
    const stickyQtyMinus = document.getElementById('stickyQtyMinus');
    const stickyQtyPlus = document.getElementById('stickyQtyPlus');
    const stickyQtyDisplay = document.getElementById('stickyQtyDisplay');
    const stickyAddCart = document.getElementById('stickyAddCart');
    
    if (stickyQtyMinus && stickyQtyPlus && stickyQtyDisplay) {
        stickyQtyMinus.addEventListener('click', function() {
            if (stickyQty > 1) {
                stickyQty--;
                stickyQtyDisplay.textContent = stickyQty;
            }
        });
        
        stickyQtyPlus.addEventListener('click', function() {
            if (stickyQty < 10) {
                stickyQty++;
                stickyQtyDisplay.textContent = stickyQty;
            }
        });
    }
}

function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (!scrollToTopBtn) return;
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================
// TOAST NOTIFICATIONS
// ================================
function setupToastNotifications() {
    // Create toast container
    const existingContainer = document.querySelector('.toast-container');
    if (existingContainer) return;
    
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // Make toast function globally available
    window.showToast = function(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '!';
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));
        
        // Auto remove
        setTimeout(() => removeToast(toast), duration);
    };
    
    function removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// ================================
// MOBILE OPTIMIZATIONS
// ================================
function setupMobileOptimizations() {
    // Touch-friendly interactions
    setupTouchOptimizations();
    
    // Mobile bottom navigation active states
    setupBottomNavActive();
    
    // Product card optimizations
    setupProductCardOptimizations();
    
    // Form optimizations
    setupFormOptimizations();
}

function setupTouchOptimizations() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .add-cart-new-btn, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.touches[0].clientX - rect.left - size / 2;
            const y = e.touches[0].clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function setupBottomNavActive() {
    const navItems = document.querySelectorAll('.nav-item');
    
    function updateBottomNavActive() {
        const sections = ['home', 'products', 'about', 'contact'];
        
        let currentSection = '';
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = sectionId;
                }
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateBottomNavActive);
    
    // Update on load
    updateBottomNavActive();
}

function setupProductCardOptimizations() {
    // Add haptic feedback simulation for mobile
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

function setupFormOptimizations() {
    // Auto-focus on mobile inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Scroll input into view on mobile
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
}

// ================================
// PERFORMANCE OPTIMIZATIONS
// ================================
function setupPerformanceOptimizations() {
    // Lazy loading for images
    setupLazyLoading();
    
    // Smooth scroll behavior
    setupSmoothScroll();
    
    // Debounce scroll events
    setupDebouncedScroll();
}

function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

function setupSmoothScroll() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupDebouncedScroll() {
    let ticking = false;
    
    function updateOnScroll() {
        // Update scroll-based elements
        updateMobileNavActive();
        updateBottomNavActive();
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// ================================
// UTILITY FUNCTIONS
// ================================

// Update cart count globally
function updateCartCount(count) {
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = count;
        if (count > 0) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// Update favorite count globally
function updateFavoriteCount(count) {
    const favoriteCounts = document.querySelectorAll('.favorite-count');
    favoriteCounts.forEach(element => {
        element.textContent = count;
        if (count > 0) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// Show loading state
function showLoading(element) {
    if (!element) return;
    
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    
    element.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Yuklanmoqda...</span>
    `;
    element.disabled = true;
}

// Hide loading state
function hideLoading(element) {
    if (!element || !element.dataset.originalContent) return;
    
    element.innerHTML = element.dataset.originalContent;
    element.disabled = false;
    delete element.dataset.originalContent;
}

// Mobile detection
function isMobile() {
    return window.innerWidth <= 768;
}

// Touch detection
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Export functions for global use
window.MobileUX = {
    updateCartCount,
    updateFavoriteCount,
    showLoading,
    hideLoading,
    isMobile,
    isTouchDevice
};
