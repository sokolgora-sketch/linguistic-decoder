import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, type User } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase wiring (shared by client components like HistoryPanel).
 *
 * Exports expected by existing UI code:
 * - db (Firestore)
 * - ensureAnon() (anonymous auth helper)
 * - getFirebaseApp() (app accessor)
 */

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  };
}

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApps()[0]!;
  return initializeApp(getFirebaseConfig());
}

export const auth = getAuth(getFirebaseApp());
export const db: Firestore = getFirestore(getFirebaseApp());

/**
 * Ensure we have an authenticated user (anonymous).
 * Returns the Firebase User (or throws if auth fails).
 */
export async function ensureAnon(): Promise<User> {
  if (auth.currentUser) return auth.currentUser;

  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    // If something races and we got a user anyway, accept it.
    if (auth.currentUser) return auth.currentUser;
    throw err;
  }
}
