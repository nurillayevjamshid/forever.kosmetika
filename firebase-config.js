// ================================
// FIREBASE CONFIGURATION
// ================================

const firebaseConfig = {
    apiKey: "AIzaSyBu4IOjLQ9RCEp920Am8eFq_BZzBJNi6vA",
    authDomain: "forever-cosmetics.firebaseapp.com",
    projectId: "forever-cosmetics",
    storageBucket: "forever-cosmetics.firebasestorage.app",
    messagingSenderId: "308730621603",
    appId: "1:308730621603:web:07a90c5c12e15eb5ec5916",
    measurementId: "G-WDTWV4800H"
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
const productsCollection = db.collection('products');
