async function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const comment = document.getElementById('orderComment').value;

    // Get Telegram config
    const BOT_TOKEN = window.TELEGRAM_CONFIG?.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
    const CHAT_ID = window.TELEGRAM_CONFIG?.CHAT_ID || 'YOUR_CHAT_ID_HERE';

    // Check if config is properly set
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || CHAT_ID === 'YOUR_CHAT_ID_HERE') {
        alert('Telegram bot sozlanmagan! telegram-config.js faylida BOT_TOKEN va CHAT_ID ni to\'ldiring.');
        console.error('Telegram config not set:', { BOT_TOKEN, CHAT_ID });
        return;
    }

    // HTML escape helper
    function esc(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // Create order message
    const orderNum = 'FOR-' + Date.now().toString(36).toUpperCase();
    const now = new Date();
    const dateStr = now.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

    let message = `<b>YANGI BUYURTMA</b>\n`;
    message += `<code>${esc(orderNum)}</code>\n\n`;
    message += `<b>Mijoz:</b> ${esc(name)}\n`;
    message += `<b>Telefon:</b> <code>${esc(phone)}</code>\n`;
    if (comment) {
        message += `<b>Izoh:</b> ${esc(comment)}\n`;
    }
    message += `\n<b>Mahsulotlar:</b>\n`;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `\n${index + 1}. ${esc(item.name)}\n`;
        message += `   ${item.quantity} x ${formatPrice(item.price)} = <b>${formatPrice(itemTotal)} so'm</b>\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    message += `\n<b>JAMI: ${formatPrice(total)} so'm</b>\n`;
    message += `Mahsulotlar soni: ${totalItems} ta\n`;
    message += `\n${dateStr} ${timeStr}`;

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
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        console.log('Telegram API javob:', data);

        if (data.ok) {
            // Save to Firebase
            if (typeof firebaseSaveOrder === 'function') {
                try {
                    await firebaseSaveOrder({
                        customerName: name,
                        customerPhone: phone,
                        customerAddress: '',
                        viloyat: '',
                        tuman: '',
                        items: cart.map(item => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity
                        })),
                        totalAmount: total,
                        comment: comment || ''
                    });
                    console.log('Buyurtma Firebase\'ga saqlandi');
                } catch (fbErr) {
                    console.error('Firebase saqlash xatosi:', fbErr);
                }
            }

            // Success - clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            // Close modal
            closeOrderModal();
            showNotification('Buyurtma muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
        } else {
            console.error('Telegram API error:', data);
            alert('Telegram xatosi: ' + (data.description || 'Noma\'lum xato'));
        }
    } catch (error) {
        console.error('Error sending order:', error);
        showNotification('Tarmoq xatosi. Iltimos, internetingizni tekshiring.');
    }
}

window.submitOrder = submitOrder;
