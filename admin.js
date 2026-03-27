// ================================
// ADMIN PANEL FUNCTIONALITY
// ================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize admin panel
    initSidebarNavigation();
    loadDashboardStats();
    loadProductsTable();
    initProductForm();
    initProductSearch();
    initImagePreview();
});

// ================================
// SIDEBAR NAVIGATION
// ================================

function initSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.admin-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Get section to show
            const sectionId = this.getAttribute('data-section');

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));

            // Show selected section
            const targetSection = document.getElementById(`${sectionId}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// ================================
// DASHBOARD STATS
// ================================

function loadDashboardStats() {
    const products = window.getProducts ? window.getProducts() : JSON.parse(localStorage.getItem('products')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update total products
    const totalProducts = document.getElementById('totalProducts');
    if (totalProducts) {
        totalProducts.textContent = products.length;
    }

    // Update cart items
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItems.textContent = totalItems;
    }

    // Load recent products
    loadRecentProducts();
}

function loadRecentProducts() {
    const products = window.getProducts ? window.getProducts() : JSON.parse(localStorage.getItem('products')) || [];
    const recentProductsList = document.getElementById('recentProductsList');

    if (!recentProductsList) return;

    // Get last 5 products
    const recentProducts = products.slice(-5).reverse();

    if (recentProducts.length === 0) {
        recentProductsList.innerHTML = `
            <div class="empty-state">
                <p>Hozircha mahsulotlar yo'q</p>
            </div>
        `;
        return;
    }

    // Create table
    let html = `
        <div class="table-header">
            <div>Rasm</div>
            <div>Mahsulot</div>
            <div>Kategoriya</div>
            <div>Narx</div>
            <div>Badge</div>
            <div>Harakatlar</div>
        </div>
    `;

    recentProducts.forEach(product => {
        html += createTableRow(product);
    });

    recentProductsList.innerHTML = html;
    attachDeleteListeners();
}

// ================================
// PRODUCTS TABLE
// ================================

function loadProductsTable(filter = 'all', searchTerm = '') {
    let products = window.getProducts ? window.getProducts() : JSON.parse(localStorage.getItem('products')) || [];
    const productsTable = document.getElementById('productsTable');

    if (!productsTable) return;

    // Apply filters
    if (filter !== 'all') {
        products = products.filter(p => p.category === filter);
    }

    if (searchTerm) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (products.length === 0) {
        productsTable.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                    <path d="M12 2v5M16 7V2M8 7V2"></path>
                </svg>
                <p>Mahsulotlar topilmadi</p>
            </div>
        `;
        return;
    }

    // Create table
    let html = `
        <div class="table-header">
            <div>Rasm</div>
            <div>Mahsulot</div>
            <div>Kategoriya</div>
            <div>Narx</div>
            <div>Badge</div>
            <div>Harakatlar</div>
        </div>
    `;

    products.forEach(product => {
        html += createTableRow(product);
    });

    productsTable.innerHTML = html;
    attachDeleteListeners();
}

function createTableRow(product) {
    const discount = typeof getActiveDiscountForProduct === 'function' ? getActiveDiscountForProduct(product) : null;
    let priceHTML = '';

    if (discount) {
        priceHTML = `
            <div style="display: flex; flex-direction: column; gap: 1.5px;">
                <div style="font-size: 0.75rem; color: #999; display: flex; align-items: center; gap: 4px;">
                    <span style="text-decoration: line-through;">${formatPrice(product.price)} so'm</span>
                    <span style="font-size: 0.7rem; background: #eee; padding: 1px 4px; border-radius: 3px; color: #777;">asl narxi</span>
                </div>
                <div style="color: #ff3d57; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                    <span>${formatPrice(discount.price)} so'm</span>
                    <span style="font-size: 0.65rem; background: rgba(255, 61, 87, 0.1); color: #ff3d57; padding: 1px 4px; border-radius: 3px; text-transform: uppercase; font-weight: 800;">chegirmada</span>
                </div>
            </div>
        `;
    } else {
        priceHTML = `<div class="price-cell">${formatPrice(product.price)} so'm</div>`;
    }

    return `
        <div class="table-row">
            <div>
                <img src="${product.image}" alt="${product.name}" class="product-thumbnail" 
                     onerror="this.src='https://via.placeholder.com/60x60/667eea/ffffff?text=FE'">
            </div>
            <div class="product-info-cell">
                <div class="product-name-cell">${product.name}</div>
                <div class="product-desc-cell">${product.description}</div>
            </div>
            <div>
                <span class="category-badge">${getCategoryName(product.category)}</span>
            </div>
            <div class="price-cell-container">
                ${priceHTML}
            </div>
            <div>${product.badge || '-'}</div>
            <div class="actions-cell">
                <button class="action-btn edit" data-id="${product.id}" title="Tahrirlash">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete" data-id="${product.id}" title="O'chirish">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
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
// DELETE PRODUCT
// ================================

function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    const editButtons = document.querySelectorAll('.action-btn.edit');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));

            if (confirm('Ushbu mahsulotni o\'chirmoqchimisiz?')) {
                deleteProduct(productId);
            }
        });
    });

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
}

function deleteProduct(productId) {
    if (window.deleteProduct) {
        window.deleteProduct(productId);
    } else {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Reload tables
    loadProductsTable();
    loadDashboardStats();

    // Show success message
    showAdminNotification('Mahsulot muvaffaqiyatli o\'chirildi!', 'success');
}

// ================================
// PRODUCT FORM
// ================================

function initProductForm() {
    const form = document.getElementById('addProductForm');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const productId = document.getElementById('productId').value;

        // Get form values
        const product = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseInt(document.getElementById('productPrice').value),
            description: document.getElementById('productDescription').value,
            image: document.getElementById('productImage').value,
            badge: document.getElementById('productBadge').value || null
        };

        // Validate
        if (!product.name || !product.category || !product.price || !product.description || !product.image) {
            showAdminNotification('Iltimos, barcha majburiy maydonlarni to\'ldiring!', 'error');
            return;
        }

        // Check if editing or adding
        if (productId) {
            // Update existing product
            updateProduct(parseInt(productId), product);
        } else {
            // Add new product
            saveNewProduct(product);
        }
    });

    // Reset button handler
    form.addEventListener('reset', function () {
        setTimeout(() => {
            resetForm();
        }, 10);
    });
}

function saveNewProduct(product) {
    if (window.saveProduct) {
        window.saveProduct(product);
    } else {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Show success message
    showAdminNotification('Mahsulot muvaffaqiyatli qo\'shildi!', 'success');

    // Reset form
    resetForm();

    // Reload tables
    loadProductsTable();
    loadDashboardStats();

    // Switch to products section
    setTimeout(() => {
        document.querySelector('.sidebar-link[data-section="products"]').click();
    }, 1500);
}

function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        showAdminNotification('Mahsulot topilmadi!', 'error');
        return;
    }

    // Fill form with product data
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productBadge').value = product.badge || '';

    // Update image preview
    const imagePreview = document.getElementById('imagePreview');
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = 'Preview';
    imagePreview.innerHTML = '';
    imagePreview.appendChild(img);
    imagePreview.classList.add('has-image');

    // Update form title
    document.getElementById('formTitle').textContent = 'Mahsulotni tahrirlash';
    document.getElementById('formSubtitle').textContent = 'Mahsulot ma\'lumotlarini yangilang';

    // Change button text
    const submitBtn = document.querySelector('#addProductForm button[type="submit"]');
    const btnText = submitBtn.querySelector('svg').nextSibling;
    btnText.textContent = ' Yangilash';

    // Switch to add-product section
    document.querySelector('.sidebar-link[data-section="add-product"]').click();
}

function updateProduct(productId, updatedData) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
        showAdminNotification('Mahsulot topilmadi!', 'error');
        return;
    }

    // Update product
    products[index] = { ...products[index], ...updatedData, id: productId };
    localStorage.setItem('products', JSON.stringify(products));

    // Show success message
    showAdminNotification('Mahsulot muvaffaqiyatli yangilandi!', 'success');

    // Reset form
    resetForm();

    // Reload tables
    loadProductsTable();
    loadDashboardStats();

    // Switch to products section
    setTimeout(() => {
        document.querySelector('.sidebar-link[data-section="products"]').click();
    }, 1500);
}

function resetForm() {
    const form = document.getElementById('addProductForm');
    form.reset();

    document.getElementById('productId').value = '';
    document.getElementById('imagePreview').innerHTML = '<p>Rasm preview</p>';
    document.getElementById('imagePreview').classList.remove('has-image');

    // Reset form title
    document.getElementById('formTitle').textContent = 'Yangi mahsulot qo\'shish';
    document.getElementById('formSubtitle').textContent = 'Mahsulot ma\'lumotlarini kiriting';

    // Reset button text
    const submitBtn = document.querySelector('#addProductForm button[type="submit"]');
    const btnText = submitBtn.querySelector('svg').nextSibling;
    btnText.textContent = ' Mahsulotni saqlash';
}

// ================================
// SEARCH & FILTER
// ================================

function initProductSearch() {
    const searchInput = document.getElementById('searchProducts');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value;
            const category = categoryFilter ? categoryFilter.value : 'all';
            loadProductsTable(category, searchTerm);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function () {
            const category = this.value;
            const searchTerm = searchInput ? searchInput.value : '';
            loadProductsTable(category, searchTerm);
        });
    }
}

// ================================
// IMAGE PREVIEW
// ================================

function initImagePreview() {
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');

    if (!imageInput || !imagePreview) return;

    imageInput.addEventListener('input', function () {
        const url = this.value;

        if (!url) {
            imagePreview.innerHTML = '<p>Rasm preview</p>';
            imagePreview.classList.remove('has-image');
            return;
        }

        // Create image element
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Preview';

        img.onload = function () {
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            imagePreview.classList.add('has-image');
        };

        img.onerror = function () {
            imagePreview.innerHTML = '<p style="color: var(--accent-color);">Rasm yuklanmadi. URL ni tekshiring.</p>';
            imagePreview.classList.remove('has-image');
        };
    });
}

// ================================
// NOTIFICATIONS
// ================================

function showAdminNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.success-message, .error-message');
    existing.forEach(el => el.remove());

    // Create notification
    const notification = document.createElement('div');
    notification.className = type === 'success' ? 'success-message' : 'error-message';
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
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
