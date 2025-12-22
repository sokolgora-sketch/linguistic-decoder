'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { db, ensureAnon} from "../lib/firebase";
import { loadHistoryPage, deleteHistoryItem } from "../lib/historyStore";
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
  cacheId?: string;
  word: string;
  mode: string;
  alphabet: string;
  engineVersion?: string;
  source?: string;
  primaryVoice?: string;
  createdAt?: any; // Firestore Timestamp-ish
};

function tsToMs(v: any): number | null {
  if (!v) return null;
  if (typeof v === "number") return v;
  if (typeof v?.toMillis === "function") return v.toMillis();
  if (typeof v?.seconds === "number") return v.seconds * 1000;
  return null;
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

  const queryParams = useMemo(() => {
    return {
      uid,
      mode: mode === "all" ? null : mode,
      alphabet: alphabet === "all" ? null : alphabet,
      wordFilter,
    };
  }, [uid, mode, alphabet, wordFilter]);
  const load = useCallback(
    async (reset = true) => {
      setLoading(true);
      setErr(null);

      try {
        const res = await loadHistoryPage({
          uid: queryParams.uid,
          mode: queryParams.mode,
          alphabet: queryParams.alphabet,
          wordFilter: queryParams.wordFilter,
          limitCount: 50,
          cursor: reset ? null : cursor,
        });

        const mapped: Row[] = res.rows.map((data: any) => ({
          id: data.id,
          cacheId: data.cacheId || data.id,
          word: data.word || "",
          mode: data.mode || "",
          alphabet: data.alphabet || "",
          engineVersion: data.engineVersion,
          source: data.source,
          primaryVoice: data.primaryVoice,
          createdAt: data.createdAt,
        }));

        if (reset) setRows(mapped);
        else setRows((prev) => prev.concat(mapped));

        setCursor(res.cursor);
        setHasMore(res.hasMore);
      } catch (e: any) {
        console.error("[HistoryPanel] load failed:", e);
        setErr(e?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    },
    [queryParams, cursor]
  );

  // Load whenever the query inputs change.
  useEffect(() => { load(true); }, [load]);

  const deleteRow = useCallback(
    async (row: Row) => {
      const ok = window.confirm(`Delete history entry for "${row.word}"? This cannot be undone.`);
      if (!ok) return;

      setLoading(true);
      setErr(null);

      try {
        let alsoDeleteCache = false;
        if (row.cacheId) {
          alsoDeleteCache = window.confirm("Also delete the shared cache entry (analyses) for this item?");
        }

        await deleteHistoryItem({
          uid,
          id: row.id,
          cacheId: row.cacheId || null,
          alsoDeleteCache,
        });

        setRows((prev) => prev.filter((r) => r.id !== row.id));
      } catch (e: any) {
        console.error("[HistoryPanel] delete failed:", e);
        setErr(e?.message || "Failed to delete history item.");
      } finally {
        setLoading(false);
      }
    },
    [uid]
  );

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-100">History</h2>
          <p className="text-xs text-gray-400">Recent analyses cached in Firestore.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={wordFilter}
            onChange={(e) => setWordFilter(e.target.value)}
            placeholder="Filter by word…"
            className="w-44 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-100 placeholder:text-gray-500"
          />

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ModeFilter)}
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-100"
            aria-label="Mode filter"
          >
            <option value="all">Mode: all</option>
            <option value="strict">Mode: strict</option>
            <option value="open">Mode: open</option>
          </select>

          <select
            value={alphabet}
            onChange={(e) => setAlphabet(e.target.value as AlphabetFilter)}
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-100"
            aria-label="Alphabet filter"
          >
            <option value="all">Alphabet: all</option>
            <option value="auto">auto</option>
            <option value="albanian">albanian</option>
            <option value="latin">latin</option>
            <option value="sanskrit">sanskrit</option>
            <option value="ancient_greek">ancient_greek</option>
            <option value="pie">pie</option>
            <option value="turkish">turkish</option>
            <option value="german">german</option>
          </select>

          <button
            onClick={() => load(true)}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-gray-100 hover:bg-white/15 disabled:opacity-60"
          >
            Refresh
          </button>
      </div>
        </div>

        {err ? (
        <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {err}
        </div>
      ) : null}

      <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        {rows.length === 0 ? (
          <div className="p-4 text-xs text-gray-400">{loading ? "Loading…" : "No history yet."}</div>
        ) : (
          rows.map((h) => {
            const ms = tsToMs(h.createdAt);
            const when = ms ? new Date(ms).toLocaleString() : "";
            return (
              <div key={h.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                <div className="min-w-[220px]">
                  <div className="text-sm text-gray-100">
                    <span className="font-semibold">{h.word}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {h.mode || "—"} · {h.alphabet || "—"}
                      {when ? ` · ${when}` : ""}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {h.engineVersion ? `v${h.engineVersion}` : ""} {h.primaryVoice ? ` · Voice ${h.primaryVoice}` : ""}{" "}
                    {h.source ? ` · ${h.source}` : ""}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    title="Load cached analysis"
                    onClick={() => onLoadAnalysis(h.cacheId)}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-gray-100 hover:bg-white/15"
                  >
                    Load
                  </button>

                  <button
                    title="Recompute this word"
                    onClick={() => onRecompute(h.word, h.mode || undefined, h.alphabet || undefined)}
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-gray-100 hover:bg-white/15"
                  >
                    Recompute
                  </button>

                  <button
                    title="Delete this row"
                    onClick={() => deleteRow(h)}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/15"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {rows.length} row{rows.length === 1 ? "" : "s"} {hasMore ? "" : "· end"}
        </div>

        <button
          onClick={() => load(false)}
          disabled={loading || !hasMore}
          className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-gray-100 hover:bg-white/15 disabled:opacity-60"
        >
          Load more
        </button>
      </div>
    </section>
  );
}
