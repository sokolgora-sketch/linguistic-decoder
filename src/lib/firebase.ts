// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, type User, type Auth } from "firebase/auth";

const isTest = process.env.NODE_ENV === 'test';

// Use the server-side key for scripts/server-side, fall back to public key for client
const apiKey = process.env.FIREBASE_SERVER_API_KEY || process.env.NEXT_PUBLIC_FB_API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
};

// Only initialize if the key is present
const appInitialized = !!apiKey;

export const app: FirebaseApp | null = isTest || !appInitialized
  ? null
  : (getApps().length ? getApps()[0] : initializeApp(firebaseConfig));

export const db: Firestore | null = app ? getFirestore(app) : null;
export const auth: Auth | null = app ? getAuth(app) : null;


// Store the promise to avoid multiple simultaneous calls
let authPromise: Promise<User> | null = null;

export function ensureAnon(): Promise<User> {
  if (isTest) return Promise.resolve({ uid: 'test-uid' } as any);
  if (!app || !auth) {
    console.warn("Firebase not initialized, cannot ensure anonymous user.");
    return Promise.resolve({ uid: 'uninitialized' } as any);
  }

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
