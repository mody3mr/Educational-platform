// إعدادات Firebase البسيطة للعمل المباشر
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqapVeFxYyLJWryfqJrwBBmaIFcsCLn-w",
  authDomain: "educational-platform-f5e7e.firebaseapp.com",
  projectId: "educational-platform-f5e7e",
  storageBucket: "educational-platform-f5e7e.firebasestorage.app",
  messagingSenderId: "284103839814",
  appId: "1:284103839814:web:9b6abd761a585c46f03a47"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
