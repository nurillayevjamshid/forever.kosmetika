/**
 * CosmeticaCRM - Men Kosmetika Biznesi uchun CRM Tizimi
 * App.js - Firebase Compat Version (Updated)
 */

// ==========================================
// AUTHENTICATION CHECK
// ==========================================
var auth = firebase.auth();
var currentUserRole = 'admin';

auth.onAuthStateChanged(function (user) {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('displayUserName').textContent = user.email || 'Foydalanuvchi';
        // Load user role from Firestore (default admin)
        db.collection('users').doc(user.uid).get().then(function (doc) {
            if (doc.exists) {
                var data = doc.data() || {};
                if (data.role) currentUserRole = String(data.role).trim().toLowerCase();
                // Update role text in UI
                var roleTextEl = document.querySelector('.user-role');
                if (roleTextEl) {
                    roleTextEl.textContent = (currentUserRole === 'admin') ? 'Admin' : 'Menejer';
                }
            }
            renderProducts();
            updateUIVisibility();
        }).catch(function (error) {
            console.error("Error loading user role:", error);
            currentUserRole = 'admin';
            renderProducts();
            updateUIVisibility();
        });
    }
});

document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    auth.signOut().then(function () {
        window.location.href = 'login.html';
    }).catch(function (error) {
        showToast('Chiqishda xatolik: ' + error.message, 'error');
    });
});

// ==========================================
// FORMAT HELPERS
// ==========================================
function formatMoney(amount) {
    return new Intl.NumberFormat('uz-UZ').format(amount || 0) + " so'm";
}

function formatPlainMoney(amount) {
    return new Intl.NumberFormat('uz-UZ').format(amount || 0);
}

function getProductImagesList(product) {
    if (!product) return [];
    var images = [];
    if (Array.isArray(product.imageUrls)) {
        product.imageUrls.forEach(function (url) {
            if (typeof url === 'string' && url.trim()) images.push(url.trim());
        });
    }
    if (typeof product.imageUrl === 'string' && product.imageUrl.trim()) images.push(product.imageUrl.trim());
    if (typeof product.image === 'string' && product.image.trim()) images.push(product.image.trim());
    // Unique
    return images.filter(function (url, idx, arr) { return arr.indexOf(url) === idx; });
}

function getProductMainImage(product) {
    var list = getProductImagesList(product);
    return list.length ? list[0] : '';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    var months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
    return d.getDate() + '-' + months[d.getMonth()] + '. ' + d.getFullYear();
}

function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type) {
    type = type || 'success';
    var container = document.getElementById('toastContainer');
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    var icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
    var iconEl = document.createElement('i');
    iconEl.className = 'fas fa-' + (icons[type] || 'info-circle');
    var textNode = document.createTextNode(' ' + (message || ''));
    toast.appendChild(iconEl);
    toast.appendChild(textNode);
    container.appendChild(toast);
    toast.addEventListener('click', function () {
        toast.classList.add('fadeout');
        setTimeout(function () { toast.remove(); }, 300);
    });
    setTimeout(function () {
        toast.classList.add('fadeout');
        setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('click', function (e) {
    if (e.target.closest('.modal-close') || e.target.closest('[data-modal]')) {
        var btn = e.target.closest('[data-modal]');
        if (btn) closeModal(btn.dataset.modal);
    }
    if (e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
    }
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(function (m) { closeModal(m.id); });
    }
});

// ==========================================
// NAVIGATION
// ==========================================
var pageConfig = {
    dashboard: { title: 'Dashboard', subtitle: "Umumiy ko'rinish va statistika" },
    sales: { title: 'Sotuvlar', subtitle: 'Barcha sotuvlarni boshqarish' },
    finance: { title: 'Kirim / Chiqim', subtitle: 'Moliyaviy operatsiyalar' },
    products: { title: 'Mahsulotlar', subtitle: "Mahsulotlar ro'yxati va boshqaruvi" },
    settings: { title: 'Sozlamalar', subtitle: 'Tizim sozlamalari boshqaruvi' },
    staff: { title: 'Xodimlar', subtitle: 'Xodimlar va kirish huquqlari' },
    customers: { title: 'Mijozlar', subtitle: 'Mijozlar bazasi va tarixi' },
    profile: { title: 'Menejer Profili', subtitle: 'Shaxsiy profil va ish statistikasi' }
};

function navigateTo(pageName) {
    document.querySelectorAll('.nav-item').forEach(function (item) {
        item.classList.toggle('active', item.dataset.page === pageName);
    });
    document.querySelectorAll('.page').forEach(function (page) {
        page.classList.toggle('active', page.id === 'page-' + pageName);
    });
    var config = pageConfig[pageName];
    if (config) {
        document.getElementById('pageTitle').textContent = config.title;
        document.getElementById('pageSubtitle').textContent = config.subtitle;
    }
    document.getElementById('sidebar').classList.remove('open');
    var overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
    updateUIVisibility(pageName);
    if (pageName === 'customers') renderCustomers();
    if (pageName === 'profile') loadUserProfile();
}

function updateUIVisibility(currentPage) {
    // Hozirgi foydalanuvchi ma'lumotlarini olish
    var user = firebase.auth().currentUser;
    if (!user) return;

    db.collection('users').doc(user.uid).get().then(function (doc) {
        var perms = { sales: true, customers: true, finance: true, products: true, staff: false, settings: false };
        var isAdmin = false;

        if (doc.exists) {
            var data = doc.data();
            isAdmin = (data.role === 'admin');
            if (data.permissions) perms = data.permissions;
        }

        // Sidebar menyularini boshqarish
        document.querySelectorAll('.nav-item').forEach(function (item) {
            var page = item.dataset.page;
            if (isAdmin) {
                item.style.display = 'block';
            } else {
                // Admin bo'lmaganlar uchun ruxsatnomalarni tekshirish
                if (perms[page] === false) {
                    item.style.display = 'none';
                    // Agar hozirgi sahifa yashirilgan bo'lsa, dashboardga yo'naltirish
                    if (currentPage === page) navigateTo('dashboard');
                } else {
                    item.style.display = 'block';
                }
            }
        });

        // Batafsil amallar ruxsatnomalarini boshqarish
        if (isAdmin) {
            document.querySelectorAll('.btn-icon.delete, .btn-icon.edit, #addUserBtn, #addFinanceBtn, .amount-box').forEach(function (el) {
                el.style.display = '';
            });
        } else {
            // Sotuvlarni tahrirlash/o'chirish
            document.querySelectorAll('.sale-edit-btn, .sale-delete-btn').forEach(function (btn) {
                btn.style.display = perms.editSale !== false ? 'inline-flex' : 'none';
            });

            // Mijozlarni o'chirish
            document.querySelectorAll('.customer-delete-btn').forEach(function (btn) {
                btn.style.display = perms.deleteCustomer !== false ? 'inline-flex' : 'none';
            });

            // Chiqim qo'shish (Moliya bo'limida)
            var addFinanceBtn = document.getElementById('addFinanceBtn');
            if (addFinanceBtn) {
                addFinanceBtn.style.display = perms.addExpense !== false ? 'inline-flex' : 'none';
            }

            // Sof foyda va moliyani ko'rish (Dashboard)
            var profitBoxes = document.querySelectorAll('.amount-box');
            profitBoxes.forEach(function (box) {
                if (perms.showProfit === false) {
                    box.style.filter = 'blur(5px)';
                    box.style.pointerEvents = 'none';
                    box.title = 'Ruxsat berilmagan';
                } else {
                    box.style.filter = '';
                    box.style.pointerEvents = '';
                }
            });

            // Xodimlar va Sozlamalar bo'limidagi amallar
            document.querySelectorAll('.user-edit-btn, .user-delete-btn, #addUserBtn').forEach(function (btn) {
                btn.style.display = 'none'; // Managerlar xodimlarni o'zgartira olmaydi
            });
        }

    }).catch(function (error) {
        console.error("UI visibility error:", error);
    });

    initSelectPicker('customerRegionPicker', allRegions);
}

// Sidebar navigation (event delegation for more reliable clicks)
document.addEventListener('click', function (e) {
    var navLink = e.target.closest('.nav-link');
    if (!navLink) return;
    var navItem = navLink.closest('.nav-item');
    if (!navItem) return;
    var page = navItem.dataset.page;
    if (!page) return;
    e.preventDefault();
    navigateTo(page);
});

document.getElementById('nav-profile').addEventListener('click', function (e) {
    e.preventDefault();
    navigateTo('profile');
});

function loadUserProfile() {
    var user = auth.currentUser;
    if (!user) return;

    document.getElementById('infoEmail').textContent = user.email;
    document.getElementById('infoUid').textContent = user.uid;
    document.getElementById('profileName').textContent = user.email.split('@')[0];

    // Role display
    var role = (currentUserRole === 'admin') ? 'Admin' : 'Menejer';
    document.getElementById('infoRole').textContent = role;
    document.getElementById('profileRoleText').innerHTML = '<i class="fas fa-shield-halved"></i> ' + role;

    // Load performance stats
    var userSales = salesArr.filter(function (s) { return false; });

    // Ruxsatnomalarni yuklash
    db.collection('users').doc(user.uid).get().then(function (doc) {
        if (doc.exists) {
            var data = doc.data();
            if (data.name) document.getElementById('profileName').textContent = data.name;
            
            // Faqat adminlar ruxsatnomalarni ko'ra oladi va o'zgartira oladi
            var isAdmin = (currentUserRole === 'admin');
            var card = document.getElementById('profilePermissionsCard');
            if (card) card.style.display = isAdmin ? 'block' : 'none';

            if (data.permissions) {
                var p = data.permissions;
                var permSales = document.getElementById('profile_perm_sales');
                if (permSales) permSales.checked = p.sales !== false;
                var permCustomers = document.getElementById('profile_perm_customers');
                if (permCustomers) permCustomers.checked = p.customers !== false;
                var permFinance = document.getElementById('profile_perm_finance');
                if (permFinance) permFinance.checked = p.finance !== false;
                var permProducts = document.getElementById('profile_perm_products');
                if (permProducts) permProducts.checked = p.products !== false;
                var permStaff = document.getElementById('profile_perm_staff');
                if (permStaff) permStaff.checked = !!p.staff;
                var permSettings = document.getElementById('profile_perm_settings');
                if (permSettings) permSettings.checked = !!p.settings;

                // Detallar
                var permShowProfit = document.getElementById('profile_perm_show_profit');
                if (permShowProfit) permShowProfit.checked = p.showProfit !== false;
                var permAddExpense = document.getElementById('profile_perm_add_expense');
                if (permAddExpense) permAddExpense.checked = p.addExpense !== false;
                var permEditSale = document.getElementById('profile_perm_edit_sale');
                if (permEditSale) permEditSale.checked = p.editSale !== false;
                var permDeleteCustomer = document.getElementById('profile_perm_delete_customer');
                if (permDeleteCustomer) permDeleteCustomer.checked = p.deleteCustomer !== false;
            }
        }
    });
}

// Ruxsatnomalarni saqlash
document.getElementById('saveProfilePermissionsBtn').addEventListener('click', function() {
    var user = auth.currentUser;
    if (!user) return;

    var permSalesEl = document.getElementById('profile_perm_sales');
    if (!permSalesEl) return;

    var btn = this;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saqlanmoqda...';

    var perms = {
        sales: permSalesEl.checked,
        customers: document.getElementById('profile_perm_customers').checked,
        finance: document.getElementById('profile_perm_finance').checked,
        products: document.getElementById('profile_perm_products').checked,
        staff: document.getElementById('profile_perm_staff').checked,
        settings: document.getElementById('profile_perm_settings').checked,
        // Detallar
        showProfit: document.getElementById('profile_perm_show_profit').checked,
        addExpense: document.getElementById('profile_perm_add_expense').checked,
        editSale: document.getElementById('profile_perm_edit_sale').checked,
        deleteCustomer: document.getElementById('profile_perm_delete_customer').checked
    };

    db.collection('users').doc(user.uid).update({ permissions: perms }).then(function() {
        showToast("Ruxsatnomalar muvaffaqiyatli yangilandi!");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> O\'zgarishlarni saqlash';
        updateUIVisibility(); // UI-ni darhol yangilash
    }).catch(function(err) {
        showToast("Xatolik: " + err.message, "error");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> O\'zgarishlarni saqlash';
    });
});

var logoutBtnProfile = document.getElementById('logoutBtnProfile');
if (logoutBtnProfile) {
    logoutBtnProfile.addEventListener('click', function () {
        auth.signOut().then(function () { window.location.href = 'login.html'; });
    });
}

// ==========================================
// MOBILE SIDEBAR
// ==========================================
var mobileMenuBtn = document.getElementById('mobileMenuBtn');
var sidebar = document.getElementById('sidebar');
var sidebarOverlay = document.createElement('div');
sidebarOverlay.className = 'sidebar-overlay';
document.body.appendChild(sidebarOverlay);

mobileMenuBtn.addEventListener('click', function () {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
});
sidebarOverlay.addEventListener('click', function () {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
});

// ==========================================
// CATEGORY METADATA (WITH ICONS)
// ==========================================
var categoryIcons = {
    // Finance Categories
    'Sotuv daromadi': { icon: 'fa-shopping-bag', color: '#10b981' },
    'Boshqa kirim': { icon: 'fa-plus-circle', color: '#3b82f6' },
    "Qaytarilgan mablag'": { icon: 'fa-undo', color: '#f59e0b' },
    'Investitsiya': { icon: 'fa-hand-holding-usd', color: '#8b5cf6' },
    'Target': { icon: 'fa-bullseye', color: '#ef4444' },
    'Yandex': { icon: 'fa-taxi', color: '#fcd34d' },
    'Pochta': { icon: 'fa-envelope', color: '#64748b' },
    // Product Categories
    'Yuz kremi': { icon: 'fa-sparkles', color: '#f472b6' },
    'Parfyumeriya': { icon: 'fa-spray-can', color: '#a78bfa' },
    'Soqol parvarishi': { icon: 'fa-user-ninja', color: '#4b5563' },
    'Soch parvarishi': { icon: 'fa-scissors', color: '#fbbf24' },
    'Tana parvarishi': { icon: 'fa-spa', color: '#34d399' },
    'Atir': { icon: 'fa-bottle-droplet', color: '#ec4899' },
    'Dezodorant': { icon: 'fa-wind', color: '#60a5fa' },
    'Boshqa': { icon: 'fa-box', color: '#94a3b8' }
};

var incomeCategories = ['Sotuv daromadi', 'Boshqa kirim', "Qaytarilgan mablag'", 'Investitsiya'];
var expenseCategories = ['Target', 'Yandex', 'Pochta'];
var allProductCategories = ['Yuz kremi', 'Parfyumeriya', 'Soqol parvarishi', 'Soch parvarishi', 'Tana parvarishi', 'Atir', 'Dezodorant', 'Boshqa'];
var allRegions = ["Toshkent shahri", "Toshkent viloyati", "Andijon", "Buxoro", "Farg'ona", "Jizzax", "Namangan", "Navoiy", "Qashqadaryo", "Samarqand", "Sirdaryo", "Surxondaryo", "Xorazm", "Qoraqalpog'iston"];

// ==========================================
// SELECT PICKER SYSTEM
// ==========================================
function setSelectValue(pickerId, value, label) {
    var picker = document.getElementById(pickerId);
    if (!picker) return;
    var input = picker.querySelector('input[type="hidden"]');
    var triggerLabel = picker.querySelector('.select-trigger-label');
    var options = picker.querySelectorAll('.select-option');

    if (input) input.value = value;
    if (triggerLabel) triggerLabel.textContent = label || value || 'Tanlang...';

    options.forEach(function (opt) {
        opt.classList.toggle('selected', opt.dataset.value === value);
    });
}

function initSelectPicker(pickerId, options, onSelect) {
    var picker = document.getElementById(pickerId);
    if (!picker) return;
    var trigger = picker.querySelector('.select-trigger');
    var dropdown = picker.querySelector('.select-dropdown');

    // Build options if provided
    if (options && options.length > 0) {
        dropdown.innerHTML = options.map(function (opt) {
            var val = typeof opt === 'string' ? opt : opt.value;
            var lab = typeof opt === 'string' ? opt : opt.label;
            var meta = categoryIcons[val] || { icon: 'fa-circle-dot', color: 'currentColor' };
            return '<button type="button" class="select-option" data-value="' + val + '" data-label="' + lab + '">' +
                '<i class="fas ' + meta.icon + '" style="color:' + meta.color + '"></i>' +
                '<span>' + lab + '</span>' +
                '</button>';
        }).join('');
    }

    // Toggle dropdown
    trigger.onclick = function (e) {
        e.stopPropagation();
        var isOpen = picker.classList.contains('open');
        document.querySelectorAll('.select-picker.open').forEach(function (p) { p.classList.remove('open'); });
        if (!isOpen) picker.classList.add('open');
    };

    // Option click
    dropdown.onclick = function (e) {
        var opt = e.target.closest('.select-option');
        if (!opt) return;
        var val = opt.dataset.value;
        var lab = opt.dataset.label;
        setSelectValue(pickerId, val, lab);
        picker.classList.remove('open');
        if (onSelect) onSelect(val, lab);
    };
}

// Close pickers on outside click
document.addEventListener('click', function () {
    document.querySelectorAll('.select-picker.open').forEach(function (p) {
        p.classList.remove('open');
    });
});

// ==========================================
// DATA STATE
// ==========================================
var productsArr = [];

var salesArr = [];
var financesArr = [];
var usersArr = [];

// Filter holatlari
var salesFilter = { region: 'all' };
var financeFilter = { type: 'all', category: 'all' };
var productsFilter = { category: 'all', status: 'all' };

// ==========================================
// REAL-TIME FIRESTORE LISTENERS
// ==========================================
db.collection("products").onSnapshot(function (snapshot) {
    productsArr = [];
    snapshot.forEach(function (doc) { productsArr.push(Object.assign({ id: doc.id }, doc.data())); });
    renderProducts();
    syncSaleItemRowOptions();
    updateSaleTotal();
    refreshDashboard();
});



db.collection("sales").onSnapshot(function (snapshot) {
    salesArr = [];
    snapshot.forEach(function (doc) { salesArr.push(Object.assign({ id: doc.id }, doc.data())); });
    renderSales();
    refreshDashboard();
});

db.collection("finances").onSnapshot(function (snapshot) {
    financesArr = [];
    snapshot.forEach(function (doc) { financesArr.push(Object.assign({ id: doc.id }, doc.data())); });
    renderFinance();
    refreshDashboard();
});

// ==========================================
// === PRODUCTS CRUD ===
// ==========================================
function renderProducts(searchTerm) {
    searchTerm = searchTerm || '';
    var tbody = document.getElementById('productsBody');
    var empty = document.getElementById('productsEmpty');
    var filtered = productsArr.slice();
    if (searchTerm) {
        var q = searchTerm.toLowerCase();
        filtered = filtered.filter(function (p) { return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q); });
    }
    // Yordamchi adminlar faqat active mahsulotlarni ko'radi
    if (currentUserRole !== 'admin') {
        filtered = filtered.filter(function (p) { return (p.status || 'active') !== 'inactive'; });
    }
    // Filter: kategoriya
    if (productsFilter.category !== 'all') {
        filtered = filtered.filter(function (p) { return (p.category || '') === productsFilter.category; });
    }
    // Filter: status
    if (productsFilter.status !== 'all') {
        filtered = filtered.filter(function (p) { return (p.status || 'active') === productsFilter.status; });
    }
    if (filtered.length === 0) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    tbody.innerHTML = filtered.map(function (p, i) {
        var status = p.status || 'active';
        var statusClass = status === 'inactive' ? 'inactive' : 'active';
        var statusText = status === 'inactive' ? 'Inactive' : 'Active';
        var mainImage = getProductMainImage(p);
        var imageHtml = mainImage
            ? '<div class="product-list-thumb"><img src="' + mainImage + '" alt="' + escapeHtml(p.name) + '"></div>'
            : '<div class="product-list-thumb"><div class="product-list-thumb-placeholder">' + (escapeHtml(p.name || 'M')[0] || 'M') + '</div></div>';
        return '' +
            '<tr>' +
            '<td data-label="#">' + (i + 1) + '</td>' +
            '<td data-label="Mahsulot"><div class="product-list-info">' + imageHtml +
            '<div class="product-list-meta"><span class="product-list-name">' + escapeHtml(p.name) + '</span></div></div></td>' +
            '<td data-label="Kategoriya">' + escapeHtml(p.category || 'â€”') + '</td>' +
            '<td data-label="Narx">' + formatMoney(p.price) + '</td>' +
            '<td data-label="Tannarx">' + (p.cost ? formatMoney(p.cost) : '\u2014') + '</td>' +
            '<td data-label="Status"><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>' +
            '<td data-label="Amallar">' +
            '<button class="btn-icon edit product-edit-btn" data-id="' + p.id + '" title="Tahrirlash"><i class="fas fa-pen"></i></button>' +
            '<button class="btn-icon delete product-delete-btn" data-id="' + p.id + '" data-name="' + escapeHtml(p.name) + '" data-storage-path="' + (p.imageStoragePath || '') + '" title="O\'chirish"><i class="fas fa-trash"></i></button>' +
            '</td>' +
            '</tr>';
    }).join('');
}

function editProduct(id) {
    var p = productsArr.find(function (x) { return x.id === id; });
    if (!p) return;
    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name;
    initSelectPicker('productCategoryPicker', allProductCategories);
    setSelectValue('productCategoryPicker', p.category, p.category);
    setSelectValue('productStatusPicker', p.status || 'active', (p.status || 'active') === 'active' ? 'Active' : 'Inactive');
    document.getElementById('productModalTitle').innerHTML = '<i class="fas fa-box-open"></i> Mahsulotni tahrirlash';
    // Mavjud rasmlarni ko'rsatish
    resetImageUpload();
    setProductFormImages(getProductImagesList(p));
    openModal('productModal');
}

document.getElementById('addProductBtn').addEventListener('click', function () {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    initSelectPicker('productCategoryPicker', allProductCategories);
    setSelectValue('productCategoryPicker', '', 'Tanlang...');
    setSelectValue('productStatusPicker', 'active', 'Active');
    document.getElementById('productModalTitle').innerHTML = '<i class="fas fa-box-open"></i> Yangi Mahsulot';
    resetImageUpload();
    openModal('productModal');
});

// Mobile card click
document.addEventListener('click', function (e) {
    var card = e.target.closest('.product-mobile-card');
    if (card) {
        var id = card.dataset.id;
        var p = productsArr.find(function (x) { return x.id === id; });
        if (p) openProductDetailModal(p);
    }
});

function openProductDetailModal(p) {
    var body = document.getElementById('productDetailsBody');
    if (!body) return;

    var status = p.status || 'active';
    var statusClass = status === 'inactive' ? 'inactive' : 'active';
    var statusText = status === 'inactive' ? 'Inactive' : 'Active';

    var mainImage = getProductMainImage(p);
    var imageHtml = mainImage
        ? '<div style="width:100%; border-radius:16px; overflow:hidden; margin-bottom:20px; border:1px solid var(--border);">' +
          '<img src="' + mainImage + '" style="width:100%; height:auto; display:block;"></div>'
        : '<div style="width:100%; height:150px; background:var(--bg-secondary); border-radius:16px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; color:var(--text-muted); font-size:3rem; border:1px solid var(--border);"><i class="fas fa-box"></i></div>';

    body.innerHTML = 
        imageHtml +
        '<div style="margin-bottom:20px;">' +
        '<h2 style="font-size:1.5rem; font-weight:800; margin-bottom:8px;">' + escapeHtml(p.name) + '</h2>' +
        '<div style="display:flex; gap:10px; align-items:center;">' +
        '<span class="status-badge info">' + escapeHtml(p.category || "Kategoriyasiz") + '</span>' +
        '<span class="status-badge ' + statusClass + '">' + statusText + '</span>' +
        '</div>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">' +
        '<div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:12px; border-radius:14px;">' +
        '<span style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Sotuv narxi</span>' +
        '<div style="font-size:1.2rem; font-weight:800; color:var(--text); margin-top:4px;">' + formatMoney(p.price) + '</div>' +
        '</div>' +
        '<div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:12px; border-radius:14px;">' +
        '<span style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Tannarxi</span>' +
        '<div style="font-size:1.2rem; font-weight:800; color:var(--text); margin-top:4px;">' + (p.cost ? formatMoney(p.cost) : "—") + '</div>' +
        '</div>' +
        '</div>' +
        '<div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:15px; border-radius:14px;">' +
        '<span style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Tavsif</span>' +
        '<div style="margin-top:8px; font-size:14px; line-height:1.5; color:var(--text-secondary);">' + (escapeHtml(p.description) || "Tavsif mavjud emas") + '</div>' +
        '</div>';

    document.getElementById('productDetailEditBtn').onclick = function() {
        closeModal('productDetailsModal');
        editProduct(p.id);
    };

    openModal('productDetailsModal');
}

// Generic Status Picker
initSelectPicker('productStatusPicker');
initSelectPicker('newUserRolePicker');


document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var id = document.getElementById('productId').value;
    var saveBtn = document.getElementById('saveProductBtn');
    var prevBtnHtml = saveBtn ? saveBtn.innerHTML : '';
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saqlanmoqda...';
    }

    var data = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        status: document.getElementById('productStatus').value || 'active',
        cost: parseFloat(document.getElementById('productCost').value) || 0,
        description: document.getElementById('productDescription').value.trim(),
        updatedAt: new Date().toISOString()
    };

    // Rasmlar (ko'p rasm qo'llab-quvvatlash)
    if (productFormImages.length) {
        data.imageUrls = productFormImages.slice();
        data.imageUrl = productFormImages[0];
        if (!productImagesTouched && id) {
            var existingProduct = productsArr.find(function (p) { return p.id === id; });
            data.imageStoragePath = existingProduct ? (existingProduct.imageStoragePath || '') : '';
        } else {
            data.imageStoragePath = ''; // Base64 uchun storage path kerak emas
        }
    } else {
        // Agar rasm tanlanmagan bo'lsa, mavjud ma'lumotni saqlab qolamiz
        var existingProduct = productsArr.find(function (p) { return p.id === id; });
        if (existingProduct && !productImagesTouched) {
            var existingImages = getProductImagesList(existingProduct);
            data.imageUrls = existingImages;
            data.imageUrl = existingImages[0] || '';
            data.imageStoragePath = existingProduct.imageStoragePath || '';
        } else {
            data.imageUrls = [];
            data.imageUrl = '';
            data.imageStoragePath = '';
        }
    }

    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('imageUploadArea').classList.remove('uploading');

    function finishSave() {
        if (!saveBtn) return;
        saveBtn.disabled = false;
        saveBtn.innerHTML = prevBtnHtml || '<i class="fas fa-save"></i> Saqlash';
    }

    var savePromise = saveProductData(id, data);
    if (savePromise && typeof savePromise.then === 'function') {
        savePromise.then(function () { finishSave(); }, function () { finishSave(); });
    } else {
        finishSave();
    }
});



// CUSTOMERS CRUD REMOVED




// SALES MULTI-ITEM LOGIC
function getAvailableSaleProducts() {
    var list = productsArr.slice();
    if (currentUserRole !== 'admin') {
        list = list.filter(function (p) { return (p.status || 'active') !== 'inactive'; });
    }
    return list.sort(function (a, b) {
        return (a.name || '').localeCompare((b.name || ''), 'uz');
    });
}

function getSaleProductById(productId) {
    return productsArr.find(function (p) { return p.id === productId; }) || null;
}

function getSaleProductLabel(productId) {
    var product = getSaleProductById(productId);
    return product ? (product.name || 'Mahsulot') : 'Mahsulot tanlang...';
}

function buildSaleProductThumb(product) {
    var mainImage = getProductMainImage(product);
    if (mainImage) {
        return '<img src="' + escapeHtml(mainImage) + '" alt="' + escapeHtml(product.name || 'Mahsulot') + '">';
    }
    var firstLetter = ((product && product.name) ? product.name : 'M').charAt(0).toUpperCase();
    return '<span class="product-option-fallback">' + escapeHtml(firstLetter) + '</span>';
}

function buildSaleProductMenuItems(selectedId) {
    var products = getAvailableSaleProducts();
    if (products.length === 0) {
        return '<div class="product-option-empty">Mahsulot topilmadi</div>';
    }

    return products.map(function (p) {
        var isActive = p.id === selectedId ? ' active' : '';
        return '<button type="button" class="product-option-item' + isActive + '" data-pid="' + p.id + '">' +
            '<div class="product-option-thumb">' + buildSaleProductThumb(p) + '</div>' +
            '<div class="product-option-meta">' +
            '<span class="product-option-name">' + escapeHtml(p.name || 'Noma\'lum') + '</span>' +
            '<span class="product-option-price">' + formatMoney(p.price) + '</span>' +
            '</div>' +
            '</button>';
    }).join('');
}

function closeSaleProductDropdowns(exceptPicker) {
    document.querySelectorAll('#saleItemsList .item-product.open').forEach(function (picker) {
        if (exceptPicker && picker === exceptPicker) return;
        picker.classList.remove('open');
    });
}

var saleProductDropdownEventsBound = false;
function bindSaleProductDropdownEvents() {
    if (saleProductDropdownEventsBound) return;
    saleProductDropdownEventsBound = true;

    document.addEventListener('click', function (e) {
        if (!e.target.closest('#saleItemsList .item-product')) {
            closeSaleProductDropdowns();
        }
    });
}

function setSaleRowProduct(row, productId, autofillPrice) {
    var hiddenInput = row.querySelector('.item-product-select');
    var labelEl = row.querySelector('.item-product-trigger-label');
    var triggerBtn = row.querySelector('.item-product-trigger');
    var menu = row.querySelector('.item-product-dropdown');
    var priceInput = row.querySelector('.item-price-input');
    var safeId = productId || '';
    var product = getSaleProductById(safeId);
    if (!product) {
        safeId = '';
    }
    product = getSaleProductById(safeId);

    if (hiddenInput) hiddenInput.value = safeId;
    row.dataset.pid = safeId;
    if (labelEl) labelEl.textContent = getSaleProductLabel(safeId);
    if (triggerBtn) triggerBtn.title = getSaleProductLabel(safeId);
    row.classList.toggle('product-not-selected', !product);

    if (menu) {
        menu.querySelectorAll('.product-option-item').forEach(function (item) {
            item.classList.toggle('active', item.getAttribute('data-pid') === safeId);
        });
    }

    if (autofillPrice && priceInput) {
        priceInput.value = product ? (parseFloat(product.price) || 0) : 0;
    }

    updateSaleTotal();
}

function syncSaleItemRowOptions() {
    document.querySelectorAll('#saleItemsList .sale-item-row').forEach(function (row) {
        var hiddenInput = row.querySelector('.item-product-select');
        var selectedId = hiddenInput ? hiddenInput.value : '';
        var menu = row.querySelector('.item-product-dropdown');
        if (menu) {
            menu.innerHTML = buildSaleProductMenuItems(selectedId);
        }
        setSaleRowProduct(row, selectedId, false);
    });
}

function addSaleItemRow(itemData) {
    itemData = itemData || {};
    var container = document.getElementById('saleItemsList');
    if (!container) return;

    var selectedId = itemData.productId || '';
    var selectedProduct = getSaleProductById(selectedId);
    var quantity = parseInt(itemData.quantity, 10);
    if (!quantity || quantity < 1) quantity = 1;
    var price = parseFloat(itemData.price);
    if (isNaN(price)) price = selectedProduct ? (parseFloat(selectedProduct.price) || 0) : 0;

    var row = document.createElement('div');
    row.className = 'sale-item-row';
    row.dataset.pid = selectedId;
    row.innerHTML = '<div class="item-product">' +
        '<input type="hidden" class="item-product-select" value="' + escapeHtml(selectedId) + '">' +
        '<button type="button" class="item-product-trigger">' +
        '<span class="item-product-trigger-label">' + escapeHtml(getSaleProductLabel(selectedId)) + '</span>' +
        '<i class="fas fa-chevron-down"></i>' +
        '</button>' +
        '<div class="item-product-dropdown">' + buildSaleProductMenuItems(selectedId) + '</div>' +
        '</div>' +
        '<div class="item-qty item-qty-stepper">' +
        '<button type="button" class="qty-btn qty-minus" title="Kamaytirish"><i class="fas fa-minus"></i></button>' +
        '<input type="number" class="item-qty-input" min="1" step="1" value="' + quantity + '" required>' +
        '<button type="button" class="qty-btn qty-plus" title="Ko\'paytirish"><i class="fas fa-plus"></i></button>' +
        '</div>' +
        '<div class="item-price"><div class="item-price-wrap"><input type="number" class="item-price-input" min="0" step="100" value="' + price + '" required><span class="item-price-suffix">so\'m</span></div></div>' +
        '<button type="button" class="sale-item-remove" title="O\'chirish"><i class="fas fa-trash"></i></button>';

    var productPicker = row.querySelector('.item-product');
    var productMenu = row.querySelector('.item-product-dropdown');
    var productTrigger = row.querySelector('.item-product-trigger');
    var qtyInput = row.querySelector('.item-qty-input');
    var priceInput = row.querySelector('.item-price-input');
    var minusBtn = row.querySelector('.qty-minus');
    var plusBtn = row.querySelector('.qty-plus');

    bindSaleProductDropdownEvents();

    productTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = productPicker.classList.contains('open');
        closeSaleProductDropdowns(productPicker);
        productPicker.classList.toggle('open', !isOpen);
    });

    productMenu.addEventListener('click', function (e) {
        var option = e.target.closest('.product-option-item');
        if (!option) return;
        var pid = option.getAttribute('data-pid') || '';
        setSaleRowProduct(row, pid, true);
        productPicker.classList.remove('open');
    });

    qtyInput.addEventListener('input', updateSaleTotal);
    qtyInput.addEventListener('blur', function () {
        var qty = parseInt(this.value, 10);
        this.value = qty && qty > 0 ? qty : 1;
        updateSaleTotal();
    });

    minusBtn.addEventListener('click', function () {
        var qty = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = Math.max(1, qty - 1);
        updateSaleTotal();
    });

    plusBtn.addEventListener('click', function () {
        var qty = parseInt(qtyInput.value, 10) || 1;
        qtyInput.value = qty + 1;
        updateSaleTotal();
    });

    priceInput.addEventListener('input', updateSaleTotal);
    priceInput.addEventListener('blur', function () {
        var val = parseFloat(this.value);
        this.value = !isNaN(val) && val >= 0 ? val : 0;
        updateSaleTotal();
    });

    row.querySelector('.sale-item-remove').addEventListener('click', function () {
        row.remove();
        if (!container.querySelector('.sale-item-row')) {
            addSaleItemRow();
            return;
        }
        updateSaleTotal();
    });

    container.appendChild(row);
    setSaleRowProduct(row, selectedId, false);
}

function updateSaleTotal() {
    var total = 0;
    document.querySelectorAll('.sale-item-row').forEach(function (row) {
        var productSelect = row.querySelector('.item-product-select');
        var pid = productSelect ? productSelect.value : '';
        if (!pid) return;
        var qty = parseFloat(row.querySelector('.item-qty-input').value) || 0;
        var price = parseFloat(row.querySelector('.item-price-input').value) || 0;
        total += qty * price;
    });
    document.getElementById('saleTotalDisplay').textContent = formatMoney(total);
}

var addSaleItemBtn = document.getElementById('addSaleItemBtn');
if (addSaleItemBtn) {
    addSaleItemBtn.addEventListener('click', function () {
        addSaleItemRow();
    });
}



function renderSales(searchTerm) {
    searchTerm = searchTerm || '';
    var tbody = document.getElementById('salesBody');
    var mobileList = document.getElementById('salesMobileList');
    var empty = document.getElementById('salesEmpty');
    var filtered = salesArr.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    if (searchTerm) {
        var q = searchTerm.toLowerCase();
        filtered = filtered.filter(function (s) {
            return (s.name && s.name.toLowerCase().includes(q)) ||
                (s.region && s.region.toLowerCase().includes(q)) ||
                s.date.includes(q);
        });
    }
    // Filter: region
    if (salesFilter.region !== 'all') {
        filtered = filtered.filter(function (s) { return (s.region || '') === salesFilter.region; });
    }
    if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (mobileList) mobileList.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    var rowsHtml = [];
    var cardsHtml = [];

    filtered.forEach(function (s, i) {
        var items = s.items || [];
        var status = normalizeSaleStatus(s.status);
        var subtotal = (typeof s.subtotalAmount === 'number') ? s.subtotalAmount : computeSaleSubtotal(items);
        var deliveryAmount = (typeof s.deliveryAmount === 'number') ? s.deliveryAmount : calculateDeliveryPrice(subtotal, getRegionType(s.region));
        var totalAmount = (typeof s.totalAmount === 'number') ? s.totalAmount : (subtotal + deliveryAmount);
        var tagsHtml = items.map(function (it) {
            var p = productsArr.find(function (px) { return px.id === it.productId; });
            var pname = p ? escapeHtml(p.name) : '—';
            return '<span class="sale-row-item-tag">' + pname + ' <span class="qty">x' + it.quantity + '</span></span>';
        }).join('');

        var itemsHtml = '<div class="sale-items-card" data-sale-id="' + s.id + '">' + tagsHtml + '</div>';

        if (items.length > 5) {
            itemsHtml = '<div class="sale-items-card" data-sale-id="' + s.id + '">' +
                '<span class="sale-row-items-count"><i class="fas fa-boxes-stacked"></i> ' + items.length + ' ta mahsulot</span>' +
                '</div>';
        }

        var fullItemsText = items.map(function (it) {
            var p = productsArr.find(function (px) { return px.id === it.productId; });
            return (p ? p.name : '—') + ' (x' + it.quantity + ')';
        }).join(', ');

        var totalCost = (s.items || []).reduce(function(sum, it) {
            var p = productsArr.find(function(px) { return px.id === it.productId; });
            return sum + ((p ? p.costPrice || 0 : 0) * it.quantity);
        }, 0);

        var deliveryHtml = deliveryAmount > 0 ? formatMoney(deliveryAmount) : '<span class="status-badge active" style="background:var(--success-glow); color:var(--success);">Tekin</span>';

        var statusSelect = '<select class="status-select-inline" data-id="' + s.id + '" style="padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-secondary); font-size: 0.8rem; cursor: pointer;">' +
            '<option value="kutilmoqda" ' + (status === 'kutilmoqda' ? 'selected' : '') + '>Kutilmoqda</option>' +
            '<option value="sotildi" ' + (status === 'sotildi' ? 'selected' : '') + '>Sotildi</option>' +
            '<option value="atkaz" ' + (status === 'atkaz' ? 'selected' : '') + '>Atkaz</option>' +
            '</select>';

        rowsHtml.push(
            '<tr class="sale-data-row">' +
            '<td data-label="#">' + (i + 1) + '</td>' +
            '<td data-label="Sana"><div class="sale-date-cell"><i class="far fa-calendar-alt"></i> ' + formatDate(s.date) + '</div></td>' +
            '<td data-label="Nomi"><span class="sale-user-name">' + escapeHtml(s.name || '—') + '</span></td>' +
            '<td data-label="Viloyat"><div class="sale-region-badge"><i class="fas fa-location-dot"></i> ' + escapeHtml(s.region || '—') + '</div></td>' +
            '<td data-label="Mahsulotlar" title="' + fullItemsText + '"><div class="sale-items-wrap">' + itemsHtml + '</div></td>' +
            '<td data-label="Jami summa" class="amount-highlight">' + formatMoney(totalAmount) + '</td>' +
            '<td data-label="Tannarx">' + formatMoney(totalCost) + '</td>' +
            '<td data-label="Dostavka">' + deliveryHtml + '</td>' +
            '<td data-label="Status">' + statusSelect + '</td>' +
            '<td data-label="Amallar"><div class="sale-actions-wrap"><button class="btn-icon edit sale-edit-btn" data-id="' + s.id + '" title="Tahrirlash"><i class="fas fa-pen"></i></button>' +
            '<button class="btn-icon delete sale-delete-btn" data-id="' + s.id + '" title="O\'chirish"><i class="fas fa-trash"></i></button></div></td>' +
            '</tr>'
        );

        if (mobileList) {
            var statusLabel = (status === 'sotildi') ? 'Sotildi' : (status === 'atkaz' ? 'Atkaz' : 'Kutilmoqda');
            var itemCount = items.length;
            var itemSummary = itemCount === 0
                ? 'Mahsulot kiritilmagan'
                : (itemCount === 1 ? '1 ta mahsulot' : (itemCount + ' ta mahsulot'));

            cardsHtml.push(
                '<button class="sale-mobile-card status-' + status + '" data-sale-id="' + s.id + '">' +
                '<div class="sale-mobile-top-row">' +
                '<span class="sale-mobile-time"><i class="far fa-calendar-alt"></i> ' + formatDate(s.date) + '</span>' +
                '<span class="sale-mobile-status-badge">' + statusLabel + '</span>' +
                '</div>' +
                '<div class="sale-mobile-main">' +
                '<h3 class="sale-mobile-title">' + escapeHtml(s.name || '—') + '</h3>' +
                '<span class="sale-mobile-amount">' + formatMoney(totalAmount) + '</span>' +
                '</div>' +
                '<div class="sale-mobile-bottom-row">' +
                '<span class="sale-mobile-region"><i class="fas fa-location-dot"></i> ' + escapeHtml(s.region || '—') + '</span>' +
                '<span class="sale-mobile-items">' + itemSummary + '</span>' +
                '</div>' +
                '</button>'
            );
        }
    });

    tbody.innerHTML = rowsHtml.join('');
    if (mobileList) {
        mobileList.innerHTML = cardsHtml.join('');
    }
    updateUIVisibility('sales');
}

// Mobile: open sale detail modal on card tap + product image viewer
document.addEventListener('click', function (e) {
    var card = e.target.closest('.sale-mobile-card');
    if (card) {
        var saleId = card.getAttribute('data-sale-id');
        if (!saleId) return;
        var sale = salesArr.find(function (s) { return s.id === saleId; });
        if (!sale) return;
        openSaleDetailModal(sale);
        return;
    }

    // Mahsulot butun qatori bosilganda -> rasmlar modali (reuse global viewer)
    var prodBtn = e.target.closest('.btn-product-full');
    if (prodBtn) {
        var row = prodBtn.closest('.sale-detail-product-row');
        if (!row) return;
        var sid = row.getAttribute('data-sale-id');
        if (!sid) return;
        var saleForImages = salesArr.find(function (x) { return x.id === sid; });
        if (!saleForImages || !saleForImages.items) return;

        var gallery = document.getElementById('saleImagesGallery');
        if (!gallery) return;

        gallery.innerHTML = '<div class="loader-placeholder" style="text-align:center; padding:20px; width:100%"><i class="fas fa-spinner fa-spin"></i> Yuklanmoqda...</div>';
        openModal('viewSaleImagesModal');

        var imagesHtml = saleForImages.items.map(function (it) {
            var p = productsArr.find(function (px) { return px.id === it.productId; });
            var mainImage = getProductMainImage(p);
            if (mainImage) {
                return '<div class="gallery-item">' +
                    '<img src="' + mainImage + '" alt="' + escapeHtml(p.name) + '">' +
                    '<div class="gallery-item-info">' + escapeHtml(p.name) + ' (x' + it.quantity + ')</div>' +
                    '</div>';
            }
            return '<div class="gallery-item no-img">' +
                '<div class="placeholder"><i class="fas fa-image"></i></div>' +
                '<div class="gallery-item-info">' + (p ? escapeHtml(p.name) : '—') + ' (x' + it.quantity + ')</div>' +
                '</div>';
        }).join('');

        gallery.innerHTML = imagesHtml || '<p style="text-align:center; padding:20px; color:var(--text-muted)">Rasmlar mavjud emas</p>';
    }
});



var currentEditingSaleId = null;
var pendingSaleStatus = null;

function openSaleDetailModal(sale) {
    try {
        currentEditingSaleId = sale.id;
        pendingSaleStatus = normalizeSaleStatus(sale.status);
        
        var items = sale.items || [];
        var subtotal = (typeof sale.subtotalAmount === "number") ? sale.subtotalAmount : computeSaleSubtotal(items);
        var deliveryAmount = (typeof sale.deliveryAmount === "number") ? sale.deliveryAmount : calculateDeliveryPrice(subtotal, getRegionType(sale.region));
        var totalAmount = (typeof sale.totalAmount === "number") ? sale.totalAmount : (subtotal + deliveryAmount);
        var costTotal = (typeof sale.costTotal === "number") ? sale.costTotal : computeSaleCostTotal(items);
        
        var dateEl = document.getElementById("saleDetailDate");
        var nameEl = document.getElementById("saleDetailName");
        var statusWrapEl = document.getElementById("saleDetailStatusWrap");
        var totalEl = document.getElementById("saleDetailTotal");
        var regionEl = document.getElementById("saleDetailRegion");
        var costEl = document.getElementById("saleDetailCost");
        var deliveryEl = document.getElementById("saleDetailDelivery");
        var productsListEl = document.getElementById("saleDetailProductsList");
        var noteWrapEl = document.getElementById("saleDetailNoteWrap");
        var noteEl = document.getElementById("saleDetailNote");
        
        if (!dateEl) return;
        
        dateEl.textContent = formatDate(sale.date);
        nameEl.textContent = sale.name || "Sotuv";
        totalEl.textContent = formatMoney(totalAmount);
        regionEl.textContent = sale.region || "NomaÊ¼lum";
        costEl.textContent = costTotal ? formatMoney(costTotal) : "â€”";
        deliveryEl.textContent = deliveryAmount === 0 ? "Tekin" : formatMoney(deliveryAmount);
        
        if (statusWrapEl) {
            renderPremiumStatusPicker(statusWrapEl, pendingSaleStatus);
        }
        
        if (productsListEl) {
            productsListEl.innerHTML = items.map(function (it) {
                var p = productsArr.find(function (px) { return px.id === it.productId; });
                var pname = p ? p.name : "Mahsulot";
                return '<li>' +
                    '<div class="premium-product-item-btn">' +
                    '<div style="display:flex; align-items:center;">' +
                    '<span class="p-name">' + escapeHtml(pname) + '</span>' +
                    '<span class="p-qty">' + it.quantity + ' ta</span>' +
                    '</div>' +
                    '<span class="p-price">' + (it.price ? formatMoney(it.price * it.quantity) : "") + '</span>' +
                    '</div>' +
                    '</li>';
            }).join("");
        }
        
        if (noteWrapEl && noteEl) {
            var note = (sale.note || "").trim();
            if (note) {
                noteWrapEl.style.display = "block";
                noteEl.textContent = note;
            } else {
                noteWrapEl.style.display = "none";
            }
        }
        
        openModal("saleDetailModal");
    } catch (err) {
        console.error(err);
    }
}

function renderPremiumStatusPicker(container, status) {
    var label = (status === "sotildi") ? "Sotildi" : (status === "atkaz" ? "Atkaz" : "Kutilmoqda");
    container.innerHTML = '<div class="premium-status-picker status-' + status + '">' +
            '<div class="status-trigger" id="statusTriggerBtn">' +
                '<span class="status-dot"></span>' +
                '<span>' + label + '</span>' +
                '<i class="fas fa-chevron-down"></i>' +
            '</div>' +
            '<div class="premium-select-dropdown" id="statusDropdown">' +
                '<div class="status-option ' + (status === "kutilmoqda" ? "selected" : "") + '" data-value="kutilmoqda">' +
                    '<span class="status-dot" style="background:var(--warning)"></span> Kutilmoqda' +
                '</div>' +
                '<div class="status-option ' + (status === "sotildi" ? "selected" : "") + '" data-value="sotildi">' +
                    '<span class="status-dot" style="background:var(--success)"></span> Sotildi' +
                '</div>' +
                '<div class="status-option ' + (status === "atkaz" ? "selected" : "") + '" data-value="atkaz">' +
                    '<span class="status-dot" style="background:var(--danger)"></span> Atkaz' +
                '</div>' +
            '</div>' +
        '</div>';
    
    var trigger = document.getElementById("statusTriggerBtn");
    var dropdown = document.getElementById("statusDropdown");
    
    if (trigger) {
        trigger.onclick = function(e) {
            e.stopPropagation();
            dropdown.classList.toggle("active");
        };
    }
    
    if (dropdown) {
        dropdown.querySelectorAll(".status-option").forEach(function(opt) {
            opt.onclick = function() {
                var val = opt.getAttribute("data-value");
                pendingSaleStatus = val;
                renderPremiumStatusPicker(container, val);
            };
        });
    }
    
    document.addEventListener("click", function() {
        if (dropdown) dropdown.classList.remove("active");
    }, { once: true });
}

document.getElementById("saveSaleStatusBtn").onclick = async function() {
    if (!currentEditingSaleId || !pendingSaleStatus) return;
    var btn = this;
    var originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saqlanmoqda...';
    
    try {
        var sale = salesArr.find(function(x) { return x.id === currentEditingSaleId; });
        if (sale && sale.status !== pendingSaleStatus) {
            await updateSaleStatus(currentEditingSaleId, sale.status, pendingSaleStatus);
            showToast("O\'zgarishlar saqlandi", "success");
        }
        closeModal("saleDetailModal");
    } catch (err) {
        showToast("Xatolik: " + err.message, "danger");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
};
