// Replace the below config with your Firebase project's config
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3Qkwv8VjG5uIvVZweChrkEzdu1_m53Lk",
  authDomain: "mone-f4d3d.firebaseapp.com",
  projectId: "mone-f4d3d",
  storageBucket: "mone-f4d3d.firebasestorage.app",
  messagingSenderId: "829958041936",
  appId: "1:829958041936:web:56688ef2daff38a99f3c55"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

