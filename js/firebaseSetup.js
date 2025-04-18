import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// --- Your Firebase config object ---
const firebaseConfig = {
  apiKey: "AIzaSyCPu....",
  authDomain: "daily-message-5eeac.firebaseapp.com",
  projectId: "daily-message-5eeac",
  storageBucket: "daily-message-5eeac.firebasestorage.app",
  messagingSenderId: "763415183763",
  appId: "1:763415183763:web:4285c932a110811fb22866",
  measurementId: "G-59YRJYPP16"
};

// --- Initialize Firebase App ---
const app = initializeApp(firebaseConfig);

// --- Get Firestore instance ---
const db = getFirestore(app);

let dbName = "messages";

// --- Export db so other files can use it ---
export { db, dbName };