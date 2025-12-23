"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Mode = "strict" | "open";

const CANON: Array<{ label: string; word: string; mode: Mode }> = [
  { label: "study (strict)", word: "study", mode: "strict" },
  { label: "damage (strict)", word: "damage", mode: "strict" },
  { label: "love (open)", word: "love", mode: "open" },
];

export default function ContractDemoPanel() {
  const [running, setRunning] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);
  const [data, setData] = React.useState<any>(null);

  async function run(word: string, mode: Mode) {
    setRunning(`${word}:${mode}`);
    setErr(null);
    setData(null);

    try {
      const url = `/api/analyze-v1?word=${encodeURIComponent(word)}&mode=${mode}`;
      const res = await fetch(url, { method: "GET" });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = (json && (json.error || json.message)) || `HTTP ${res.status}`;
        throw new Error(String(msg));
      }

      setData(json);
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setRunning(null);
    }
  }

  function copyJson() {
    if (!data) return;
    void navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }

  const engineVersion = data?.engineVersion ?? data?.heart?.engineVersion ?? "";
  const mode = data?.mode ?? data?.heart?.mode ?? "";
  const alphabet = data?.alphabet ?? data?.heart?.alphabet ?? "";

  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Contract Demo (v1)</div>
          <div className="text-xs text-muted-foreground">
            Canon runs against <span className="font-mono">/api/analyze-v1</span>.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CANON.map((c) => (
            <Button
              key={c.label}
              variant="secondary"
              onClick={() => void run(c.word, c.mode)}
              disabled={!!running}
            >
              {running === `${c.word}:${c.mode}` ? "Running…" : c.label}
            </Button>
          ))}
          <Button variant="outline" onClick={copyJson} disabled={!data}>
            Copy JSON
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <Badge variant="outline">engineVersion: {engineVersion || "—"}</Badge>
        <Badge variant="outline">mode: {mode || "—"}</Badge>
        <Badge variant="outline">alphabet: {alphabet || "—"}</Badge>
      </div>

      {err ? (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
          {err}
        </div>
      ) : null}

      {data ? (
        <pre className="mt-3 max-h-[420px] overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-white/85">
{JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-muted-foreground">
          Run a canon word to view payload JSON here.
        </div>
      )}
    </div>
  );
}
