import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";
import type { PublicShareRecord } from "@/lib/types";

const db = getFirestore(firebaseApp);
const COLLECTION = "publicShares";

export async function getPublicShare(
  id: string
): Promise<PublicShareRecord | null> {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as PublicShareRecord;
    }
    return null;
  } catch (err) {
    console.error("🔥 Firestore read error:", err);
    return null;
  }
}

export async function savePublicShare(record: PublicShareRecord): Promise<void> {
  console.log(
    "[publicShareStore] using projectId",
    firebaseApp.options.projectId
  );

  const sanitized: PublicShareRecord = {
    ...record,
    zhejiSummary: record.zhejiSummary ?? null,
    symbolicSummary: record.symbolicSummary ?? null,
  };

  await setDoc(doc(db, COLLECTION, record.id), sanitized);
  console.log("[publicShareStore] Firestore save", record.id);
}
