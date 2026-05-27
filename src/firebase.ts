import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC31kkzl0JdLNq5mgWJi__e8e8CtFFT6Fg",
  authDomain: "varc-arena.firebaseapp.com",
  projectId: "varc-arena",
  storageBucket: "varc-arena.firebasestorage.app",
  messagingSenderId: "844137581884",
  appId: "1:844137581884:web:3facad0e768cf4ec24a239",
  measurementId: "G-6QSZS0SHTY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);