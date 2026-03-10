// profile.js

document.addEventListener('DOMContentLoaded', async function () {
    const profileForm = document.getElementById('profileForm');
    const nameInput = document.getElementById('profileName');
    const phoneInput = document.getElementById('profilePhone');
    const viloyatSelect = document.getElementById('profileViloyat');
    const tumanSelect = document.getElementById('profileTuman');
    const instagramInput = document.getElementById('profileInstagram');
    const telegramInput = document.getElementById('profileTelegram');
    const saveBtn = document.getElementById('saveProfileBtn');
    const avatarInput = document.getElementById('avatarInput');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileNameDisplay = document.getElementById('profileNameDisplay');

    let currentProfile = JSON.parse(localStorage.getItem('userProfile')) || {};

    const tumanlarData = {
        "Toshkent shahri": ["Olmazor tumani", "Bektemir tumani", "Mirobod tumani", "Mirzo Ulug'bek tumani", "Sergeli tumani", "Uchtepa tumani", "Chilonzor tumani", "Shayxontohur tumani", "Yunusobod tumani", "Yakkasaroy tumani", "Yashnobod tumani", "Yangihayot tumani"],
        "Toshkent viloyati": ["Angren shahri", "Olmaliq shahri", "Nurafshon shahri", "Ohangaron tumani", "Bekobod tumani", "Bo'stonliq tumani", "Bo'ka tumani", "Chinoz tumani", "Qibray tumani", "Parkent tumani", "Piskent tumani", "Quyi Chirchiq tumani", "O'rta Chirchiq tumani", "Yuqori Chirchiq tumani", "Zangiota tumani", "Yangiyo'l tumani", "Toshkent tumani"],
        "Andijon": ["Andijon shahri", "Andijon tumani", "Asaka tumani", "Baliqchi tumani", "Bo'ston tumani", "Buloqboshi tumani", "Izboskan tumani", "Jalaquduq tumani", "Marhamat tumani", "Oltinko'l tumani", "Paxtaobod tumani", "Qo'rg'ontepa tumani", "Shahrixon tumani", "Ulug'nor tumani", "Xo'jaobod tumani"],
        "Buxoro": ["Buxoro shahri", "Buxoro tumani", "G'ijduvon tumani", "Jondor tumani", "Kogon tumani", "Olot tumani", "Peshku tumani", "Qorako'l tumani", "Qorovulbozor tumani", "Romitan tumani", "Shofirkon tumani", "Vobkent tumani"],
        "Farg'ona": ["Farg'ona shahri", "Marg'ilon shahri", "Qo'qon shahri", "Quva tumani", "Beshariq tumani", "Bag'dod tumani", "Buvayda tumani", "Dang'ara tumani", "Furqat tumani", "Oltiariq tumani", "Rishton tumani", "So'x tumani", "Toshloq tumani", "Uchko'prik tumani", "O'zbekiston tumani", "Yozyovon tumani"],
        "Jizzax": ["Jizzax shahri", "Arnasoy tumani", "Baxmal tumani", "Do'stlik tumani", "Forish tumani", "G'allaorol tumani", "Sharof Rashidov tumani", "Mirzachul tumani", "Paxtakor tumani", "Yangiobod tumani", "Zafarobod tumani", "Zamin tumani", "Zarbdor tumani"],
        "Xorazm": ["Urganch shahri", "Urganch tumani", "Bog'ot tumani", "Gurlan tumani", "Xonqa tumani", "Xazoraap tumani", "Xiva tumani", "Qo'shko'pir tumani", "Shovot tumani", "Yangiariq tumani", "Yangibozor tumani", "Tuproqqal'a tumani"],
        "Namangan": ["Namangan shahri", "Namangan tumani", "Chortoq tumani", "Chust tumani", "Kosonsoy tumani", "Mingbuloq tumani", "Norin tumani", "Pop tumani", "To'raqo'rg'on tumani", "Uychi tumani", "Uychi tumani", "Yangiqo'rg'on tumani"],
        "Navoiy": ["Navoiy shahri", "Zarafshon shahri", "Konimex tumani", "Karmana tumani", "Qiziltepa tumani", "Navbahor tumani", "Nurota tumani", "Tomdi tumani", "Uchkuduk tumani", "Xatirchi tumani"],
        "Qashqadaryo": ["Qarshi shahri", "Qarshi tumani", "Dehqonobod tumani", "G'uzor tumani", "Kasbi tumani", "Kitob tumani", "Koson tumani", "Mirishkor tumani", "Muborak tumani", "Nishon tumani", "Shahrisabz shahri", "Shahrisabz tumani", "Chiroqchi tumani", "Yakkabog' tumani", "Qamashi tumani"],
        "Qoraqalpog'iston": ["Nukus shahri", "Amudaryo tumani", "Beruniy tumani", "Chimboy tumani", "Ellikqala tumani", "Kegeyli tumani", "Mo'ynoq tumani", "Nukus tumani", "Qonliko'l tumani", "Qo'ng'irot tumani", "Qorao'zak tumani", "Shumanay tumani", "Taxtako'pir tumani", "To'rtko'l tumani", "Xo'jayli tumani", "Taxiatosh shahri"],
        "Samarqand": ["Samarqand shahri", "Samarqand tumani", "Bulung'ur tumani", "Ishtixon tumani", "Jomboy tumani", "Kattaqo'rg'on shahri", "Kattaqo'rg'on tumani", "Narpay tumani", "Nurobod tumani", "Oqdaryo tumani", "Paxtachi tumani", "Payariq tumani", "Pastdarg'om tumani", "Toyloq tumani", "Urgut tumani", "Qo'shrabot tumani"],
        "Sirdaryo": ["Guliston shahri", "Guliston tumani", "Boyovut tumani", "Oqoltin tumani", "Sardoba tumani", "Sayxunobod tumani", "Sirdaryo tumani", "Xovos tumani", "Mirzaobod tumani", "Shirin shahri", "Yangiyer shahri"],
        "Surxondaryo": ["Termiz shahri", "Termiz tumani", "Angor tumani", "Boysun tumani", "Denov tumani", "Jarqo'rg'on tumani", "Muzrabot tumani", "Oltinsoy tumani", "Qiziriq tumani", "Qumqo'rg'on tumani", "Sariosiyo tumani", "Sherobod tumani", "Sho'rchi tumani", "Uzun tumani"]
    };

    // Viloyatlarni to'ldirish
    for (const viloyat in tumanlarData) {
        const option = document.createElement('option');
        option.value = viloyat;
        option.textContent = viloyat;
        viloyatSelect.appendChild(option);
    }

    // Tumanlarni yangilash funksiyasi
    function updateTumanlar(viloyat) {
        tumanSelect.innerHTML = '<option value="">Tuman</option>'; // Reset
        if (viloyat && tumanlarData[viloyat]) {
            tumanlarData[viloyat].forEach(tuman => {
                const option = document.createElement('option');
                option.value = tuman;
                option.textContent = tuman;
                tumanSelect.appendChild(option);
            });
        }
    }

    // Viloyat o'zgarganda tumanni yangilash
    viloyatSelect.addEventListener('change', (e) => {
        updateTumanlar(e.target.value);
    });

    // Profil malumotlarini formaga joylashtirish
    function populateForm(profile) {
        if (profile.name) {
            nameInput.value = profile.name;
            profileNameDisplay.textContent = profile.name;
        }
        if (profile.phone) phoneInput.value = profile.phone;
        if (profile.viloyat) {
            viloyatSelect.value = profile.viloyat;
            updateTumanlar(profile.viloyat);
        }
        if (profile.tuman) setTimeout(() => { tumanSelect.value = profile.tuman; }, 50);
        if (profile.instagram) instagramInput.value = profile.instagram;
        if (profile.telegram) telegramInput.value = profile.telegram;
        if (profile.avatar) profileAvatar.src = profile.avatar;
    }

    // Dastlabki ma'lumotlarni o'rnatish
    populateForm(currentProfile);

    // Rasmni o'zgartirish
    avatarInput.addEventListener('change', async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // Vaqtincha rasmni ko'rsatish
        const reader = new FileReader();
        reader.onload = (e) => {
            profileAvatar.src = e.target.result;
            // Agar profile yo'q bo'lsa base64 ni o'ziga saqlab qolamiz
            currentProfile.avatar = e.target.result;
            localStorage.setItem('userProfile', JSON.stringify(currentProfile));
        };
        reader.readAsDataURL(file);

        // Agar internet bo'lsa firebase'ga saqlaymiz
        if (typeof firebaseUploadImage === 'function' && typeof firebase !== 'undefined') {
            try {
                // spinner qo'shish yoki loading animatsiyasi (ixtiyoriy)
                const uploadResult = await firebaseUploadImage(file);
                if (uploadResult && uploadResult.url) {
                    currentProfile.avatar = uploadResult.url;
                    localStorage.setItem('userProfile', JSON.stringify(currentProfile));
                }
            } catch (err) {
                console.error("Rasm yuklashda xatolik:", err);
            }
        }
    });

    // Formni saqlash
    profileForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const btnText = saveBtn.querySelector('.btn-text');
        const spinner = saveBtn.querySelector('.spinner');

        // Loading state
        btnText.style.display = 'none';
        spinner.style.display = 'block';
        saveBtn.disabled = true;

        const profileData = {
            id: currentProfile.id || null,
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            viloyat: viloyatSelect.value,
            tuman: tumanSelect.value,
            instagram: instagramInput.value.trim(),
            telegram: telegramInput.value.trim(),
            avatar: currentProfile.avatar || ''
        };

        try {
            // Firebase ga saqlash
            if (typeof firebaseSaveProfile === 'function') {
                const docId = await firebaseSaveProfile(profileData);
                if (docId) {
                    profileData.id = docId;
                }
            }

            // LocalStorage ga saqlash
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            currentProfile = profileData;

            // UI Update
            profileNameDisplay.textContent = profileData.name;

            if (typeof showNotification === 'function') {
                showNotification("Profil muvaffaqiyatli saqlandi!");
            } else {
                alert("Profil saqlandi!");
            }
        } catch (error) {
            console.error(error);
            if (typeof showNotification === 'function') {
                showNotification("Saqlashda xatolik yuz berdi!");
            } else {
                alert("Xatolik!");
            }
        } finally {
            // Reset loading state
            btnText.style.display = 'block';
            spinner.style.display = 'none';
            saveBtn.disabled = false;
        }
    });

    // Add global notification function if it doesn't exist
    if (typeof window.showNotification !== 'function') {
        window.showNotification = function (message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
                z-index: 10000;
                animation: slideIn 0.3s ease;
                font-weight: 600;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 3000);
        };
    }
});
