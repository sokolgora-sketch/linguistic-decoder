'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { db, ensureAnon } from "../lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Query,
} from "firebase/firestore";
import type { User } from "firebase/auth";

type ModeFilter = "all" | "strict" | "open";
type AlphabetFilter =
  | "all"
  | "auto"
  | "albanian"
  | "latin"
  | "sanskrit"
  | "ancient_greek"
  | "pie"
  | "turkish"
  | "german";

type Row = {
  id: string;
  cacheId: string;
  word: string;
  mode: string;
  alphabet: string;
  engineVersion: string;
  source: string;
  primaryVoice?: string;
  createdAt?: any; // Firestore Timestamp (kept loose to avoid dependency on firebase types here)
};

function toISO(ts: any): string {
  try {
    // Firestore Timestamp has .toDate()
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
    return d ? d.toISOString().replace("T", " ").slice(0, 19) : "";
  } catch {
    return "";
  }
}

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

  const [mode, setMode] = useState<ModeFilter>("all");
  const [alphabet, setAlphabet] = useState<AlphabetFilter>("all");
  const [wordFilter, setWordFilter] = useState("");
  const [uid, setUid] = useState<string | null>(null);

  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Ensure we have an anon user (if your firebase wiring supports it).
  useEffect(() => {
    let cancelled = false;

    ensureAnon()
      .then((user: User | null) => {
        if (cancelled) return;
        setUid(user?.uid ?? null);
      })
      .catch((e) => {
        console.error("[HistoryPanel] ensureAnon failed:", e);
        if (!cancelled) setUid(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const baseQuery: Query<DocumentData> | null = useMemo(() => {
    if (!db) return null;

    const col = collection(db, "history");
    const clauses: any[] = [];

    // Filter by uid when available
    if (uid) clauses.push(where("uid", "==", uid));

    if (mode !== "all") clauses.push(where("mode", "==", mode));
    if (alphabet !== "all") clauses.push(where("alphabet", "==", alphabet));

    return query(col, ...clauses, orderBy("createdAt", "desc"), limit(50));
  }, [uid, mode, alphabet]);

  const load = useCallback(
    async (reset = true) => {
      if (!baseQuery || !db) {
        if (!db) console.warn("[HistoryPanel] Firestore not available.");
        return;
      }

      setLoading(true);
      setErr(null);

      try {
        let q: Query<DocumentData> = baseQuery;

        if (!reset) {
          if (!cursor) {
            setLoading(false);
            return;
          }
          // pagination: continue after cursor
          q = query(baseQuery, startAfter(cursor), limit(50));
        } else {
          // reset pagination state
          setCursor(null);
          setHasMore(true);
        }

        const snap = await getDocs(q);
        const mapped: Row[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            cacheId: data.cacheId || d.id,
            word: data.word || "",
            mode: data.mode || "",
            alphabet: data.alphabet || "",
            engineVersion: data.engineVersion || "",
            source: data.source || "",
            primaryVoice: data.primaryVoice,
            createdAt: data.createdAt,
          };
        });

        const last = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
        setCursor(last);
        setHasMore(snap.docs.length === 50);

        setRows((prev) => (reset ? mapped : [...prev, ...mapped]));
      } catch (e: any) {
        console.error("[HistoryPanel] load failed:", e);
        setErr(e?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    },
    [baseQuery, cursor]
  );

  // Load whenever filters/baseQuery change (proper deps, no disables).
  useEffect(() => {
    void load(true);
  }, [load]);

  const filteredRows = useMemo(() => {
    const f = wordFilter.trim().toLowerCase();
    if (!f) return rows;
    return rows.filter((r) => (r.word || "").toLowerCase().includes(f));
  }, [rows, wordFilter]);

  const clearAll = useCallback(async () => {
    if (!db) return;
    if (!uid) {
      setErr("No uid available; refusing to clear global history.");
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      const col = collection(db, "history");
      const q = query(col, where("uid", "==", uid), orderBy("createdAt", "desc"), limit(500));
      const snap = await getDocs(q);

      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();

      setRows([]);
      setCursor(null);
      setHasMore(false);
    } catch (e: any) {
      console.error("[HistoryPanel] clearAll failed:", e);
      setErr(e?.message || "Failed to clear history.");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  const removeOne = useCallback(async (id: string) => {
    if (!db) return;

    try {
      await deleteDoc(doc(db, "history", id));
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("[HistoryPanel] delete failed:", e);
    }
  }, []);

  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-200">History</h2>
          <p className="text-xs text-gray-400">
            Recent analyses (filtered by uid when available).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10"
            onClick={() => load(true)}
            disabled={loading}
          >
            Reload
          </button>

          <button
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10"
            onClick={() => load(false)}
            disabled={loading || !hasMore}
            title={!hasMore ? "No more results" : "Load more"}
          >
            Load more
          </button>

          <button
            className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/20"
            onClick={clearAll}
            disabled={loading}
            title="Clears ONLY your uid history (safety)"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
        <label className="text-xs text-gray-400">
          Word
          <input
            value={wordFilter}
            onChange={(e) => setWordFilter(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-sm text-gray-200 outline-none"
            placeholder="filter…"
          />
        </label>

        <label className="text-xs text-gray-400">
          Mode
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ModeFilter)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-sm text-gray-200 outline-none"
          >
            <option value="all">all</option>
            <option value="strict">strict</option>
            <option value="open">open</option>
          </select>
        </label>

        <label className="text-xs text-gray-400">
          Alphabet
          <select
            value={alphabet}
            onChange={(e) => setAlphabet(e.target.value as AlphabetFilter)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-sm text-gray-200 outline-none"
          >
            <option value="all">all</option>
            <option value="auto">auto</option>
            <option value="albanian">albanian</option>
            <option value="latin">latin</option>
            <option value="sanskrit">sanskrit</option>
            <option value="ancient_greek">ancient_greek</option>
            <option value="pie">pie</option>
            <option value="turkish">turkish</option>
            <option value="german">german</option>
          </select>
        </label>
      </div>

      {err ? <p className="mt-3 text-xs text-red-300">{err}</p> : null}

      <div className="mt-3 space-y-2">
        {filteredRows.length === 0 ? (
          <p className="text-xs text-gray-500">{loading ? "Loading…" : "No history yet."}</p>
        ) : (
          filteredRows.map((h) => (
            <div
              key={h.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/30 p-3"
            >
              <div className="min-w-[220px]">
                <div className="text-sm text-gray-100">
                  <span className="font-semibold">{h.word || "(missing word)"}</span>{" "}
                  <span className="text-xs text-gray-400">
                    {h.mode ? `• ${h.mode}` : ""} {h.alphabet ? `• ${h.alphabet}` : ""}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-gray-400">
                  {h.engineVersion ? `engine ${h.engineVersion}` : ""}
                  {h.source ? ` • ${h.source}` : ""}
                  {h.createdAt ? ` • ${toISO(h.createdAt)}` : ""}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10"
                  onClick={() => onLoadAnalysis(h.cacheId)}
                >
                  Load
                </button>

                <button
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10"
                  onClick={() => onRecompute(h.word, h.mode, h.alphabet)}
                >
                  Recompute
                </button>

                <button
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200 hover:bg-white/10"
                  onClick={() => removeOne(h.id)}
                  title="Delete this row"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
