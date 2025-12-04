// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, type User, type Auth } from "firebase/auth";


// ✅ Safe Firebase config using env vars
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_Sender_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ✅ Only initialize once
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ✅ Export Firestore instance directly (optional)
export const db = getFirestore(app);

// ✅ restore auth + ensureAnon (needed by analyzeClient)
export const auth: Auth | null = app ? getAuth(app) : null;

export async function ensureAnon(): Promise<User | null> {
  if (!auth) {
    console.warn("[firebase] ensureAnon called but auth is null (no Firebase app)");
    return null;
  }

  // already signed in
  if (auth.currentUser) {
    return auth.currentUser;
  }

  try {
    const cred = await signInAnonymously(auth);
    return cred.user ?? null;
  } catch (err) {
    console.error("[firebase] Anonymous sign-in failed:", err);
    return null;
  }
}
