# For.Ever Cosmetics - Landing Page, Admin Panel va CRM Tizimi

## 🌟 Loyiha haqida

**For.Ever Cosmetics** - bu onlayn kosmetika do'koni uchun yaratilgan mukammal ekotizim. Loyiha o'z ichiga mijozlar uchun jozibador landing page, mahsulotlarni boshqarish uchun qulay admin panel va sotuvlar hamda moliya hisobini yuritish uchun professional CRM tizimini oladi.

## ✨ Xususiyatlar

### 🛍️ Landing Page (index.html)
- ✅ Premium va zamonaviy dizayn (Outfit & Playfair Display fontlari)
- ✅ Mahsulotlar katalogi va real-vaqtda qidiruv funksiyasi
- ✅ Kategoriyalar bo'yicha filtrlash (Kosmetika, Atirlar, Teri parvarishi va b.)
- ✅ Sevimlilar ro'yxati (Wishlist)
- ✅ Savatcha (Shopping cart) va aqlli buyurtma berish tizimi
- ✅ Viloyatlar va tumanlar bo'yicha yetkazib berish hisoblagichi
- ✅ Telegram bot orqali yangi buyurtmalar haqida bildirishnoma
- ✅ Mobil qurilmalar uchun optimallashtirilgan UX (mobile-ux.js)

### ⚙️ Admin Panel (admin-simple.html)
- ✅ Firebase Firestore bilan to'liq integratsiya
- ✅ Mahsulotlarni qo'shish, tahrirlash va o'chirish
- ✅ Rasmlarni Firebase Storage'ga yuklash (Base64 va fayl ko'rinishida)
- ✅ LocalStorage'dan Firebase'ga ma'lumotlarni ko'chirish (Migration)
- ✅ Badge'lar boshqaruvi (Yangi, Top, Premium va b.)

### 📊 CRM Tizimi (crm/index.html)
- ✅ Sotuvlar va buyurtmalar nazorati
- ✅ Mijozlar bazasi va ularning xaridlar tarixi
- ✅ Moliya bo'limi: Kirim va Chiqimlar hisobi, Sof foyda hisoblagichi
- ✅ Xodimlar boshqaruvi va huquqlarni cheklash (RBAC)
- ✅ Dashboard statistikasi: Viloyatlar bo'yicha sotuvlar va top mahsulotlar
- ✅ Tungi va kunduzgi rejim (Dark/Light mode)

## 📁 Fayl tuzilmasi

```
./
├── index.html          # Asosiy landing page
├── cart.html           # Savatcha va buyurtma sahifasi
├── profile.html        # Foydalanuvchi profili
├── admin-simple.html   # Firebase integratsiyalashgan admin panel
├── script.js           # Landing page asosiy mantiqi
├── styles.css          # Asosiy CSS uslublar
├── firebase-config.js  # Firebase ulanish sozlamalari
├── firebase-db.js      # Baza bilan ishlash funksiyalari
├── telegram-config.js  # Telegram bot sozlamalari
├── crm/                # CRM tizimi papkasi
│   ├── index.html      # CRM asosiy sahifasi
│   ├── app.js          # CRM JavaScript mantiqi
│   └── style.css       # CRM dizayni
└── docs/               # Qo'llanmalar (Markdown fayllar)
```

## 🚀 Ishga tushirish va Sozlash

### 1. Firebase ulanishi
Loyihaning ma'lumotlar bazasi Firebase'da ishlaydi. Sozlash uchun:
- `firebase-config.js` faylini oching va o'z API kalitlaringizni kiriting.
- Batafsil ma'lumot: [FIREBASE-SOZLASH.md](FIREBASE-SOZLASH.md)

### 2. Telegram Bildirishnomalari
Buyurtmalar Telegram guruhingizga kelishi uchun:
- `telegram-config.js` faylida `BOT_TOKEN` va `CHAT_ID` ni sozlang.
- Batafsil ma'lumot: [TELEGRAM_SOZLASH.md](TELEGRAM_SOZLASH.md)

### 3. Rasmlar bilan ishlash
Mahsulot rasmlarini kompyuterdan yoki URL orqali yuklash mumkin.
- Batafsil ma'lumot: [RASM-YUKLASH.md](RASM-YUKLASH.md)

## 💾 Ma'lumotlarni saqlash
- Barcha mahsulotlar, buyurtmalar va mijozlar ma'lumotlari **Firebase Firestore** bazasida xavfsiz saqlanadi.
- Rasmlar **Firebase Storage**'da saqlanadi.
- LocalStorage faqat vaqtinchalik ma'lumotlar (savatcha, sessiya) uchun ishlatiladi.

## 📱 Mobil UX Strategiyasi
Loyiha mobil foydalanuvchilar uchun maxsus optimallashtirilgan:
- Pastki qismdagi qulay navigatsiya paneli.
- Sticky "Sotib olish" tugmasi.
- Bir qo'l bilan ishlatish uchun qulay interfeys.
- Batafsil: [MOBILE_UX_STRATEGY.md](MOBILE_UX_STRATEGY.md)

## 📞 Texnik yordam
Muammolarga duch kelsangiz yoki savollaringiz bo'lsa:
- Telegram: [@forevercosmetic_admin](https://t.me/forevercosmetic_admin)
- Instagram: [@forever.kosmetika](https://www.instagram.com/forever.kosmetika/)

---
© 2026 For.Ever Cosmetics. Barcha huquqlar himoyalangan.
