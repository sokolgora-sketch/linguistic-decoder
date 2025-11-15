
"use client";
import { useEffect, useMemo, useState } from "react";
import { db, auth, ensureAnon } from "@/lib/firebase";
import {
  collection, query, orderBy, limit, getDocs, startAfter,
  deleteDoc, doc, writeBatch, DocumentData, QueryDocumentSnapshot
} from "firebase/firestore";

type Row = {
  id: string;
  cacheId: string;
  word: string;
  mode: string;
  alphabet: string;
  engineVersion: string;
  source: string;
  primaryVoice?: string;
  createdAt?: any; // Timestamp
};

export default function HistoryPanel({
  onLoadAnalysis,
  onRecompute,
}: {
  onLoadAnalysis: (cacheId: string) => Promise<void>;
  onRecompute: (word: string, mode?: string, alphabet?: string) => Promise<void>;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mode, setMode] = useState<"all"|"strict"|"open">("all");
  const [alphabet, setAlphabet] = useState<"all"|"auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie"|"turkish"|"german">("all");
  const [wordFilter, setWordFilter] = useState("");

  useEffect(() => { (async () => ensureAnon())(); }, []);
  const uid = auth.currentUser?.uid || null;

  const baseQuery = useMemo(() => {
    if (!uid) return null;
    const col = collection(db, "users", uid, "history");
    return query(col, orderBy("createdAt", "desc"), limit(20));
  }, [uid]);

  async function load(hardRefresh = false) {
    if (!uid || !baseQuery) return;
    setLoading(true); setErr(null);
    try {
      const snap = await getDocs(baseQuery);
      const mapped: Row[] = snap.docs.map(d => {
        const x = d.data() as any;
        return {
          id: d.id,
          cacheId: String(x.cacheId || ""),
          word: String(x.word || ""),
          mode: String(x.mode || ""),
          alphabet: String(x.alphabet || ""),
          engineVersion: String(x.engineVersion || ""),
          source: String(x.source || ""),
          primaryVoice: x.primaryVoice ? String(x.primaryVoice) : undefined,
          createdAt: x.createdAt,
        };
      });
      const filtered = mapped.filter(r => {
        if (mode !== "all" && r.mode !== mode) return false;
        if (alphabet !== "all" && r.alphabet !== alphabet) return false;
        if (wordFilter && !r.word?.toLowerCase().includes(wordFilter.toLowerCase())) return false;
        return true;
      });
      setRows(filtered);
    } catch (e:any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [baseQuery, mode, alphabet, wordFilter]);

  async function deleteRow(row: Row) {
    if (!uid) return;
    const sure = window.confirm(`Delete history entry for "${row.word}"? This cannot be undone.`);
    if (!sure) return;

    setLoading(true); setErr(null);
    try {
      await deleteDoc(doc(db, "users", uid, "history", row.id));

      if (row.cacheId) {
        const also = window.confirm("Also delete the shared cache entry (analyses) for this item?");
        if (also) {
          await deleteDoc(doc(db, "analyses", row.cacheId));
        }
      }

      // Refresh list so UI never looks stale
      await load(true);
    } catch (e:any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function clearAll() {
    if (!uid) return;

    // Permission step 1 — explicit confirm
    const sure = window.confirm("Delete ALL your history entries? This cannot be undone.");
    if (!sure) return;

    // Permission step 2 — typed confirmation
    const token = window.prompt('Type CLEAR to confirm bulk delete:');
    if (token !== 'CLEAR') return;

    setLoading(true); setErr(null);
    try {
      let last: QueryDocumentSnapshot<DocumentData> | null = null;
      let total = 0;

      while (true) {
        const q = query(
          collection(db, "users", uid, "history"),
          orderBy("createdAt", "desc"),
          ...(last ? [startAfter(last)] : []),
          limit(200)
        );
        const snap = await getDocs(q);
        if (snap.empty) break;

        const batch = writeBatch(db);
        snap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();

        total += snap.docs.length;
        last = snap.docs[snap.docs.length - 1];
        if (snap.docs.length < 200) break;
      }

      // Optimistic UI clear + hard reload of list
      setRows([]);
      await load(true);

      alert(`Deleted ${total} history entr${total === 1 ? 'y' : 'ies'}.`);
    } catch (e:any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-3 bg-card">
      <div className="flex flex-wrap gap-2 items-end mb-3">
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Mode</label>
          <select className="border rounded px-2 py-1 text-sm bg-background" value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="all">All</option>
            <option value="strict">strict</option>
            <option value="open">open</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Alphabet</label>
          <select className="border rounded px-2 py-1 text-sm bg-background" value={alphabet} onChange={e=>setAlphabet(e.target.value as any)}>
            <option value="all">All</option>
            <option value="auto">auto</option>
            <option value="albanian">albanian</option>
            <option value="latin">latin</option>
            <option value="sanskrit">sanskrit</option>
            <option value="ancient_greek">ancient_greek</option>
            <option value="pie">pie</option>
            <option value="turkish">turkish</option>
            <option value="german">german</option>
          </select>
        </div>
        <div className="flex flex-col grow">
          <label className="text-xs text-muted-foreground">Word</label>
          <input className="border rounded px-2 py-1 text-sm bg-background" placeholder="search…" value={wordFilter} onChange={e=>setWordFilter(e.target.value)} />
        </div>

        <button className="border rounded px-3 py-1 text-sm" onClick={() => load(true)} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
        <button className="border rounded px-3 py-1 text-sm text-red-700 border-red-300" onClick={clearAll} disabled={loading}>
          {loading ? "…" : "Clear All"}
        </button>
      </div>

      {err && <div className="text-red-700 text-sm mb-2">Error: {err}</div>}

      <div className="divide-y">
        {rows.map((r)=>(
          <div key={r.id} className="py-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{r.word} <span className="font-normal opacity-70">({r.mode} · {r.alphabet})</span></div>
              <div className="text-xs opacity-70 truncate">
                {r.primaryVoice ? `Voice: ${r.primaryVoice}` : "—"}
                <span className="mx-1">·</span>
                eng {r.engineVersion}
                {r.createdAt?.toDate && (
                  <>
                    <span className="mx-1">·</span>
                    {r.createdAt.toDate().toLocaleString()}
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="border rounded px-2 py-1 text-xs" onClick={()=>onLoadAnalysis(r.cacheId)} title="Load cached analysis">Load</button>
              <button
                className="border rounded px-2 py-1 text-xs"
                title="Recompute (bypass cache)"
                onClick={()=>onRecompute(r.word, r.mode, r.alphabet)}
              >
                Recompute
              </button>
              <button className="border rounded px-2 py-1 text-xs text-red-700 border-red-300" onClick={()=>deleteRow(r)} title="Delete history">Delete</button>
            </div>
          </div>
        ))}
         {rows.length === 0 && !loading && (
            <div className="text-sm text-center py-4 text-slate-500">No history matching filters.</div>
        )}
      </div>
    </div>
  );
}

    