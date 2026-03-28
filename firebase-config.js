// ================================
// FIREBASE CONFIGURATION
// ================================

const firebaseConfig = {
    apiKey: "AIzaSyCcXc0svgxLtPvOYwpNUIzyRJGgajbyR9M",
    authDomain: "foreverkosmetika.firebaseapp.com",
    projectId: "foreverkosmetika",
    storageBucket: "foreverkosmetika.appspot.com",
    messagingSenderId: "1013746676566",
    appId: "1:1013746676566:web:0032dfcb13239db2d15cf7",
    measurementId: "G-B71E70JH2Z"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('🔥 Firebase ishga tushdi!');
} catch (e) {
    console.error('Firebase ishga tushirishda xatolik:', e);
}

// Initialize Services
const db = firebase.firestore();
const storage = firebase.storage();

// Firestore offline persistence (IndexedDB)
try {
    db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('⚠️ Persistence: boshqa tab ochiq, bittada ishlaydi');
        } else if (err.code === 'unimplemented') {
            console.warn('⚠️ Persistence: brauzer qo\'llab-quvvatlamaydi');
        }
    });
} catch (e) {
    console.warn('Persistence sozlashda xatolik:', e);
}

const productsCollection = db.collection('products');
const ordersCollection = db.collection('orders');
const customersCollection = db.collection('customers');
const salesCollection = db.collection('sales');
const financesCollection = db.collection('finances');
