// ================================
// FIREBASE DATABASE OPERATIONS
// ================================

// Barcha mahsulotlarni olish
async function firebaseGetProducts() {
    try {
        const snapshot = await productsCollection.orderBy('createdAt', 'desc').get();
        const products = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Faqat 'active' yoki statusi bo'lmagan mahsulotlarni ko'rsatish
            if ((data.status || 'active') !== 'inactive') {
                products.push({ id: doc.id, ...data });
            }
        });
        return products;
    } catch (error) {
        console.error('Mahsulotlarni olishda xatolik:', error);
        return [];
    }
}

// Bitta mahsulotni olish
async function firebaseGetProduct(productId) {
    try {
        const doc = await productsCollection.doc(productId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Mahsulotni olishda xatolik:', error);
        return null;
    }
}

// Yangi mahsulot qo'shish
async function firebaseAddProduct(productData) {
    try {
        productData.createdAt = new Date().toISOString();
        productData.updatedAt = new Date().toISOString();
        const docRef = await productsCollection.add(productData);
        console.log('✅ Mahsulot qo\'shildi, ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Mahsulot qo\'shishda xatolik:', error);
        return null;
    }
}

// Mahsulotni yangilash
async function firebaseUpdateProduct(productId, productData) {
    try {
        productData.updatedAt = new Date().toISOString();
        await productsCollection.doc(productId).update(productData);
        console.log('✅ Mahsulot yangilandi:', productId);
        return true;
    } catch (error) {
        console.error('Mahsulotni yangilashda xatolik:', error);
        return false;
    }
}

// Mahsulotni o'chirish
async function firebaseDeleteProduct(productId) {
    try {
        // Agar rasm Storage'da bo'lsa, uni ham o'chirish
        const product = await firebaseGetProduct(productId);
        if (product && product.imageStoragePath) {
            try {
                await storage.ref(product.imageStoragePath).delete();
                console.log('🗑️ Rasm o\'chirildi:', product.imageStoragePath);
            } catch (imgError) {
                console.warn('Rasmni o\'chirishda muammo:', imgError);
            }
        }

        await productsCollection.doc(productId).delete();
        console.log('✅ Mahsulot o\'chirildi:', productId);
        return true;
    } catch (error) {
        console.error('Mahsulotni o\'chirishda xatolik:', error);
        return false;
    }
}

// ================================
// RASM YUKLASH (Firebase Storage)
// ================================

// Rasmni Firebase Storage'ga yuklash
// Rasmni ImgBB'ga yuklash (Firebase Storage o'rniga)
async function firebaseUploadImage(file) {
    // ImgBB API Key tekshirish
    if (typeof IMGBB_API_KEY === 'undefined' || IMGBB_API_KEY === 'SIZNING_IMGBB_KODINGIZ') {
        alert('❌ Rasm yuklash uchun ImgBB kaliti kerak! imgbb-config.js faylini to\'ldiring.');
        return null;
    }

    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', IMGBB_API_KEY);

        // Progress bar uchun simulyatsiya
        const progressBar = document.getElementById('uploadProgress');
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            if (progress > 90) clearInterval(progressInterval);
            if (progressBar) {
                progressBar.style.width = progress + '%';
                progressBar.textContent = progress + '%';
            }
        }, 200);

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });

        clearInterval(progressInterval);
        if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.textContent = '100%';
        }

        const data = await response.json();

        if (data.success) {
            console.log('✅ Rasm ImgBB ga yuklandi:', data.data.url);
            return {
                url: data.data.url,
                storagePath: null // ImgBB da path kerak emas
            };
        } else {
            throw new Error(data.error.message || 'ImgBB xatosi');
        }
    } catch (error) {
        console.error('Rasm yuklashda xatolik:', error);
        alert('❌ Rasm yuklanmadi: ' + error.message);
        return null;
    }
}

// Base64 rasmni Firebase Storage'ga yuklash
async function firebaseUploadBase64Image(base64String) {
    try {
        const fileName = `products/${Date.now()}_uploaded.jpg`;
        const storageRef = storage.ref(fileName);

        // Base64 dan blob yaratish
        const response = await fetch(base64String);
        const blob = await response.blob();

        const snapshot = await storageRef.put(blob);
        const downloadURL = await snapshot.ref.getDownloadURL();

        console.log('✅ Base64 rasm yuklandi:', downloadURL);
        return {
            url: downloadURL,
            storagePath: fileName
        };
    } catch (error) {
        console.error('Base64 rasm yuklashda xatolik:', error);
        return null;
    }
}

// ================================
// REAL VAQTDA YANGILANISH (Real-time)
// ================================

// Mahsulotlar o'zgarishini kuzatish
function firebaseListenProducts(callback) {
    return productsCollection.orderBy('createdAt', 'desc').onSnapshot(
        (snapshot) => {
            const products = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                if ((data.status || 'active') !== 'inactive') {
                    products.push({ id: doc.id, ...data });
                }
            });
            callback(products);
        },
        (error) => {
            console.error('Real-time xatolik:', error);
        }
    );
}

// ================================
// KATEGORIYA BO'YICHA FILTER
// ================================

async function firebaseGetProductsByCategory(category) {
    try {
        const snapshot = await productsCollection
            .where('category', '==', category)
            .orderBy('createdAt', 'desc')
            .get();

        const products = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if ((data.status || 'active') !== 'inactive') {
                products.push({ id: doc.id, ...data });
            }
        });
        return products;
    } catch (error) {
        console.error('Kategoriya bo\'yicha olishda xatolik:', error);
        return [];
    }
}

// ================================
// LOCALHOST MAHSULOTLARINI FIREBASE'GA KO'CHIRISH
// ================================

async function migrateLocalStorageToFirebase() {
    const localProducts = JSON.parse(localStorage.getItem('products'));
    if (!localProducts || localProducts.length === 0) {
        console.log('LocalStorage\'da mahsulotlar yo\'q');
        return 0;
    }

    let migrated = 0;
    for (const product of localProducts) {
        const productData = {
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
            image: product.image,
            badge: product.badge || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await productsCollection.add(productData);
            migrated++;
            console.log(`✅ Ko'chirildi: ${product.name}`);
        } catch (error) {
            console.error(`❌ Ko'chirib bo'lmadi: ${product.name}`, error);
        }
    }

    console.log(`🎉 Jami ${migrated} ta mahsulot Firebase'ga ko'chirildi!`);
    return migrated;
}

// Global qilish
window.firebaseGetProducts = firebaseGetProducts;
window.firebaseGetProduct = firebaseGetProduct;
window.firebaseAddProduct = firebaseAddProduct;
window.firebaseUpdateProduct = firebaseUpdateProduct;
window.firebaseDeleteProduct = firebaseDeleteProduct;
window.firebaseUploadImage = firebaseUploadImage;
window.firebaseUploadBase64Image = firebaseUploadBase64Image;
window.firebaseListenProducts = firebaseListenProducts;
window.firebaseGetProductsByCategory = firebaseGetProductsByCategory;
window.migrateLocalStorageToFirebase = migrateLocalStorageToFirebase;
