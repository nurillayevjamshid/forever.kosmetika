// ALOQA FORMASI UCHUN TELEGRAM INTEGRATSIYASI

async function handleContactFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const messageText = document.getElementById('message').value;

    // Get Telegram config
    const BOT_TOKEN = window.TELEGRAM_CONFIG?.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
    const CHAT_ID = window.TELEGRAM_CONFIG?.CHAT_ID || 'YOUR_CHAT_ID_HERE';

    // Check if config is properly set
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || CHAT_ID === 'YOUR_CHAT_ID_HERE') {
        alert('❌ Telegram bot sozlanmagan!');
        console.error('Telegram config not set');
        return;
    }

    // Create message
    let message = `📨 *YANGI XABAR (Aloqa Formasi)*\n\n`;
    message += `👤 *Ism:* ${name}\n`;
    message += `📞 *Telefon:* ${phone}\n`;
    message += `💬 *Xabar:*\n${messageText}\n\n`;
    message += `📅 Sana: ${new Date().toLocaleString('uz-UZ')}`;

    // Show loading notification
    showNotification('Xabar yuborilmoqda...');

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
        console.log('Telegram API javob (Contact Form):', data);

        if (data.ok) {
            // Success - reset form
            document.getElementById('contactForm').reset();
            showNotification(`✅ Rahmat, ${name}! Xabaringiz yuborildi. Tez orada siz bilan bog'lanamiz.`);
        } else {
            // Error from Telegram
            console.error('Telegram API error:', data);
            showNotification(`❌ Xatolik: ${data.description || 'Noma\'lum xato'}`);
        }
    } catch (error) {
        // Network or other error
        console.error('Error sending contact form:', error);
        showNotification('❌ Tarmoq xatosi. Iltimos, qaytadan urinib ko\'ring.');
    }
}

// Export function globally
window.handleContactFormSubmit = handleContactFormSubmit;
