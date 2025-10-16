// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2NWy17qDzOK35kCrInOvupg7T52WIxAk",
  authDomain: "green-iq-vii.firebaseapp.com",
  projectId: "green-iq-vii",
  storageBucket: "green-iq-vii.firebasestorage.app",
  messagingSenderId: "303617109721",
  appId: "1:303617109721:web:340960f4b9ddd3402998c8",
  measurementId: "G-KZ1DL0RS3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Add error handling for Firestore initialization
try {
  // Configure Firestore settings to reduce connection issues
  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    // Only connect to emulator in development
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_FIRESTORE_EMULATOR) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
  });
} catch (error) {
  console.warn('Firestore configuration warning:', error);
}