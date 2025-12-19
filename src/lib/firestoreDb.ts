import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./firebase";

/**
 * Lazy Firestore accessor.
 * Avoid top-level initialization so Next build / CI doesn't crash.
 */
let _db: Firestore | null = null;

export function getDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getFirebaseApp());
  return _db;
}
