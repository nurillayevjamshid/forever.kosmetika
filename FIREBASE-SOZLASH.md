# 🔥 Firebase Sozlash Qo'llanmasi

## For.Ever Cosmetics uchun Firebase bazasini sozlash

### 1-QADAM: Firebase loyiha yaratish

1. **Brauzerda oching:** https://console.firebase.google.com
2. **Google akkauntingiz** bilan kiring
3. **"Create a project"** (Loyiha yaratish) tugmasini bosing
4. Loyiha nomini kiriting: `forever-cosmetics`
5. Google Analytics - **o'chirsa ham bo'ladi** (ixtiyoriy)
6. **"Create project"** tugmasini bosing va kuting

---

### 2-QADAM: Web ilovasini qo'shish

1. Loyiha ochilgandan so'ng, **"<>"** (Web) ikonkasini bosing
2. Ilova nomini kiriting: `For.Ever Web`
3. **"Register app"** tugmasini bosing
4. Sizga **firebaseConfig** ko'rsatiladi — bu ma'lumotlarni ko'chiring!

**Namuna:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz",
    authDomain: "forever-cosmetics.firebaseapp.com",
    projectId: "forever-cosmetics",
    storageBucket: "forever-cosmetics.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

5. Bu ma'lumotlarni `firebase-config.js` fayliga yozing

---

### 3-QADAM: Firestore Database yaratish

1. Chap panelda **"Build" > "Firestore Database"** ni bosing
2. **"Create database"** tugmasini bosing
3. Location tanlang: **eur3 (Europe)** yoki **nam5 (US)**
4. **⚠️ MUHIM: "Start in test mode"** ni tanlang (keyinroq xavfsizlikni sozlaymiz)
5. **"Create"** ni bosing

---

### 4-QADAM: Firebase Storage sozlash

1. Chap panelda **"Build" > "Storage"** ni bosing
2. **"Get started"** tugmasini bosing
3. **"Start in test mode"** ni tanlang
4. **"Next"** va **"Done"** ni bosing

---

### 5-QADAM: firebase-config.js ni yangilash

`firebase-config.js` faylini oching va **SIZNING** Firebase ma'lumotlaringizni yozing:

```javascript
const firebaseConfig = {
    apiKey: "SIZNING_HAQIQIY_API_KEY",
    authDomain: "SIZNING_LOYIHA.firebaseapp.com",
    projectId: "SIZNING_LOYIHA_ID",
    storageBucket: "SIZNING_LOYIHA.firebasestorage.app",
    messagingSenderId: "SIZNING_SENDER_ID",
    appId: "SIZNING_APP_ID"
};
```

---

### 6-QADAM: Tekshirish ✅

1. `admin-simple.html` ni oching
2. Yuqori o'ng burchakda **"🔥 Firebase ulangan"** yashil badge ko'rinishi kerak
3. Agar **"⚠️ Firebase ulanmagan"** ko'rinsa — `firebase-config.js` dagi ma'lumotlarni tekshiring

---

### 7-QADAM: Mavjud mahsulotlarni ko'chirish

Agar oldin localStorage'da mahsulotlaringiz bo'lsa:
1. Admin panelda sariq **"Ko'chirish"** tugmasi ko'rinadi
2. Uni bosing va mahsulotlar avtomatik Firebase'ga ko'chiriladi!

---

## ⚠️ Xavfsizlik (Keyinroq sozlash kerak!)

Test rejimida Firebase hamma uchun ochiq. Production uchun quyidagi qoidalarni qo'shing:

### Firestore Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;           // Hamma o'qiy oladi
      allow write: if false;         // Hech kim yoza olmaydi (admin paneldan tashqari)
    }
    match /orders/{orderId} {
      allow read: if true;           // CRM dan o'qish
      allow create: if true;         // Websitedan buyurtma yaratish
      allow update, delete: if false; // Faqat admin/CRM dan boshqarish
    }
    match /customers/{customerId} {
      allow read: if true;           // CRM dan o'qish
      allow create, update: if true; // Websitedan mijoz yaratish/yangilash
      allow delete: if false;        // Faqat admin/CRM dan o'chirish
    }
  }
}
```

### Storage Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;           // Hamma rasmlarni ko'ra oladi
      allow write: if request.resource.size < 5 * 1024 * 1024;  // 5MB gacha yuklash
    }
  }
}
```

---

## 📁 Fayl tuzilmasi

```
lp/
├── firebase-config.js      ← Firebase sozlamalari (SIZ TO'LDIRASIZ)
├── firebase-db.js           ← Baza operatsiyalari (tayyor)
├── index.html               ← Bosh sahifa (Firebase bilan)
├── admin-simple.html        ← Admin panel (Firebase bilan)
├── script.js                ← Asosiy skript (Firebase bilan)
└── ...
```

## 🆘 Muammolar va yechimlari

| Muammo | Yechim |
|--------|--------|
| Firebase ulanmagan | `firebase-config.js` ma'lumotlarini tekshiring |
| Rasm yuklanmaydi | Storage rules'ni "test mode"ga qo'ying |
| Ma'lumotlar ko'rinmaydi | Firestore rules'ni "test mode"ga qo'ying |
| Console'da xatolik | Brauzer developer tools'da xatolikni ko'ring (F12) |
