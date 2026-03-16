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

    // Initialize custom selects (viloyat/tuman)
    initCustomSelects();

    // Update cart count

    updateCartCount();

    // Smooth scroll for links

    initSmoothScroll();

    // Header scroll effect

    initHeaderScroll();

    // Firebase real-time listener (agar Firebase ulangan bo'lsa)

    if (isFirebaseReady && typeof firebaseListenProducts === 'function') {

        firebaseListenProducts((updatedProducts) => {

            products = updatedProducts;

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

});

// ================================
// CUSTOM SELECTS (VILOYAT/TUMAN)
// ================================
function initCustomSelects() {
    const wrappers = document.querySelectorAll('.custom-select');
    if (!wrappers.length) return;

    wrappers.forEach(wrapper => {
        const select = wrapper.querySelector('select');
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const panel = wrapper.querySelector('.custom-select-panel');
        if (!select || !trigger || !panel) return;

        buildCustomSelectOptions(select);
        syncCustomSelectState(select);

        trigger.addEventListener('click', () => {
            if (select.disabled) return;
            const isOpen = wrapper.classList.contains('is-open');
            closeAllCustomSelects();
            if (!isOpen) {
                wrapper.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.custom-select')) {
            closeAllCustomSelects();
        }
    });
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
            : `<span class="option-bullet"></span>`;

        optionBtn.innerHTML = `
            ${iconHtml}
            <span class="option-text">${opt.textContent}</span>
        `;
        optionBtn.addEventListener('click', () => {
            selectEl.value = opt.value;
            selectEl.dispatchEvent(new Event('change', { bubbles: true }));
            syncCustomSelectState(selectEl);
            closeAllCustomSelects();
        });
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
                valueEl.textContent = selectedOption.textContent;
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

    if (isFirebaseReady && typeof firebaseGetProducts === 'function') {

        try {

            console.log('🔥 Firebase\'dan mahsulotlar yuklanmoqda...');

            const loadedProducts = await firebaseGetProducts();

            console.log('📦 Bazadan kelgan mahsulotlar:', loadedProducts);

            products = loadedProducts;

            console.log(`✅ ${products.length} ta mahsulot yuklandi`);

        } catch (error) {

            console.error('Firebase xatolik:', error);

            products = [];

        }

    } else {

        console.log('⚠️ Firebase ulanmagan');

        products = [];

    }

    // Mahsulotlarni ko'rsatish

    displayProducts(currentFilter);

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

function displayProducts(filter = 'all') {

    const productsGrid = document.getElementById('productsGrid');

    // Filter products

    const filteredProducts = filter === 'all'

        ? products

        : products.filter(p => {

            const cat = (p.category || '').toLowerCase();

            const f = filter.toLowerCase();

            // CRM dagi "Soch parvarishi" -> websitedagi "soch"

            if (f === 'soch' && cat.includes('soch')) return true;

            // CRM dagi "Tana parvarishi" -> websitedagi "parvarish"

            if (f === 'parvarish' && (cat.includes('tana') || cat.includes('parvarish') || cat.includes('krem'))) return true;

            // CRM dagi "Atir" yoki "Parfyumeriya" -> websitedagi "atir"

            if (f === 'atir' && (cat.includes('atir') || cat.includes('parfyumeriya'))) return true;

            // Kosmetika

            if (f === 'kosmetika' && cat.includes('kosmetika')) return true;

            return cat === f;

        });

    // Clear grid

    productsGrid.innerHTML = '';

    // Display products

    if (filteredProducts.length === 0) {

        productsGrid.innerHTML = `

            <div class="loading-state">

                <p style="color: var(--text-secondary);">Hozircha mahsulotlar yo'q</p>

            </div>

        `;

        return;

    }

    filteredProducts.forEach(product => {

        const productCard = createProductCard(product);

        productsGrid.appendChild(productCard);

    });

    // Add animation

    const cards = productsGrid.querySelectorAll('.product-card');

    cards.forEach((card, index) => {

        setTimeout(() => {

            card.style.opacity = '0';

            card.style.transform = 'translateY(20px)';

            setTimeout(() => {

                card.style.transition = 'all 0.5s ease';

                card.style.opacity = '1';

                card.style.transform = 'translateY(0)';

            }, 50);

        }, index * 50);

    });

}

function createProductCard(product) {

    const card = document.createElement('div');

    card.className = 'product-card';

    card.id = `product-card-${product.id}`;

    const rating = product.rating || "4.9";

    const state = ensureProductImageState(product);
    const fallback = getProductFallbackImage(product);
    const initialImage = (state.images[state.index] || state.images[0] || product.imageUrl || product.image || fallback);
    const showNav = state.images.length > 1;

    card.innerHTML = `

        <div class="product-click-area" onclick="openProductDetailModal('${product.id}')">

            <div class="product-image">

                <img src="${initialImage}" alt="${product.name}" data-fallback="${fallback}" onerror="this.src='${fallback}'">

                <button class="image-nav prev" data-pid="${product.id}" data-dir="-1" aria-label="Oldingi rasm" style="display:${showNav ? 'flex' : 'none'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <button class="image-nav next" data-pid="${product.id}" data-dir="1" aria-label="Keyingi rasm" style="display:${showNav ? 'flex' : 'none'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                <button class="favorite-btn" onclick="event.stopPropagation()">

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">

                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>

                    </svg>

                </button>

            </div>

            <div class="product-info" style="padding: 12px 12px 0; display: flex; flex-direction: column; gap: 4px; flex: 1;">

                <h3 class="product-name" style="font-size: 0.9rem; line-height: 1.3; color: #1a1a2e; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.34rem; margin: 0; margin-bottom: 4px;">${product.name}</h3>
                
                <div class="current-price" style="font-size: 1.15rem; font-weight: 700; color: #1a1a2e; margin-bottom: 2px;">${formatPrice(product.price)} so'm</div>
                
                ${product.brand ? `
                <div class="product-brand" style="font-size: 0.8rem; color: #8b8b9f; font-weight: 500; display: flex; align-items: center; gap: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    ${product.brand}
                </div>` : ''}

            </div>

        </div>

        <div class="product-footer-container" style="padding: 10px 12px 12px; margin-top: auto;">

            <div class="product-footer" id="footer-${product.id}" style="width: 100%; display: flex; padding: 0; border: none;">

                ${getProductFooterHTML(product)}

            </div>

        </div>

    `;

    return card;

}

function getProductFooterHTML(product) {

    const cartItem = cart.find(item => item.id.toString() === product.id.toString());

    if (cartItem) {

        // Savatda bor (count controls)

        return `

            <div class="qty-counter-uzum" style="width: 100%; display: flex; align-items: center; justify-content: space-between; background: #f5edff; border-radius: 8px; padding: 6px;">

                <button class="qty-btn" style="width: 32px; height: 32px; border: none; background: transparent; font-size: 1.2rem; color: #9c27b0; cursor: pointer; display: flex; align-items: center; justify-content: center;" onclick="event.stopPropagation(); changeQuantity('${product.id}', -1)">−</button>

                <span class="qty-display" style="font-weight: 600; font-size: 1.05rem; color: #000;">${cartItem.quantity}</span>

                <button class="qty-btn" style="width: 32px; height: 32px; border: none; background: transparent; font-size: 1.2rem; color: #9c27b0; cursor: pointer; display: flex; align-items: center; justify-content: center;" onclick="event.stopPropagation(); changeQuantity('${product.id}', 1)">+</button>

            </div>

        `;

    } else {

        // Savatda yo'q (Add button only)

        return `

            <button class="add-cart-new-btn" style="width: 100%; height: 44px; background: linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%); color: white; border: none; border-radius: 8px; font-weight: 500; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; font-family: inherit;" onclick="event.stopPropagation(); addToCart('${product.id}')" onmouseover="this.style.background='linear-gradient(135deg, #8B7FFF 0%, #7B68EE 100%)'" onmouseout="this.style.background='linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)'">
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

            }, 500);

        });

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

        // Add animation

        cartCount.style.transform = 'scale(1.3)';

        setTimeout(() => {

            cartCount.style.transform = 'scale(1)';

        }, 200);

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

    let lastScroll = 0;

    window.addEventListener('scroll', () => {

        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {

            header.classList.add('scrolled');

        } else {

            header.classList.remove('scrolled');

        }

        lastScroll = currentScroll;

    });

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

    const viloyat = document.getElementById('orderViloyat' + suffix).value;

    const tumanSelect = document.getElementById('orderTuman' + suffix);

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

    // Sync custom select UI
    buildCustomSelectOptions(tumanSelect);
    syncCustomSelectState(tumanSelect);
    const viloyatSelect = document.getElementById('orderViloyat' + suffix);
    if (viloyatSelect) {
        syncCustomSelectState(viloyatSelect);
    }

    // Cart/order page: viloyat o'zgarganda dostavka matnini yangilash
    if (isPage && typeof updateOrderDeliveryTextFromInputs === 'function') {
        updateOrderDeliveryTextFromInputs();
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

    document.getElementById('detailPrice').textContent = formatPrice(product.price) + " so'm";

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
