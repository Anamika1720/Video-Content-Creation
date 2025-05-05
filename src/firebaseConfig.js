import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUwgsaUh6bbtLrzrlYskYoSj2_c_kG0PY",
  authDomain: "otp-auth-video-creation.firebaseapp.com",
  projectId: "otp-auth-video-creation",
  storageBucket: "otp-auth-video-creation.firebasestorage.app",
  messagingSenderId: "510434968154",
  appId: "1:510434968154:web:56313106ffb2e632face63",
  measurementId: "G-DS1KJ851B7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
