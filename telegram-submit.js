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
        alert('❌ Telegram bot sozlanmagan! telegram-config.js faylida BOT_TOKEN va CHAT_ID ni to\'ldiring.');
        console.error('Telegram config not set:', { BOT_TOKEN, CHAT_ID });
        return;
    }

    console.log('Bot Token mavjud:', BOT_TOKEN ? 'Ha' : 'Yo\'q');
    console.log('Chat ID mavjud:', CHAT_ID ? 'Ha' : 'Yo\'q');

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
        // Send message to Telegram group via Bot API
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
        console.log('Telegram API javob:', data);

        if (data.ok) {
            // Success - clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            // Close modal
            closeOrderModal();
            showNotification('✅ Buyurtma muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
        } else {
            // Error from Telegram
            console.error('Telegram API error:', data);
            alert(`❌ Telegram xatosi: ${data.description || 'Noma\'lum xato'}`);
        }
    } catch (error) {
        // Network or other error
        console.error('Error sending order:', error);
        showNotification('❌ Tarmoq xatosi. Iltimos, internetingizni tekshiring.');
    }
}

window.submitOrder = submitOrder;
