"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function isObj(x: unknown): x is Record<string, any> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function safeGet(root: any, path: string[]): any {
  let cur = root;
  for (const k of path) {
    if (!isObj(cur)) return undefined;
    cur = cur[k];
  }
  return cur;
}

function asStringArray(x: unknown): string[] | null {
  if (!Array.isArray(x)) return null;
  const out = x.filter((v) => typeof v === "string" && v.length > 0);
  return out.length ? out : null;
}

function asUnknownArray(x: unknown): any[] | null {
  if (!Array.isArray(x)) return null;
  return x;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-3 py-2">
      <div className="col-span-12 md:col-span-3 text-xs text-zinc-400">{label}</div>
      <div className="col-span-12 md:col-span-9 text-sm text-zinc-100">{children}</div>
    </div>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200">
      {text}
    </span>
  );
}

export interface EvidenceCardProps {
  result: unknown | null;
  className?: string;
}

export default function EvidenceCard({ result, className }: EvidenceCardProps) {
  const evidence =
    safeGet(result, ["evidence"]) ??
    safeGet(result, ["raw", "evidence"]) ??
    null;

  const basis =
    (typeof safeGet(evidence, ["basis"]) === "string" ? safeGet(evidence, ["basis"]) : null) ??
    null;

  const normalizationSteps = asStringArray(safeGet(evidence, ["normalizationSteps"])) ?? [];
  const ops = asUnknownArray(safeGet(evidence, ["ops"])) ?? [];
  const signals = asStringArray(safeGet(evidence, ["signals"])) ?? [];

  const cacheHit = safeGet(evidence, ["cacheHit"]);
  const recomputed = safeGet(evidence, ["recomputed"]);
  const solveMs = safeGet(evidence, ["solveMs"]);

  const hasAny =
    !!basis ||
    normalizationSteps.length > 0 ||
    ops.length > 0 ||
    signals.length > 0 ||
    typeof cacheHit === "boolean" ||
    typeof recomputed === "boolean" ||
    typeof solveMs === "number";

  return (
    <Card className={["bg-zinc-950 text-zinc-100 border-zinc-800", className ?? ""].join(" ")}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Evidence</CardTitle>
        <div className="mt-1 text-xs text-zinc-400">
          Deterministic ledger. No inference. Empty states are explicit.
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {!result ? (
          <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-300">
            No result yet.
          </div>
        ) : !hasAny ? (
          <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-300">
            Evidence not available in this engine version.
          </div>
        ) : (
          <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-3">
            <Row label="basis">
              {basis ? <span className="font-mono text-xs">{basis}</span> : <span className="text-zinc-400">None</span>}
            </Row>

            <div className="border-t border-zinc-800 my-1" />

            <Row label="normalization">
              {normalizationSteps.length ? (
                <div className="flex flex-wrap gap-2">
                  {normalizationSteps.map((s, i) => (
                    <Pill key={`${s}-${i}`} text={s} />
                  ))}
                </div>
              ) : (
                <span className="text-zinc-400">None</span>
              )}
            </Row>

            <Row label="ops">
              {ops.length ? (
                <div className="space-y-2">
                  {ops.map((op, i) => (
                    <pre
                      key={i}
                      className="whitespace-pre-wrap break-words rounded-md border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200"
                    >
                      {JSON.stringify(op, null, 2)}
                    </pre>
                  ))}
                </div>
              ) : (
                <span className="text-zinc-400">None</span>
              )}
            </Row>

            <Row label="signals">
              {signals.length ? (
                <div className="flex flex-wrap gap-2">
                  {signals.map((s, i) => (
                    <Pill key={`${s}-${i}`} text={s} />
                  ))}
                </div>
              ) : (
                <span className="text-zinc-400">None</span>
              )}
            </Row>

            <div className="border-t border-zinc-800 my-1" />

            <Row label="compute">
              <div className="flex flex-wrap gap-2">
                <Pill text={`cacheHit=${typeof cacheHit === "boolean" ? cacheHit : "N/A"}`} />
                <Pill text={`recomputed=${typeof recomputed === "boolean" ? recomputed : "N/A"}`} />
                <Pill text={`solveMs=${typeof solveMs === "number" ? solveMs : "N/A"}`} />
              </div>
            </Row>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
