import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcIRUYHhYQ7OgKmHzlOuAXjar_ZUudcRo",
  authDomain: "skillsync-ai-89c6b.firebaseapp.com",
  projectId: "skillsync-ai-89c6b",
  storageBucket: "skillsync-ai-89c6b.firebasestorage.app",
  messagingSenderId: "1017139556669",
  appId: "1:1017139556669:web:145d9ec10cac1bfe769554",
  measurementId: "G-8R2VRFRKJG",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize analytics only when supported (avoids errors in iframes/previews)
isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});
