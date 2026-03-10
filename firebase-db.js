// ================================
// FIREBASE DATABASE OPERATIONS
// ================================

// Barcha mahsulotlarni olish
async function firebaseGetProducts() {
    try {
        const snapshot = await productsCollection.get();
        const products = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Faqat 'active' yoki statusi bo'lmagan mahsulotlarni ko'rsatish
            if ((data.status || 'active') !== 'inactive') {
                products.push({ id: doc.id, ...data });
            }
        });
        // So'nggi qo'shilganlar yuqorida bo'lishi uchun sort qilish (ixtiyoriy)
        return products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
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
async function firebaseUploadImage(file) {
    try {
        const storageRef = firebase.storage().ref();
        const fileName = 'products/' + Date.now() + '_' + file.name;
        const uploadTask = await storageRef.child(fileName).put(file);
        const downloadURL = await uploadTask.ref.getDownloadURL();

        console.log('✅ Rasm Firebase Storage\'ga yuklandi:', downloadURL);
        return {
            url: downloadURL,
            storagePath: fileName
        };
    } catch (error) {
        console.error('Rasm yuklashda xatolik:', error);
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
    return productsCollection.onSnapshot(
        (snapshot) => {
            const products = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                if ((data.status || 'active') !== 'inactive') {
                    products.push({ id: doc.id, ...data });
                }
            });
            // Client-side sort
            callback(products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
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

// ================================
// BUYURTMALARNI SAQLASH (Orders)
// ================================

// Buyurtma raqamini generatsiya qilish
function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FOR-${year}${month}${day}-${random}`;
}

// Yangi buyurtmani saqlash
async function firebaseSaveOrder(orderData) {
    try {
        const orderNumber = generateOrderNumber();
        const order = {
            orderNumber: orderNumber,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerAddress: orderData.customerAddress || '',
            viloyat: orderData.viloyat || '',
            tuman: orderData.tuman || '',
            items: orderData.items.map(item => ({
                productId: item.id || '',
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity,
                imageUrl: item.imageUrl || item.image || ''
            })),
            totalAmount: orderData.totalAmount,
            itemsCount: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
            status: 'yangi', // yangi, jarayonda, yetkazilmoqda, tugallangan, bekor
            paymentStatus: 'kutilmoqda', // kutilmoqda, to'langan
            source: 'website',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await ordersCollection.add(order);
        console.log('✅ Buyurtma saqlandi, ID:', docRef.id, 'Raqam:', orderNumber);
        return { id: docRef.id, orderNumber: orderNumber };
    } catch (error) {
        console.error('❌ Buyurtma saqlashda xatolik:', error);
        return null;
    }
}

// Barcha buyurtmalarni olish
async function firebaseGetOrders() {
    try {
        const snapshot = await ordersCollection.orderBy('createdAt', 'desc').get();
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (error) {
        console.error('Buyurtmalarni olishda xatolik:', error);
        return [];
    }
}

// Buyurtma statusini yangilash
async function firebaseUpdateOrderStatus(orderId, status) {
    try {
        await ordersCollection.doc(orderId).update({
            status: status,
            updatedAt: new Date().toISOString()
        });
        console.log('✅ Buyurtma statusi yangilandi:', status);
        return true;
    } catch (error) {
        console.error('Buyurtma statusini yangilashda xatolik:', error);
        return false;
    }
}

// ================================
// MIJOZLAR BAZASI (Customers)
// ================================

// Mijozni saqlash yoki yangilash (telefon raqam bo'yicha)
async function firebaseSaveCustomer(customerData) {
    try {
        // Telefon raqam bo'yicha mavjud mijozni qidirish
        const existingCustomer = await customersCollection
            .where('phone', '==', customerData.phone)
            .get();

        if (!existingCustomer.empty) {
            // Mavjud mijoz — yangilash
            const customerDoc = existingCustomer.docs[0];
            const currentData = customerDoc.data();

            const updatedData = {
                name: customerData.name, // Eng so'nggi ism
                phone: customerData.phone,
                address: customerData.address || currentData.address || '',
                viloyat: customerData.viloyat || currentData.viloyat || '',
                tuman: customerData.tuman || currentData.tuman || '',
                totalOrders: (currentData.totalOrders || 0) + 1,
                totalSpent: (currentData.totalSpent || 0) + (customerData.orderAmount || 0),
                lastOrderAt: new Date().toISOString(),
                lastOrderItems: customerData.orderItems || [],
                updatedAt: new Date().toISOString()
            };

            // Buyurtma tarixiga qo'shish
            const orderHistory = currentData.orderHistory || [];
            orderHistory.push({
                orderNumber: customerData.orderNumber || '',
                amount: customerData.orderAmount || 0,
                items: customerData.orderItems || [],
                date: new Date().toISOString()
            });
            updatedData.orderHistory = orderHistory;

            await customersCollection.doc(customerDoc.id).update(updatedData);
            console.log('✅ Mavjud mijoz yangilandi:', customerDoc.id);
            return { id: customerDoc.id, isNew: false };
        } else {
            // Yangi mijoz
            const newCustomer = {
                name: customerData.name,
                phone: customerData.phone,
                address: customerData.address || '',
                viloyat: customerData.viloyat || '',
                tuman: customerData.tuman || '',
                totalOrders: 1,
                totalSpent: customerData.orderAmount || 0,
                lastOrderAt: new Date().toISOString(),
                lastOrderItems: customerData.orderItems || [],
                orderHistory: [{
                    orderNumber: customerData.orderNumber || '',
                    amount: customerData.orderAmount || 0,
                    items: customerData.orderItems || [],
                    date: new Date().toISOString()
                }],
                source: 'website',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const docRef = await customersCollection.add(newCustomer);
            console.log('✅ Yangi mijoz qo\'shildi:', docRef.id);
            return { id: docRef.id, isNew: true };
        }
    } catch (error) {
        console.error('❌ Mijoz saqlashda xatolik:', error);
        return null;
    }
}

// Barcha mijozlarni olish
async function firebaseGetCustomers() {
    try {
        const snapshot = await customersCollection.orderBy('createdAt', 'desc').get();
        const customers = [];
        snapshot.forEach(doc => {
            customers.push({ id: doc.id, ...doc.data() });
        });
        return customers;
    } catch (error) {
        console.error('Mijozlarni olishda xatolik:', error);
        return [];
    }
}

// Mijozni o'chirish
async function firebaseDeleteCustomer(customerId) {
    try {
        await customersCollection.doc(customerId).delete();
        console.log('✅ Mijoz o\'chirildi:', customerId);
        return true;
    } catch (error) {
        console.error('Mijozni o\'chirishda xatolik:', error);
        return false;
    }
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

// Buyurtma va Mijoz funksiyalari
window.firebaseSaveOrder = firebaseSaveOrder;
window.firebaseGetOrders = firebaseGetOrders;
window.firebaseUpdateOrderStatus = firebaseUpdateOrderStatus;
window.firebaseSaveCustomer = firebaseSaveCustomer;
window.firebaseGetCustomers = firebaseGetCustomers;
window.firebaseDeleteCustomer = firebaseDeleteCustomer;
