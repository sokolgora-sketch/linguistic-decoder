"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Row =
  | { word: string; ok: true; hash: string; engineVersion?: string; data: any; ms: number }
  | { word: string; ok: false; error: string; ms: number };

function stableStringify(value: any): string {
  const seen = new WeakSet();

  const norm = (v: any): any => {
    if (v === null || typeof v !== "object") return v;
    if (seen.has(v)) return "[Circular]";
    seen.add(v);

    if (Array.isArray(v)) return v.map(norm);

    const keys = Object.keys(v).sort();
    const out: any = {};
    for (const k of keys) out[k] = norm(v[k]);
    return out;
  };

  return JSON.stringify(norm(value));
}

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function downloadJson(filename: string, payload: any) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function DeterminismLab() {
  const [wordsText, setWordsText] = useState<string>(
    ["study", "love", "hope", "damage", "father"].join("\n")
  );

  const words = useMemo(
    () =>
      wordsText
        .split(/\r?\n/g)
        .map((s) => s.trim())
        .filter(Boolean),
    [wordsText]
  );

  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    const next: Row[] = [];

    for (const w of words) {
      const t0 = performance.now();
      try {
        const res = await fetch(`/api/analyze-v1?word=${encodeURIComponent(w)}`);
        const ms = Math.round(performance.now() - t0);

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          next.push({
            word: w,
            ok: false,
            error: `HTTP ${res.status} ${res.statusText}${txt ? ` — ${txt}` : ""}`,
            ms,
          });
          continue;
        }

        const data = await res.json();
        const canonical = stableStringify(data);
        const hash = await sha256Hex(canonical);

        next.push({
          word: w,
          ok: true,
          hash,
          engineVersion: data?.engineVersion,
          data,
          ms,
        });
      } catch (e: any) {
        const ms = Math.round(performance.now() - t0);
        next.push({ word: w, ok: false, error: e?.message ?? String(e), ms });
      }
    }

    setRows(next);
    setRunning(false);
  }

  const okRows = rows.filter((r): r is Extract<Row, { ok: true }> => r.ok);
  const allOk = rows.length > 0 && rows.every((r) => r.ok);
  const hashes = okRows.map((r) => r.hash);
  const uniqueHashes = new Set(hashes);

  return (
    <Card className="border-white/10 bg-zinc-950/30">
      <CardHeader>
        <CardTitle className="text-base">Determinism Lab</CardTitle>
        <CardDescription>
          Batch-run <span className="font-mono">/api/analyze-v1</span>, compute stable SHA-256 hashes, and verify consistent outputs.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">One word per line.</div>
        <Textarea
          value={wordsText}
          onChange={(e) => setWordsText(e.target.value)}
          className="min-h-[120px] bg-black/30"
          spellCheck={false}
        />

        <div className="flex flex-wrap gap-2">
          <Button onClick={run} disabled={running || words.length === 0} aria-busy={running ? "true" : "false"}>
            {running ? "Running…" : "Run batch"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => downloadJson("zero-determinism-lab.json", { words, rows })}
            disabled={rows.length === 0}
          >
            Export results JSON
          </Button>
        </div>

        {rows.length > 0 && (
          <div className="rounded-lg border border-white/10 bg-zinc-950/30 p-3 text-sm">
            <div className="flex flex-wrap gap-3">
              <span>
                Words: <span className="font-semibold">{words.length}</span>
              </span>
              <span>
                OK: <span className="font-semibold">{rows.filter((r) => r.ok).length}</span>
              </span>
              <span>
                Errors: <span className="font-semibold">{rows.filter((r) => !r.ok).length}</span>
              </span>
              <span>
                Unique hashes: <span className="font-semibold">{uniqueHashes.size}</span>
              </span>
              <span>
                Verdict:{" "}
                <span
                  className={
                    allOk && uniqueHashes.size === okRows.length
                      ? "font-semibold text-emerald-300"
                      : "font-semibold text-yellow-200"
                  }
                >
                  {allOk && uniqueHashes.size === okRows.length ? "Stable per-word" : "Review"}
                </span>
              </span>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="mt-4 space-y-3">
            {rows.map((r) => (
              <Card key={r.word} className="border-white/10 bg-zinc-950/40">
                <CardHeader className="py-4">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="font-semibold">{r.word}</span>
                    <span className="text-xs text-muted-foreground">{r.ms} ms</span>
                  </CardTitle>
                  <CardDescription>
                    {r.ok ? (
                      <>
                        Hash: <span className="font-mono">{r.hash.slice(0, 16)}</span>
                        {r.engineVersion ? (
                          <>
                            {" "}
                            · Engine: <span className="font-mono">{r.engineVersion}</span>
                          </>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-red-200">Error: {r.error}</span>
                    )}
                  </CardDescription>
                </CardHeader>

                {r.ok && (
                  <CardContent className="pt-0">
                    <details>
                      <summary className="cursor-pointer text-sm text-muted-foreground select-none">
                        Raw JSON
                      </summary>
                      <pre className="mt-3 max-w-full overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs leading-relaxed">
{JSON.stringify(r.data, null, 2)}
                      </pre>
                    </details>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
