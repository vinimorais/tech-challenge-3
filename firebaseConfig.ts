import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAXI8VKe2uRh18zQf7NYkjIGGfFZ7QYYOs",
    authDomain: "tech-challenge-3-78a2c.firebaseapp.com",
    projectId: "tech-challenge-3-78a2c",
    storageBucket: "tech-challenge-3-78a2c.firebasestorage.app",
    messagingSenderId: "104121244699",
    appId: "1:104121244699:web:ce18db0e5bdf037aa3ecbe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export { auth };
