// Firebase App & Service Initialization
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Only consider Firebase configured if real API key is present
export const isFirebaseConfigured = Boolean(
  rawApiKey && 
  rawApiKey !== 'AIzaSyMockKeyForRajibCSC2026NorthLakhimpur' &&
  !rawApiKey.includes('MockKey')
);

let app = null;
let db = null;
let storage = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: rawApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rajib-csc-north-lakhimpur.firebaseapp.com",
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rajib-csc-north-lakhimpur",
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rajib-csc-north-lakhimpur.appspot.com",
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "498120394812",
      appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:498120394812:web:a1b2c3d4e5f6g7h8"
    };

    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    console.log('[Firebase API initialized successfully]');
  } catch (err) {
    console.warn('[Firebase Init Warning] Falling back to persistent local DB:', err);
  }
}

export { app, db, storage, auth };
export default app;
