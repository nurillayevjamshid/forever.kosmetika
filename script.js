// ================================
// PRODUCT DATA & MANAGEMENT
// ================================

// Mahsulotlar ro'yxati (Firebase'dan yuklanadi)
let products = [];

// Firebase ulangan yoki yo'qligini tekshirish
const isFirebaseReady = typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0;

// Default mahsulotlar (Firebase ulanmaganda)
const defaultProducts = [
    {
        id: 1,
        name: "Luxury Face Cream",
        category: "parvarish",
        price: 250000,
        description: "Premium teri parvarish kremi - yumshoq va silliq teri uchun",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80",
        badge: "Yangi"
    },
    {
        id: 2,
        name: "Rose Perfume",
        category: "atir",
        price: 350000,
        description: "Eksklyuziv atirgul hidli atir - uzun muddatli hid",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80",
        badge: "Top"
    },
    {
        id: 3,
        name: "Matte Lipstick Set",
        category: "kosmetika",
        price: 180000,
        description: "6 ta rangdagi mat lab bo'yoqlari to'plami",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80",
        badge: "Set"
    },
    {
        id: 4,
        name: "Professional Hair Dryer",
        category: "soch",
        price: 450000,
        description: "Yuqori quvvatli ionli fen - tez va xavfsiz quritish",
        image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500&q=80",
        badge: "Premium"
    },
    {
        id: 5,
        name: "Vitamin C Serum",
        category: "parvarish",
        price: 280000,
        description: "Teri uchun Vitamin C serumi - yorqinlik va namlik",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
        badge: "Ommabop"
    },
    {
        id: 6,
        name: "Eye Shadow Palette",
        category: "kosmetika",
        price: 220000,
        description: "20 ta rang palitasi - kundalik va kechki makiyaj uchun",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80",
        badge: "Yangi"
    },
    {
        id: 7,
        name: "Oud Perfume",
        category: "atir",
        price: 520000,
        description: "Sharq hidlari - Ajoyib Oud atiri",
        image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59bd9?w=500&q=80",
        badge: "Lux"
    },
    {
        id: 8,
        name: "Hair Straightener",
        category: "soch",
        price: 380000,
        description: "Keramik soch dazoli - harorat nazorati bilan",
        image: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=500&q=80",
        badge: "Yangi"
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
});

// ================================
// MAHSULOTLARNI YUKLASH
// ================================

async function loadProducts() {
    if (isFirebaseReady && typeof firebaseGetProducts === 'function') {
        try {
            console.log('🔥 Firebase\'dan mahsulotlar yuklanmoqda...');
            products = await firebaseGetProducts();

            if (products.length === 0) {
                console.log('📦 Firebase\'da mahsulotlar yo\'q, default mahsulotlar ko\'rsatilmoqda');
                products = defaultProducts;
            }

            console.log(`✅ ${products.length} ta mahsulot yuklandi`);
        } catch (error) {
            console.error('Firebase xatolik, localStorage\'dan yuklanmoqda:', error);
            products = JSON.parse(localStorage.getItem('products')) || defaultProducts;
        }
    } else {
        console.log('⚠️ Firebase ulanmagan, localStorage\'dan yuklanmoqda');
        products = JSON.parse(localStorage.getItem('products')) || defaultProducts;
    }

    // Mahsulotlarni ko'rsatish
    displayProducts('all');
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
        : products.filter(p => p.category === filter);

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
    card.id = `product-card-${product.id}`; // Add unique ID for scrolling
    // card.setAttribute('data-category', product.category); // Optional, but good for filtering compatibility if needed

    // Check if new (less than 7 days)
    const isNew = (new Date() - new Date(product.createdAt?.toDate ? product.createdAt.toDate() : product.createdAt)) / (1000 * 60 * 60 * 24) < 7;

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300?text=${product.name}'">
            <button class="favorite-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : (isNew ? '<span class="product-badge new">Yangi</span>' : '')}
        </div>
        <div class="product-info">
            <div class="product-price-row">
                <span class="product-price">${formatPrice(product.price)} so'm</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB547" stroke="#FFB547">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span class="rating-score">4.9</span>
            </div>
            <div class="product-footer" id="footer-${product.id}">
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
            <div class="qty-counter full-width-qty">
                <button class="qty-btn" onclick="changeQuantity('${product.id}', -1)">−</button>
                <span class="qty-display">${cartItem.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity('${product.id}', 1)">+</button>
            </div>
        `;
    } else {
        // Savatda yo'q (Add button only)
        return `
            <button class="btn-add-uzum" onclick="addToCart('${product.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                    <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span>Tanlash</span>
            </button>
        `;
    }
}

function updateProductUI(productId) {
    const footer = document.getElementById(`footer-${productId}`);
    if (footer) {
        const product = products.find(p => p.id.toString() === productId.toString());
        if (product) {
            footer.innerHTML = getProductFooterHTML(product);
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
    if (cart.length === 0) {
        showNotification('Savatchada mahsulotlar yo\'q');
        return;
    }

    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');

    // Render cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80'">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-controls" style="display: flex; gap: 10px; align-items: center; margin: 5px 0;">
                    <button onclick="changeQuantity('${item.id}', -1)" style="padding: 2px 8px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer;">-</button>
                    <span style="font-weight: 600;">${item.quantity}</span>
                    <button onclick="changeQuantity('${item.id}', 1)" style="padding: 2px 8px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer;">+</button>
                </div>
                <div class="cart-item-price">${formatPrice(item.price * item.quantity)} so'm</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">O'chirish</button>
        </div>
    `).join('');

    // Update total
    updateCartTotal();

    // Show modal
    modal.classList.add('active');
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
    updateProductUI(productId);

    const modal = document.getElementById('cartModal');
    const isModalOpen = modal.classList.contains('active');

    if (cart.length === 0) {
        if (isModalOpen) closeCartModal();
        showNotification('Savatcha bo\'shatildi');
    } else {
        if (isModalOpen) openCartModal(); // Refresh cart display only if open
        if (!isModalOpen) showNotification('Mahsulot o\'chirildi'); // Notification only if modal closed
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
        if (modal.classList.contains('active')) {
            openCartModal();
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
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update total in order modal
    document.getElementById('orderTotalPrice').textContent = formatPrice(total) + ' so\'m';

    // Show modal
    modal.classList.add('active');
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    document.getElementById('orderForm').reset();
}

// ================================
// TELEGRAM ORDER SUBMISSION
// ================================

async function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const comment = document.getElementById('orderComment').value;

    // Get Telegram config
    const BOT_TOKEN = window.TELEGRAM_CONFIG?.BOT_TOKEN;
    const CHAT_ID = window.TELEGRAM_CONFIG?.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        alert('❌ Telegram bot sozlanmagan! telegram-config.js faylini tekshiring.');
        return;
    }

    // Create order message
    let message = `🔔 *YANGI BUYURTMA*\n\n`;
    message += `👤 *Ism:* ${name}\n`;
    message += `📞 *Telefon:* ${phone}\n`;
    if (comment) {
        message += `💬 *Izoh:* ${comment}\n`;
    }
    message += `\n📦 *Mahsulotlar:*\n`;
    message += `━━━━━━━━━━━━━━━━\n`;

    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   Soni: ${item.quantity} ta\n`;
        message += `   Narxi: ${formatPrice(item.price * item.quantity)} so'm\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💰 *JAMI: ${formatPrice(total)} so'm*\n\n`;
    message += `📅 Sana: ${new Date().toLocaleString('uz-UZ')}`;

    // Show loading notification
    showNotification('Buyurtma yuborilmoqda...');

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

        if (data.ok) {
            // Success
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            closeOrderModal();
            showNotification('✅ Buyurtma qabul qilindi! Tez orada aloqaga chiqamiz.');
        } else {
            console.error('Telegram error:', data);
            alert(`Xatolik: ${data.description}`);
        }
    } catch (error) {
        console.error('Network error:', error);
        showNotification('❌ Internet bilan aloqa yo\'q', 'error');
    }
}

// Make globally available
window.submitOrder = submitOrder;


// Close modals when clicking outside
window.addEventListener('click', function (event) {
    const cartModal = document.getElementById('cartModal');
    const orderModal = document.getElementById('orderModal');

    if (event.target === cartModal) {
        closeCartModal();
    }
    if (event.target === orderModal) {
        closeOrderModal();
    }
});

// Global functions for onclick handlers
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.removeFromCart = removeFromCart;
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.showNotification = showNotification;
window.changeQuantity = changeQuantity;
// window.submitOrder allaqachon yuqorida aniqlangan
