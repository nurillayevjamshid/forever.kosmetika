# 📱 TELEGRAM BOT SOZLASH KO'RSATMASI

## 🤖 Bot yaratish

### 1-qadam: BotFather bilan bot yaratish

1. Telegram'da **@BotFather** ni toping va oching
2. `/start` buyrug'ini yuboring
3. `/newbot` buyrug'ini yuboring
4. Bot uchun **nom** kiriting (masalan: `For.Ever Orders Bot`)
5. Bot uchun **username** kiriting (masalan: `ForEverOrdersBot`)
   - Username albatta `bot` bilan tugashi kerak
   - Masalan: `forevercosmetics_bot`

### 2-qadam: Bot Token olish

Botni yaratganingizdan keyin BotFather sizga **Bot Token** beradi. 

Masalan:
```
123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

⚠️ **MUHIM**: Bu tokenni hech kimga bermang!

---

## 👥 Guruh yaratish va Bot qo'shish

### 3-qadam: Buyurtmalar uchun guruh yaratish

1. Telegram'da yangi **guruh** yarating
2. Guruh nomini kiriting (masalan: `For.Ever Buyurtmalar`)
3. Guruh yaratilgandan keyin:
   - Guruh sozlamalariga (`⋮` → `Edit`) kiring
   - `Add Members` ga bosing
   - Yaratgan botingizni qo'shing (masalan: `@ForEverOrdersBot`)

### 4-qadam: Botni admin qiling

1. Guruh sozlamalariga kiring
2. `Administrators` ni tanlang
3. `Add Admin` bosing
4. Botingizni tanlang
5. **"Post Messages"** ruxsatini yoqing
6. `Save` bosing

---

## 🆔 Guruh ID sini olish

### 5-qadam: Guruh ID sini topish

1. Guruhga biror **xabar yuboring** (masalan: `test`)

2. Brauzerda quyidagi URL ni oching:
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
   
   `<BOT_TOKEN>` o'rniga o'zingizning Bot Token ni qo'ying
   
   Masalan:
   ```
   https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/getUpdates
   ```

3. Natijada JSON ko'rinadi. Quyidagiga o'xshash qismni toping:
   ```json
   "chat": {
       "id": -1001234567890,
       "title": "For.Ever Buyurtmalar",
       "type": "supergroup"
   }
   ```

4. **chat ID** ni nusxa oling (masalan: `-1001234567890`)
   - ⚠️ ID manfiy son bilan boshlanadi!

---

## ⚙️ Kodni sozlash

### 6-qadam: telegram-config.js faylini yangilash

1. `telegram-config.js` faylini oching

2. Quyidagi qatorlarni to'ldiring:
   ```javascript
   const TELEGRAM_CONFIG = {
       BOT_TOKEN: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',  // ← O'z tokeningizni kiriting
       CHAT_ID: '-1001234567890'                          // ← O'z guruh ID ngizni kiriting
   };
   ```

3. Faylni saqlang

---

## ✅ Test qilish

### 7-qadam: Ishlatib ko'rish

1. `index.html` ni brauzerda oching
2. Biror mahsulotni savatchaga qo'shing
3. Savatcha tugmasini bosing
4. "Buyurtma berish" ni bosing
5. Formani to'ldiring:
   - Ism
   - Telefon
   - Izoh (ixtiyoriy)
6. "Buyurtma qoldirish" ni bosing

Agar hammasi to'g'ri sozlangan bo'lsa:
- ✅ Telegram guruhiga xabar keladi
- ✅ Xabarda buyurtma tafsilotlari bo'ladi
- ✅ Saytda muvaffaqiyat xabari chiqadi

---

## 🐛 Muammolarni hal qilish

### Xabar kelmayapti?

1. **Bot Token to'g'rimi?**
   - `telegram-config.js` ni tekshiring
   - Token to'liq nusxa olinganiga ishonch hosil qiling

2. **Chat ID to'g'rimi?**
   - ID manfiy son bilan boshlanishi kerak
   - ID to'liq nusxa olinganiga ishonch hosil qiling

3. **Bot admin qilinganmi?**
   - Guruh sozlamalarini tekshiring
   - Bot adminlik huquqlariga ega ekanligini tasdiqlang

4. **Brauzer console ni tekshiring:**
   - F12 bosing
   - Console tabiga o'ting
   - Qizil xatolik bormi ko'ring

### Test buyurtma yuboring

Quyidagi URL orqali test xabar yuboring:
```
https://api.telegram.org/bot<BOT_TOKEN>/sendMessage?chat_id=<CHAT_ID>&text=Test
```

Agar test xabar kelsa - kod to'g'ri, lekin saytda muammo bor.
Agar test xabar kelmasa - Bot yoki Guruh sozlamalarida xatolik bor.

---

## 📞 Yordam

Agar muammo hal bo'lmasa:
1. Bot tokenini qaytadan yarating (BotFather `/mybots` → botingiz → `API Token` → `Revoke`)
2. Yangi guruh yarating va qaytadan sinab ko'ring
3. Brauzer konsolidan xatolik xabarini nusxa oling

---

**Omad tilaymiz! 🚀**
