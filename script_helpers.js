
function getProductFooterHTML(product) {
    const cartItem = cart.find(item => item.id.toString() === product.id.toString());

    // Asosiy narx
    let html = `<div class="product-price">${formatPrice(product.price)} so'm</div>`;

    if (cartItem) {
        // 2-holat: Savatda bor (count controls)
        html += `
            <div class="qty-control-wrapper">
                <div class="qty-counter">
                    <button class="qty-btn" onclick="changeQuantity('${product.id}', -1)">-</button>
                    <span class="qty-display">${cartItem.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${product.id}', 1)">+</button>
                </div>
                <button class="btn-go-cart" onclick="openCartModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    O'tish
                </button>
            </div>
        `;
    } else {
        // 1-holat: Savatda yo'q (Add button only)
        html += `
            <button class="btn-add-main" onclick="addToCart('${product.id}')">
                Savatga qo'shish
                <span>Ertaga yetkazib beramiz</span>
            </button>
        `;
    }
    return html;
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
