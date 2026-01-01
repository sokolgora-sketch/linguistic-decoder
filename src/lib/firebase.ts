
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, type User, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

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
  if (process.env.NODE_ENV === "test") {
    throw new Error("Firebase app should not be initialized in unit tests");
  }
  if (_app) return _app;

  _app = initializeApp(getFirebaseConfig());
  return _app;
}

export function getAuthClient(): Auth {
  if (process.env.NODE_ENV === "test") {
    throw new Error("Firebase auth should not be initialized in unit tests");
  }
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  return _auth;
}

export function getFirestoreClient(): Firestore {
  if (process.env.NODE_ENV === "test") {
    throw new Error("Firebase firestore should not be initialized in unit tests");
  }
  if (_db) return _db;
  _db = getFirestore(getFirebaseApp());
  return _db;
}

export async function ensureAnon(): Promise<User> {
  const auth = getAuthClient();
  if (auth.currentUser) return auth.currentUser;

  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    if (auth.currentUser) return auth.currentUser;
    throw err;
  }
}
