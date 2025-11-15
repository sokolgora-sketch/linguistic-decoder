
"use client";
import { useEffect, useMemo, useState } from "react";
import { db, auth, ensureAnon } from "@/lib/firebase";
import {
  collection, query, where, orderBy, limit, getDocs, startAfter,
  DocumentData, QueryDocumentSnapshot
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
  onRecompute: (word: string, mode: "strict" | "open", alphabet: string) => Promise<void>;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [after, setAfter] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [mode, setMode] = useState<"all"|"strict"|"open">("all");
  const [alphabet, setAlphabet] = useState<"all"|"auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie"|"turkish"|"german">("all");
  const [wordFilter, setWordFilter] = useState("");

  useEffect(() => { (async () => ensureAnon())(); }, []);

  const uid = auth.currentUser?.uid || null;

  const baseQuery = useMemo(() => {
    if (!uid) return null;
    const col = collection(db, "users", uid, "history");
    const parts: any[] = [orderBy("createdAt", "desc")];
    const q = query(col, ...parts, limit(20));
    return q;
  }, [uid]);

  async function load(reset = false) {
    if (!uid || !baseQuery) return;
    setLoading(true);
    setErr(null);
    try {
      let q = baseQuery;

      const snap = await getDocs(q);
      const docs = snap.docs;
      setAfter(docs.length ? docs[docs.length - 1] : null);

      const mapped: Row[] = docs.map(d => {
        const x = d.data() as any;
        return {
          id: d.id,
          cacheId: x.cacheId,
          word: x.word,
          mode: x.mode,
          alphabet: x.alphabet,
          engineVersion: x.engineVersion,
          source: x.source,
          primaryVoice: x.primaryVoice,
          createdAt: x.createdAt,
        };
      });

      const filtered = mapped.filter(r => {
        if (mode !== "all" && r.mode !== mode) return false;
        if (alphabet !== "all" && r.alphabet !== alphabet) return false;
        if (wordFilter && !r.word?.toLowerCase().includes(wordFilter.toLowerCase())) return false;
        return true;
      });

      setRows(reset ? filtered : [...rows, ...filtered]);
    } catch (e:any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(true); /* reload on filter change */ }, [baseQuery, mode, alphabet, wordFilter]);

  return (
    <div className="border rounded-lg p-3">
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
            <option value="german">german</option>
            <option value="turkish">turkish</option>
          </select>
        </div>
        <div className="flex flex-col grow">
          <label className="text-xs text-muted-foreground">Word</label>
          <input className="border rounded px-2 py-1 text-sm bg-background" placeholder="search…" value={wordFilter} onChange={e=>setWordFilter(e.target.value)} />
        </div>
        <button className="border rounded px-3 py-1 text-sm" onClick={()=>load(true)} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
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
              <button className="border rounded px-2 py-1 text-xs" title="Load cached analysis"
                onClick={()=>onLoadAnalysis(r.cacheId)}>Load</button>
              <button className="border rounded px-2 py-1 text-xs" title="Recompute (bypass cache)"
                onClick={()=>onRecompute(r.word, r.mode as any, r.alphabet)}>Recompute</button>
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
