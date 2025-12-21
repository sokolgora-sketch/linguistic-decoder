"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, type Auth, type User } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Enable Firebase only when config is present (keeps builds stable in environments without config)
export const firebaseEnabled = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_API_KEY
);

const firebaseConfig = firebaseEnabled
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
  : null;

const _app: FirebaseApp | null = firebaseEnabled
  ? getApps().length
    ? getApps()[0]!
    : initializeApp(firebaseConfig!)
  : null;

// Export the names older code expects.
// We intentionally keep types non-null to avoid cascading TS refactors;
// runtime usage must be guarded via firebaseEnabled.
export const app = _app as unknown as FirebaseApp;
export const auth = (firebaseEnabled ? getAuth(_app!) : null) as unknown as Auth;
export const db = (firebaseEnabled ? getFirestore(_app!) : null) as unknown as Firestore;

export async function ensureAnon(): Promise<User | null> {
  if (!firebaseEnabled) return null;
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}
