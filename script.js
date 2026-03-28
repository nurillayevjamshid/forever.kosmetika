// ================================

// PRODUCT DATA & MANAGEMENT

// ================================

// Mahsulotlar ro'yxati (Firebase'dan yuklanadi)

let products = [];

// Mahsulot rasmlari slider holati
const productImageState = new Map();
let modalImageState = null;

// Firebase ulangan yoki yo'qligini tekshirish

const isFirebaseReady = typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0;

// Default mahsulotlar olib tashlandi (Faqat CRM dan keladi)

const defaultProducts = [];

// Cart state

let cart = JSON.parse(localStorage.getItem('cart')) || [];
// Wishlist modulidan olish (wishlist-module.js loaded bo'lishi kerak)
let wishlist = (typeof Wishlist !== 'undefined') ? Wishlist.getIds() : (JSON.parse(localStorage.getItem('wishlistItems')) || []).map(w => w.id || w);

// Viloyatlar va Tumanlar ma'lumotlari

const tumanlarData = {

    "Toshkent shahri": ["Olmazor tumani", "Bektemir tumani", "Mirobod tumani", "Mirzo Ulug'bek tumani", "Sergeli tumani", "Uchtepa tumani", "Chilonzor tumani", "Shayxontohur tumani", "Yunusobod tumani", "Yakkasaroy tumani", "Yashnobod tumani", "Yangihayot tumani"],

    "Toshkent viloyati": ["Angren shahri", "Olmaliq shahri", "Nurafshon shahri", "Ohangaron tumani", "Bekobod tumani", "Bo'stonliq tumani", "Bo'ka tumani", "Chinoz tumani", "Qibray tumani", "Parkent tumani", "Piskent tumani", "Quyi Chirchiq tumani", "O'rta Chirchiq tumani", "Yuqori Chirchiq tumani", "Zangiota tumani", "Yangiyo'l tumani", "Toshkent tumani"],

    "Andijon": ["Andijon shahri", "Andijon tumani", "Asaka tumani", "Baliqchi tumani", "Bo'ston tumani", "Buloqboshi tumani", "Izboskan tumani", "Jalaquduq tumani", "Marhamat tumani", "Oltinko'l tumani", "Paxtaobod tumani", "Qo'rg'ontepa tumani", "Shahrixon tumani", "Ulug'nor tumani", "Xo'jaobod tumani"],

    "Buxoro": ["Buxoro shahri", "Buxoro tumani", "G'ijduvon tumani", "Jondor tumani", "Kogon tumani", "Olot tumani", "Peshku tumani", "Qorako'l tumani", "Qorovulbozor tumani", "Romitan tumani", "Shofirkon tumani", "Vobkent tumani"],

    "Farg'ona": ["Farg'ona shahri", "Marg'ilon shahri", "Qo'qon shahri", "Quva tumani", "Beshariq tumani", "Bag'dod tumani", "Buvayda tumani", "Dang'ara tumani", "Furqat tumani", "Oltiariq tumani", "Rishton tumani", "So'x tumani", "Toshloq tumani", "Uchko'prik tumani", "O'zbekiston tumani", "Yozyovon tumani"],

    "Jizzax": ["Jizzax shahri", "Arnasoy tumani", "Baxmal tumani", "Do'stlik tumani", "Forish tumani", "G'allaorol tumani", "Sharof Rashidov tumani", "Mirzachul tumani", "Paxtakor tumani", "Yangiobod tumani", "Zafarobod tumani", "Zamin tumani", "Zarbdor tumani"],

    "Xorazm": ["Urganch shahri", "Urganch tumani", "Bog'ot tumani", "Gurlan tumani", "Xonqa tumani", "Xazoraap tumani", "Xiva tumani", "Qo'shko'pir tumani", "Shovot tumani", "Yangiariq tumani", "Yangibozor tumani", "Tuproqqal'a tumani"],

    "Namangan": ["Namangan shahri", "Namangan tumani", "Chortoq tumani", "Chust tumani", "Kosonsoy tumani", "Mingbuloq tumani", "Norin tumani", "Pop tumani", "To'raqo'rg'on tumani", "Uychi tumani", "Uychi tumani", "Yangiqo'rg'on tumani"],

    "Navoiy": ["Navoiy shahri", "Zarafshon shahri", "Konimex tumani", "Karmana tumani", "Qiziltepa tumani", "Navbahor tumani", "Nurota tumani", "Tomdi tumani", "Uchkuduk tumani", "Xatirchi tumani"],

    "Qashqadaryo": ["Qarshi shahri", "Qarshi tumani", "Dehqonobod tumani", "G'uzor tumani", "Kasbi tumani", "Kitob tumani", "Koson tumani", "Mirishkor tumani", "Muborak tumani", "Nishon tumani", "Shahrisabz shahri", "Shahrisabz tumani", "Chiroqchi tumani", "Yakkabog' tumani", "Qamashi tumani"],

    "Qoraqalpog'iston": ["Nukus shahri", "Amudaryo tumani", "Beruniy tumani", "Chimboy tumani", "Ellikqala tumani", "Kegeyli tumani", "Mo'ynoq tumani", "Nukus tumani", "Qonliko'l tumani", "Qo'ng'irot tumani", "Qorao'zak tumani", "Shumanay tumani", "Taxtako'pir tumani", "To'rtko'l tumani", "Xo'jayli tumani", "Taxiatosh shahri"],

    "Samarqand": ["Samarqand shahri", "Samarqand tumani", "Bulung'ur tumani", "Ishtixon tumani", "Jomboy tumani", "Kattaqo'rg'on shahri", "Kattaqo'rg'on tumani", "Narpay tumani", "Nurobod tumani", "Oqdaryo tumani", "Paxtachi tumani", "Payariq tumani", "Pastdarg'om tumani", "Toyloq tumani", "Urgut tumani", "Qo'shrabot tumani"],

    "Sirdaryo": ["Guliston shahri", "Guliston tumani", "Boyovut tumani", "Oqoltin tumani", "Sardoba tumani", "Sayxunobod tumani", "Sirdaryo tumani", "Xovos tumani", "Mirzaobod tumani", "Shirin shahri", "Yangiyer shahri"],

    "Surxondaryo": ["Termiz shahri", "Termiz tumani", "Angor tumani", "Boysun tumani", "Denov tumani", "Jarqo'rg'on tumani", "Muzrabot tumani", "Oltinsoy tumani", "Qiziriq tumani", "Qumqo'rg'on tumani", "Sariosiyo tumani", "Sherobod tumani", "Sho'rchi tumani", "Uzun tumani"]

};

// ================================

// INITIALIZATION

// ================================

document.addEventListener('DOMContentLoaded', async function () {

    // Initialize navigation

    initNavigation();

    // Firebase'dan mahsulotlarni yuklash

    await loadProducts();

    // Initialize filters

    initFilters();

    // Initialize category cards

    initCategories();

    // Initialize contact form

    initContactForm();

    // Initialize search with dropdown
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
        const searchWrapper = searchInput.closest('.search-wrapper');

        // Dropdown yaratish
        let dropdown = searchWrapper?.querySelector('.search-dropdown');
        if (!dropdown && searchWrapper) {
            dropdown = document.createElement('div');
            dropdown.className = 'search-dropdown';
            searchWrapper.appendChild(dropdown);
        }

        let searchTimeout = null;
        let lastSearchTerm = '';

        function renderSearchResults(results, term) {
            if (!dropdown) return;
            if (results.length === 0 && term.length > 1) {
                dropdown.innerHTML = `
                    <div class="search-no-results">
                        <span class="search-no-results-icon">🔍</span>
                        "${term}" bo'yicha mahsulot topilmadi
                    </div>
                `;
                dropdown.classList.add('active');
                return;
            }
            if (results.length === 0) {
                dropdown.classList.remove('active');
                return;
            }

            const fallback = 'assets/logo.png';
            let html = `<div class="search-dropdown-header">${results.length} ta mahsulot topildi</div>`;
            results.slice(0, 8).forEach(p => {
                const img = p.imageUrl || p.image || fallback;
                const price = formatPrice(p.price);
                const targetUrl = isIndexPage ? `#product-card-${p.id}` : `index.html#product-card-${p.id}`;
                html += `
                    <a href="${targetUrl}" class="search-result-item" data-product-id="${p.id}" onclick="handleSearchResultClick(event, '${p.id}')">
                        <img src="${img}" alt="${p.name}" class="search-result-img" onerror="this.src='${fallback}'">
                        <div class="search-result-info">
                            <div class="search-result-name">${p.name}</div>
                            <div class="search-result-category">${p.category || ''}</div>
                        </div>
                        <div class="search-result-price">${price} so'm</div>
                        <svg class="search-result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </a>
                `;
            });
            dropdown.innerHTML = html;
            dropdown.classList.add('active');
        }

        function searchProducts(term) {
            if (!term || term.length < 2) {
                if (dropdown) dropdown.classList.remove('active');
                return;
            }

            const lowerTerm = term.toLowerCase();
            let results = [];

            if (typeof products !== 'undefined' && products.length > 0) {
                results = products.filter(p =>
                    (p.name || '').toLowerCase().includes(lowerTerm) ||
                    (p.category || '').toLowerCase().includes(lowerTerm) ||
                    (p.description || '').toLowerCase().includes(lowerTerm) ||
                    (p.brand || '').toLowerCase().includes(lowerTerm)
                );
            }

            renderSearchResults(results, term);
        }

        // Search result click handler
        window.handleSearchResultClick = function(e, productId) {
            e.preventDefault();
            if (dropdown) dropdown.classList.remove('active');
            searchInput.value = '';

            if (isIndexPage) {
                const card = document.getElementById(`product-card-${productId}`);
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.transition = 'box-shadow 0.3s, transform 0.3s';
                    card.style.boxShadow = '0 0 0 3px rgba(226, 158, 125, 0.5)';
                    card.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        card.style.boxShadow = '';
                        card.style.transform = '';
                    }, 2000);
                }
            } else {
                window.location.href = 'index.html#product-card-' + productId;
            }
        };

        // Input event — real-time search
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();

            if (isIndexPage && typeof displayProducts === 'function') {
                if (searchTerm.length > 1) {
                    displayProducts('search:' + searchTerm.toLowerCase());
                } else if (searchTerm.length === 0) {
                    displayProducts('all');
                }
            }

            // Dropdown search with debounce
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts(searchTerm);
            }, 200);
        });

        // Focus — agar matn bor bo'lsa dropdown ochish
        searchInput.addEventListener('focus', () => {
            const term = searchInput.value.trim();
            if (term.length >= 2) {
                searchProducts(term);
            }
        });

        // Tashqariga bosilganda yopish
        document.addEventListener('click', (e) => {
            if (searchWrapper && !searchWrapper.contains(e.target)) {
                if (dropdown) dropdown.classList.remove('active');
            }
        });

        // Enter — page ga yo'naltirish
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (dropdown) dropdown.classList.remove('active');
                const term = searchInput.value.trim();
                if (term.length > 0) {
                    if (isIndexPage && typeof displayProducts === 'function') {
                        displayProducts('search:' + term.toLowerCase());
                    } else {
                        window.location.href = 'index.html?search=' + encodeURIComponent(term);
                    }
                }
            }
            if (e.key === 'Escape') {
                if (dropdown) dropdown.classList.remove('active');
                searchInput.blur();
            }
        });

        // Search icon click
        const searchTrigger = searchWrapper?.querySelector('.search-trigger');
        if (searchTrigger) {
            searchTrigger.addEventListener('click', () => {
                const term = searchInput.value.trim();
                if (term.length > 0) {
                    if (dropdown) dropdown.classList.remove('active');
                    if (!isIndexPage) {
                        window.location.href = 'index.html?search=' + encodeURIComponent(term);
                    }
                }
            });
        }
    }

    // Initialize custom selects (viloyat/tuman)
    initCustomSelects();

    // Update cart count

    updateCartCount();

    // Update wishlist icons
    updateWishlistUI();

    // Initialize favorite filter buttons
    const mobileFavoriteBtn = document.getElementById('mobileFavoriteBtn');
    if (mobileFavoriteBtn) {
        mobileFavoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            displayProducts('favorites');
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Smooth scroll for links

    initSmoothScroll();

    // Header scroll effect

    initHeaderScroll();

    // Premium hero showcase

    initHeroShowcase();

    // Firebase real-time listener (agar Firebase ulangan bo'lsa)
    if (isFirebaseReady && typeof firebaseListenProducts === 'function') {
        firebaseListenProducts((updatedProducts) => {
            products = updatedProducts;
            // LocalStorage ga zaxira saqlash
            try { localStorage.setItem('products', JSON.stringify(products)); } catch(e) {}
            // Hozirgi filterni saqlash
            const activeFilter = document.querySelector('.filter-btn.active');
            const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
            displayProducts(currentFilter);
        });
    }

    // Product image slider navigation on cards
    document.addEventListener('click', (event) => {
        const navBtn = event.target.closest('.image-nav');
        if (!navBtn) return;
        const pid = navBtn.dataset.pid;
        if (!pid) return;
        event.stopPropagation();
        event.preventDefault();
        const dir = parseInt(navBtn.dataset.dir || '0', 10);
        if (dir) changeProductImage(pid, dir);
    }, true);

    // Modal image navigation
    const detailPrev = document.getElementById('detailPrev');
    const detailNext = document.getElementById('detailNext');
    if (detailPrev) {
        detailPrev.addEventListener('click', (event) => {
            event.stopPropagation();
            changeModalImage(-1);
        });
    }
    if (detailNext) {
        detailNext.addEventListener('click', (event) => {
            event.stopPropagation();
            changeModalImage(1);
        });
    }

    // CRM dan qaytganda yoki tab qayta aktiv bo'lganda yangilash
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            loadProducts();
        }
    });

    // URL hash orqali mahsulotga scroll qilish
    function scrollToHashProduct() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#product-card-')) {
            setTimeout(() => {
                const card = document.querySelector(hash);
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.transition = 'box-shadow 0.3s, transform 0.3s';
                    card.style.boxShadow = '0 0 0 3px rgba(226, 158, 125, 0.5)';
                    card.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        card.style.boxShadow = '';
                        card.style.transform = '';
                    }, 2500);
                }
            }, 800);
        }
    }
    scrollToHashProduct();
    window.addEventListener('hashchange', scrollToHashProduct);

});

// ================================
// CUSTOM SELECTS (VILOYAT/TUMAN)
// ================================
// Custom select document-level handlers — faqat bir marta o'rnatiladi
let _customSelectDocHandlersAttached = false;

function initCustomSelects() {
    const wrappers = document.querySelectorAll('.custom-select');
    if (!wrappers.length) return;

    wrappers.forEach(wrapper => {
        const select = wrapper.querySelector('select');
        const trigger = wrapper.querySelector('.custom-select-trigger');
        if (!select || !trigger) return;

        buildCustomSelectOptions(select);
        syncCustomSelectState(select);
    });

    // Document-level click handler — faqat bir marta o'rnatiladi
    if (!_customSelectDocHandlersAttached) {
        _customSelectDocHandlersAttached = true;

        // Trigger clicklar uchun event delegation
        document.addEventListener('click', (event) => {
            const trigger = event.target.closest('.custom-select-trigger');
            if (trigger) {
                const wrapper = trigger.closest('.custom-select');
                if (!wrapper) return;
                const select = wrapper.querySelector('select');
                if (!select || select.disabled) return;
                const isOpen = wrapper.classList.contains('is-open');
                closeAllCustomSelects();
                if (!isOpen) {
                    wrapper.classList.add('is-open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
                event.stopPropagation();
                return;
            }

            // Option clicklar uchun event delegation
            const optionBtn = event.target.closest('.custom-select-option');
            if (optionBtn) {
                const wrapper = optionBtn.closest('.custom-select');
                if (!wrapper) return;
                const select = wrapper.querySelector('select');
                if (!select) return;
                const value = optionBtn.dataset.value;
                if (value !== undefined) {
                    select.value = value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    syncCustomSelectState(select);
                }
                closeAllCustomSelects();
                event.stopPropagation();
                return;
            }

            // Tashqariga bosilganda barcha selectlarni yopish
            if (!event.target.closest('.custom-select')) {
                closeAllCustomSelects();
            }
        });
    }
}

function closeAllCustomSelects() {
    document.querySelectorAll('.custom-select.is-open').forEach(wrapper => {
        wrapper.classList.remove('is-open');
        const trigger = wrapper.querySelector('.custom-select-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
}

function buildCustomSelectOptions(selectEl) {
    const wrapper = selectEl.closest('.custom-select');
    if (!wrapper) return;
    const panel = wrapper.querySelector('.custom-select-panel');
    if (!panel) return;

    panel.innerHTML = '';

    const isViloyat = selectEl.id.toLowerCase().includes('viloyat');

    const options = Array.from(selectEl.options).filter(opt => !opt.disabled || opt.value);
    options.forEach(opt => {
        if (!opt.value && opt.disabled) return;
        const optionBtn = document.createElement('button');
        optionBtn.type = 'button';
        optionBtn.className = 'custom-select-option' + (isViloyat ? ' is-viloyat' : '');
        optionBtn.setAttribute('role', 'option');
        optionBtn.dataset.value = opt.value;

        const iconHtml = isViloyat
            ? `
                <span class="option-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </span>
            `
            : `
                <span class="option-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                    </svg>
                </span>
            `;

        optionBtn.innerHTML = `
            ${iconHtml}
            <span class="option-text">${opt.textContent}</span>
        `;
        // Event delegation orqali ishlaydi — alohida listener kerak emas
        panel.appendChild(optionBtn);
    });
}

function syncCustomSelectState(selectEl) {
    const wrapper = selectEl.closest('.custom-select');
    if (!wrapper) return;
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const valueEl = wrapper.querySelector('.custom-select-value');
    const isViloyat = selectEl.id.toLowerCase().includes('viloyat');
    const panel = wrapper.querySelector('.custom-select-panel');
    const placeholder = wrapper.getAttribute('data-placeholder') || 'Tanlang...';

    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const hasValue = selectedOption && !selectedOption.disabled && selectedOption.value;
    if (valueEl) {
        if (hasValue) {
            if (isViloyat) {
                valueEl.innerHTML = `
                    <span class="option-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </span>
                    <span class="option-text">${selectedOption.textContent}</span>
                `;
            } else {
                valueEl.innerHTML = `
                    <span class="option-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                        </svg>
                    </span>
                    <span class="option-text">${selectedOption.textContent}</span>
                `;
            }
        } else {
            valueEl.textContent = placeholder;
        }
    }

    if (trigger) {
        trigger.disabled = selectEl.disabled;
        trigger.setAttribute('aria-disabled', selectEl.disabled ? 'true' : 'false');
    }

    if (panel) {
        panel.querySelectorAll('.custom-select-option').forEach(opt => {
            opt.classList.toggle('is-selected', opt.dataset.value === selectEl.value);
        });
    }
}

// ================================

// MAHSULOTLARNI YUKLASH

// ================================

async function loadProducts() {
    const activeFilter = document.querySelector('.filter-btn.active');
    const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    const grid = document.getElementById('productsGrid');

    // Loading spinner ko'rsatish
    if (grid) {
        grid.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Mahsulotlar yuklanmoqda...</p></div>';
    }

    if (isFirebaseReady && typeof firebaseGetProducts === 'function') {
        try {
            const loadedProducts = await firebaseGetProducts();
            products = loadedProducts;
            console.log(`✅ ${products.length} ta mahsulot yuklandi (Firebase)`);
            // LocalStorage ga zaxira saqlash
            try { localStorage.setItem('products', JSON.stringify(products)); } catch(e) {}
        } catch (error) {
            console.error('Firebase xatolik:', error);
            // Offline/timeout bo'lsa localStorage dan yuklash
            const cached = localStorage.getItem('products');
            if (cached) {
                try {
                    products = JSON.parse(cached);
                    console.log(`📦 ${products.length} ta mahsulot local keshdan yuklandi`);
                } catch (e) {
                    products = [];
                }
            } else {
                products = [];
            }
        }
    } else {
        console.log('⚠️ Firebase ulanmagan, localStorage dan yuklanmoqda');
        const cached = localStorage.getItem('products');
        if (cached) {
            try {
                products = JSON.parse(cached);
                console.log(`📦 ${products.length} ta mahsulot local keshdan yuklandi`);
            } catch (e) {
                products = [];
            }
        } else {
            products = [];
        }
    }

    // Mahsulotlarni ko'rsatish
    if (grid) {
        displayProducts(currentFilter);
    }
}

// ================================

// NAVIGATION

// ================================

function initNavigation() {

    const menuToggle = document.getElementById('menuToggle');

    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {

        menuToggle.addEventListener('click', () => {

            navMenu.classList.toggle('active');

        });

    }

    // Active link highlighting for desktop

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {

        link.addEventListener('click', function () {

            navLinks.forEach(l => l.classList.remove('active'));

            this.classList.add('active');

        });

    });

    // Active link highlighting for mobile bottom nav

    const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');

    mobileNavItems.forEach(item => {

        item.addEventListener('click', function () {

            // Remove active from all

            mobileNavItems.forEach(nav => nav.classList.remove('active'));

            // Add active to clicked (unless it's cart, cart has its own visual state or doesn't change active tab)

            if (!this.classList.contains('cart-btn-mobile')) {

                this.classList.add('active');

            }

        });

    });

}

// ================================

// PRODUCTS DISPLAY

// ================================

/**
 * Mahsulotlarni ko'rsatish — optimallashtirilgan
 * DocumentFragment + CSS staggered animation + lazy loading
 */
function displayProducts(filter = 'all') {
    // Wishlist ni moduldan sinxronlash
    wishlist = Wishlist.getIds();

    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    // 1) Filter
    const filtered = _filterProducts(filter);

    // 2) Tozalash (bir marta)
    grid.innerHTML = '';

    // 3) Empty state
    if (!filtered.length) {
        const msg = filter === 'favorites'
            ? '💔 Sevimlilar ro\'yxati bo\'sh — yurakcha bosib qo\'shing'
            : '🔍 Bu kategoriyada mahsulot topilmadi';
        grid.innerHTML = `<div class="empty-state"><span class="empty-icon">✨</span><p>${msg}</p></div>`;
        return;
    }

    // 4) Fragment bilan render — bitta reflow
    const fragment = document.createDocumentFragment();
    filtered.forEach((product, i) => {
        const card = createProductCard(product);
        // CSS animation-delay (setTimeout yo'q!)
        card.style.animationDelay = (i * 0.04) + 's';
        fragment.appendChild(card);
    });
    grid.appendChild(fragment); // bitta DOM op
}

/**
 * Mahsulotni filterlash — ajratilgan funksiya
 */
function _filterProducts(filter) {
    if (!filter || filter === 'all') return products;

    if (typeof filter === 'string' && filter.startsWith('search:')) {
        const term = filter.slice(7).toLowerCase();
        return products.filter(p =>
            (p.name || '').toLowerCase().includes(term) ||
            (p.description || '').toLowerCase().includes(term) ||
            (p.category || '').toLowerCase().includes(term)
        );
    }

    if (filter === 'favorites') {
        return products.filter(p => wishlist.includes(p.id.toString()));
    }

    const f = filter.toLowerCase();
    return products.filter(p => {
        const cat = (p.category || '').toLowerCase();
        if (f === 'soch' && cat.includes('soch')) return true;
        if (f === 'yuz kremi' && cat.includes('yuz kremi')) return true;
        if (f === 'parvarish' && (cat.includes('tana') || cat.includes('parvarish'))) return true;
        if (f === 'atir' && (cat.includes('atir') || cat.includes('parfyumeriya'))) return true;
        if (f === 'kosmetika' && cat.includes('kosmetika')) return true;
        return cat === f;
    });
}

/**
 * Product card yaratish — optimallashtirilgan
 * - loading="lazy" rasmlar uchun
 * - isFavorite marta hisoblash (har bir card uchun emas)
 * - single innerHTML
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.id = `product-card-${product.id}`;

    const state = ensureProductImageState(product);
    const fallback = getProductFallbackImage(product);
    const initialImage = state.images[state.index] || state.images[0] || product.imageUrl || product.image || fallback;
    const showNav = state.images.length > 1;
    const isFav = wishlist.includes(product.id.toString());
    const discount = getActiveDiscountForProduct(product);

    // Narx HTML
    let priceHTML;
    let badgeHTML = '';
    if (discount) {
        priceHTML = `<div style="display:flex;flex-direction:column;gap:0;margin-bottom:0">
            <div class="current-price" style="display:flex;align-items:center;gap:4px;color:var(--text-light);font-size:0.8rem;opacity:0.8;text-decoration:line-through">${formatPrice(product.price)} so'm <span style="font-size:0.7em;background:#eee;padding:1px 5px;border-radius:4px;color:#777;font-weight:500">asl narxi</span></div>
            <div class="current-price" style="color:var(--accent-color);font-weight:800;font-size:1.15rem">${formatPrice(discount.price)} so'm <span style="font-size:0.6em;background:rgba(255,61,87,0.1);color:#ff3d57;padding:2px 6px;border-radius:4px;margin-left:2px;font-weight:700;text-transform:uppercase">chegirmada</span></div>
        </div>`;
        badgeHTML = `<div style="position:absolute;top:10px;left:10px;background:linear-gradient(135deg,#ff3d57,#ff8a80);color:white;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:800;z-index:2;display:flex;align-items:center;gap:4px;box-shadow:0 4px 10px rgba(255,61,87,0.3)">-${discount.percent}%</div>`;
    } else {
        priceHTML = `<div class="current-price">${formatPrice(product.price)} so'm</div>`;
    }

    const brandHTML = product.brand
        ? product.brand
        : '<span style="width:40px;height:1.5px;background:#eef2f6;display:inline-block;border-radius:10px;opacity:0.8"></span>';

    card.innerHTML =
        `<div class="product-click-area" onclick="openProductDetailModal('${product.id}')" style="position:relative">` +
            badgeHTML +
            `<div class="product-image">` +
                `<img loading="lazy" src="${initialImage}" alt="${product.name}" data-fallback="${fallback}" onerror="this.src='${fallback}'">` +
                `<button class="image-nav prev" data-pid="${product.id}" data-dir="-1" aria-label="Oldingi rasm" style="display:${showNav ? 'flex' : 'none'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>` +
                `<button class="image-nav next" data-pid="${product.id}" data-dir="1" aria-label="Keyingi rasm" style="display:${showNav ? 'flex' : 'none'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>` +
            `</div>` +
            `<button class="favorite-btn${isFav ? ' active' : ''}" onclick="toggleWishlist(event,'${product.id}')" id="wishlist-btn-${product.id}">` +
                `<svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>` +
            `</button>` +
            `<div class="product-info">` +
                `<h3 class="product-name">${product.name}</h3>` +
                priceHTML +
                `<div class="product-brand" style="font-size:0.8rem;color:var(--text-light);font-weight:500;display:flex;align-items:center;gap:4px;margin-top:6px;min-height:1.2rem"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>${brandHTML}</div>` +
            `</div>` +
        `</div>` +
        `<div class="product-footer-container"><div class="product-footer" id="footer-${product.id}">${getProductFooterHTML(product)}</div></div>`;

    return card;
}

function getProductFooterHTML(product) {

    const cartItem = cart.find(item => item.id.toString() === product.id.toString());

    if (cartItem) {
        return `
            <div class="qty-counter-uzum">
                <button class="qty-btn" onclick="event.stopPropagation(); changeQuantity('${product.id}', -1)">-</button>
                <span class="qty-display">${cartItem.quantity}</span>
                <button class="qty-btn" onclick="event.stopPropagation(); changeQuantity('${product.id}', 1)">+</button>
            </div>
        `;
    } else {
        return `
            <button class="add-cart-new-btn" onclick="event.stopPropagation(); addToCart('${product.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Tanlash
            </button>
        `;
    }

}

function updateProductUI(productId) {

    const footer = document.getElementById(`footer-${productId}`);

    if (footer) {

        const product = products.find(p => p.id.toString() === productId.toString());

        if (product) {

            // Footer ichida endi faqat tugma
            footer.innerHTML = getProductFooterHTML(product);

            // Agar detail modal ochiq bo'lsa, uni ham yangilash

            const detailModal = document.getElementById('productDetailModal');

            if (detailModal && detailModal.classList.contains('active')) {

                const detailFooter = document.getElementById('detailFooter');

                if (detailFooter) {

                    detailFooter.innerHTML = getProductFooterHTML(product);

                }

            }

        }

    }

}

function getCategoryName(category) {

    const names = {

        'kosmetika': 'Kosmetika',

        'atir': 'Atirlar',

        'parvarish': 'Teri parvarishi',

        'soch': 'Soch vositalari'

    };

    return names[category] || category;

}

// Chegirma holatini tekshirish funksiyasi (online magazin uchun)
function getActiveDiscountForProduct(product) {
    if (!product) return null;
    
    const now = new Date();
    let hasDiscount = false;
    let discountPrice = 0;
    let discountPercent = 0;

    // Vaqt oralig'ini tekshirish
    let isTimeValid = true;
    if (product.discountStart) {
        const start = new Date(product.discountStart);
        if (now < start) isTimeValid = false;
    }
    if (product.discountEnd) {
        const end = new Date(product.discountEnd);
        if (now > end) isTimeValid = false;
    }

    if (isTimeValid) {
        if (product.discountPrice && product.discountPrice > 0) {
            discountPrice = product.discountPrice;
            discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);
            hasDiscount = true;
        } else if (product.discountPercent && product.discountPercent > 0) {
            discountPercent = product.discountPercent;
            discountPrice = product.price - (product.price * product.discountPercent / 100);
            hasDiscount = true;
        }
    }

    if (hasDiscount) {
        return {
            price: Math.round(discountPrice),
            percent: discountPercent,
            originalPrice: product.price
        };
    }
    return null;
}

function formatPrice(price) {

    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

}

function getProductFallbackImage(product) {
    const name = product && product.name ? encodeURIComponent(product.name) : 'No+Image';
    return `https://via.placeholder.com/300x300?text=${name}`;
}

function getProductImages(product) {
    if (!product) return [];
    const list = [];
    if (Array.isArray(product.imageUrls)) {
        product.imageUrls.forEach(url => {
            if (typeof url === 'string' && url.trim()) list.push(url.trim());
        });
    }
    if (typeof product.imageUrl === 'string' && product.imageUrl.trim()) list.push(product.imageUrl.trim());
    if (typeof product.image === 'string' && product.image.trim()) list.push(product.image.trim());
    return [...new Set(list)];
}

function ensureProductImageState(product) {
    const id = product.id.toString();
    const images = getProductImages(product);
    const prev = productImageState.get(id);
    const same = prev && JSON.stringify(prev.images) === JSON.stringify(images);
    const index = same ? Math.min(prev.index || 0, Math.max(images.length - 1, 0)) : 0;
    const state = { images, index };
    productImageState.set(id, state);
    return state;
}

function setProductCardImage(productId) {
    const id = productId.toString();
    const card = document.getElementById(`product-card-${id}`);
    if (!card) return;
    const img = card.querySelector('.product-image img');
    const prevBtn = card.querySelector('.image-nav.prev');
    const nextBtn = card.querySelector('.image-nav.next');
    const state = productImageState.get(id);
    if (!img || !state) return;

    const images = state.images || [];
    const fallback = img.dataset.fallback || '';
    const src = images[state.index] || images[0] || fallback;
    if (src) img.src = src;

    const showNav = images.length > 1;
    if (prevBtn) prevBtn.style.display = showNav ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = showNav ? 'flex' : 'none';
}

function changeProductImage(productId, dir) {
    const id = productId.toString();
    const state = productImageState.get(id);
    if (!state || !state.images || state.images.length < 2) return;
    const len = state.images.length;
    state.index = (state.index + dir + len) % len;
    setProductCardImage(id);

    if (modalImageState && modalImageState.productId.toString() === id) {
        modalImageState.index = state.index;
        updateDetailImage();
    }
}

function setModalImages(product) {
    const images = getProductImages(product);
    const state = ensureProductImageState(product);
    modalImageState = {
        productId: product.id,
        images: images,
        index: state.index || 0,
        fallback: getProductFallbackImage(product)
    };
    updateDetailImage();
}

function updateDetailImage() {
    if (!modalImageState) return;
    const img = document.getElementById('detailImage');
    const prevBtn = document.getElementById('detailPrev');
    const nextBtn = document.getElementById('detailNext');
    if (!img) return;

    const images = modalImageState.images || [];
    const src = images[modalImageState.index] || images[0] || modalImageState.fallback || '';
    if (src) img.src = src;
    img.onerror = function () {
        if (modalImageState && modalImageState.fallback) {
            img.src = modalImageState.fallback;
        }
    };

    const showNav = images.length > 1;
    if (prevBtn) prevBtn.style.display = showNav ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = showNav ? 'flex' : 'none';
}

function changeModalImage(dir) {
    if (!modalImageState || !modalImageState.images || modalImageState.images.length < 2) return;
    const len = modalImageState.images.length;
    modalImageState.index = (modalImageState.index + dir + len) % len;
    updateDetailImage();

    const id = modalImageState.productId.toString();
    const state = productImageState.get(id);
    if (state) {
        state.index = modalImageState.index;
        setProductCardImage(id);
    }
}

// ================================

// FILTERS

// ================================

function initFilters() {

    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {

        button.addEventListener('click', function () {

            // Remove active class from all buttons

            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button

            this.classList.add('active');

            // Get filter value and display products

            const filter = this.getAttribute('data-filter');

            displayProducts(filter);

        });

    });

}

// ================================

// CATEGORIES

// ================================

function initCategories() {

    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {

        // Remove click event - cards are now info only

        /*
        card.addEventListener('click', function () {

            const category = this.getAttribute('data-category');

            // Scroll to products section

            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });

            // Filter products after scroll

            setTimeout(() => {

                const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);

                if (filterBtn) {

                    filterBtn.click();

                }

            }, 100);

        });
        */

    });

}

// ================================

// CART MANAGEMENT

// ================================

function addToCart(productId) {

    const product = products.find(p => p.id.toString() === productId.toString());

    if (!product) return;

    // Check if product already in cart

    const existingItem = cart.find(item => item.id.toString() === productId.toString());

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }

    // Save to localStorage

    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count

    updateCartCount();

    // Update wishlist icons
    updateWishlistUI();

    // Update UI for this product

    updateProductUI(productId);

    // Show notification

    showNotification(`${product.name} savatchaga qo'shildi!`);

}

function updateCartCount() {

    const cartCounts = document.querySelectorAll('.cart-count');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCounts.forEach(cartCount => {
        cartCount.textContent = totalItems;
        
        // Hide if 0
        if (totalItems === 0) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'flex';
        }

        // Add animation
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    });

    // Mobile UX event
    window.dispatchEvent(new Event('cartUpdated'));
}

function toggleFavorite(productId) {
    const id = productId.toString();
    const index = favorites.indexOf(id);
    const product = products.find(p => p.id.toString() === id);
    
    if (index === -1) {
        favorites.push(id);
        if (product) showNotification(`${product.name} sevimlilarga qo'shildi!`);
    } else {
        favorites.splice(index, 1);
        if (product) showNotification(`${product.name} sevimlilardan olib tashlandi!`);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteCount();
    
    // Update the card UI
    const card = document.getElementById(`product-card-${id}`);
    if (card) {
        const favBtn = card.querySelector('.favorite-btn');
        if (favBtn) {
            favBtn.classList.toggle('active');
        }
    }

    // If we are in favorites view, re-render
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter && activeFilter.getAttribute('data-filter') === 'favorites') {
        displayProducts('favorites');
    }
}

function updateFavoriteCount() {
    const favoriteCounts = document.querySelectorAll('.favorite-count');
    const totalFavorites = favorites.length;

    favoriteCounts.forEach(count => {
        count.textContent = totalFavorites;
        if (totalFavorites === 0) {
            count.style.display = 'none';
        } else {
            count.style.display = 'flex';
        }
    });
}

// ================================

// NOTIFICATIONS

// ================================

function showNotification(message) {

    // Create notification element

    const notification = document.createElement('div');

    notification.style.cssText = `

        position: fixed;

        top: 100px;

        right: 20px;

        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

        color: white;

        padding: 1rem 1.5rem;

        border-radius: 12px;

        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);

        z-index: 10000;

        animation: slideIn 0.3s ease;

        font-weight: 600;

    `;

    notification.textContent = message;

    // Add to page

    document.body.appendChild(notification);

    // Remove after 3 seconds

    setTimeout(() => {

        notification.style.animation = 'slideOut 0.3s ease';

        setTimeout(() => {

            document.body.removeChild(notification);

        }, 300);

    }, 3000);

}

// Add animation styles

const style = document.createElement('style');

style.textContent = `

    @keyframes slideIn {

        from {

            transform: translateX(400px);

            opacity: 0;

        }

        to {

            transform: translateX(0);

            opacity: 1;

        }

    }

    @keyframes slideOut {

        from {

            transform: translateX(0);

            opacity: 1;

        }

        to {

            transform: translateX(400px);

            opacity: 0;

        }

    }

`;

document.head.appendChild(style);

// ================================

// CONTACT FORM

// ================================

function initContactForm() {

    const form = document.getElementById('contactForm');

    if (form) {

        form.addEventListener('submit', function (e) {

            e.preventDefault();

            // Use Telegram integration if available

            if (typeof handleContactFormSubmit === 'function') {

                handleContactFormSubmit(e);

            } else {

                // Fallback to simple notification

                const name = document.getElementById('name').value;

                showNotification(`Rahmat, ${name}! Tez orada siz bilan bog'lanamiz.`);

                form.reset();

            }

        });

    }

}

// ================================

// SMOOTH SCROLL

// ================================

function initSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function (e) {

            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);

            if (target) {

                target.scrollIntoView({

                    behavior: 'smooth',

                    block: 'start'

                });

            }

        });

    });

}

// ================================

// HEADER SCROLL EFFECT

// ================================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    const navContainer = document.querySelector('.nav-container');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.top = '0';
            if (navContainer) {
                navContainer.style.borderRadius = '0';
                navContainer.style.maxWidth = '100%';
                navContainer.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        } else {
            header.style.top = '20px';
            if (navContainer) {
                navContainer.style.borderRadius = '100px';
                navContainer.style.maxWidth = '1200px';
                navContainer.style.background = 'rgba(255, 255, 255, 0.8)';
            }
        }
    });
}

// ================================
// HERO SHOWCASE
// ================================
function initHeroShowcase() {
    const thumbs = document.querySelectorAll('.hero-thumb');
    const productName = document.getElementById('heroProductName');
    const productDescription = document.getElementById('heroProductDescription');
    const productChip = document.getElementById('heroProductChip');
    const productMeta = document.getElementById('heroProductMeta');
    const productCard = document.getElementById('heroProductCard');
    const variantLabel = document.getElementById('heroVariantLabel');
    const variantType = document.getElementById('heroVariantType');
    const noteTop = document.getElementById('heroNoteTop');
    const noteBottom = document.getElementById('heroNoteBottom');
    const tiltTarget = document.querySelector('[data-tilt-target]');
    const variantClasses = ['hero-product-card--serum', 'hero-product-card--perfume', 'hero-product-card--lipstick'];

    if (!thumbs.length || !productName || !productDescription || !productCard) {
        return;
    }

    const activateThumb = (thumb) => {
        if (!thumb) return;

        thumbs.forEach((button) => {
            button.classList.remove('is-active');
            button.setAttribute('aria-selected', 'false');
        });

        thumb.classList.add('is-active');
        thumb.setAttribute('aria-selected', 'true');

        productName.textContent = thumb.dataset.name || '';
        productDescription.textContent = thumb.dataset.description || '';
        if (productChip) productChip.textContent = thumb.dataset.chip || '';
        if (productMeta) productMeta.textContent = thumb.dataset.meta || '';
        if (variantLabel) variantLabel.textContent = thumb.dataset.label || '';
        if (variantType) variantType.textContent = thumb.dataset.type || '';
        if (noteTop) noteTop.textContent = thumb.dataset.noteTop || '';
        if (noteBottom) noteBottom.textContent = thumb.dataset.noteBottom || '';

        productCard.classList.remove(...variantClasses);
        productCard.classList.add(`hero-product-card--${thumb.dataset.variant || 'serum'}`);
    };

    thumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => activateThumb(thumb));
    });

    activateThumb(document.querySelector('.hero-thumb.is-active') || thumbs[0]);

    if (tiltTarget && window.matchMedia('(pointer: fine)').matches) {
        const resetTilt = () => {
            tiltTarget.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateY(0)';
        };

        resetTilt();

        tiltTarget.addEventListener('pointermove', (event) => {
            const rect = tiltTarget.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
            const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
            const rotateX = (-offsetY * 5).toFixed(2);
            const rotateY = (offsetX * 7).toFixed(2);

            tiltTarget.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        tiltTarget.addEventListener('pointerleave', resetTilt);
        tiltTarget.addEventListener('pointercancel', resetTilt);
    }
}
// ================================

// CART BUTTON & MODAL

// ================================

document.getElementById('cartBtn')?.addEventListener('click', function () {

    openCartModal();

});

function openCartModal() {

    // Endi modal o'rniga yangi page ochiladi

    window.location.href = 'cart.html';

}

function clearCart() {

    if (confirm('Savatchani tozalamoqchimisiz?')) {

        cart = [];

        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartCount();

        // Agar savat sahifasida bo'lsa, UI ni yangilash

        if (window.location.pathname.includes('cart.html')) {

            if (typeof updateCartPageUI === 'function') updateCartPageUI();

        } else {

            showNotification('Savatcha tozalandi');

        }

        // Update all product cards to show "Add" button

        if (typeof products !== 'undefined') {

            products.forEach(p => updateProductUI(p.id));

        }

    }

}

function closeCartModal() {

    const modal = document.getElementById('cartModal');

    modal.classList.remove('active');

}

function removeFromCart(productId) {

    cart = cart.filter(item => item.id.toString() !== productId.toString());

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();

    // Update UI for this product

    if (typeof updateProductUI === 'function') updateProductUI(productId);

    // Agar savat sahifasida bo'lsa, UI ni yangilash

    if (window.location.pathname.includes('cart.html')) {

        if (typeof updateCartPageUI === 'function') updateCartPageUI();

    } else {

        showNotification('Mahsulot o\'chirildi');

    }

}

function changeQuantity(productId, change) {

    const item = cart.find(item => item.id.toString() === productId.toString());

    if (item) {

        item.quantity += change;

        if (item.quantity <= 0) {

            removeFromCart(productId);

            return;

        }

        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartCount();

        // Update modal only if it is already open

        const modal = document.getElementById('cartModal');
        if (modal && modal.classList.contains('active')) {
            openCartModal();
        }

        // Agar savat sahifasida bo'lsa, UI ni yangilash

        if (window.location.pathname.includes('cart.html')) {

            if (typeof updateCartPageUI === 'function') updateCartPageUI();

        }

        // Update main UI (product card)

        updateProductUI(productId);

    } else if (change > 0) {

        // Agar savatda yo'q bo'lsa va + bosilsa (masalan product carddan)

        addToCart(productId);

    }

    // Mobile UX event
    window.dispatchEvent(new Event('cartUpdated'));
}

function updateCartTotal() {

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    document.getElementById('cartTotalPrice').textContent = formatPrice(total) + ' so\'m';

}

// ================================

// EXPORT FUNCTIONS FOR ADMIN

// ================================

async function saveProduct(product) {

    if (isFirebaseReady && typeof firebaseAddProduct === 'function') {

        const id = await firebaseAddProduct(product);

        return id !== null;

    } else {

        // Fallback: localStorage

        product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

        products.push(product);

        localStorage.setItem('products', JSON.stringify(products));

        return true;

    }

}

async function deleteProduct(productId) {

    if (isFirebaseReady && typeof firebaseDeleteProduct === 'function') {

        return await firebaseDeleteProduct(productId);

    } else {

        products = products.filter(p => p.id !== productId);

        localStorage.setItem('products', JSON.stringify(products));

        return true;

    }

}

function getProducts() {

    return products;

}

// Make functions globally available

window.saveProduct = saveProduct;

window.deleteProduct = deleteProduct;

window.getProducts = getProducts;

window.addToCart = addToCart;

// ================================

// ORDER MODAL FUNCTIONS

// ================================

function openOrderModal() {

    closeCartModal();

    const modal = document.getElementById('orderModal');

    const summaryItems = document.getElementById('checkoutSummaryItems');

    const totalPriceEl = document.getElementById('orderTotalPrice');

    // Render details

    summaryItems.innerHTML = cart.map(item => `

        <div class="summary-item-row">

            <span>${item.name} x${item.quantity}</span>

            <span>${formatPrice(item.price * item.quantity)} so'm</span>

        </div>

    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    totalPriceEl.textContent = formatPrice(total) + ' so\'m';

    // Show modal

    modal.classList.add('active');

    document.body.style.overflow = 'hidden';

}

function handleViloyatChange(isPage = false) {
    const suffix = isPage ? 'Page' : '';
    const viloyatSelect = document.getElementById('orderViloyat' + suffix);
    const tumanSelect = document.getElementById('orderTuman' + suffix);
    if (!viloyatSelect || !tumanSelect) return;

    const viloyat = viloyatSelect.value;

    // Clear current tumanlar
    tumanSelect.innerHTML = '<option value="" disabled selected>Tumanni tanlang</option>';

    if (viloyat && tumanlarData[viloyat]) {
        tumanSelect.disabled = false;
        tumanlarData[viloyat].forEach(tuman => {
            const option = document.createElement('option');
            option.value = tuman;
            option.textContent = tuman;
            tumanSelect.appendChild(option);
        });
    } else {
        tumanSelect.disabled = true;
    }

    // Sync custom select UI — tuman
    buildCustomSelectOptions(tumanSelect);
    syncCustomSelectState(tumanSelect);

    // Sync custom select UI — viloyat
    syncCustomSelectState(viloyatSelect);

    // Dostavka matnini yangilash
    if (isPage && typeof updateOrderDeliveryTextFromInputs === 'function') {
        updateOrderDeliveryTextFromInputs();
    }
}

// Viloyat/Tuman selectlar uchun event listenerlarni o'rnatish (inline onchange o'rniga)
function initRegionSelectListeners() {
    const viloyatPage = document.getElementById('orderViloyatPage');
    const tumanPage = document.getElementById('orderTumanPage');
    const viloyatModal = document.getElementById('orderViloyat');
    const tumanModal = document.getElementById('orderTuman');

    if (viloyatPage) {
        viloyatPage.removeEventListener('change', viloyatPage._regionHandler);
        viloyatPage._regionHandler = () => handleViloyatChange(true);
        viloyatPage.addEventListener('change', viloyatPage._regionHandler);
    }
    if (tumanPage) {
        tumanPage.removeEventListener('change', tumanPage._regionHandler);
        tumanPage._regionHandler = () => {
            if (typeof updateOrderDeliveryTextFromInputs === 'function') {
                updateOrderDeliveryTextFromInputs();
            }
        };
        tumanPage.addEventListener('change', tumanPage._regionHandler);
    }
    if (viloyatModal) {
        viloyatModal.removeEventListener('change', viloyatModal._regionHandler);
        viloyatModal._regionHandler = () => handleViloyatChange(false);
        viloyatModal.addEventListener('change', viloyatModal._regionHandler);
    }
    if (tumanModal) {
        tumanModal.removeEventListener('change', tumanModal._regionHandler);
        tumanModal._regionHandler = () => {};
        tumanModal.addEventListener('change', tumanModal._regionHandler);
    }
}

function backToCart() {

    closeOrderModal();

    openCartModal();

}

function closeOrderModal() {

    // Standalone page da bu kerak emas

}

// ================================

// TELEGRAM ORDER SUBMISSION

// ================================

async function submitOrder(event, isPage = false) {

    event.preventDefault();

    const suffix = isPage ? 'Page' : '';

    const name = document.getElementById('orderName' + suffix).value;

    const phoneInput = document.getElementById('orderPhone' + suffix).value;

    const phone = "+998 " + phoneInput;

    const viloyat = document.getElementById('orderViloyat' + suffix).value;

    const tuman = document.getElementById('orderTuman' + suffix).value;

    // Get Telegram config

    const BOT_TOKEN = window.TELEGRAM_CONFIG?.BOT_TOKEN;

    const CHAT_ID = window.TELEGRAM_CONFIG?.CHAT_ID;

    // Show loading state

    const submitBtn = event.target.querySelector('button[type="submit"]');

    const originalBtnText = submitBtn.textContent;

    submitBtn.disabled = true;

    submitBtn.textContent = 'Yuborilmoqda...';

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate delivery price to include in the order total
    let deliveryPrice = 0;
    if (typeof calculateDeliveryPrice === 'function' && viloyat && tuman) {
        const regionType = viloyat === 'Toshkent shahri' ? 'tashkent' : 'regions';
        deliveryPrice = calculateDeliveryPrice(total, regionType);
    }
    const grandTotal = total + deliveryPrice;

    try {

        // ============================

        // 1. FIREBASE: Buyurtmani saqlash (orders)

        // ============================

        let orderResult = null;

        if (typeof firebaseSaveOrder === 'function') {

            orderResult = await firebaseSaveOrder({

                customerName: name,

                customerPhone: phone,

                customerAddress: `${viloyat}, ${tuman}`,

                viloyat: viloyat,

                tuman: tuman,

                items: cart,

                totalAmount: grandTotal,

                deliveryPrice: deliveryPrice

            });

            console.log('📋 Buyurtma Firebase ga saqlandi:', orderResult);

        }

        // ============================

        // 2. FIREBASE: Mijozni saqlash (customers)

        // ============================

        if (typeof firebaseSaveCustomer === 'function') {

            const customerResult = await firebaseSaveCustomer({

                name: name,

                phone: phone,

                address: `${viloyat}, ${tuman}`,

                viloyat: viloyat,

                tuman: tuman,

                orderAmount: grandTotal,

                orderNumber: orderResult?.orderNumber || '',

                orderItems: cart.map(item => ({

                    name: item.name,

                    quantity: item.quantity,

                    price: item.price,

                    total: item.price * item.quantity

                }))

            });

            console.log('👤 Mijoz Firebase ga saqlandi:', customerResult);

        }

        // ============================

        // 3. FIREBASE: Sotuvni saqlash (CRM sales)

        // ============================

        if (typeof firebaseSaveSale === 'function') {
            const saleId = await firebaseSaveSale({
                customerName: name,
                viloyat: viloyat,
                items: cart,
                subtotalAmount: total,
                deliveryAmount: deliveryPrice,
                totalAmount: grandTotal,
                orderNumber: orderResult?.orderNumber || ''
            });
            console.log('🛒 Sotuv Firebase ga saqlandi:', saleId);
        }

        // ============================

        // 4. TELEGRAM: Guruhga xabar yuborish

        // ============================

        let telegramSuccess = false;

        if (BOT_TOKEN && CHAT_ID) {

            let message = `🔔 *YANGI BUYURTMA*\n\n`;

            if (orderResult?.orderNumber) {

                message += `🔢 *Buyurtma №:* ${orderResult.orderNumber}\n`;

            }

            message += `👤 *Mijoz:* ${name}\n`;

            message += `📞 *Telefon:* ${phone}\n`;

            message += `📍 *Manzil:* ${viloyat}, ${tuman}\n`;

            message += `\n📦 *Mahsulotlar:*\n`;

            message += `━━━━━━━━━━━━━━━━\n`;

            cart.forEach((item, index) => {

                message += `${index + 1}. *${item.name}*\n`;

                message += `   Soni: ${item.quantity} ta\n`;

                message += `   Narxi: ${formatPrice(item.price * item.quantity)} so'm\n\n`;

            });

            message += `━━━━━━━━━━━━━━━━\n`;

            if (deliveryPrice > 0) {
                message += `🚚 *Yetkazib berish:* ${formatPrice(deliveryPrice)} so'm\n`;
            } else if (viloyat && tuman) {
                message += `🚚 *Yetkazib berish:* Tekin\n`;
            }

            message += `💰 *JAMI: ${formatPrice(grandTotal)} so'm*\n\n`;

            message += `📅 Sana: ${new Date().toLocaleString('uz-UZ')}`;

            try {

                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {

                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json',

                    },

                    body: JSON.stringify({

                        chat_id: CHAT_ID,

                        text: message,

                        parse_mode: 'Markdown'

                    })

                });

                const data = await response.json();

                telegramSuccess = data.ok;

                if (!data.ok) {

                    console.error('Telegram xatolik:', data);

                }

            } catch (telegramError) {

                console.error('Telegram yuborishda xatolik:', telegramError);

            }

        }

        // ============================

        // 5. NATIJA: Muvaffaqiyat

        // ============================

        if (orderResult || telegramSuccess) {

            // Savatni tozalash

            cart = [];

            localStorage.setItem('cart', JSON.stringify(cart));

            updateCartCount();

            if (isPage) {

                // Success sahifasida buyurtma raqamini ko'rsatish

                const successContent = document.querySelector('.success-page-content');

                if (successContent && orderResult?.orderNumber) {

                    const orderNumEl = successContent.querySelector('.order-number-display');

                    if (orderNumEl) {

                        orderNumEl.textContent = orderResult.orderNumber;

                    } else {

                        const h2 = successContent.querySelector('h2');

                        if (h2) {

                            const numSpan = document.createElement('p');

                            numSpan.className = 'order-number-display';

                            numSpan.style.cssText = 'font-size: 1.1rem; color: var(--primary-color); font-weight: 600; margin-top: 0.5rem;';

                            numSpan.textContent = `Buyurtma raqami: ${orderResult.orderNumber}`;

                            h2.after(numSpan);

                        }

                    }

                }

                if (typeof showStep === 'function') showStep('successStep');

            } else {

                closeOrderModal();

                showSuccessModal();

            }

            // Barcha mahsulot kartalarini yangilash

            if (typeof products !== 'undefined') {

                products.forEach(p => updateProductUI(p.id));

            }

        } else {

            alert('❌ Buyurtma yuborilmadi. Iltimos, qayta urinib ko\'ring.');

            submitBtn.disabled = false;

            submitBtn.textContent = originalBtnText;

        }

    } catch (error) {

        console.error('Buyurtma yuborishda umumiy xatolik:', error);

        showNotification('❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');

        submitBtn.disabled = false;

        submitBtn.textContent = originalBtnText;

    }

}

function showSuccessModal() {

    const modal = document.getElementById('successModal');

    modal.classList.add('active');

    document.body.style.overflow = 'hidden';

}

function closeSuccessModal() {

    const modal = document.getElementById('successModal');

    modal.classList.remove('active');

    document.body.style.overflow = '';

}

// Make globally available

window.submitOrder = submitOrder;

// Product Detail Modal

function openProductDetailModal(productId) {

    const product = products.find(p => p.id.toString() === productId.toString());

    if (!product) return;

    setModalImages(product);

    document.getElementById('detailImage').alt = product.name || '';

    document.getElementById('detailName').textContent = product.name;

    // Chegirmani tekshirish va narxni yangilash
    const discount = getActiveDiscountForProduct(product);
    let detailPriceHTML = '';
    
    if (discount) {
        detailPriceHTML = '<div style="display: flex; align-items: center; gap: 15px;">' +
            '<div style="display: flex; flex-direction: column; gap: 0px;">' +
                '<span style="display: flex; align-items: center; gap: 5px; color: var(--text-light); font-size: 0.85rem; opacity: 0.8;">' + 
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"></path>' +
                        '<path d="M6 9h.01"></path>' +
                        '<path d="M15 5h7v7l-6.29 6.29c-.94.94-2.48.94-3.42 0"></path>' +
                    '</svg>' +
                    '<span style="text-decoration: line-through;">' + formatPrice(product.price) + ' so\'m</span>' + 
                    '<span style="font-size: 0.75em; background: #eee; padding: 1px 6px; border-radius: 4px; color: #777; font-weight: 500; margin-left: 2px;">asl narxi</span>' +
                '</span>' +
                '<span style="display: flex; align-items: center; gap: 8px; color: var(--accent-color); font-weight: 800; font-size: 1.6rem;">' + 
                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>' +
                        '<path d="m14 11-3 3"></path>' +
                        '<path d="M11 11h.01"></path>' +
                        '<path d="M14 14h.01"></path>' +
                    '</svg>' +
                    formatPrice(discount.price) + ' so\'m' + 
                    '<span style="font-size: 0.55em; background: rgba(255, 61, 87, 0.1); color: #ff3d57; padding: 2px 8px; border-radius: 5px; margin-left: 5px; font-weight: 700; text-transform: uppercase; vertical-align: middle;">chegirmada</span>' +
                '</span>' +
            '</div>' +
            '<span style="background: linear-gradient(135deg, #ff3d57 0%, #ff8a80 100%); color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 800; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 12px rgba(255, 61, 87, 0.2);">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
                    '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>' +
                    '<line x1="7" y1="7" x2="7.01" y2="7"></line>' +
                '</svg>' +
                '-' + discount.percent + '%' +
            '</span>' +
            '</div>';
    } else {
        detailPriceHTML = '<span>' + formatPrice(product.price) + ' so\'m</span>';
    }
    
    document.getElementById('detailPrice').innerHTML = detailPriceHTML;

    const brandRow = document.getElementById('detailBrandRow');
    const brandEl = document.getElementById('detailBrand');
    if (brandRow && brandEl) {
        if (product.brand) {
            brandEl.textContent = product.brand;
            brandRow.style.display = 'flex';
        } else {
            brandRow.style.display = 'none';
        }
    }

    document.getElementById('detailDescription').textContent = product.description || "Mahsulot haqida batafsil ma'lumot tez orada joylanadi.";

    const detailFooter = document.getElementById('detailFooter');

    detailFooter.innerHTML = getProductFooterHTML(product);

    const modal = document.getElementById('productDetailModal');

    modal.classList.add('active');

    document.body.style.overflow = 'hidden'; // Stop scrolling

}

function closeProductDetailModal() {

    const modal = document.getElementById('productDetailModal');

    modal.classList.remove('active');

    document.body.style.overflow = ''; // Restore scrolling

    modalImageState = null;

}

// Close modals when clicking outside

window.addEventListener('click', function (event) {

    const cartModal = document.getElementById('cartModal');

    const orderModal = document.getElementById('orderModal');

    const productDetailModal = document.getElementById('productDetailModal');

    if (event.target === cartModal) {

        closeCartModal();

    }

    if (event.target === orderModal) {

        closeOrderModal();

    }

    if (event.target === productDetailModal) {

        closeProductDetailModal();

    }

    if (event.target === document.getElementById('successModal')) {

        closeSuccessModal();

    }

});

// Global functions for onclick handlers

window.openCartModal = openCartModal;

window.closeCartModal = closeCartModal;

window.clearCart = clearCart;

window.removeFromCart = removeFromCart;

window.openOrderModal = openOrderModal;

window.closeOrderModal = closeOrderModal;

window.backToCart = backToCart;

window.handleViloyatChange = handleViloyatChange;

window.showNotification = showNotification;

window.changeQuantity = changeQuantity;

window.openProductDetailModal = openProductDetailModal;

window.closeProductDetailModal = closeProductDetailModal;

window.closeSuccessModal = closeSuccessModal;


function calculateDeliveryPrice(total, regionType) {
    // regionType: 'tashkent' | 'regions'
    if (regionType === 'tashkent') {
        if (total < 120000) return 20000;
        if (total < 220000) return 15000;
        return 0;
    } else {
        if (total < 220000) return 35000;
        if (total < 320000) return 30000;
        return 0;
    }
}

// ================================
// CART PAGE FUNCTIONS
// ================================

function showStep(stepId) {
    const steps = document.querySelectorAll('.step-container');
    steps.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(stepId);
    if (target) target.classList.add('active');
}

function renderCartPage() {
    const container = document.getElementById('cartContent');
    if (!container) return;

    cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-page">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#c0c0d0" stroke-width="1.5" style="margin-bottom: 1.5rem;">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <h2>Savatingiz bo'sh</h2>
                <p>Mahsulotlar qo'shish uchun do'konga qaytib, yoqtirgan mahsulotingizni tanlang.</p>
                <a href="index.html" class="btn btn-primary" style="display: inline-flex; width: auto;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                    Do'konga qaytish
                </a>
            </div>
        `;
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Viloyat options
    let viloyatOptions = '<option value="" disabled selected>Viloyatni tanlang</option>';
    Object.keys(tumanlarData).forEach(v => {
        viloyatOptions += `<option value="${v}">${v}</option>`;
    });

    container.innerHTML = `
        <!-- Step 1: Savat + Buyurtma -->
        <div class="step-container active" id="cartStep">
            <div class="checkout-header">
                <h1>Savatingiz</h1>
                <button class="clear-cart-btn" onclick="clearCart()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Tozalash
                </button>
            </div>

            <div class="modal-body-layout">
                <!-- Chap tomon: Mahsulotlar ro'yxati -->
                <div class="modal-main-content">
                    <div class="cart-items-list" id="cartItemsList">
                        ${renderCartItems()}
                    </div>
                </div>

                <!-- O'ng tomon: Buyurtma berish -->
                <div class="modal-sidebar">
                    <div class="order-summary-card order-summary-premium">
                        <div class="summary-header-premium">
                            <div class="summary-header-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
                                    <path d="M3 6h18"></path>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                            </div>
                            <h3>Buyurtma xulosasi</h3>
                        </div>

                        <div class="summary-items-list summary-items-premium" id="summaryItemsList">
                            ${renderSummaryItems()}
                        </div>

                        <div id="deliverySectionPremium" class="delivery-section-premium" style="display: none;"></div>

                        <div class="summary-breakdown-premium" id="summaryBreakdown">
                            <div class="breakdown-row">
                                <span>Mahsulotlar</span>
                                <span>${formatPrice(total)} so'm</span>
                            </div>
                            <div class="breakdown-row delivery-row" id="deliveryBreakdownRow" style="display: none;">
                                <span>Yetkazib berish</span>
                                <span class="delivery-price-tag" id="deliveryPriceTag">—</span>
                            </div>
                        </div>

                        <div class="summary-total summary-total-premium">
                            <span>Jami:</span>
                            <span id="cartPageTotal">${formatPrice(total)} so'm</span>
                        </div>

                        <button class="btn btn-primary btn-full checkout-btn checkout-btn-premium" onclick="showStep('orderStep')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                            Buyurtma berish
                        </button>

                        <button class="continue-shopping" onclick="window.location.href='index.html'">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 12H5M12 19l-7-7 7-7"></path>
                            </svg>
                            Xaridni davom ettirish
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 2: Buyurtma ma'lumotlari -->
        <div class="step-container" id="orderStep">
            <div class="checkout-header">
                <h1>Buyurtma berish</h1>
                <button class="back-link" onclick="showStep('cartStep')" style="cursor: pointer; background: none; border: none; font-size: 1rem; font-family: inherit;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                    <span>Savatga qaytish</span>
                </button>
            </div>

            <div class="modal-body-layout">
                <div class="modal-main-content">
                    <form id="orderFormPage" onsubmit="submitOrder(event, true)">
                        <!-- Shaxsiy ma'lumotlar -->
                        <div class="order-section-card" style="margin-bottom: 1.5rem;">
                            <div class="section-title-row">
                                <div class="section-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <h3>Shaxsiy ma'lumotlar</h3>
                            </div>
                            <div class="form-grid two-cols">
                                <div class="form-group">
                                    <label class="field-label">
                                        <span class="label-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </span>
                                        Ismingiz
                                    </label>
                                    <input type="text" id="orderNamePage" required placeholder="Ismingizni kiriting">
                                </div>
                                <div class="form-group">
                                    <label class="field-label">
                                        <span class="label-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1 .45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11 .45 12.84 12.84 0 0 0 2.81 .7A2 2 0 0 1 22 16.92z"></path></svg>
                                        </span>
                                        Telefon raqam
                                    </label>
                                    <div class="phone-input-wrapper">
                                        <span class="country-code">+998</span>
                                        <input type="tel" id="orderPhonePage" required placeholder="90 123 45 67" pattern="[0-9 ]{9,12}" maxlength="12">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Manzil -->
                        <div class="order-section-card" style="margin-bottom: 1.5rem;">
                            <div class="section-title-row">
                                <div class="section-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <h3>Yetkazib berish manzili</h3>
                            </div>
                            <div class="form-grid two-cols">
                                <div class="form-group">
                                    <label class="field-label">
                                        <span class="label-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        </span>
                                        Viloyat
                                    </label>
                                    <div class="custom-select" data-placeholder="Viloyatni tanlang">
                                        <select id="orderViloyatPage" class="native-select" required>
                                            ${viloyatOptions}
                                        </select>
                                        <button type="button" class="custom-select-trigger" aria-expanded="false">
                                            <span class="custom-select-value">Viloyatni tanlang</span>
                                            <span class="custom-select-caret"></span>
                                        </button>
                                        <div class="custom-select-panel" role="listbox"></div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="field-label">
                                        <span class="label-icon dot-icon"></span>
                                        Tuman
                                    </label>
                                    <div class="custom-select" data-placeholder="Tumanni tanlang">
                                        <select id="orderTumanPage" class="native-select" required disabled>
                                            <option value="" disabled selected>Tumanni tanlang</option>
                                        </select>
                                        <button type="button" class="custom-select-trigger" aria-expanded="false" disabled>
                                            <span class="custom-select-value">Tumanni tanlang</span>
                                            <span class="custom-select-caret"></span>
                                        </button>
                                        <div class="custom-select-panel" role="listbox"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Prepayment Notice (pochta orqali viloyatga) -->
                        <div id="prepaymentNotice" class="prepayment-notice-card" style="display: none;">
                            <div class="prepayment-notice-inner">
                                <div class="prepayment-icon-wrap">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                    </svg>
                                </div>
                                <p class="prepayment-main-text">
                                    Hurmatli mijoz, siz mahsulotingiz pochta orqali yuborilishi uchun oldindan <strong id="prepaymentAmount">0</strong> so'm to'lov qilishingiz kerak.
                                </p>
                                <p class="prepayment-sub-text">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1 .45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11 .45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    Buyurtmadan so'ng mutaxassislarimiz to'lov masalasida siz bilan bog'lanishadi
                                </p>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary btn-full checkout-btn checkout-btn-premium" style="width: 100%;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            Buyurtmani tasdiqlash
                        </button>
                    </form>
                </div>

                <!-- O'ng sidebar: Buyurtma xulosasi -->
                <div class="modal-sidebar">
                    <div class="order-summary-card order-summary-premium">
                        <div class="summary-header-premium">
                            <div class="summary-header-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                                    <rect x="9" y="3" width="6" height="4" rx="2"></rect>
                                </svg>
                            </div>
                            <h3>Buyurtma tafsiloti</h3>
                        </div>
                        <div class="summary-items-list summary-items-premium" id="orderSummaryItemsList">
                            ${renderSummaryItems()}
                        </div>
                        <div id="orderDeliverySectionPremium" class="delivery-section-premium" style="display: none;"></div>
                        <div class="summary-breakdown-premium" id="orderSummaryBreakdown">
                            <div class="breakdown-row">
                                <span>Mahsulotlar</span>
                                <span>${formatPrice(total)} so'm</span>
                            </div>
                            <div class="breakdown-row delivery-row" id="orderDeliveryBreakdownRow" style="display: none;">
                                <span>Yetkazib berish</span>
                                <span class="delivery-price-tag" id="orderDeliveryPriceTag">—</span>
                            </div>
                        </div>
                        <div class="summary-total summary-total-premium">
                            <span>Jami:</span>
                            <span id="orderPageTotal">${formatPrice(total)} so'm</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 3: Muvaffaqiyat -->
        <div class="step-container" id="successStep">
            <div class="success-page-content" style="text-align: center; padding: 5rem 0;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h2 style="font-size: 2rem; font-family: var(--font-display); color: var(--text-primary); margin-bottom: 0.5rem;">Buyurtma qabul qilindi!</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem; max-width: 400px; margin-left: auto; margin-right: auto;">Buyurtmangiz muvaffaqiyatli yuborildi. Tez orada menejerimiz siz bilan bog'lanadi.</p>
                <a href="index.html" class="btn btn-primary" style="display: inline-flex; width: auto;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Bosh sahifaga qaytish
                </a>
            </div>
        </div>
    `;

    // Custom selectlarni qayta ishga tushirish
    initCustomSelects();
    initRegionSelectListeners();
}

function renderCartItems() {
    return cart.map(item => {
        const imgUrl = item.imageUrl || item.image || (Array.isArray(item.imageUrls) && item.imageUrls[0]) || `https://via.placeholder.com/100x100?text=${encodeURIComponent(item.name)}`;
        return `
            <div class="cart-item">
                <img class="cart-item-image" src="${imgUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(item.price)} so'm</div>
                    <div class="cart-item-controls">
                        <div class="qty-counter">
                            <button class="qty-btn" onclick="changeQuantityPage('${item.id}', -1)">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQuantityPage('${item.id}', 1)">+</button>
                        </div>
                        <button class="cart-item-remove-icon" onclick="removeFromCartPage('${item.id}')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderSummaryItems() {
    return cart.map(item => `
        <div class="summary-item-row summary-item-row-premium">
            <span class="item-name-col">
                <span class="item-dot"></span>
                ${item.name}
                <span class="item-qty-badge">x${item.quantity}</span>
            </span>
            <span class="item-price-col">${formatPrice(item.price * item.quantity)} so'm</span>
        </div>
    `).join('');
}

function updateCartPageUI() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCartPage();
    updateCartCount();
}

function changeQuantityPage(productId, change) {
    const item = cart.find(i => i.id.toString() === productId.toString());
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id.toString() !== productId.toString());
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartPageUI();
    }
}

function removeFromCartPage(productId) {
    cart = cart.filter(i => i.id.toString() !== productId.toString());
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartPageUI();
}

function updateOrderDeliveryTextFromInputs() {
    const viloyatEl = document.getElementById('orderViloyatPage');
    const tumanEl = document.getElementById('orderTumanPage');
    if (!viloyatEl || !tumanEl) return;

    const viloyat = viloyatEl.value;
    const tuman = tumanEl.value;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Delivery section elements in both steps
    const deliverySection = document.getElementById('deliverySectionPremium');
    const deliveryRow = document.getElementById('deliveryBreakdownRow');
    const deliveryTag = document.getElementById('deliveryPriceTag');
    const cartTotalEl = document.getElementById('cartPageTotal');

    const orderDeliverySection = document.getElementById('orderDeliverySectionPremium');
    const orderDeliveryRow = document.getElementById('orderDeliveryBreakdownRow');
    const orderDeliveryTag = document.getElementById('orderDeliveryPriceTag');
    const orderTotalEl = document.getElementById('orderPageTotal');

    // Prepayment notice elements
    const prepaymentNotice = document.getElementById('prepaymentNotice');
    const prepaymentAmount = document.getElementById('prepaymentAmount');

    if (viloyat && tuman) {
        const regionType = viloyat === 'Toshkent shahri' ? 'tashkent' : 'regions';
        const deliveryPrice = calculateDeliveryPrice(total, regionType);
        const grandTotal = total + deliveryPrice;

        const deliveryText = deliveryPrice > 0
            ? `${formatPrice(deliveryPrice)} so'm`
            : 'Tekin';

        const deliveryBadgeHTML = `
            <div class="delivery-badge-premium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>${viloyat}, ${tuman} — ${deliveryPrice > 0 ? formatPrice(deliveryPrice) + " so'm" : 'Tekin yetkazib berish'}</span>
            </div>
        `;

        // Order step delivery
        if (orderDeliverySection) {
            orderDeliverySection.innerHTML = deliveryBadgeHTML;
            orderDeliverySection.style.display = '';
        }
        if (orderDeliveryRow) orderDeliveryRow.style.display = '';
        if (orderDeliveryTag) {
            orderDeliveryTag.textContent = deliveryText;
            orderDeliveryTag.className = 'delivery-price-tag' + (deliveryPrice === 0 ? ' free-delivery' : '');
        }
        if (orderTotalEl) orderTotalEl.textContent = formatPrice(grandTotal) + " so'm";

        // Cart step delivery (mirror)
        if (deliverySection) {
            deliverySection.innerHTML = deliveryBadgeHTML;
            deliverySection.style.display = '';
        }
        if (deliveryRow) deliveryRow.style.display = '';
        if (deliveryTag) {
            deliveryTag.textContent = deliveryText;
            deliveryTag.className = 'delivery-price-tag' + (deliveryPrice === 0 ? ' free-delivery' : '');
        }
        if (cartTotalEl) cartTotalEl.textContent = formatPrice(grandTotal) + " so'm";

        // Prepayment notice for viloyat (pochta) deliveries
        const isRegionDelivery = viloyat !== 'Toshkent shahri';
        if (isRegionDelivery && prepaymentNotice && prepaymentAmount) {
            // Calculate: sum(tannarx * quantity) + deliveryPrice
            const costTotal = cart.reduce((sum, item) => {
                const costPrice = parseFloat(item.cost) || 0;
                return sum + (costPrice * item.quantity);
            }, 0);
            const prepayment = costTotal + deliveryPrice;
            prepaymentAmount.textContent = formatPrice(prepayment);
            prepaymentNotice.style.display = 'block';
        } else if (prepaymentNotice) {
            prepaymentNotice.style.display = 'none';
        }
    } else {
        // Hide prepayment notice if no region/district selected
        if (prepaymentNotice) {
            prepaymentNotice.style.display = 'none';
        }
    }
}

// Make cart page functions globally available
window.renderCartPage = renderCartPage;
window.updateCartPageUI = updateCartPageUI;
window.showStep = showStep;
window.changeQuantityPage = changeQuantityPage;
window.removeFromCartPage = removeFromCartPage;
window.updateOrderDeliveryTextFromInputs = updateOrderDeliveryTextFromInputs;

// ================================
// WISHLIST FUNCTIONS
// Wishlist module (wishlist-module.js) orqali ishlaydi
// ================================

async function toggleWishlist(event, productId) {
    if (event) { event.stopPropagation(); event.preventDefault(); }

    const added = Wishlist.toggle(productId);

    // wishlist massivini sync qilish (boshqa joylar ishlatishi uchun)
    wishlist = Wishlist.getIds();

    // Heart pop animatsiya
    const btn = event && event.currentTarget;
    if (btn) {
        btn.classList.remove('pop');
        void btn.offsetWidth;
        btn.classList.add('pop');
        setTimeout(() => btn.classList.remove('pop'), 600);

        if (added) {
            for (let i = 0; i < 4; i++) {
                const particle = document.createElement('span');
                particle.className = 'heart-particle';
                particle.textContent = ['❤️', '✨', '💕', '💗'][i];
                particle.style.left = (btn.offsetWidth / 2 - 6 + (Math.random() - 0.5) * 20) + 'px';
                particle.style.top = '0px';
                particle.style.animationDelay = (i * 0.08) + 's';
                btn.appendChild(particle);
                setTimeout(() => particle.remove(), 800);
            }
        }
    }

    // Firebase sync (orqa fonda)
    const product = typeof products !== 'undefined' && products.find(p => String(p.id) === String(productId));
    if (added && product && typeof firebaseAddToWishlist === 'function') {
        firebaseAddToWishlist(product).catch(() => {});
    } else if (!added && typeof firebaseRemoveFromWishlist === 'function') {
        firebaseRemoveFromWishlist(productId).catch(() => {});
    }

    // Wishlist sahifasini yangilash
    if (typeof renderWishlist === 'function') renderWishlist();
}

function updateWishlistUI() {
    wishlist = Wishlist.getIds();
    Wishlist._sync();
}

window.toggleWishlist = toggleWishlist;
window.updateWishlistUI = updateWishlistUI;


// Chegirma vaqtini har minutda tekshirib turish (avtomatik yangilanish uchun)
// Bu mahsulotlar kartasini yangilaydi agar chegirma vaqti o'tgan bo'lsa
setInterval(function() {
    // Agar mahsulotlar kartasi ko'rinib turgan bo'lsa, uni yangilash
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid && productsGrid.children.length > 0) {
        // Hozirgi filterni saqlash
        const activeFilter = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        displayProducts(currentFilter);
    }
}, 60000); // Har 60 soniyada tekshiradi
