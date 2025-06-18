import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDlaEJjQ7isZwUaqUuSRX-7Z0FMXZoUDVU",
  authDomain: "hungry-saver-e1516.firebaseapp.com",
  projectId: "hungry-saver-e1516",
  storageBucket: "hungry-saver-e1516.appspot.com",
  messagingSenderId: "241617097469",
  appId: "1:241617097469:web:576561e1d0d602f0bb2494",
  measurementId: "G-EB9XCXJM8Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;