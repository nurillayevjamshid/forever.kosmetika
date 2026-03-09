// ⚠️ TELEGRAM BOT KONFIGURATSIYASI
// Bu faylni script.js dan oldin yuklang

// GURUH ID SINI OLISH UCHUN:
// 1. @foreverzayavkalar_bot ni https://t.me/+C5t-W7AZ5UtjMjZi guruhga qo'shing
// 2. Botni ADMIN qiling (Post Messages huquqi bilan)
// 3. Guruhga biror xabar yuboring (masalan: "test")
// 4. Brauzerda oching: https://api.telegram.org/bot8594066068:AAH8P08h-OHFGKjY8kj2n0Tn3RAy8KDVHhM/getUpdates
// 5. "chat":{"id": raqamni nusxa oling (masalan: -1001234567890)
// 6. Quyidagi CHAT_ID ga qo'ying

const TELEGRAM_CONFIG = {
    BOT_TOKEN: '8594066068:AAH8P08h-OHFGKjY8kj2n0Tn3RAy8KDVHhM',
    CHAT_ID: '-1003809511067'  // ✅ Guruh ID o'rnatildi
};

// Bu obyektni global qilamiz
window.TELEGRAM_CONFIG = TELEGRAM_CONFIG;
