"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Row =
  | {
      word: string;
      ok: true;
      engineVersion?: string;
      runs: number;
      distinct: number;
      verdict: "PASS" | "FAIL";
      baselineHash: string;
      mismatch?: { runIndex: number; hash: string };
      msAvg: number;
      msMax: number;
    }
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

export default function DeterminismComparatorPanel() {
  const [wordsText, setWordsText] = useState<string>(["study", "love", "hope", "damage", "father"].join("\n"));
  const words = useMemo(
    () =>
      wordsText
        .split(/\r?\n/g)
        .map((s) => s.trim())
        .filter(Boolean),
    [wordsText]
  );

  const [runsPerWord, setRunsPerWord] = useState<number>(10);
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    const next: Row[] = [];

    for (const w of words) {
      const t0 = performance.now();

      try {
        const canonicalByRun: string[] = [];
        const hashByRun: string[] = [];
        const msByRun: number[] = [];
        let engineVersion: string | undefined;

        for (let i = 0; i < runsPerWord; i++) {
          const t1 = performance.now();
          const res = await fetch(`/api/analyze-v1?word=${encodeURIComponent(w)}&mode=strict`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const ms = Math.round(performance.now() - t1);
          msByRun.push(ms);

          if (!res.ok) {
            const txt = await res.text().catch(() => "");
            throw new Error(`HTTP ${res.status} ${res.statusText}${txt ? ` — ${txt}` : ""}`);
          }

          const data = await res.json();
          engineVersion = engineVersion ?? data?.engineVersion;

          const canonical = stableStringify(data);
          const hash = await sha256Hex(canonical);

          canonicalByRun.push(canonical);
          hashByRun.push(hash);
        }

        const baseline = hashByRun[0] ?? "";
        const distinct = new Set(hashByRun).size;

        let mismatch: { runIndex: number; hash: string } | undefined;
        for (let i = 1; i < hashByRun.length; i++) {
          if (hashByRun[i] !== baseline) {
            mismatch = { runIndex: i + 1, hash: hashByRun[i] };
            break;
          }
        }

        const msAvg = Math.round(msByRun.reduce((a, b) => a + b, 0) / Math.max(1, msByRun.length));
        const msMax = msByRun.reduce((a, b) => Math.max(a, b), 0);

        next.push({
          word: w,
          ok: true,
          engineVersion,
          runs: runsPerWord,
          distinct,
          verdict: mismatch ? "FAIL" : "PASS",
          baselineHash: baseline,
          mismatch,
          msAvg,
          msMax,
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
  const allPass = okRows.length > 0 && okRows.every((r) => r.verdict === "PASS");
  const verdict = rows.length === 0 ? "—" : allOk && allPass ? "PASS" : "REVIEW";

  return (
    <Card className="border-white/10 bg-zinc-950/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-base">Determinism Comparator</CardTitle>
        <CardDescription>
          Re-run each word N times (strict), stable-stringify + SHA-256, then compare hashes per word.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] items-end">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Word set (one per line)</div>
            <Textarea
              value={wordsText}
              onChange={(e) => setWordsText(e.target.value)}
              className="min-h-[120px] bg-black/30"
              spellCheck={false}
            />
          </div>

          <div className="md:pl-2">
            <div className="text-xs text-muted-foreground mb-1">Runs per word</div>
            <Input
              value={String(runsPerWord)}
              onChange={(e) => {
                const v = Number(e.target.value || 1);
                setRunsPerWord(Math.max(2, Math.min(50, Number.isFinite(v) ? v : 10)));
              }}
              className="h-10 w-28"
              inputMode="numeric"
            />
          </div>

          <div className="flex gap-2 md:justify-end">
            <Button onClick={run} disabled={running || words.length === 0} aria-busy={running ? "true" : "false"}>
              {running ? "Running…" : "Run compare"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => downloadJson("zero-determinism-compare.json", { words, runsPerWord, rows })}
              disabled={rows.length === 0}
            >
              Export JSON
            </Button>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="rounded-lg border border-white/10 bg-zinc-950/30 p-3 text-sm">
            <div className="flex flex-wrap gap-3 items-center">
              <span>
                Words: <span className="font-semibold">{words.length}</span>
              </span>
              <span>
                Runs/word: <span className="font-semibold">{runsPerWord}</span>
              </span>
              <span>
                OK: <span className="font-semibold">{rows.filter((r) => r.ok).length}</span>
              </span>
              <span>
                Errors: <span className="font-semibold">{rows.filter((r) => !r.ok).length}</span>
              </span>
              <span className="ml-auto">
                Verdict:{" "}
                <span className={verdict === "PASS" ? "font-semibold text-emerald-300" : "font-semibold text-yellow-200"}>
                  {verdict}
                </span>
              </span>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="space-y-2">
            {rows.map((r) => (
              <Card key={r.word} className="border-white/10 bg-zinc-950/30">
                <CardHeader className="py-4">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="font-semibold">{r.word}</span>
                    {"ms" in r ? (
                      <span className="text-xs text-muted-foreground">
                        {(() => {
  const anyR: any = r as any;
  if (typeof anyR.msAvg === "number" && typeof anyR.msMax === "number") {
    return `${anyR.msAvg}ms avg · ${anyR.msMax}ms max`;
  }
  if (typeof anyR.ms === "number") return `${anyR.ms}ms`;
  if (typeof anyR.ms === "string") return anyR.ms;
  return "";
})()}
                      </span>
                    ) : null}
                  </CardTitle>

                  <CardDescription className="space-y-1">
                    {r.ok ? (
                      <>
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge variant={r.verdict === "PASS" ? "secondary" : "destructive"} className="text-xs">
                            {r.verdict}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            distinct hashes: <span className="font-semibold">{r.distinct}</span> / {r.runs}
                          </span>
                          {r.engineVersion ? (
                            <span className="text-xs text-muted-foreground">
                              · engine: <span className="font-mono">{r.engineVersion}</span>
                            </span>
                          ) : null}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          baseline: <span className="font-mono">{r.baselineHash.slice(0, 16)}</span>
                          {r.mismatch ? (
                            <>
                              {" "}
                              · mismatch run #{r.mismatch.runIndex}:{" "}
                              <span className="font-mono">{r.mismatch.hash.slice(0, 16)}</span>
                            </>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <span className="text-red-200">Error: {r.error}</span>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
