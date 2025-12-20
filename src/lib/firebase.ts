import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";

// Lazy-safe init — no crash if no key provided
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === "undefined") return null; // SSR safety
  try {
    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  } catch {
    return null;
  }
};

// Lazy getter for auth
export const getFirebaseAuth = async (): Promise<Auth | null> => {
  if (typeof window === "undefined") return null;
  const app = getFirebaseApp();
  if (!app) return null;
  const { getAuth, signInAnonymously, onAuthStateChanged } = await import("firebase/auth");
  const auth = getAuth(app);
  try {
    await signInAnonymously(auth);
  } catch (_) {}
  return auth;
};
