import { useEffect, useState } from "react";
import { db, auth, ensureAnon } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export type HistoryItem = { id: string; word: string; mode: string; alphabet: string; createdAt?: any };

export function useHistory(max = 12) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    let unsub = () => {};
    const setupListener = async () => {
      try {
        await ensureAnon();
        const uid = auth.currentUser!.uid;
        const q = query(
          collection(db, "users", uid, "history"),
          orderBy("createdAt", "desc"),
          limit(max)
        );
        unsub = onSnapshot(q, (snap) => {
          setItems(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
        }, (error) => {
          console.error("History snapshot error:", error);
          setItems([]);
        });
      } catch (error) {
        console.error("Failed to setup history listener:", error);
      }
    };

    setupListener();
    
    return () => {
      unsub();
    };
  }, [max]);
  
  return items;
}
