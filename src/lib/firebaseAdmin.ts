// app/lib/firebaseAdmin.ts
import admin from "firebase-admin";

if (!admin.apps.length) {
  // In Firebase Hosting / Studio this will use the default service account.
  admin.initializeApp();
}

export const firestore = admin.firestore();
export { admin };
