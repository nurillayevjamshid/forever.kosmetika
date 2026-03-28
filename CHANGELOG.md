# Changelog

Barcha muhim o'zgarishlar bu faylda qayd etiladi.

Format: [Keep a Changelog](https://keepachangelog.com/) asosida.
Version: [Semantic Versioning](https://semver.org/) — MAJOR.MINOR.PATCH.

## [Unreleased]

### Added
- **Search dropdown (avtomatik takliflar)**: Qidiruv maydoniga 2+ harf yozganda pastga mahsulotlar dropdown chiqadi — rasm, nom, kategoriya va narx bilan. Mahsulotni bosganda index.html da o'sha mahsulotga scroll qilinadi (highlight bilan). Boshqa sahifalardan bosganda index.html ga o'tadi.
- **Hash-based product navigation**: `index.html#product-card-{id}` URL orqali to'g'ridan-to'g'ri mahsulotga o'tish mumkin (search dropdown dan click qilganda).

### Fixed
- **Search funksiyasi butun saytda ishlashi ta'minlandi**: `script.js` dagi search handler yangilandi — index.html da darhol filtrlash, boshqa sahifalarda Enter/bosish orqali `index.html?search=...` ga yo'naltirish. `index.html` URL parametrdan qidiruv so'zini o'qib avtomatik filtrlaydi.
- **profile.html search qo'shildi**: profile.html `script.js` yuklamasligi sababli inline search handler qo'shildi.

### Changed
- **Navbar yangilandi**: "Do'kon" → "Mahsulotlar" qilib o'zgartirildi; "Chegirma" va "Maslahat" nav linklari olib tashlandi.
- **Search input qo'shildi**: Barcha sahifalarda qidiruv ikonkasining chapiga qidiruv input maydoni qo'shildi — fokuslanganda kengayadigan, estetik pill-shape dizayn.
- **Heart (Sevimlilar) ikonkasi qo'shildi**: Search va Profil o'rtasiga wishlist/heart ikonkasi qo'shildi.
- **wishlist.html merge conflictlar bartaraf etildi**: Git merge conflict markerlari (`<<<<<<<`, `=======`, `>>>>>>>`) tozalandi, so'nggi versiya asosida qayta yozildi.

### Changed
- **Barcha sahifalardagi navbar o'zbekchaga o'tkazildi**: `index.html`, `cart.html`, `profile.html`, `wishlist.html` dagi barcha navigatsiya linklari o'zbek tiliga tarjima qilindi — "Home" → "Bosh sahifa", "Shop" → "Mahsulotlar", "About" → "Biz haqimizda", "Contact" → "Bog'lanish".
- **Barcha navbarlar standartlashtirildi**: `profile.html` va `wishlist.html` dagi navbar `index.html` va `cart.html` dagi bilan bir xil tuzilishga keltirildi — logo matn (For.Ever), to'liq navigatsiya menyusi, header action tugmalari (qidiruv, profil, savat, mobil menyu).

### Fixed
- **Custom select (viloyat/tuman) bug fix**: Viloyat tanlagandan so'ng tuman tanlash ishlamayotgan muammo bartaraf etildi. Tumanni bir marta tanlagandan so'ng qayta o'zgartirib bo'lmayotgan muammo ham tuzatildi.
- Inline `onchange` handlerlar (`handleViloyatChange(true)`, `updateOrderDeliveryTextFromInputs()`) olib tashlandi — endi `initRegionSelectListeners()` orqali JavaScript event listenerlar bilan ishlaydi.
- `initCustomSelects()` har chaqirilganda yangi document click listener qo'shishi (memory leak) to'xtatildi — endi faqat bir marta o'rnatiladi (`_customSelectDocHandlersAttached` flag orqali).
- Custom select trigger va option clicklari uchun event delegation joriy etildi — DOM qayta yaratilganda ham ishonchli ishlaydi.
- `handleViloyatChange()` funksiyasiga null-check qo'shildi va `syncCustomSelectState()` trigger `disabled` holatini to'g'ri sinxronlaydi.

### Added
- CHANGELOG.md fayli yaratildi — loyiha o'zgarishlarini kuzatish uchun.

### Changed
- cart.html navbari index.html'dagi bilan bir xil qilindi: logo matn (For.Ever), to'liq navigatsiya menyusi, header action tugmalari (qidiruv, profil, savat, mobil menyu). Shriftlar ham moslashtirildi (Cormorant Garamond + Poppins).

### Enhanced
- Cart page miqdor boshqaruvchisi (- 1 +) premium dizaynga o'tkazildi: gradient fon, yumaloq tugmalar, hover effekt.
- "Buyurtma berish" tugmasi yangilandi: shimmer effekt, kuchliroq soyalar, scale animatsiya.
- "Xaridni davom ettirish" havolasi elegant outline tugma sifatida qayta ishlab chiqildi: hover'da rang o'zgarishi, strelka animatsiyasi.
- Buyurtma berish (step 2) sahifasi premium dizaynga o'tkazildi: section kartalar radius, soyalar, border yangilandi; form inputlar focus'da glow effekt; phone input va custom select premium ko'rinish; "Savatga qaytish" tugmasi elegant pill ko'rinish; prepayment notice kartasi gradient fon bilan.
- Order form label overlap tuzatildi — .field-label endi absolute emas, yuqorida aniq ko'rinadi.
- Checkout page container va padding optimizatsiya qilindi.
- Item qty badge gradient fon bilan yanada premium ko'rinishga keltirildi.
- Custom select dropdown premium qayta ishlab chiqildi: har bir viloyat va tuman oldidan location icon, ochilganda smooth animatsiya, selected holatda gradient fon, hover'da siljish effekt, custom scrollbar, trigger'da caret animatsiyasi.
- Native `<select>` elementlari yashirildi — faqat custom style trigger ko'rinadi.

---

## Versiya tarixi

> Bu loyihaga birinchi marta CHANGELOG o'rnatilmoqda. Oldingi o'zgarishlar qayd etilmagan.
