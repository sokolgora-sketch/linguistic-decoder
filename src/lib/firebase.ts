// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Store the promise to avoid multiple simultaneous calls
let authPromise: Promise<User> | null = null;

export function ensureAnon(): Promise<User> {
  const existing = auth.currentUser;
  if (existing) return Promise.resolve(existing);

  if (authPromise) return authPromise;

  authPromise = new Promise((resolve, reject) => {
    // Check again inside the promise in case auth state changed while promise was created
    if (auth.currentUser) {
      resolve(auth.currentUser);
      authPromise = null;
      return;
    }

    const off = onAuthStateChanged(auth, (u) => {
        if (u) {
            off();
            resolve(u);
            authPromise = null;
        }
    }, (err) => {
        off();
        reject(err);
        authPromise = null;
    });

    signInAnonymously(auth).catch(err => {
      // The onAuthStateChanged error handler should catch this,
      // but we reject here as a fallback.
      reject(err);
      authPromise = null;
    });
  });

  return authPromise;
}
