/**
 * For.Ever Cosmetics — Wishlist Module
 * Professional wishlist tizimi: localStorage asosida, modular va robust.
 *
 * Foydalanish:
 *   <script src="wishlist-module.js"></script>
 *   Wishlist.toggle(productId)          — qo'shish/olib tashlash
 *   Wishlist.getAll()                   — barcha sevimli mahsulotlar
 *   Wishlist.count()                    — soni
 *   Wishlist.isIn(id)                   — bor-yo'qligi
 *   Wishlist.remove(id)                 — o'chirish
 *   Wishlist.renderGrid(containerId)    — wishlist.html da render
 *   Wishlist.updateBadges()             — barcha badge'lar yangilash
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'wishlistItems';

    // ─── Helpers ───────────────────────────────────────────────

    function _load() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function _save(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function _extractData(productObj) {
        if (!productObj) return null;
        const images = [];
        if (Array.isArray(productObj.imageUrls)) images.push(...productObj.imageUrls.filter(Boolean));
        if (productObj.imageUrl) images.push(productObj.imageUrl);
        if (productObj.image) images.push(productObj.image);

        return {
            id: String(productObj.id),
            name: productObj.name || 'Nomsiz mahsulot',
            price: Number(productObj.price) || 0,
            oldPrice: productObj.oldPrice ? Number(productObj.oldPrice) : null,
            discountPrice: productObj.discountPrice ? Number(productObj.discountPrice) : null,
            category: productObj.category || 'Kosmetika',
            brand: productObj.brand || '',
            image: images[0] || 'assets/logo.png',
            images: images.length ? images : ['assets/logo.png'],
            badge: productObj.badge || ''
        };
    }

    // Mahsulotni asosiy products massividan topib, to'liq ma'lumot olish
    function _resolveProduct(productId) {
        if (typeof products !== 'undefined' && Array.isArray(products)) {
            const p = products.find(pr => String(pr.id) === String(productId));
            if (p) return _extractData(p);
        }
        // Agar products topilmasa, faqat id bilan saqlaymiz
        return { id: String(productId), name: '', price: 0, oldPrice: null, discountPrice: null, category: '', brand: '', image: 'assets/logo.png', images: ['assets/logo.png'], badge: '' };
    }

    // ─── Core API ──────────────────────────────────────────────

    const Wishlist = {
        STORAGE_KEY,

        /** Mahsulotni toggle qilish (yo'q bo'lsa qo'shadi, bo'lsa o'chiradi) */
        toggle(productId) {
            const items = _load();
            const id = String(productId);
            const idx = items.findIndex(w => w.id === id);

            if (idx !== -1) {
                items.splice(idx, 1);
                this._sync();
                this._notify("Sevimlilardan olib tashlandi");
                return false; // o'chirildi
            }

            // Mahsulot ma'lumotlarini olish
            const data = _resolveProduct(id);
            if (items.some(w => w.id === id)) {
                // allaqachon bor (ehtiyot)
                this._sync();
                return true;
            }

            items.push(data);
            _save(items);
            this._sync();
            this._notify("Sevimlilarga qo'shildi 💕");
            return true; // qo'shildi
        },

        /** Faqat ma'lum bir product obyekti bilan qo'shish (product card uchun) */
        add(productObj) {
            const data = _extractData(productObj);
            if (!data) return;
            const items = _load();
            if (!items.some(w => w.id === data.id)) {
                items.push(data);
                _save(items);
            }
            this._sync();
            this._notify("Sevimlilarga qo'shildi 💕");
        },

        /** ID bo'yicha o'chirish */
        remove(productId) {
            const items = _load();
            const id = String(productId);
            const filtered = items.filter(w => w.id !== id);
            _save(filtered);
            this._sync();
            this._notify("Sevimlilardan olib tashlandi");
        },

        /** Barcha sevimlilarni olish */
        getAll() {
            return _load();
        },

        /** Sonini olish */
        count() {
            return _load().length;
        },

        /** Mahsulot sevimlilarda bormi */
        isIn(productId) {
            return _load().some(w => w.id === String(productId));
        },

        /** ID lar ro'yxatini olish (eski kod bilan moslash uchun) */
        getIds() {
            return _load().map(w => w.id);
        },

        /** Tozalash */
        clear() {
            _save([]);
            this._sync();
        },

        // ─── UI Sync ─────────────────────────────────────────

        /** Barcha heart tugmalari va badge'larni yangilash */
        _sync() {
            this._syncHeartButtons();
            this._syncBadges();
        },

        /** Product card dagi heart tugmalarini yangilash */
        _syncHeartButtons() {
            const ids = this.getIds();
            document.querySelectorAll('.favorite-btn').forEach(btn => {
                const pid = btn.id.replace('wishlist-btn-', '');
                const active = ids.includes(pid);
                btn.classList.toggle('active', active);
                const svg = btn.querySelector('svg');
                if (svg) svg.setAttribute('fill', active ? 'currentColor' : 'none');
            });
        },

        /** Badge'larni yangilash (header, navbar) */
        _syncBadges() {
            const count = this.count();
            document.querySelectorAll('.wishlist-count, .heart-count, #wishlistCount').forEach(el => {
                el.textContent = count;
                el.style.display = count > 0 ? 'flex' : 'none';
            });
        },

        /** Eski localStorage key'dan migration */
        migrate() {
            const old = localStorage.getItem('wishlist');
            if (old && !localStorage.getItem(STORAGE_KEY)) {
                try {
                    const ids = JSON.parse(old) || [];
                    if (Array.isArray(ids) && ids.length) {
                        const items = ids.map(id => _resolveProduct(id));
                        _save(items);
                        console.log('✅ Wishlist migrated from old key');
                    }
                } catch {}
            }
        },

        // ─── Notification ─────────────────────────────────────

        _notify(msg) {
            if (typeof showNotification === 'function') {
                showNotification(msg);
            }
        },

        // ─── Render (wishlist.html uchun) ─────────────────────

        renderGrid(gridId, emptyId, statsId) {
            const grid = document.getElementById(gridId || 'wishlistGrid');
            const emptyEl = document.getElementById(emptyId || 'emptyWishlist');
            const statsEl = document.getElementById(statsId || 'wishlistStats');
            if (!grid) return;

            const items = this.getAll();

            // Empty / filled state
            if (!items.length) {
                grid.style.display = 'none';
                if (emptyEl) emptyEl.style.display = 'block';
                if (statsEl) statsEl.style.display = 'none';
                const countText = document.getElementById('wishlistCountText');
                if (countText) countText.textContent = "Hozircha hech narsa yo'q";
                return;
            }

            if (emptyEl) emptyEl.style.display = 'none';
            grid.style.display = 'grid';
            if (statsEl) statsEl.style.display = 'flex';

            // Stats
            const totalItemsEl = document.getElementById('totalItems');
            const totalPriceEl = document.getElementById('totalPrice');
            const countText = document.getElementById('wishlistCountText');
            let totalPrice = 0;

            grid.innerHTML = '';
            items.forEach((item, i) => {
                totalPrice += item.price || 0;
                const card = _createCard(item, i);
                grid.appendChild(card);
            });

            if (totalItemsEl) totalItemsEl.textContent = items.length;
            if (totalPriceEl) totalPriceEl.textContent = _formatPrice(totalPrice) + " so'm";
            if (countText) countText.textContent = `${items.length} ta mahsulot saqlangan`;

            this._syncBadges();
        }
    };

    // ─── Card Builder ──────────────────────────────────────────

    function _formatPrice(price) {
        if (typeof formatPrice === 'function') return formatPrice(price);
        return new Intl.NumberFormat('uz-UZ').format(price || 0);
    }

    function _createCard(item, index) {
        const card = document.createElement('div');
        card.className = 'wishlist-card';
        card.style.animationDelay = (index * 0.08) + 's';

        const image = item.image || 'assets/logo.png';
        const priceStr = _formatPrice(item.price);
        const hasDiscount = item.oldPrice && item.oldPrice > item.price;
        const oldPriceStr = hasDiscount ? _formatPrice(item.oldPrice) : '';

        card.innerHTML = `
            <button class="remove-wishlist" data-remove-id="${item.id}" title="O'chirish">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="wishlist-img-wrapper">
                <img src="${image}" alt="${item.name}" onerror="this.src='assets/logo.png'">
            </div>
            <div class="wishlist-info">
                <div class="wishlist-category">${item.category || 'Kosmetika'}</div>
                <h3 class="wishlist-name">${item.name}</h3>
                <div class="wishlist-price">
                    ${priceStr}<span>so'm</span>
                    ${hasDiscount ? `<div class="wishlist-old-price" style="font-size:0.75rem;color:#999;text-decoration:line-through;font-weight:400;margin-top:2px;">${oldPriceStr} so'm</div>` : ''}
                </div>
                <button class="btn-add-cart" data-cart-id="${item.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Savatga qo'shish
                </button>
            </div>
        `;

        // Remove button handler
        card.querySelector('[data-remove-id]').addEventListener('click', function (e) {
            e.stopPropagation();
            card.classList.add('removing');
            setTimeout(() => {
                Wishlist.remove(item.id);
                Wishlist.renderGrid();
            }, 400);
        });

        // Add to cart handler
        card.querySelector('[data-cart-id]').addEventListener('click', function (e) {
            e.stopPropagation();
            if (typeof addToCart === 'function') {
                addToCart(item.id);
                this.classList.add('added');
                this.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Qo'shildi!`;
            }
        });

        return card;
    }

    // ─── Init ──────────────────────────────────────────────────

    // Eski ma'lumotni migratsiya qilish
    Wishlist.migrate();

    // Globalga chiqarish
    window.Wishlist = Wishlist;

    // Eski toggleWishlist funksiyasi uchun moslashuv (backward compat)
    if (typeof window.toggleWishlist !== 'function') {
        window.toggleWishlist = function (event, productId) {
            if (event) { event.stopPropagation(); event.preventDefault(); }
            const added = Wishlist.toggle(productId);

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

            // renderWishlist() chaqirish (wishlist.html da)
            if (typeof renderWishlist === 'function') renderWishlist();
        };
    }

    // updateWishlistUI override — modulga yo'naltirish
    window.updateWishlistUI = function () {
        Wishlist._sync();
    };

})();
