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
            var savedPage = localStorage.getItem('crm-active-page') || 'dashboard';
            navigateTo(savedPage);
        }).catch(function (error) {
            console.error("Error loading user role:", error);
            currentUserRole = 'admin';
            renderProducts();
            var savedPage = localStorage.getItem('crm-active-page') || 'dashboard';
            navigateTo(savedPage);
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
// THEME & CLOCK MANAGEMENT
// ==========================================
(function() {
    // Theme Toggle
    var themeToggle = document.getElementById('themeToggle');
    var currentTheme = localStorage.getItem('crm-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('crm-theme', newTheme);
            showToast(newTheme === 'dark' ? "Tungi rejim yoqildi" : "Kunduzgi rejim yoqildi", "info");
        });
    }

    // Real-time Clock
    function updateClock() {
        var now = new Date();
        var day = String(now.getDate()).padStart(2, '0');
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var year = now.getFullYear();
        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');
        var seconds = String(now.getSeconds()).padStart(2, '0');
        
        var displayStr = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds + ' (Toshkent)';
        var clockEl = document.getElementById('currentDateTime');
        if (clockEl) clockEl.textContent = displayStr;
    }
    
    setInterval(updateClock, 1000);
    updateClock(); // Initial call
})();

// ==========================================
// CORE RENDERING FUNCTIONS (Moved up)
// ==========================================

function refreshDashboard() {
    var inc = financesArr.filter(function (f) { return f.type === 'income'; }).reduce(function (s, f) { return s + f.amount; }, 0);
    var exp = financesArr.filter(function (f) { return f.type === 'expense'; }).reduce(function (s, f) { return s + f.amount; }, 0);

    var soldSales = salesArr.filter(function(s) { return s.status === 'sotildi'; });
    var totalCostPrice = soldSales.reduce(function(sum, s) {
        var sCost = (s.items || []).reduce(function(isum, it) {
            var p = productsArr.find(function(px) { return px.id === it.productId; });
            return isum + ((p ? p.costPrice || 0 : 0) * it.quantity);
        }, 0);
        return sum + sCost;
    }, 0);

    document.getElementById('totalIncome').textContent = formatMoney(inc);
    document.getElementById('totalExpense').textContent = formatMoney(exp);
    var netProfit = inc - exp - totalCostPrice;
    document.getElementById('totalProfit').textContent = formatMoney(netProfit);

    var costListEl = document.getElementById('dashCostList');
    var emptyCostEl = document.getElementById('dashEmptyCost');
    if (costListEl) {
        if (soldSales.length === 0) {
            costListEl.innerHTML = '';
            if (emptyCostEl) emptyCostEl.style.display = 'block';
        } else {
            if (emptyCostEl) emptyCostEl.style.display = 'none';
            costListEl.innerHTML = soldSales.slice(0, 10).map(function(s) {
                var sCost = (s.items || []).reduce(function(isum, it) {
                    var p = productsArr.find(function(px) { return px.id === it.productId; });
                    return isum + ((p ? (p.costPrice || p.cost || 0) : 0) * it.quantity);
                }, 0);
                return '<div class="expense-row" style="cursor:pointer" onclick="editSale(\'' + s.id + '\')">' +
                    '<div class="expense-icon-wrap" style="background:var(--warning-glow); color:var(--warning)"><i class="fas fa-calculator"></i></div>' +
                    '<div class="expense-details">' +
                    '<div class="expense-cat">' + escapeHtml(s.name) + '</div>' +
                    '<div class="expense-time">' + formatDate(s.date) + '</div>' +
                    '</div>' +
                    '<div class="expense-amount">-' + formatMoney(sCost) + '</div>' +
                    '</div>';
            }).join('');
        }
    }

    // 1. REGION STATS
    var regionCount = {};
    var regionSum = {};
    salesArr.forEach(function (s) {
        var r = s.region || "Noma'lum";
        regionCount[r] = (regionCount[r] || 0) + 1;
        regionSum[r] = (regionSum[r] || 0) + (s.totalAmount || 0);
    });

    var demoList = document.getElementById('demographicsList');
    if (demoList) {
        var sortedRegions = Object.keys(regionCount).sort(function (a, b) { return regionCount[b] - regionCount[a]; }).slice(0, 10);
        if (sortedRegions.length === 0) {
            demoList.innerHTML = '<p class="text-muted" style="text-align:center; padding:20px;">Hali sotuvlar geografiyasi shakllanmagan</p>';
        } else {
            demoList.innerHTML = sortedRegions.map(function (r) {
                var count = regionCount[r];
                var sum = regionSum[r] || 0;
                var percent = Math.round((count / (salesArr.length || 1)) * 100);
                return '<div class="demographic-item">' +
                    '<div class="region-icon"><i class="fas fa-location-dot"></i></div>' +
                    '<div class="region-info">' +
                    '<span class="region-name">' + escapeHtml(r) + '</span>' +
                    '<span class="region-count">' + count + ' ta sotuv</span>' +
                    '</div>' +
                    '<div class="region-sum">' + formatMoney(sum) + '</div>' +
                    '<div class="region-progress-wrap">' +
                    '<div class="region-progress-bar"><div class="region-progress-fill" style="width: ' + percent + '%"></div></div>' +
                    '<span class="region-percent">' + percent + '%</span>' +
                    '</div>' +
                    '</div>';
            }).join('');
        }
    }

    // 2. TOP PRODUCTS
    var prodStats = {};
    salesArr.forEach(function (s) {
        (s.items || []).forEach(function (it) {
            prodStats[it.productId] = (prodStats[it.productId] || 0) + (it.quantity || 0);
        });
    });

    var topListEl = document.getElementById('topProductsList');
    if (topListEl) {
        var sortedProds = Object.keys(prodStats).sort(function (a, b) { return prodStats[b] - prodStats[a]; }).slice(0, 10);
        if (sortedProds.length === 0) {
            topListEl.innerHTML = '<p class="text-muted" style="text-align:center; padding:10px;">Ma\'lumot yo\'q</p>';
        } else {
            topListEl.innerHTML = sortedProds.map(function (pid, index) {
                var product = productsArr.find(function (p) { return p.id === pid; });
                var name = product ? product.name : "Noma'lum";
                var qty = prodStats[pid];
                var mainImage = getProductMainImage(product);
                var imgHtml = mainImage
                    ? '<img src="' + escapeHtml(mainImage) + '" class="top-img" alt="' + escapeHtml(name) + '">'
                    : '<div class="top-img-placeholder">' + (name.charAt(0).toUpperCase() || 'M') + '</div>';
                var priceText = product ? formatMoney(product.price) : "Narx yo'q";

                return '<li class="top-item">' +
                    '<div class="top-img-wrap">' + imgHtml + '</div>' +
                    '<div class="top-info">' +
                    '<span class="top-name">' + escapeHtml(name) + '</span>' +
                    '<span class="top-meta">' + priceText + '  ' + qty + ' dona</span>' +
                    '</div>' +
                    '</li>';
            }).join('');
        }
    }

    // 4. EXPENSES (Recent 10)
    var expenses = financesArr.filter(function (f) { return f.type === 'expense'; }).sort(function (a, b) { return new Date(b.date) - new Date(a.date); }).slice(0, 10);
    var listContainer = document.getElementById('dashExpenseList');
    var emptyE = document.getElementById('dashEmptyExpense');

    if (expenses.length === 0) {
        if (listContainer) listContainer.innerHTML = '';
        if (emptyE) emptyE.style.display = 'block';
    } else {
        if (emptyE) emptyE.style.display = 'none';
        if (listContainer) {
            listContainer.innerHTML = expenses.map(function (f) {
                var desc = (f.description || "").toLowerCase();
                var icon = "fa-receipt";
                var typeClass = "other";
                if (desc.includes('yandex') || desc.includes('taxi') || desc.includes('taksi')) { icon = "fa-car"; typeClass = "transport"; }
                else if (desc.includes('target') || desc.includes('reklama') || desc.includes('ads')) { icon = "fa-bullhorn"; typeClass = "marketing"; }
                else if (desc.includes('pochta') || desc.includes('dostavka') || desc.includes('kurer')) { icon = "fa-envelope"; typeClass = "service"; }

                return '<div class="expense-row">' +
                    '<div class="expense-icon-wrap ' + typeClass + '"><i class="fas ' + icon + '"></i></div>' +
                    '<div class="expense-details">' +
                    '<span class="expense-title">' + escapeHtml(f.description || '') + '</span>' +
                    '<span class="expense-date">' + formatDate(f.date) + '</span>' +
                    '</div>' +
                    '<div class="expense-value-wrap">' +
                    '<span class="expense-value">-' + formatMoney(f.amount) + '</span>' +
                    '</div>' +
                    '</div>';
            }).join('');
        }
    }
}

function renderProducts(searchTerm) {
    searchTerm = searchTerm || '';
    var tbody = document.getElementById('productsBody');
    var mobileList = document.getElementById('productsMobileList');
    var empty = document.getElementById('productsEmpty');
    var filtered = productsArr.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    
    if (searchTerm) {
        var q = searchTerm.toLowerCase();
        filtered = filtered.filter(function (p) { return p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)); });
    }
    
    if (productsFilter.category !== 'all') {
        filtered = filtered.filter(function (p) { return p.category === productsFilter.category; });
    }
    if (productsFilter.status !== 'all') {
        filtered = filtered.filter(function (p) { return (p.status || 'active') === productsFilter.status; });
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (mobileList) mobileList.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    var rows = filtered.map(function (p, i) {
        var mainImg = getProductMainImage(p);
        var imgHtml = mainImg 
            ? '<img src="' + mainImg + '" class="product-avatar">' 
            : '<div class="product-avatar-placeholder">' + (p.name.charAt(0).toUpperCase()) + '</div>';
        
        return '<tr>' +
            '<td>' + (i + 1) + '</td>' +
            '<td class="product-main-col">' +
                '<div class="product-info-wrap">' +
                    imgHtml +
                    '<div class="product-detail-text">' +
                        '<div class="product-name">' + escapeHtml(p.name) + '</div>' +
                        '<div class="product-category">' + escapeHtml(p.category || 'Boshqa') + (p.brand ? ' | ' + escapeHtml(p.brand) : '') + '</div>' +
                    '</div>' +
                '</div>' +
            '</td>' +
            '<td><div class="product-price">' + formatMoney(p.price) + '</div><div class="product-label">Sotish narxi</div></td>' +
            '<td><div class="product-cost">' + (p.cost ? formatMoney(p.cost) : '\u2014') + '</div><div class="product-label">Tannarxi</div></td>' +
            '<td><span class="status-badge ' + ((p.status || 'active') === 'active' ? 'active' : 'inactive') + '">' + (p.status === 'active' ? 'Active' : 'Nofaol') + '</span></td>' +
            '<td><div class="sale-actions-wrap">' +
            '<button class="btn-icon info product-view-btn" data-id="' + p.id + '" title="Ko\'rish"><i class="fas fa-eye"></i></button>' +
            '<button class="btn-icon edit product-edit-btn" data-id="' + p.id + '" title="Tahrirlash"><i class="fas fa-pen"></i></button>' +
            '<button class="btn-icon delete product-delete-btn" data-id="' + p.id + '" data-name="' + escapeHtml(p.name) + '" data-storage-path="' + (p.storagePath || '') + '" title="O\'chirish"><i class="fas fa-trash"></i></button>' +
            '</div></td>' +
            '</tr>';
    });
    tbody.innerHTML = rows.join('');

    if (mobileList) {
        mobileList.innerHTML = filtered.map(function (p) {
            var mainImg = getProductMainImage(p);
            var imgHtml = mainImg 
                ? '<img src="' + escapeHtml(mainImg) + '" alt="' + escapeHtml(p.name) + '">' 
                : '<div class="pm-img-placeholder"><i class="fas fa-box"></i></div>';
            
            return '<button class="product-mobile-card" data-id="' + p.id + '">' +
                '<div class="pm-img-wrap">' + imgHtml + '</div>' +
                '<div class="pm-name-wrap">' +
                '<span class="pm-name">' + escapeHtml(p.name) + '</span>' +
                '<span class="pm-category">' + escapeHtml(p.category || 'Boshqa') + (p.brand ? ' | ' + escapeHtml(p.brand) : '') + '</span>' +
                '</div>' +
                '<div class="pm-price">' + formatMoney(p.price) + '</div>' +
                '</button>';
        }).join('');
    }
}



function renderFinance(searchTerm) {
    searchTerm = searchTerm || '';
    var tbody = document.getElementById('financeBody');
    var empty = document.getElementById('financeEmpty');
    var filtered = financesArr.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    if (searchTerm) {
        var q = searchTerm.toLowerCase();
        filtered = filtered.filter(function (f) { return f.category.toLowerCase().includes(q) || (f.description && f.description.toLowerCase().includes(q)) || f.date.includes(q); });
    }
    // Filter: turi
    if (financeFilter.type !== 'all') {
        filtered = filtered.filter(function (f) { return f.type === financeFilter.type; });
    }
    // Filter: kategoriya
    if (financeFilter.category !== 'all') {
        filtered = filtered.filter(function (f) { return f.category === financeFilter.category; });
    }
    var totalIncome = financesArr.filter(function (f) { return f.type === 'income'; }).reduce(function (sum, f) { return sum + f.amount; }, 0);
    var totalExpense = financesArr.filter(function (f) { return f.type === 'expense'; }).reduce(function (sum, f) { return sum + f.amount; }, 0);
    document.getElementById('financeIncome').textContent = formatMoney(totalIncome);
    document.getElementById('financeExpense').textContent = formatMoney(totalExpense);
    document.getElementById('financeBalance').textContent = formatMoney(totalIncome - totalExpense);
    var mobileList = document.getElementById('financeMobileList');
    if (filtered.length === 0) { 
        tbody.innerHTML = ''; 
        if (mobileList) mobileList.innerHTML = '';
        empty.style.display = 'block'; 
        return; 
    }
    empty.style.display = 'none';
    
    var cardsHtml = [];
    tbody.innerHTML = filtered.map(function (f, i) {
        var isInc = f.type === 'income';
        return '' +
            '<tr>' +
            '<td data-label="#">' + (i + 1) + '</td>' +
            '<td data-label="Sana">' + formatDate(f.date) + '</td>' +
            '<td data-label="Turi"><span class="type-badge ' + f.type + '"><i class="fas fa-' + (isInc ? 'arrow-down' : 'arrow-up') + '"></i> ' + (isInc ? 'Kirim' : 'Chiqim') + '</span></td>' +
            '<td data-label="Kategoriya">' + escapeHtml(f.category) + '</td>' +
            '<td data-label="Tavsif">' + escapeHtml(f.description || '???') + '</td>' +
            '<td data-label="Summa" class="' + (isInc ? 'amount-positive' : 'amount-negative') + '">' + (isInc ? '+' : '-') + formatMoney(f.amount) + '</td>' +
            '<td data-label="Amallar">' +
            '<button class="btn-icon edit finance-edit-btn" data-id="' + f.id + '" title="Tahrirlash"><i class="fas fa-pen"></i></button>' +
            '<button class="btn-icon delete finance-delete-btn" data-id="' + f.id + '" title="O\'chirish"><i class="fas fa-trash"></i></button>' +
            '</td>' +
            '</tr>';
    }).join('');

    if (mobileList) {
        cardsHtml = filtered.map(function (f) {
            var isInc = f.type === 'income';
            return '<button class="finance-mobile-card ' + f.type + '" data-id="' + f.id + '">' +
                '<div class="finance-mobile-top">' +
                '<span class="finance-mobile-date">' + formatDate(f.date) + '</span>' +
                '<span class="finance-mobile-category">' + escapeHtml(f.category) + '</span>' +
                '</div>' +
                '<div class="finance-mobile-main">' +
                '<span class="finance-mobile-desc">' + escapeHtml(f.description || '...') + '</span>' +
                '<span class="finance-mobile-amount">' + (isInc ? '+' : '-') + formatMoney(f.amount) + '</span>' +
                '</div>' +
                '</button>';
        }).join('');
        mobileList.innerHTML = cardsHtml;
    }
}


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
    localStorage.setItem('crm-active-page', pageName);
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
    'Yuz kremi': { icon: 'fa-cream', color: '#f472b6' },
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
    if (trigger) {
        trigger.onclick = function (e) {
            e.stopPropagation();
            var isOpen = picker.classList.contains('open');
            document.querySelectorAll('.select-picker.open').forEach(function (p) { p.classList.remove('open'); });
            if (!isOpen) picker.classList.add('open');
        };
    }

    // Option click
    if (dropdown) {
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


function editProduct(id) {
    var p = productsArr.find(function (x) { return x.id === id; });
    if (!p) return;
    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name;
    document.getElementById('productBrand').value = p.brand || '';
    document.getElementById('productPrice').value = p.price || 0;
    document.getElementById('productCost').value = p.cost || p.costPrice || 0;
    document.getElementById('productCost').readOnly = true;
    document.getElementById('productDescription').value = p.description || '';
    
    initSelectPicker('productCategoryPicker', allProductCategories);
    setSelectValue('productCategoryPicker', p.category, p.category);
    setSelectValue('productStatusPicker', p.status || 'active', (p.status || 'active') === 'active' ? 'Active' : 'Inactive');
    document.getElementById('productModalTitle').innerHTML = '<i class="fas fa-box-open"></i> Mahsulotni tahrirlash';
    // Mavjud rasmlarni ko\'rsatish
    resetImageUpload();
    setProductFormImages(getProductImagesList(p));
    openModal('productModal');
}

document.getElementById('addProductBtn').addEventListener('click', function () {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productBrand').value = '';
    document.getElementById('productCost').readOnly = false;
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
        '<div style="font-size:1.2rem; font-weight:800; color:var(--text); margin-top:4px;">' + (p.cost ? formatMoney(p.cost) : "") + '</div>' +
        '</div>' +
        '</div>' +
        '<div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:15px; border-radius:14px;">' +
        '<span style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Tavsif</span>' +
        '<div style="margin-top:8px; font-size:14px; line-height:1.5; color:var(--text-secondary);">' + (escapeHtml(p.description) || "Tavsif mavjud emas") + '</div>' +
        '</div>';

    var editBtn = document.getElementById('productDetailEditBtn');
    if (editBtn) {
        editBtn.onclick = function() {
            closeModal('productDetailsModal');
            editProduct(p.id);
        };
    }

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
        brand: document.getElementById('productBrand').value.trim(),
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

function normalizeSaleStatus(status) {
    status = (status || '').toString().trim().toLowerCase();
    if (status === 'sotildi' || status === 'sold') return 'sotildi';
    if (status === 'atkaz' || status === 'otkaz' || status === 'atkz' || status === 'atkaz ') return 'atkaz';
    if (status === 'kutilmoqda' || status === 'kutilyapti' || status === 'pending') return 'kutilmoqda';
    return 'kutilmoqda';
}

// === Sale Calculation Helpers ===
function computeSaleSubtotal(items) {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce(function (sum, it) {
        var price = parseFloat(it.price) || 0;
        var qty = parseFloat(it.quantity) || 0;
        return sum + (price * qty);
    }, 0);
}

function getRegionType(region) {
    region = (region || '').toLowerCase();
    if (region.includes('toshkent shahri') || region === 'toshkent' || region === 'tashkent') return 'tashkent';
    return 'viloyat';
}

function calculateDeliveryPrice(subtotal, regionType) {
    // regionType: 'tashkent' | 'regions'
    if (regionType === 'tashkent') {
        if (subtotal < 120000) return 20000;
        if (subtotal < 220000) return 15000;
        return 0;
    } else {
        if (subtotal < 220000) return 35000;
        if (subtotal < 320000) return 30000;
        return 0;
    }
}

function computeSaleCostTotal(items) {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce(function (sum, it) {
        var p = productsArr.find(function (px) { return px.id === it.productId; });
        var cost = p ? (parseFloat(p.cost) || parseFloat(p.costPrice) || 0) : 0;
        var qty = parseFloat(it.quantity) || 0;
        return sum + (cost * qty);
    }, 0);
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
            var pname = p ? escapeHtml(p.name) : '';
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
            return (p ? p.name : '') + ' (x' + it.quantity + ')';
        }).join(', ');

        var totalCost = (s.items || []).reduce(function(sum, it) {
            var p = productsArr.find(function(px) { return px.id === it.productId; });
            return sum + ((p ? p.costPrice || 0 : 0) * it.quantity);
        }, 0);

        var deliveryHtml = deliveryAmount > 0 ? formatMoney(deliveryAmount) : '<span class="status-badge active" style="background:var(--success-glow); color:var(--success);">Tekin</span>';

        var statusSelectHtml = buildSaleStatusSelectHtml(status, s.id);

        rowsHtml.push(
            '<tr class="sale-data-row">' +
            '<td data-label="#">' + (i + 1) + '</td>' +
            '<td data-label="Sana"><div class="sale-date-cell"><i class="far fa-calendar-alt"></i> ' + formatDate(s.date) + '</div></td>' +
            '<td data-label="Nomi"><span class="sale-user-name">' + escapeHtml(s.name || '') + '</span></td>' +
            '<td data-label="Viloyat"><div class="sale-region-badge"><i class="fas fa-location-dot"></i> ' + escapeHtml(s.region || '') + '</div></td>' +
            '<td data-label="Mahsulotlar" title="' + fullItemsText + '"><div class="sale-items-wrap">' + itemsHtml + '</div></td>' +
            '<td data-label="Jami summa" class="amount-highlight">' + formatMoney(totalAmount) + '</td>' +
            '<td data-label="Tannarx">' + formatMoney(totalCost) + '</td>' +
            '<td data-label="Dostavka">' + deliveryHtml + '</td>' +
            '<td data-label="Status"><div class="sale-status-inline-wrap">' + statusSelectHtml + '</div></td>' +
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
                '<h3 class="sale-mobile-title">' + escapeHtml(s.name || '') + '</h3>' +
                '<span class="sale-mobile-amount">' + formatMoney(totalAmount) + '</span>' +
                '</div>' +
                '<div class="sale-mobile-bottom-row">' +
                '<span class="sale-mobile-region"><i class="fas fa-location-dot"></i> ' + escapeHtml(s.region || '') + '</span>' +
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
                '<div class="gallery-item-info">' + (p ? escapeHtml(p.name) : '') + ' (x' + it.quantity + ')</div>' +
                '</div>';
        }).join('');

        gallery.innerHTML = imagesHtml || '<p style="text-align:center; padding:20px; color:var(--text-muted)">Rasmlar mavjud emas</p>';
    }
});

function openSaleDetailModal(sale) {
    try {
        var status = normalizeSaleStatus(sale.status);
        var items = sale.items || [];
        var subtotal = (typeof sale.subtotalAmount === 'number') ? sale.subtotalAmount : computeSaleSubtotal(items);
        var deliveryAmount = (typeof sale.deliveryAmount === 'number') ? sale.deliveryAmount : calculateDeliveryPrice(subtotal, getRegionType(sale.region));
        var totalAmount = (typeof sale.totalAmount === 'number') ? sale.totalAmount : (subtotal + deliveryAmount);
        var costTotal = (typeof sale.costTotal === 'number') ? sale.costTotal : computeSaleCostTotal(items);

        var dateEl = document.getElementById('saleDetailDate');
        var nameEl = document.getElementById('saleDetailName');
        var statusWrapEl = document.getElementById('saleDetailStatusWrap');
        var totalEl = document.getElementById('saleDetailTotal');
        var regionEl = document.getElementById('saleDetailRegion');
        var costEl = document.getElementById('saleDetailCost');
        var deliveryEl = document.getElementById('saleDetailDelivery');
        var productsListEl = document.getElementById('saleDetailProductsList');
        var noteWrapEl = document.getElementById('saleDetailNoteWrap');
        var noteEl = document.getElementById('saleDetailNote');

        if (!dateEl) return; // modal yo'q bo'lsa jim chiqamiz

        dateEl.textContent = formatDate(sale.date);
        nameEl.textContent = sale.name || '';
        totalEl.textContent = formatMoney(totalAmount);
        regionEl.textContent = sale.region || '';
        costEl.textContent = costTotal ? formatMoney(costTotal) : '';
        deliveryEl.textContent = deliveryAmount === 0 ? 'Tekin' : formatMoney(deliveryAmount);

        if (statusWrapEl) {
            statusWrapEl.innerHTML = buildSaleStatusSelectHtml(status, sale.id);
        }

        // Products list
        if (productsListEl) {
            productsListEl.innerHTML = items.map(function (it) {
                var p = productsArr.find(function (px) { return px.id === it.productId; });
                var pname = p ? p.name : 'Mahsulot';
                var countLabel = it.quantity + ' ta';
                return '' +
                    '<li>' +
                    '<button type="button" class="sale-detail-product-row btn-product-full" data-sale-id="' + sale.id + '" data-product-id="' + (it.productId || '') + '">' +
                    '<span class="p-name">' + escapeHtml(pname) + '</span>' +
                    '<span class="p-qty">' + countLabel + '</span>' +
                    '<span class="p-price">' + (it.price ? formatMoney(it.price * it.quantity) : '') + '</span>' +
                    '</button>' +
                    '</li>';
            }).join('');
        }

        // Note
        if (noteWrapEl && noteEl) {
            var note = (sale.note || '').trim();
            if (note) {
                noteEl.textContent = note;
                noteWrapEl.style.display = 'block';
            } else {
                noteWrapEl.style.display = 'none';
                noteEl.textContent = '';
            }
        }

        openModal('saleDetailModal');
    } catch (err) {
        console.error(err);
    }
}

function buildSaleStatusSelectHtml(status, saleId) {
    status = normalizeSaleStatus(status);
    var label = (status === 'sotildi') ? 'Sotildi' : (status === 'atkaz' ? 'Rad etildi' : 'Kutilmoqda');
    var iconClass = (status === 'sotildi') ? 'fa-check' : (status === 'atkaz' ? 'fa-xmark' : 'fa-spinner fa-spin');
    
    return '' +
        '<div class="status-bubbles-picker status-' + status + '" data-id="' + saleId + '">' +
        '<button type="button" class="status-trigger" title="Status: ' + label + '">' +
        '<i class="fas ' + iconClass + ' status-main-icon"></i>' +
        '<span>' + label + '</span>' +
        '<i class="fas fa-chevron-down status-caret"></i>' +
        '</button>' +
        '<div class="status-bubble-options">' +
        '<div class="bubble-opt kutilmoqda" data-value="kutilmoqda"><i class="fas fa-spinner fa-spin"></i> Kutilmoqda</div>' +
        '<div class="bubble-opt atkaz" data-value="atkaz"><i class="fas fa-xmark"></i> Rad etildi</div>' +
        '<div class="bubble-opt sotildi" data-value="sotildi"><i class="fas fa-check"></i> Sotildi</div>' +
        '</div>' +
        '</div>';
}

// Status change handler (event delegation for custom picker)
document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.status-trigger');
    if (trigger) {
        var picker = trigger.closest('.status-bubbles-picker');
        var wasOpen = picker.classList.contains('open');
        document.querySelectorAll('.status-bubbles-picker.open').forEach(function(p) { p.classList.remove('open'); });
        if (!wasOpen) picker.classList.add('open');
        return;
    }

    var bubbleOpt = e.target.closest('.bubble-opt');
    if (bubbleOpt) {
        var picker = bubbleOpt.closest('.status-bubbles-picker');
        var saleId = picker.getAttribute('data-id');
        var next = normalizeSaleStatus(bubbleOpt.getAttribute('data-value'));
        var prev = picker.className.split(' ').find(function(c) { return c.startsWith('status-') && c !== 'status-bubbles-picker'; }).replace('status-', '');
        
        if (saleId && prev !== next) {
            // UI Instant Update
            picker.className = 'status-bubbles-picker status-' + next;
            var label = (next === 'sotildi') ? 'Sotildi' : (next === 'atkaz' ? 'Rad etildi' : 'Kutilmoqda');
            var iconClass = (next === 'sotildi') ? 'fa-check' : (next === 'atkaz' ? 'fa-xmark' : 'fa-spinner fa-spin');
            picker.querySelector('.status-trigger span').textContent = label;
            picker.querySelector('.status-trigger .status-main-icon').className = 'fas ' + iconClass + ' status-main-icon';
            
            updateSaleStatus(saleId, prev, next);
        }
        picker.classList.remove('open');
        return;
    }

    // Close on outside click
    document.querySelectorAll('.status-bubbles-picker.open').forEach(function(p) { p.classList.remove('open'); });
});

async function updateSaleStatus(saleId, prevStatus, nextStatus) {
    try {
        var sale = salesArr.find(function (x) { return x.id === saleId; });
        if (!sale) throw new Error('Sotuv topilmadi');

        var items = sale.items || [];
        var subtotal = (typeof sale.subtotalAmount === 'number') ? sale.subtotalAmount : computeSaleSubtotal(items);
        var deliveryAmount = (typeof sale.deliveryAmount === 'number') ? sale.deliveryAmount : calculateDeliveryPrice(subtotal, getRegionType(sale.region));
        var totalAmount = (typeof sale.totalAmount === 'number') ? sale.totalAmount : (subtotal + deliveryAmount);
        var costTotal = (typeof sale.costTotal === 'number') ? sale.costTotal : computeSaleCostTotal(items);

        // Always persist normalized status, and lock derived fields when sold
        var saleUpdate = { status: nextStatus, updatedAt: new Date().toISOString() };
        if (nextStatus === 'sotildi') {
            saleUpdate.soldAt = sale.soldAt || new Date().toISOString();
            saleUpdate.subtotalAmount = subtotal;
            saleUpdate.deliveryAmount = deliveryAmount;
            saleUpdate.totalAmount = totalAmount;
            saleUpdate.costTotal = costTotal;
        }

        await db.collection('sales').doc(saleId).update(saleUpdate);

        if (prevStatus !== 'sotildi' && nextStatus === 'sotildi') {
            await ensureFinanceEntriesForSoldSale(Object.assign({}, sale, saleUpdate));
            showToast('Status "Sotildi" qilindi. Dashboard yangilandi!', 'success');
        }

        if (prevStatus === 'sotildi' && nextStatus !== 'sotildi') {
            await deleteAutoFinanceEntriesForSale(saleId);
            showToast('Status qaytarildi. Avto kirim/chiqim o\'chirildi.', 'info');
        }



        // UI ni yangilab qo'yamiz (jadval + mobil kartalar)
        var searchInput = document.getElementById('salesSearch');
        var currentSearch = searchInput ? searchInput.value : '';
        renderSales(currentSearch);
    } catch (err) {
        console.error(err);
        showToast('Statusni o\'zgartirishda xatolik: ' + (err.message || err), 'error');
        var si = document.getElementById('salesSearch');
        renderSales(si ? si.value : '');
    }
}

function buildSaleFinanceDescription(sale) {
    var items = sale.items || [];
    var desc = (sale.name || '') + ': ';
    desc += items.map(function (it) {
        var p = productsArr.find(function (px) { return px.id === it.productId; });
        return (p ? p.name : 'Mahs') + ' (x' + it.quantity + ')';
    }).join(', ');
    return desc.trim();
}

async function ensureFinanceEntriesForSoldSale(sale) {
    // Prevent duplicates: if any autoGenerated record exists for this sale, skip creation per kind.
    var snap = await db.collection('finances').where('saleId', '==', sale.id).get();
    var hasSaleIncome = false;
    var hasDeliveryExpense = false;
    snap.forEach(function (doc) {
        var d = doc.data() || {};
        // New format (recommended)
        if (d.autoGenerated && d.autoKind === 'sale_income') hasSaleIncome = true;
        if (d.autoGenerated && d.autoKind === 'delivery_expense') hasDeliveryExpense = true;
        // Backward compatibility: older records had no auto flags
        if (d.type === 'income' && d.category === 'Sotuv daromadi') hasSaleIncome = true;
        if (d.type === 'expense' && (d.category === 'Yandex' || d.category === 'Pochta') && (d.description || '').toLowerCase().includes('dostavka')) {
            hasDeliveryExpense = true;
        }
    });

    var nowIso = new Date().toISOString();
    var subtotal = (typeof sale.subtotalAmount === 'number') ? sale.subtotalAmount : computeSaleSubtotal(sale.items || []);
    var deliveryAmount = (typeof sale.deliveryAmount === 'number') ? sale.deliveryAmount : calculateDeliveryPrice(subtotal, getRegionType(sale.region));
    var totalAmount = (typeof sale.totalAmount === 'number') ? sale.totalAmount : (subtotal + deliveryAmount);

    var desc = buildSaleFinanceDescription(sale);

    if (!hasSaleIncome) {
        await db.collection('finances').add({
            date: sale.date,
            type: 'income',
            category: 'Sotuv daromadi',
            description: desc,
            amount: totalAmount,
            saleId: sale.id,
            autoGenerated: true,
            autoKind: 'sale_income',
            createdAt: nowIso
        });
    }

    if (deliveryAmount > 0 && !hasDeliveryExpense) {
        var isTashkent = getRegionType(sale.region) === 'tashkent';
        var category = isTashkent ? 'Yandex' : 'Pochta';
        var deliveryDesc = (isTashkent ? 'Yandex dostavka' : 'Pochta dostavka') + '  ' + (sale.name || 'Sotuv') + ' (mijoz tomonidan to\'landi)';
        await db.collection('finances').add({
            date: sale.date,
            type: 'expense',
            category: category,
            description: deliveryDesc,
            amount: deliveryAmount,
            saleId: sale.id,
            autoGenerated: true,
            autoKind: 'delivery_expense',
            paidByCustomer: true,
            createdAt: nowIso
        });
    }
}

async function deleteAutoFinanceEntriesForSale(saleId) {
    var snap = await db.collection('finances').where('saleId', '==', saleId).get();
    var batch = db.batch();
    var count = 0;
    snap.forEach(function (doc) {
        var d = doc.data() || {};
        if (d.autoGenerated) {
            batch.delete(doc.ref);
            count += 1;
        }
    });
    if (count > 0) await batch.commit();
}

// Global viewer logic
document.addEventListener('click', function (e) {
    var card = e.target.closest('.sale-items-card');
    if (card) {
        var sid = card.getAttribute('data-sale-id');
        var sale = salesArr.find(function (x) { return x.id === sid; });
        if (sale && sale.items) {
            var gallery = document.getElementById('saleImagesGallery');
            gallery.innerHTML = '<div class="loader-placeholder" style="text-align:center; padding:20px; width:100%"><i class="fas fa-spinner fa-spin"></i> Yuklanmoqda...</div>';
            openModal('viewSaleImagesModal');

            var imagesHtml = sale.items.map(function (it) {
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
                    '<div class="gallery-item-info">' + (p ? escapeHtml(p.name) : '') + ' (x' + it.quantity + ')</div>' +
                    '</div>';
            }).join('');

            gallery.innerHTML = imagesHtml || '<p style="text-align:center; padding:20px; color:var(--text-muted)">Rasmlar mavjud emas</p>';
        }
    }
});

function editSale(id) {
    var s = salesArr.find(function (x) { return x.id === id; });
    if (!s) return;
    document.getElementById('saleId').value = s.id;
    document.getElementById('saleDate').value = s.date;
    document.getElementById('saleName').value = s.name || '';
    document.getElementById('saleDelivery').value = s.deliveryAmount || 0;
    initSelectPicker('saleRegionPicker', allRegions);
    setSelectValue('saleRegionPicker', s.region || '', s.region || 'Tanlang...');
    document.getElementById('saleNote').value = s.note || '';

    // Clear and fill rows
    document.getElementById('saleItemsList').innerHTML = '';
    if (s.items && s.items.length > 0) {
        s.items.forEach(function (it) { addSaleItemRow(it); });
    } else if (s.productId) {
        // Handle migration for old single-item sales
        addSaleItemRow({ productId: s.productId, quantity: s.quantity || 1, price: s.price });
    } else {
        addSaleItemRow();
    }

    document.getElementById('saleModalTitle').innerHTML = '<i class="fas fa-shopping-cart"></i> Sotuvni tahrirlash';
    openModal('saleModal');
}

document.getElementById('addSaleBtn').addEventListener('click', function () {
    document.getElementById('saleForm').reset();
    document.getElementById('saleId').value = '';
    document.getElementById('saleDate').value = getTodayStr();
    document.getElementById('saleItemsList').innerHTML = '';
    addSaleItemRow();
    initSelectPicker('saleRegionPicker', allRegions);
    setSelectValue('saleRegionPicker', '', 'Tanlang...');
    document.getElementById('saleTotalDisplay').textContent = "0 so'm";
    document.getElementById('saleModalTitle').innerHTML = '<i class="fas fa-shopping-cart"></i> Yangi Sotuv';
    openModal('saleModal');
    setTimeout(function () {
        var firstPicker = document.querySelector('#saleItemsList .item-product-trigger');
        if (firstPicker) firstPicker.focus();
    }, 300);
});

document.getElementById('saleForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var id = document.getElementById('saleId').value;
    var items = [];
    var totalAmount = 0;

    document.querySelectorAll('.sale-item-row').forEach(function (row) {
        var productSelect = row.querySelector('.item-product-select');
        var pid = productSelect ? productSelect.value : '';
        var qty = parseInt(row.querySelector('.item-qty-input').value) || 0;
        var price = parseFloat(row.querySelector('.item-price-input').value) || 0;
        if (pid && qty > 0) {
            items.push({ productId: pid, quantity: qty, price: price });
            totalAmount += qty * price;
        }
    });

    if (items.length === 0) { showToast('Kamida bitta mahsulot tanlang!', 'error'); return; }

    var deliveryAmount = parseFloat(document.getElementById('saleDelivery').value) || 0;
    var data = {
        date: document.getElementById('saleDate').value,
        name: document.getElementById('saleName').value.trim(),
        region: document.getElementById('saleRegion').value,
        items: items,
        totalAmount: totalAmount,
        deliveryAmount: deliveryAmount,
        status: 'kutilmoqda',
        note: document.getElementById('saleNote').value.trim(),
        updatedAt: new Date().toISOString()
    };

    if (id) {
        db.collection("sales").doc(id).update(data).then(function () { showToast('Sotuv yangilandi!'); closeModal('saleModal'); }).catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
    } else {
        data.createdAt = new Date().toISOString();
        db.collection("sales").add(data).then(function (docRef) {
            showToast("Yangi sotuv qo'shildi (Kutilmoqda statusida)!");
            closeModal('saleModal');
        }).catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
    }
});

function updateCustomerStats(customerName, amount) {
    if (!customerName) return;
    // Ism bo'yicha mijozni qidirish (sodda usul)
    db.collection('customers').where('name', '==', customerName).get().then(function (snapshot) {
        snapshot.forEach(function (doc) {
            var c = doc.data();
            db.collection('customers').doc(doc.id).update({
                salesCount: (c.salesCount || 0) + 1,
                totalSpent: (c.totalSpent || 0) + amount,
                lastPurchaseDate: new Date().toISOString()
            });
        });
    });
}

// ==========================================
// === FINANCE CRUD ===
// ==========================================
function populateFinanceCategories(type) {
    var cats = type === 'income' ? incomeCategories : expenseCategories;
    initSelectPicker('financeCategoryPicker', cats);
    setSelectValue('financeCategoryPicker', '', 'Tanlang...');
}



function editFinance(id) {
    var f = financesArr.find(function (x) { return x.id === id; });
    if (!f) return;
    document.getElementById('financeId').value = f.id;
    document.getElementById('financeType').value = f.type;
    document.getElementById('financeDate').value = f.date;
    document.getElementById('financeAmount').value = f.amount;
    document.getElementById('financeDescription').value = f.description || '';
    var isInc = f.type === 'income';
    document.getElementById('financeModalTitle').innerHTML = isInc ? '<i class="fas fa-arrow-circle-down" style="color:var(--success)"></i> Kirimni tahrirlash' : '<i class="fas fa-arrow-circle-up" style="color:var(--danger)"></i> Chiqimni tahrirlash';
    populateFinanceCategories(f.type);
    setSelectValue('financeCategoryPicker', f.category, f.category);
    openModal('financeModal');
}

document.getElementById('addIncomeBtn').addEventListener('click', function () {
    document.getElementById('financeForm').reset();
    document.getElementById('financeId').value = '';
    document.getElementById('financeType').value = 'income';
    document.getElementById('financeDate').value = getTodayStr();
    document.getElementById('financeModalTitle').innerHTML = '<i class="fas fa-arrow-circle-down" style="color:var(--success)"></i> Kirim qo\'shish';
    populateFinanceCategories('income');
    openModal('financeModal');
});

document.getElementById('addExpenseBtn').addEventListener('click', function () {
    document.getElementById('financeForm').reset();
    document.getElementById('financeId').value = '';
    document.getElementById('financeType').value = 'expense';
    document.getElementById('financeDate').value = getTodayStr();
    document.getElementById('financeModalTitle').innerHTML = '<i class="fas fa-arrow-circle-up" style="color:var(--danger)"></i> Chiqim qo\'shish';
    populateFinanceCategories('expense');
    openModal('financeModal');
});

// Dashboard expense button - opens same finance modal in expense mode
document.getElementById('addDashExpenseBtn').addEventListener('click', function () {
    document.getElementById('financeForm').reset();
    document.getElementById('financeId').value = '';
    document.getElementById('financeType').value = 'expense';
    document.getElementById('financeDate').value = getTodayStr();
    document.getElementById('financeModalTitle').innerHTML = '<i class="fas fa-arrow-circle-up" style="color:var(--danger)"></i> Chiqim qo\'shish';
    populateFinanceCategories('expense');
    openModal('financeModal');
});

document.getElementById('financeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var id = document.getElementById('financeId').value;
    var data = {
        date: document.getElementById('financeDate').value,
        type: document.getElementById('financeType').value,
        category: document.getElementById('financeCategory').value,
        description: document.getElementById('financeDescription').value.trim(),
        amount: parseFloat(document.getElementById('financeAmount').value) || 0
    };
    if (id) {
        db.collection("finances").doc(id).update(data).then(function () { showToast("Ma'lumot yangilandi!"); closeModal('financeModal'); }).catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
    } else {
        data.createdAt = new Date().toISOString();
        db.collection("finances").add(data).then(function () { showToast(data.type === 'income' ? "Kirim qo'shildi!" : "Chiqim qo'shildi!"); closeModal('financeModal'); }).catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
    }
});

// ==========================================
// === UNIVERSAL DELETE ===
// ==========================================
var deleteTarget = { coll: '', id: '', storagePath: '' };

function deleteItem(coll, id, name) {
    deleteTarget = { coll: coll, id: id, storagePath: '' };
    document.getElementById('deleteMessage').textContent = '"' + name + '" ni o\'chirmoqchimisiz?';
    openModal('deleteModal');
}

// Mahsulotni rasm bilan birga o'chirish
function deleteProductWithImage(id, name, storagePath) {
    deleteTarget = { coll: 'products', id: id, storagePath: storagePath || '' };
    document.getElementById('deleteMessage').textContent = '"' + name + '" ni o\'chirmoqchimisiz?';
    openModal('deleteModal');
}

// Delegatsiya qilingan click handlerlar (inline onclick o'rniga)
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('status-select-inline')) {
        var sid = e.target.dataset.id;
        var newStatus = e.target.value;
        var sale = salesArr.find(function (x) { return x.id === sid; });
        if (!sale) return;

        // Agar status "sotildi" bo'lsa moliya amallarini bajarish
        if (newStatus === 'sotildi' && sale.status !== 'sotildi') {
            // 1. Daromad qo'shish
            db.collection("finances").add({
                date: getTodayStr(),
                type: 'income',
                category: 'Sotuv daromadi',
                description: 'Sotuv: ' + (sale.name || 'Noma\'lum'),
                amount: sale.totalAmount,
                saleId: sid,
                createdAt: new Date().toISOString()
            });

            // 2. Agar dostavka bo'lsa xarajatga qo'shish
            if (sale.deliveryAmount > 0) {
                var isViloyat = sale.region && !sale.region.toLowerCase().includes('toshkent');
                db.collection("finances").add({
                    date: getTodayStr(),
                    type: 'expense',
                    category: isViloyat ? 'Pochta' : 'Yandex',
                    description: (isViloyat ? 'Viloyatga dostavka' : 'Shaharga dostavka') + ' (Mijoz tomonidan to\'landi)',
                    amount: sale.deliveryAmount,
                    saleId: sid,
                    isDeliveryExpense: true,
                    createdAt: new Date().toISOString()
                });
            }
            
            // 3. Mijoz statistikasini yangilash
            updateCustomerStats(sale.name, sale.totalAmount);
            showToast('Sotuv muvaffaqiyatli yakunlandi!', 'success');
        }

        db.collection("sales").doc(sid).update({ status: newStatus })
            .then(function () { 
                if (newStatus !== 'sotildi') showToast('Status yangilandi'); 
            })
            .catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
    }
});

document.addEventListener('click', function (e) {
    var btn;

    // Product edit
    btn = e.target.closest('.product-edit-btn');
    if (btn) {
        var pid = btn.getAttribute('data-id');
        if (pid) editProduct(pid);
        return;
    }

    // Product delete
    btn = e.target.closest('.product-delete-btn');
    if (btn) {
        var dpId = btn.getAttribute('data-id');
        var dpName = btn.getAttribute('data-name') || '';
        var dpPath = btn.getAttribute('data-storage-path') || '';
        deleteProductWithImage(dpId, dpName, dpPath);
        return;
    }



    // Sale edit
    btn = e.target.closest('.sale-edit-btn');
    if (btn) {
        var sid = btn.getAttribute('data-id');
        if (sid) editSale(sid);
        return;
    }

    // Sale delete
    btn = e.target.closest('.sale-delete-btn');
    if (btn) {
        var sdelId = btn.getAttribute('data-id');
        deleteItem('sales', sdelId, 'bu sotuvni');
        return;
    }

    // Finance edit
    btn = e.target.closest('.finance-edit-btn');
    if (btn) {
        var fid = btn.getAttribute('data-id');
        if (fid) editFinance(fid);
        return;
    }

    // Finance delete
    btn = e.target.closest('.finance-delete-btn');
    if (btn) {
        var fdelId = btn.getAttribute('data-id');
        deleteItem('finances', fdelId, 'bu yozuvni');
        return;
    }
});

document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
    var storagePath = deleteTarget.storagePath;
    db.collection(deleteTarget.coll).doc(deleteTarget.id).delete().then(function () {
        closeModal('deleteModal');
        showToast("O'chirildi!", 'info');
        // Agar mahsulot rasmi bo'lsa, uni Storage dan ham o'chirish
        if (storagePath) {
            storage.ref(storagePath).delete().catch(function () {
                // Rasm o'chirishda xatolik bo'lsa ham jarayon davom etadi
            });
        }
    }).catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
});

// ==========================================
// === DASHBOARD ===
// ==========================================



// ==========================================
// === SETTINGS: THEME MODE ===
// ==========================================
function setThemeMode(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('crm_theme_mode', mode);

    var lightBtn = document.getElementById('btnLightMode');
    var darkBtn = document.getElementById('btnDarkMode');
    if (!lightBtn || !darkBtn) return;

    if (mode === 'light') {
        lightBtn.classList.remove('btn-secondary');
        lightBtn.classList.add('btn-primary');
        darkBtn.classList.remove('btn-primary');
        darkBtn.classList.add('btn-secondary');
    } else {
        darkBtn.classList.remove('btn-secondary');
        darkBtn.classList.add('btn-primary');
        lightBtn.classList.remove('btn-primary');
        lightBtn.classList.add('btn-secondary');
    }
}

// Load saved theme
var savedTheme = localStorage.getItem('crm_theme_mode') || 'dark';
setThemeMode(savedTheme);

document.getElementById('btnLightMode').addEventListener('click', function () {
    setThemeMode('light');
    showToast('Kunduzgi holat yoqildi!', 'info');
});

document.getElementById('btnDarkMode').addEventListener('click', function () {
    setThemeMode('dark');
    showToast('Tungi holat yoqildi!', 'info');
});

// ==========================================
// === SETTINGS: USER MANAGEMENT ===
// ==========================================
document.getElementById('addUserBtn').addEventListener('click', function () {
    document.getElementById('userForm').reset();
    document.getElementById('editUserId').value = '';
    document.getElementById('newUserEmail').disabled = false;
    document.getElementById('newUserPassword').required = true;
    document.getElementById('passGroup').style.display = 'block';
    initSelectPicker('newUserRolePicker');
    setSelectValue('newUserRolePicker', 'manager', 'Manager (Cheklangan)');
    document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Yangi xodim qo\'shish';
    openModal('userModal');
});

function editUser(id) {
    var u = usersArr.find(function (x) { return x.id === id; });
    if (!u) return;
    document.getElementById('userForm').reset();
    document.getElementById('editUserId').value = u.id;
    document.getElementById('newUserName').value = u.name;
    document.getElementById('newUserEmail').value = u.email;
    initSelectPicker('newUserRolePicker');
    var roleVal = u.role || 'manager';
    var roleLab = roleVal === 'admin' ? 'Admin (To\'liq huquq)' : 'Manager (Cheklangan)';
    setSelectValue('newUserRolePicker', roleVal, roleLab);
    
    // Ruxsatnomalarni to'ldirish
    var perms = u.permissions || { sales: true, customers: true, finance: true, products: true, staff: false, settings: false };
    document.getElementById('perm_sales').checked = perms.sales !== false;
    document.getElementById('perm_customers').checked = perms.customers !== false;
    document.getElementById('perm_finance').checked = perms.finance !== false;
    document.getElementById('perm_products').checked = perms.products !== false;
    document.getElementById('perm_staff').checked = !!perms.staff;
    document.getElementById('perm_settings').checked = !!perms.settings;

    document.getElementById('newUserEmail').disabled = true;
    document.getElementById('newUserPassword').required = false;
    document.getElementById('newUserPassword').placeholder = "O'zgartirish uchun yangi parol kiriting (ixtiyoriy)";
    document.getElementById('passGroup').style.display = 'block';
    document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> Xodimni tahrirlash';
    openModal('userModal');
}

document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var id = document.getElementById('editUserId').value;
    var name = document.getElementById('newUserName').value.trim();
    var email = document.getElementById('newUserEmail').value.trim().toLowerCase();
    var password = document.getElementById('newUserPassword').value;

    var btn = document.getElementById('createUserBtn');
    btn.disabled = true;
    btn.textContent = 'Saqlanmoqda...';

    var permissions = {
        sales: document.getElementById('perm_sales').checked,
        customers: document.getElementById('perm_customers').checked,
        finance: document.getElementById('perm_finance').checked,
        products: document.getElementById('perm_products').checked,
        staff: document.getElementById('perm_staff').checked,
        settings: document.getElementById('perm_settings').checked
    };

    if (id) {
        var updateData = {
            name: name,
            role: document.getElementById('newUserRole').value,
            permissions: permissions
        };
        if (password) {
            updateData.password = password;
        }

        db.collection("users").doc(id).update(updateData).then(function () {
            showToast("Xodim ma'lumotlari yangilandi!");
            closeModal('userModal');
            btn.disabled = false;
            btn.textContent = 'Saqlash';
        }).catch(function (err) {
            btn.disabled = false;
            btn.textContent = 'Saqlash';
            showToast('Xatolik: ' + err.message, 'error');
        });
    } else {
        var secondaryApp;
        try {
            secondaryApp = firebase.app('Secondary');
        } catch (e) {
            secondaryApp = firebase.initializeApp(firebase.app().options, 'Secondary');
        }
        var secondaryAuth = secondaryApp.auth();

        secondaryAuth.createUserWithEmailAndPassword(email, password).then(function (cred) {
            return db.collection("users").doc(cred.user.uid).set({
                name: name,
                email: email,
                role: document.getElementById('newUserRole').value,
                permissions: permissions,
                password: password,
                createdAt: new Date().toISOString()
            });
        }).then(function () {
            secondaryAuth.signOut();
            showToast("Yangi xodim qo'shildi va paroli bazaga saqlandi!");
            closeModal('userModal');
            btn.disabled = false;
            btn.textContent = 'Saqlash';
        }).catch(function (err) {
            btn.disabled = false;
            btn.textContent = 'Saqlash';
            if (err.code === 'auth/email-already-in-use') {
                showToast('Bu email allaqachon ro\'yxatdan o\'tgan!', 'error');
            } else {
                showToast('Xatolik: ' + err.message, 'error');
            }
        });
    }
});

// Load users list
db.collection("users").onSnapshot(function (snapshot) {
    usersArr = [];
    snapshot.forEach(function (doc) { usersArr.push(Object.assign({ id: doc.id }, doc.data())); });
    renderUsers();
});

function renderUsers(searchTerm) {
    searchTerm = searchTerm || '';
    var tbody = document.getElementById('usersBody');
    var empty = document.getElementById('usersEmpty');
    var filtered = usersArr.slice().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

    if (searchTerm) {
        var q = searchTerm.toLowerCase();
        filtered = filtered.filter(function (u) {
            return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        });
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    tbody.innerHTML = filtered.map(function (u, i) {
        var uRole = (u.role && String(u.role).trim().toLowerCase() === 'admin');
        var roleBadge = uRole ? '<span class="status-badge active">Admin</span>' : '<span class="status-badge info">Manager</span>';
        var realPassword = u.password || u.parol || u.pass || u.userPassword;
        var hasPassword = !!realPassword;
        var pwdToShow = hasPassword ? realPassword : "Parol topilmadi";

        var passwordHtml = '<div class="password-cell-inner' + (hasPassword ? '' : ' no-password') + '">' +
            '<span class="password-text" data-original="' + escapeHtml(pwdToShow) + '" data-has-pwd="' + hasPassword + '"></span>' +
            '<button type="button" class="password-eye-btn" data-visible="false" title="Ko\'rsatish/Yashirish"><i class="fas fa-eye"></i></button>' +
            '</div>';

        return '' +
            '<tr class="user-data-row">' +
            '<td data-label="#">' + (i + 1) + '</td>' +
            '<td data-label="Ismi"><span class="user-name-link">' + escapeHtml(u.name) + '</span></td>' +
            '<td data-label="Email (Login)">' + escapeHtml(u.email) + '</td>' +
            '<td data-label="Parol">' + passwordHtml + '</td>' +
            '<td data-label="Rol">' + roleBadge + '</td>' +
            '<td data-label="Yaratilgan">' + formatDate(u.createdAt) + '</td>' +
            '<td data-label="Amallar"><button class="btn-icon edit user-edit-btn" data-id="' + u.id + '" title="Tahrirlash"><i class="fas fa-pen"></i></button>' +
            '<button class="btn-icon delete user-delete-btn" data-id="' + u.id + '" data-name="' + escapeHtml(u.name) + '" title="O\'chirish"><i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    }).join('');
    updateUIVisibility('staff');
}

// User edit/delete delegatsiya
document.addEventListener('click', function (e) {
    var btn;

    btn = e.target.closest('.user-edit-btn');
    if (btn) {
        var uid = btn.getAttribute('data-id');
        if (uid) editUser(uid);
        return;
    }

    btn = e.target.closest('.user-delete-btn');
    if (btn) {
        var udelId = btn.getAttribute('data-id');
        var udelName = btn.getAttribute('data-name') || '';
        deleteItem('users', udelId, udelName);
        return;
    }

    // Password Toggle Visibility
    var eyeBtn = e.target.closest('.password-eye-btn');
    if (eyeBtn) {
        var wrap = eyeBtn.closest('.password-cell-inner');
        var txt = wrap.querySelector('.password-text');
        var icon = eyeBtn.querySelector('i');
        var original = txt.getAttribute('data-original');
        var isVisible = eyeBtn.getAttribute('data-visible') === 'true';

        if (!isVisible) {
            txt.textContent = original;
            icon.classList.replace('fa-eye', 'fa-eye-slash');
            eyeBtn.classList.add('active');
            eyeBtn.setAttribute('data-visible', 'true');
        } else {
            txt.textContent = '';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
            eyeBtn.classList.remove('active');
            eyeBtn.setAttribute('data-visible', 'false');
        }
    }

    // Staff row click navigation
    var userRow = e.target.closest('.user-data-row');
    if (userRow && !e.target.closest('.btn-icon') && !e.target.closest('.password-eye-btn') && !e.target.closest('.user-edit-btn') && !e.target.closest('.user-delete-btn')) {
        var editBtn = userRow.querySelector('.user-edit-btn');
        if (editBtn) {
            var uid = editBtn.getAttribute('data-id');
            loadUserProfileById(uid);
        }
    }
});

// Avatar upload logic
document.getElementById('avatarUpload').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    
    var reader = new FileReader();
    reader.onload = function(event) {
        var base64 = event.target.result;
        var uid = document.getElementById('infoUid').textContent;
        if (uid && uid !== '---') {
            db.collection('users').doc(uid).update({ avatar: base64 }).then(function() {
                document.getElementById('profileAvatarDisplay').innerHTML = '<img src="' + base64 + '" alt="Avatar">';
                showToast('Profil rasmi yangilandi!');
            });
        }
    };
    reader.readAsDataURL(file);
});

// Profile Tabs Logic
document.querySelectorAll('.profile-tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var tid = this.getAttribute('data-tab-id');
        document.querySelectorAll('.profile-tab-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
        this.classList.add('active');
        document.getElementById(tid).classList.add('active');
    });
});

// Settings Vertical Tabs Logic
document.querySelectorAll('.set-nav-item').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var section = this.getAttribute('data-set-section');
        document.querySelectorAll('.set-nav-item').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        renderAdminSettingsSection(section);
    });
});

function loadUserProfileById(uid) {
    var u = usersArr.find(function(x) { return x.id === uid; });
    if (!u) return;
    
    navigateTo('profile');
    
    // Header info
    document.getElementById('profileName').textContent = u.name || 'Noma\'lum';
    document.getElementById('profileRoleText').innerHTML = '<i class="fas fa-shield-halved"></i> ' + (u.role === 'admin' ? 'Admin' : 'Menejer');
    document.getElementById('infoUid').textContent = u.id;
    document.getElementById('infoEmail').textContent = u.email;
    document.getElementById('infoRole').textContent = u.role === 'admin' ? 'Admin' : 'Menejer';
    document.getElementById('infoJoinDate').textContent = formatDate(u.createdAt);
    
    // Avatar
    var avatarEl = document.getElementById('profileAvatarDisplay');
    if (u.avatar) {
        avatarEl.innerHTML = '<img src="' + u.avatar + '" alt="Avatar">';
    } else {
        avatarEl.innerHTML = '<i class="fas fa-user-astronaut"></i>';
    }
    
    // Stats calculation
    var uSales = salesArr.filter(function(s) { return s.status === 'sotildi' && s.createdBy === u.id; }); // Assuming createdBy exists
    // If createdBy doesn't exist yet, we'll need to add it to sales data in future. 
    // For now, let's use a mock or filter by name if name matches
    if (uSales.length === 0) {
        uSales = salesArr.filter(function(s) { return s.status === 'sotildi' && s.sellerName === u.name; });
    }
    
    var totalVol = uSales.reduce(function(sum, s) { return sum + (s.totalAmount || 0); }, 0);
    document.getElementById('infoSalesCount').textContent = uSales.length;
    document.getElementById('statSalesCount').textContent = uSales.length;
    document.getElementById('statSalesVolume').textContent = formatMoney(totalVol);
    
    // Rating (Mock logic based on sales)
    var rating = Math.min(5, (uSales.length / 10) + 1);
    renderStarRating(rating);
    document.getElementById('infoRatingScore').textContent = (rating * 100).toFixed(0);
    
    // Permissions visibility
    var isAdmin = currentUserRole === 'admin';
    document.getElementById('adminSettingsSidebar').style.display = isAdmin ? 'flex' : 'none';
    document.getElementById('saveProfilePermissionsBtn').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('personalSettingsSection').style.display = (!isAdmin || u.id === auth.currentUser.uid) ? 'block' : 'none';
    
    if (isAdmin) {
        renderAdminSettingsSection('dash', u.permissions);
    }
    
    // Render profile sales list
    renderProfileSales(uSales);
}

function renderProfileSales(sales) {
    var container = document.getElementById('profileSalesList');
    if (!container) return;
    
    if (sales.length === 0) {
        container.innerHTML = '<div class="empty-state" style="padding: 20px;"><p>Sotuvlar topilmadi.</p></div>';
        return;
    }
    
    container.innerHTML = sales.map(function(s) {
        return '<div class="achievement-item" style="margin-bottom: 10px; cursor: pointer;" onclick="viewSaleDetails(\'' + s.id + '\')">' +
               '<div class="ach-icon"><i class="fas fa-shopping-cart"></i></div>' +
               '<div class="ach-text">' +
               '<span class="ach-label">' + formatDate(s.createdAt) + '</span>' +
               '<span class="ach-value">' + formatMoney(s.totalAmount) + '</span>' +
               '</div>' +
               '<div style="margin-left: auto;"><i class="fas fa-chevron-right" style="opacity: 0.3;"></i></div>' +
               '</div>';
    }).join('');
}

function viewSaleDetails(saleId) {
    var sale = salesArr.find(function(s) { return s.id === saleId; });
    if (sale) {
        openSaleDetailModal(sale);
    }
}

// Personal password update
document.getElementById('updateProfilePassBtn').addEventListener('click', function() {
    var newPass = document.getElementById('newProfilePass').value;
    if (!newPass || newPass.length < 6) {
        showToast('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!', 'error');
        return;
    }
    
    var user = auth.currentUser;
    var uid = document.getElementById('infoUid').textContent;
    
    if (user && user.uid === uid) {
        user.updatePassword(newPass).then(function() {
            return db.collection('users').doc(uid).update({ 
                password: newPass,
                passUpdated: new Date().toISOString() 
            });
        }).then(function() {
            showToast('Parolingiz muvaffaqiyatli yangilandi!');
            document.getElementById('newProfilePass').value = '';
        }).catch(function(error) {
            showToast('Xatolik: ' + error.message, 'error');
        });
    }
});

// Admin alert for password changes
var lastPasswordAlertAt = {};
db.collection('users').onSnapshot(function(snapshot) {
    if (currentUserRole !== 'admin') return;
    
    snapshot.docChanges().forEach(function(change) {
        if (change.type === "modified") {
            var data = change.doc.data();
            var lastAlertTime = lastPasswordAlertAt[change.doc.id];
            if (data.passUpdated && (!lastAlertTime || data.passUpdated > lastAlertTime)) {
                // Show alert for admin
                if (change.doc.id !== auth.currentUser.uid) {
                    showToast(data.name + ' parolini o\'zgartirdi!', 'info');
                }
                lastPasswordAlertAt[change.doc.id] = data.passUpdated;
            }
        }
    });
});

function renderStarRating(rating) {
    var container = document.getElementById('profileStarRating');
    var html = '';
    for (var i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) html += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= rating) html += '<i class="fas fa-star-half-alt"></i>';
        else html += '<i class="far fa-star"></i>';
    }
    html += '<span class="rating-value">' + rating.toFixed(1) + '</span>';
    container.innerHTML = html;
}

function renderAdminSettingsSection(section, perms) {
    var main = document.getElementById('adminSettingsMain');
    var uid = document.getElementById('infoUid').textContent;
    var u = usersArr.find(function(x) { return x.id === uid; });
    var p = perms || (u ? u.permissions : {});
    
    var html = '';
    switch(section) {
        case 'dash':
            html = '<h3>Dashboard Ruxsatlari</h3>' +
                   createPermSwitch('Dashboard bo\'limi', 'view_dash', p.view_dash !== false) +
                   '<div class="sub-perms">' +
                   createPermSwitch('Sof foyda ko\'rinishi', 'dash_profit', p.dash_profit !== false) +
                   '</div>';
            break;
        case 'sales':
            html = '<h3>Sotuvlar Ruxsatlari</h3>' +
                   createPermSwitch('Sotuvlar bo\'limi', 'view_sales', p.view_sales !== false) +
                   '<div class="sub-perms">' +
                   createPermSwitch('Sotuvni tahrirlash', 'edit_sale', p.edit_sale !== false) +
                   createPermSwitch('Sotuvni o\'chirish', 'delete_sale', p.delete_sale !== false) +
                   '</div>';
            break;
        case 'customers':
            html = '<h3>Mijozlar Ruxsatlari</h3>' +
                   createPermSwitch('Mijozlar bo\'limi', 'view_customers', p.view_customers !== false) +
                   '<div class="sub-perms">' +
                   createPermSwitch('Mijozni o\'chirish', 'delete_customer', p.delete_customer !== false) +
                   '</div>';
            break;
        case 'finance':
            html = '<h3>Moliya Ruxsatlari</h3>' +
                   createPermSwitch('Moliya bo\'limi', 'view_finance', p.view_finance !== false) +
                   '<div class="sub-perms">' +
                   createPermSwitch('Chiqim qo\'shish', 'add_expense', p.add_expense !== false) +
                   '</div>';
            break;
        case 'products':
            html = '<h3>Mahsulotlar Ruxsatlari</h3>' +
                   createPermSwitch('Mahsulotlar bo\'limi', 'view_products', p.view_products !== false) +
                   '<div class="sub-perms">' +
                   createPermSwitch('Tannarxni ko\'rish', 'view_cost', p.view_cost !== false) +
                   '</div>';
            break;
        case 'staff':
            html = '<h3>Xodimlar Ruxsatlari</h3>' +
                   createPermSwitch('Xodimlar bo\'limi (Admin)', 'view_staff', !!p.view_staff) +
                   createPermSwitch('Sozlamalar bo\'limi', 'view_settings', !!p.view_settings);
            break;
    }
    main.innerHTML = html;
}

function createPermSwitch(label, id, checked) {
    return '<label class="perm-switch">' +
           '<span>' + label + '</span>' +
           '<input type="checkbox" id="perm_' + id + '" ' + (checked ? 'checked' : '') + ' onchange="updateLivePermission(\'' + id + '\', this.checked)">' +
           '<span class="slider"></span>' +
           '</label>';
}

function updateLivePermission(key, val) {
    var uid = document.getElementById('infoUid').textContent;
    if (!uid || uid === '---') return;
    // We'll save all at once with the save button as requested, 
    // but this could also be live-updated.
}

document.getElementById('saveProfilePermissionsBtn').addEventListener('click', function() {
    var infoUidEl = document.getElementById('infoUid');
    if (!infoUidEl) return;
    var uid = infoUidEl.textContent;
    if (!uid || uid === '---') return;
    
    var u = usersArr.find(function(x) { return x.id === uid; });
    if (!u) return;
    var newPerms = Object.assign({}, u.permissions || {});
    
    // Collect all checkboxes from the current view and potentially others if we cached them
    // For simplicity, let's collect common ones
    var keys = ['view_dash', 'dash_profit', 'view_sales', 'edit_sale', 'delete_sale', 'view_customers', 'delete_customer', 'view_finance', 'add_expense', 'view_products', 'view_cost', 'view_staff', 'view_settings'];
    keys.forEach(function(k) {
        var el = document.getElementById('perm_' + k);
        if (el) newPerms[k] = el.checked;
    });
    
    db.collection('users').doc(uid).update({ permissions: newPerms }).then(function() {
        showToast('Ruxsatnomalar saqlandi!');
    });
});

// ==========================================
// === SEARCH ===
// ==========================================
var salesSearchInput = document.getElementById('salesSearch');
if (salesSearchInput) {
    salesSearchInput.addEventListener('input', function (e) { renderSales(e.target.value); });
}
var financeSearchInput = document.getElementById('financeSearch');
if (financeSearchInput) {
    financeSearchInput.addEventListener('input', function (e) { renderFinance(e.target.value); });
}
var productsSearchInput = document.getElementById('productsSearch');
if (productsSearchInput) {
    productsSearchInput.addEventListener('input', function (e) { renderProducts(e.target.value); });
}
var staffSearchInput = document.getElementById('staffSearch');
if (staffSearchInput) {
    staffSearchInput.addEventListener('input', function (e) { renderUsers(e.target.value); });
}


// ==========================================
// === INIT ===
// ==========================================
function formatTashkentDateTime() {
    var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Tashkent',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).formatToParts(new Date());

    function getPart(type) {
        var part = parts.find(function (p) { return p.type === type; });
        return part ? part.value : '';
    }

    return getPart('day') + '.' + getPart('month') + '.' + getPart('year') + ' ' + getPart('hour') + ':' + getPart('minute') + ':' + getPart('second');
}

function startTopbarClock() {
    var el = document.getElementById('currentDate');
    if (!el) return;

    function tick() {
        el.textContent = formatTashkentDateTime() + ' (Toshkent)';
    }

    tick();
    setInterval(tick, 1000);
}

startTopbarClock();
navigateTo('dashboard');

// ==========================================
// === FILTER INIT ===
// ==========================================

// Sales  region filter selectni toldirish
(function initSalesFilter() {
    var sel = document.getElementById('salesRegionFilter');
    if (!sel) return;
    allRegions.forEach(function (r) {
        var opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        sel.appendChild(opt);
    });
    sel.addEventListener('change', function () {
        salesFilter.region = this.value || 'all';
        var searchEl = document.getElementById('salesSearch');
        var current = searchEl ? searchEl.value : '';
        renderSales(current);
    });
})();

// Finance  kategoriya filter
(function initFinanceCategoryFilter() {
    var sel = document.getElementById('financeCategoryFilter');
    if (!sel) return;
    var allCats = incomeCategories.concat(expenseCategories);
    allCats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        sel.appendChild(opt);
    });
    var typeSel = document.getElementById('financeTypeFilter');
    if (typeSel) {
        typeSel.addEventListener('change', function () {
            financeFilter.type = this.value || 'all';
            var searchEl = document.getElementById('financeSearch');
            var current = searchEl ? searchEl.value : '';
            renderFinance(current);
        });
    }
    sel.addEventListener('change', function () {
        financeFilter.category = this.value || 'all';
        var searchEl = document.getElementById('financeSearch');
        var current = searchEl ? searchEl.value : '';
        renderFinance(current);
    });
})();

// Products  kategoriya va status filtrlar
(function initProductsFilters() {
    var catSel = document.getElementById('productsCategoryFilter');
    var statusSel = document.getElementById('productsStatusFilter');
    if (!catSel || !statusSel) return;
    allProductCategories.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        catSel.appendChild(opt);
    });
    catSel.addEventListener('change', function () {
        productsFilter.category = this.value || 'all';
        var searchEl = document.getElementById('productsSearch');
        var current = searchEl ? searchEl.value : '';
        renderProducts(current);
    });
    statusSel.addEventListener('change', function () {
        productsFilter.status = this.value || 'all';
        var searchEl = document.getElementById('productsSearch');
        var current = searchEl ? searchEl.value : '';
        renderProducts(current);
    });
})();

// ==========================================
// === FIREBASE STORAGE - RASM YUKLASH ===
// Stub: rasm yuklash endi ishlatilmaydi
function uploadProductImage(file, callback) {
    if (typeof callback === 'function') callback('', '');
}


// Mahsulot ma'lumotlarini Firestore ga saqlash
function saveProductData(id, data) {
    if (id) {
        return db.collection('products').doc(id).update(data)
            .then(function () { showToast('Mahsulot yangilandi!'); closeModal('productModal'); })
            .catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
    } else {
        data.createdAt = new Date().toISOString();
        return db.collection('products').add(data)
            .then(function () { showToast("Yangi mahsulot qo'shildi!"); closeModal('productModal'); })
            .catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
    }
}

// Rasm input ni reset qilish yordamchi funksiyasi
var productFormImages = [];
var productImagesTouched = false;

function setProductFormImages(images, markTouched) {
    var list = Array.isArray(images) ? images : [];
    productFormImages = list.filter(function (url) { return typeof url === 'string' && url.trim(); });
    if (markTouched === true) productImagesTouched = true;
    if (markTouched === false) productImagesTouched = false;
    renderProductImagePreviews();
}

function renderProductImagePreviews() {
    var container = document.getElementById('imagePreviewContainer');
    var list = document.getElementById('imagePreviewList');
    var placeholder = document.getElementById('imageUploadPlaceholder');
    if (!container || !list || !placeholder) return;

    if (!productFormImages.length) {
        list.innerHTML = '';
        container.style.display = 'none';
        placeholder.style.display = 'flex';
        return;
    }

    container.style.display = 'block';
    placeholder.style.display = 'none';
    list.innerHTML = productFormImages.map(function (src, idx) {
        return '' +
            '<div class="image-preview-item">' +
            '<img src="' + src + '" alt="Rasm ' + (idx + 1) + '">' +
            '<button type="button" class="image-preview-remove" data-index="' + idx + '" title="Rasmni o\'chirish">' +
            '<i class="fas fa-times"></i>' +
            '</button>' +
            '</div>';
    }).join('');
}

function resetImageUpload() {
    document.getElementById('productImage').value = '';
    setProductFormImages([], false);
    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressText').textContent = '0%';
}

function handleImageFiles(files, append) {
    var list = Array.prototype.slice.call(files || []);
    if (!list.length) return;

    var validFiles = list.filter(function (file) { return file && file.type && file.type.startsWith('image/'); });
    if (!validFiles.length) {
        showToast('Faqat rasm fayllarini yuklang!', 'error');
        return;
    }

    if (validFiles.some(function (file) { return file.size > 5 * 1024 * 1024; })) {
        showToast('Rasm hajmi 5MB dan oshmasligi kerak!', 'error');
        return;
    }

    Promise.all(validFiles.map(function (file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (ev) { resolve(ev.target.result); };
            reader.onerror = function () { reject(); };
            reader.readAsDataURL(file);
        });
    })).then(function (results) {
        productFormImages = append ? productFormImages.concat(results) : results;
        productImagesTouched = true;
        renderProductImagePreviews();
    }).catch(function () {
        showToast('Rasmni o\'qishda xatolik yuz berdi!', 'error');
    });
}

// Rasm yuklash maydoni - click bilan fayl tanlash
var imageUploadArea = document.getElementById('imageUploadArea');
var productImageInput = document.getElementById('productImage');

imageUploadArea.addEventListener('click', function (e) {
    if (e.target.closest('#removeImageBtn') || e.target.closest('.image-preview-remove')) return;
    productImageInput.click();
});

// Rasm tanlanganda preview ko'rsatish
productImageInput.addEventListener('change', function () {
    if (!this.files || !this.files.length) return;
    handleImageFiles(this.files, true);
    this.value = '';
});

// Rasmni o'chirish (faqat previewdan, Storage dan emas) - barchasini tozalash
document.getElementById('removeImageBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    resetImageUpload();
    productImagesTouched = true;
});

// Bitta rasmni o'chirish
document.getElementById('imagePreviewList').addEventListener('click', function (e) {
    var btn = e.target.closest('.image-preview-remove');
    if (!btn) return;
    e.stopPropagation();
    var idx = parseInt(btn.dataset.index, 10);
    if (isNaN(idx)) return;
    productFormImages.splice(idx, 1);
    productImagesTouched = true;
    renderProductImagePreviews();
});

// Drag & drop qo'llab-quvvatlash
imageUploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    this.style.borderColor = 'var(--accent)';
    this.style.background = 'var(--accent-glow)';
});

imageUploadArea.addEventListener('dragleave', function () {
    this.style.borderColor = '';
    this.style.background = '';
});

imageUploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    this.style.borderColor = '';
    this.style.background = '';
    handleImageFiles(e.dataTransfer.files, true);
});

// ==========================================
// === CUSTOMERS MANAGEMENT ===
// ==========================================

// Mijozlar ro'yxatini yuklash va ko'rsatish
function renderCustomers(searchQuery) {
    var customersBody = document.getElementById('customersBody');
    var mobileList = document.getElementById('customersMobileList');
    var customersEmpty = document.getElementById('customersEmpty');
    if (!customersBody) return;

    db.collection('customers').orderBy('createdAt', 'desc').onSnapshot(function (snapshot) {
        var customers = [];
        snapshot.forEach(function (doc) {
            var data = doc.data();
            data.id = doc.id;
            if (!searchQuery ||
                data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                data.phone.includes(searchQuery)) {
                customers.push(data);
            }
        });

        if (customers.length === 0) {
            customersBody.innerHTML = '';
            if (mobileList) mobileList.innerHTML = '';
            customersEmpty.style.display = 'block';
        } else {
            customersEmpty.style.display = 'none';
            var rowsHtml = [];
            var cardsHtml = [];

            customers.forEach(function (c, i) {
                var totalSpent = c.totalSpent || 0;
                var debt = c.debt || 0;
                var statusLabel = totalSpent > 5000000 ? 'VIP' : (totalSpent > 1000000 ? 'Doimiy' : 'Yangi');
                var statusClass = totalSpent > 5000000 ? 'vip' : (totalSpent > 1000000 ? 'regular' : 'new');

                var vipBadge = totalSpent > 5000000 ? '<span class="status-badge active" style="background: linear-gradient(45deg, #ffd700, #ffa500); color: #000; border: none;"><i class="fas fa-crown"></i> VIP</span>' :
                    totalSpent > 1000000 ? '<span class="status-badge info">Doimiy</span>' :
                        '<span class="status-badge">Yangi</span>';

                var phoneDisplay = '<div>' + escapeHtml(c.phone) + '</div>';
                if (c.telegram) {
                    var tgLink = c.telegram.startsWith('@') ? c.telegram.substring(1) : c.telegram;
                    phoneDisplay += '<a href="https://t.me/' + tgLink + '" target="_blank" style="color: #0088cc; font-size: 0.85rem;"><i class="fab fa-telegram"></i> ' + escapeHtml(c.telegram) + '</a>';
                }

                var debtClass = debt > 0 ? 'amount-negative' : '';

                rowsHtml.push(
                    '<tr>' +
                    '<td data-label="#">' + (i + 1) + '</td>' +
                    '<td data-label="Mijoz ismi"><div style="font-weight:600">' + escapeHtml(c.name) + '</div>' + (c.birthday ? '<div style="font-size:0.75rem; color:var(--text-muted)"><i class="fas fa-birthday-cake"></i> ' + c.birthday + '</div>' : '') + '</td>' +
                    '<td data-label="Telefon / Telegram">' + phoneDisplay + '</td>' +
                    '<td data-label="Viloyat">' + escapeHtml(c.region || '-') + '</td>' +
                    '<td data-label="Sotuvlar soni">' + (c.salesCount || 0) + '</td>' +
                    '<td data-label="Umumiy savdo">' + formatMoney(totalSpent) + '</td>' +
                    '<td data-label="Qarz" class="' + debtClass + '">' + formatMoney(debt) + '</td>' +
                    '<td data-label="Status">' + vipBadge + '</td>' +
                    '<td data-label="Amallar">' +
                    '<button class="btn-icon info customer-history-btn" data-id="' + c.id + '" data-name="' + escapeHtml(c.name) + '" title="Xaridlar tarixi"><i class="fas fa-history"></i></button>' +
                    '<button class="btn-icon edit customer-edit-btn" data-id="' + c.id + '" title="Tahrirlash"><i class="fas fa-pen"></i></button>' +
                    '<button class="btn-icon delete customer-delete-btn" data-id="' + c.id + '" data-name="' + escapeHtml(c.name) + '" title="O\'chirish"><i class="fas fa-trash"></i></button>' +
                    '</td>' +
                    '</tr>'
                );

                if (mobileList) {
                    cardsHtml.push(
                        '<button class="customer-mobile-card ' + statusClass + '" data-customer-id="' + c.id + '">' +
                        '<div class="customer-mobile-top-row">' +
                        '<span class="customer-mobile-status">' + statusLabel + '</span>' +
                        '<span class="customer-mobile-region"><i class="fas fa-location-dot"></i> ' + escapeHtml(c.region || '-') + '</span>' +
                        '</div>' +
                        '<div class="customer-mobile-main">' +
                        '<h3 class="customer-mobile-title">' + escapeHtml(c.name) + '</h3>' +
                        '<span class="customer-mobile-amount">' + formatMoney(totalSpent) + '</span>' +
                        '</div>' +
                        '<div class="customer-mobile-bottom-row">' +
                        '<span class="customer-mobile-phone"><i class="fas fa-phone"></i> ' + escapeHtml(c.phone) + '</span>' +
                        '<span class="customer-mobile-debt ' + (debt > 0 ? 'has-debt' : '') + '">Qarz: ' + formatMoney(debt) + '</span>' +
                        '</div>' +
                        '</button>'
                    );
                }
            });

            customersBody.innerHTML = rowsHtml.join('');
            if (mobileList) {
                mobileList.innerHTML = cardsHtml.join('');
            }
            updateUIVisibility('customers');
        }
    });
}

// Mijoz qo'shish tugmasi
document.getElementById('addCustomerBtn').addEventListener('click', function () {
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
    document.getElementById('customerModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Yangi Mijoz';
    setSelectValue('customerRegionPicker', '', 'Tanlang...');
    openModal('customerModal');
});

// Mijozni saqlash
document.getElementById('customerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var id = document.getElementById('customerId').value;
    var data = {
        name: document.getElementById('customerName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        telegram: document.getElementById('customerTelegram').value.trim(),
        birthday: document.getElementById('customerBirthday').value,
        region: document.getElementById('customerRegion').value,
        address: document.getElementById('customerAddress').value.trim(),
        note: document.getElementById('customerNote').value.trim(),
        updatedAt: new Date().toISOString()
    };

    if (id) {
        db.collection('customers').doc(id).update(data)
            .then(function () { showToast('Mijoz ma\'lumotlari yangilandi'); closeModal('customerModal'); })
            .catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
    } else {
        data.createdAt = new Date().toISOString();
        data.salesCount = 0;
        data.totalSpent = 0;
        data.debt = 0;
        db.collection('customers').add(data)
            .then(function () { showToast('Yangi mijoz qo\'shildi'); closeModal('customerModal'); })
            .catch(function (err) { showToast('Xatolik: ' + err.message, 'error'); });
    }
});

// Mijozni tahrirlash va o'chirish delegatsiyasi
document.addEventListener('click', function (e) {
    var btn = e.target.closest('.customer-edit-btn');
    if (btn) {
        var id = btn.dataset.id;
        db.collection('customers').doc(id).get().then(function (doc) {
            if (doc.exists) {
                var c = doc.data();
                document.getElementById('customerId').value = id;
                document.getElementById('customerName').value = c.name;
                document.getElementById('customerPhone').value = c.phone;
                document.getElementById('customerTelegram').value = c.telegram || '';
                document.getElementById('customerBirthday').value = c.birthday || '';
                document.getElementById('customerAddress').value = c.address || '';
                document.getElementById('customerNote').value = c.note || '';
                setSelectValue('customerRegionPicker', c.region, c.region);
                document.getElementById('customerModalTitle').innerHTML = '<i class="fas fa-pen"></i> Mijozni tahrirlash';
                openModal('customerModal');
            }
        });
        return;
    }

    btn = e.target.closest('.customer-history-btn');
    if (btn) {
        var id = btn.dataset.id;
        var name = btn.dataset.name;
        showCustomerHistory(id, name);
        return;
    }

    btn = e.target.closest('.customer-delete-btn');
    if (btn) {
        deleteItem('customers', btn.dataset.id, btn.dataset.name);
    }
});

function showCustomerHistory(customerId, customerName) {
    document.getElementById('historyCustomerName').textContent = customerName;
    var historyBody = document.getElementById('customerHistoryBody');
    historyBody.innerHTML = '<tr><td colspan="4" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Yuklanmoqda...</td></tr>';

    // Mijoz ma'lumotlarini olish
    db.collection('customers').doc(customerId).get().then(function (doc) {
        if (doc.exists) {
            var c = doc.data();
            document.getElementById('historyTotalSales').textContent = c.salesCount || 0;
            document.getElementById('historyTotalSpent').textContent = formatMoney(c.totalSpent || 0);
            document.getElementById('historyTotalDebt').textContent = formatMoney(c.debt || 0);
        }
    });

    // Sotuvlar tarixini olish (Mijoz ismi bo'yicha)
    db.collection('sales').where('name', '==', customerName).orderBy('date', 'desc').get().then(function (snapshot) {
        if (snapshot.empty) {
            historyBody.innerHTML = '<tr><td colspan="4" style="text-align:center">Xaridlar mavjud emas</td></tr>';
        } else {
            var html = '';
            snapshot.forEach(function (doc) {
                var s = doc.data();
                var itemsStr = s.items ? s.items.map(function (it) {
                    var p = productsArr.find(function (px) { return px.id === it.productId; });
                    return (p ? p.name : 'Mahsulot') + ' (x' + it.quantity + ')';
                }).join(', ') : '';

                html += '<tr>' +
                    '<td>' + formatDate(s.date) + '</td>' +
                    '<td style="font-size:0.85rem">' + escapeHtml(itemsStr) + '</td>' +
                    '<td>' + formatMoney(s.totalAmount) + '</td>' +
                    '<td><span class="status-badge active">Sotilgan</span></td>' +
                    '</tr>';
            });
            historyBody.innerHTML = html;
        }
        openModal('customerHistoryModal');
    }).catch(function (err) {
        console.error("History error:", err);
        historyBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--danger)">Yuklashda xatolik yuz berdi</td></tr>';
    });
}

// Qidiruv
var customersSearchInput = document.getElementById('customersSearch');
if (customersSearchInput) {
    customersSearchInput.addEventListener('input', function (e) {
        renderCustomers(e.target.value);
    });
}

// Profile Tabs Handler
document.addEventListener('click', function (e) {
    var tabBtn = e.target.closest('.profile-tab-btn');
    if (tabBtn) {
        var tabId = tabBtn.dataset.tabId;

        // Update Buttons
        document.querySelectorAll('.profile-tab-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn === tabBtn);
        });

        // Update Content
        document.querySelectorAll('.tab-content').forEach(function (content) {
            content.classList.toggle('active', content.id === tabId);
        });
    }
});












// Mobile customer card click
document.addEventListener('click', function (e) {
    var card = e.target.closest('.customer-mobile-card');
    if (card) {
        var id = card.getAttribute('data-customer-id');
        // Trigger the edit logic for the customer with the given ID
        db.collection('customers').doc(id).get().then(function (doc) {
            if (doc.exists) {
                var c = doc.data();
                document.getElementById('customerId').value = doc.id;
                document.getElementById('customerName').value = c.name;
                document.getElementById('customerPhone').value = c.phone;
                document.getElementById('customerTelegram').value = c.telegram || '';
                document.getElementById('customerBirthday').value = c.birthday || '';
                document.getElementById('customerAddress').value = c.address || '';
                document.getElementById('customerNote').value = c.note || '';
                
                initSelectPicker('customerRegionPicker', allRegions);
                setSelectValue('customerRegionPicker', c.region, c.region || 'Tanlang...');
                
                document.getElementById('customerModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> Mijozni tahrirlash';
                openModal('customerModal');
            }
        });
    }
});

// Mobile finance card click
document.addEventListener('click', function (e) {
    var card = e.target.closest('.finance-mobile-card');
    if (card) {
        var id = card.getAttribute('data-id');
        editFinance(id);
    }
});

/* ===========================
   Product Details View & Gallery Logic
   =========================== */
var currentProductGalleryImages = [];
var currentImageIndex = 0;

function openProductDetailModal(p) {
    if (!p) return;
    
    // Set Images
    currentProductGalleryImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : [];
    if (currentProductGalleryImages.length === 0 && (p.image || p.imageUrl)) {
        currentProductGalleryImages = [p.image || p.imageUrl];
    }
    
    currentImageIndex = 0;
    updateProductGallery();
    
    // Set Text Details
    var contentEl = document.getElementById('productDetailsContent');
    if (contentEl) {
        var statusHtml = '<span class="status-badge ' + ((p.status || 'active') === 'active' ? 'active' : 'inactive') + '">' + 
                        ((p.status || 'active') === 'active' ? 'Active' : 'Nofaol') + '</span>';
        
        contentEl.innerHTML = 
            '<div style="display:flex; justify-content:space-between; align-items:start; margin-bottom: 20px;">' +
                '<div>' +
                    '<h3 style="font-size:1.4rem; margin-bottom:4px; color:var(--text)">' + escapeHtml(p.name) + '</h3>' +
                    '<p style="color:var(--text-muted); font-size:0.9rem; font-weight:500">' + escapeHtml(p.category || 'Boshqa') + '</p>' +
                '</div>' +
                statusHtml +
            '</div>' +
            
            '<div class="detail-info-grid">' +
                '<div class="detail-card">' +
                    '<span class="label">Sotish narxi</span>' +
                    '<span class="value">' + formatMoney(p.price) + '</span>' +
                '</div>' +
                '<div class="detail-card">' +
                    '<span class="label">Tannarxi</span>' +
                    '<span class="value">' + (p.cost ? formatMoney(p.cost) : '\u2014') + '</span>' +
                '</div>' +
            '</div>' +
            
            (p.description ? 
                '<div class="detail-description" style="margin-top:16px">' +
                    '<strong>Tavsif:</strong><br>' + escapeHtml(p.description).replace(/\n/g, '<br>') +
                '</div>' : '') +
            
            '<div style="font-size:0.75rem; color:var(--text-muted); margin-top:20px; border-top:1px solid var(--border); padding-top:10px">' +
                'ID: ' + p.id + (p.createdAt ? ' | Yaratilgan: ' + formatDate(p.createdAt) : '') +
            '</div>';
    }
    
    // Prepare Edit Button
    var editBtn = document.getElementById('productDetailEditBtn');
    if (editBtn) {
        editBtn.onclick = function() {
            closeModal('productDetailsModal');
            editProduct(p.id);
        };
    }
    
    openModal('productDetailsModal');
}

function updateProductGallery() {
    var viewport = document.getElementById('productGalleryViewport');
    var currentIdxEl = document.getElementById('currentImgIdx');
    var totalCountEl = document.getElementById('totalImgCount');
    var prevBtn = document.getElementById('prevProductImg');
    var nextBtn = document.getElementById('nextProductImg');
    
    if (!viewport || !currentIdxEl || !totalCountEl) return;
    
    var images = currentProductGalleryImages;
    totalCountEl.textContent = images.length || 0;
    
    if (images.length === 0) {
        viewport.innerHTML = '<div style="color:var(--text-muted); text-align:center"><i class="fas fa-image fa-3x" style="display:block; margin-bottom:10px; opacity:0.3"></i>Rasm mavjud emas</div>';
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        currentIdxEl.textContent = 0;
        return;
    }
    
    currentIdxEl.textContent = currentImageIndex + 1;
    viewport.innerHTML = '<img src="' + images[currentImageIndex] + '" alt="Product Image">';
    
    if (prevBtn) prevBtn.style.display = images.length > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = images.length > 1 ? 'flex' : 'none';
}

// Global Gallery Listeners
var prevBtn = document.getElementById('prevProductImg');
if (prevBtn) {
    prevBtn.addEventListener('click', function() {
        if (currentProductGalleryImages.length <= 1) return;
        currentImageIndex--;
        if (currentImageIndex < 0) currentImageIndex = currentProductGalleryImages.length - 1;
        updateProductGallery();
    });
}

var nextBtn = document.getElementById('nextProductImg');
if (nextBtn) {
    nextBtn.addEventListener('click', function() {
        if (currentProductGalleryImages.length <= 1) return;
        currentImageIndex++;
        if (currentImageIndex >= currentProductGalleryImages.length) currentImageIndex = 0;
        updateProductGallery();
    });
}

// Row Click Handler for Products (Delegation)
document.addEventListener('click', function(e) {
    var viewBtn = e.target.closest('.product-view-btn');
    if (viewBtn) {
        var pid = viewBtn.getAttribute('data-id');
        var p = productsArr.find(function(x) { return x.id === pid; });
        if (p) openProductDetailModal(p);
    }
});
