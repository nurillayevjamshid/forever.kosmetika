# For.Ever Cosmetics - Landing Page va Admin Panel

## 🌟 Loyiha haqida

**For.Ever Cosmetics** - bu Instagram online magaziningiz uchun professional landing page va admin panel. Xitoydan keltirilgan ayollar kosmetikalari, atirlar, uxodoviy kosmetikalar va soch vositalarini namoyish qilish uchun mo'ljallangan.

## ✨ Xususiyatlar

### Landing Page (index.html)
- ✅ Premium dizayn va zamonaviy interfeys
- ✅ Mahsulotlar katalogi
- ✅ Kategoriyalar bo'yicha filtrlash
- ✅ Qidiruv funksiyasi
- ✅ Savatcha (Shopping cart)
- ✅ Kontakt forma
- ✅ Mobil va desktop responsive dizayn
- ✅ Instagram integratsiyasi
- ✅ Smooth animatsiyalar

### Admin Panel (admin.html)
- ✅ Dashboard statistikasi
- ✅ Yangi mahsulot qo'shish
- ✅ Mahsulotlarni ko'rish va o'chirish
- ✅ Kategoriyalar bo'yicha filtrlash
- ✅ Qidiruv funksiyasi
- ✅ Rasm preview
- ✅ LocalStorage orqali ma'lumotlarni saqlash

## 📁 Fayllar

```
lp/
├── index.html          # Asosiy landing page
├── admin.html          # Admin panel
├── styles.css          # Asosiy CSS uslublar
├── admin-styles.css    # Admin panel CSS
├── script.js           # Landing page JavaScript
├── admin.js            # Admin panel JavaScript
└── README.md           # Bu fayl
```

## 🚀 Ishga tushirish

### 1. Landing Page ni ochish
- `index.html` faylini brauzerdaoching
- Yoki to'g'ridan-to'g'ri double-click qiling

### 2. Admin Panel ga kirish
- `admin.html` faylini brauzerdaoching
- Yoki landing page headeridagi "Bosh sahifa" tugmasidan keyin URL da `admin.html` kiriting

## 📝 Admin Panel dan foydalanish

### Yangi mahsulot qo'shish:

1. Admin panelni oching (`admin.html`)
2. Chap menudagi "Yangi mahsulot" ni bosing
3. Formani to'ldiring:
   - **Mahsulot nomi**: Masalan, "Luxury Face Cream"
   - **Kategoriya**: Kosmetika, Atirlar, Teri parvarishi yoki Soch vositalari
   - **Narxi**: So'mda, masalan 250000
   - **Badge**: Yangi, Top, Ommabop va boshqalar (ixtiyoriy)
   - **Ta'rif**: Mahsulot haqida qisqacha
   - **Rasm URL**: Unsplash.com dan rasm topib URL ni kiriting

4. "Mahsulotni saqlash" tugmasini bosing
5. Mahsulot avtomatik saqlanadi va landing page da ko'rinadi

### Rasm topish (Unsplash):

1. [Unsplash.com](https://unsplash.com) ga kiring
2. Kosmetika, atir yoki soch vositalari rasmlarini qidiring
3. Rasm ustiga right-click qiling
4. "Copy image address" ni tanlang
5. URL ni Admin paneldagi "Rasm URL" maydoniga joylashtiring

**Misol URL:**
```
https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80
```

### Mahsulotlarni boshqarish:

- **Ko'rish**: "Mahsulotlar" menyusiga o'ting
- **Qidirish**: Yuqoridagi qidiruv maydonidan foydalaning
- **Filtrlash**: Kategoriya tanlagichni ishlating
- **Tahrirlash**: Mahsulot qatoridagi ko'k "Tahrirlash" tugmasini bosing
  - Form avtomatik mahsulot ma'lumotlari bilan to'ldiriladi
  - Kerakli o'zgarishlarni kiriting
  - "Yangilash" tugmasini bosing
- **O'chirish**: Mahsulot qatoridagi qizil "O'chirish" tugmasini bosing

## 🎨 Kategoriyalar

Landing page da 4 ta kategoriya mavjud:

1. **Kosmetika** 💄 - Lab bo'yoqlari, tush soyalari, pudra va boshqalar
2. **Atirlar** 🌸 - Eksklyuziv va premium atirlar
3. **Teri parvarishi** ✨ - Kremlar, serumlar, maskalar
4. **Soch vositalari** 💆‍♀️ - Fen, dazmol, shampun va boshqalar

## 💾 Ma'lumotlarni saqlash

Barcha mahsulotlar va savat ma'lumotlari **localStorage** da saqlanadi:
- Brauzer yopilganda ham saqlanadi
- Faylni boshqa kompyuterga ko'chirsangiz, ma'lumotlar yo'qoladi
- Ma'lumotlarni tozalash: Brauzer Developer Tools > Application > Local Storage > Clear

## 🎯 Qo'shimcha sozlashlar

### Instagram havolasini o'zgartirish:

`index.html` faylida quyidagi qismlarni topib, o'z Instagram sahifangizni kiriting:

```html
<a href="https://instagram.com/sizning_sahifangiz" target="_blank">
```

### Telefon raqamini o'zgartirish:

`index.html` da:
```html
<a href="tel:+998901234567" class="contact-method">
```

### Ranglarni o'zgartirish:

`styles.css` faylining boshida `:root` qismida ranglarni moslashtiring:

```css
:root {
    --primary-color: #667eea;  /* Asosiy rang */
    --secondary-color: #764ba2; /* Ikkilamchi rang */
    --accent-color: #f5576c;    /* Urg'u rangi */
}
```

## 📱 Responsive Dizayn

Sayt barcha qurilmalarda ishlaydi:
- 📱 **Mobil telefonlar** (320px+)
- 📲 **Planshetlar** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Katta ekranlar** (1280px+)

## 🌐 Deploy qilish (Hosting)

Saytni internetga chiqarish uchun:

### 1. GitHub Pages (Bepul):
1. GitHub ga akkaunt oching
2. Yangi repository yarating
3. Barcha fayllarni yuklang
4. Settings > Pages > Source: main branch
5. Saytingiz tayyor!

### 2. Netlify (Bepul):
1. [Netlify.com](https://netlify.com) ga kiring
2. "New site from Git" ni bosing
3. GitHub repository ni tanlang
4. Deploy!

### 3. Vercel (Bepul):
1. [Vercel.com](https://vercel.com) ga kiring
2. Import project
3. GitHub repository ni connect qiling
4. Deploy tugmasini bosing

## 🎓 Yordam

Muammolarga duch kelsangiz:

1. **Mahsulotlar ko'rinmayapti**: Brauzer cache ni tozalang
2. **Rasm yuklanmayapti**: URL to'g'riligini tekshiring
3. **Admin panel ishlamayapti**: JavaScript yoqilganligini tekshiring
4. **Ma'lumotlar yo'qoldi**: localStorage tozalanganligini tekshiring

## 📞 Texnik yordam

Qo'shimcha savol va yordamlar uchun:
- Instagram: @forever.cosmetics
- Telegram: @forevercosmetics

## 📄 Litsenziya

Bu loyiha **For.Ever Cosmetics** uchun maxsus tayyorlangan.

---

**Muvaffaqiyatlar tilaymiz! 🚀**

© 2026 For.Ever Cosmetics. Barcha huquqlar himoyalangan.
