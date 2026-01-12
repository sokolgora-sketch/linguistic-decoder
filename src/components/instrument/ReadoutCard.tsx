"use client";

import * as React from "react";
import type { ReadoutModelV0_1, StageFlag } from "@/shared/uiTelemetryContract.v0_1";
import { buildReadoutModelV0_1 } from "@/shared/uiTelemetryContract.v0_1";

// If your project already has shadcn/ui components, keep using them.
// If not, swap for basic divs later.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function badgeClass(status: "RAN" | "SKIPPED" | "FAILED" | "UNKNOWN") {
  switch (status) {
    case "RAN":
      return "bg-emerald-600/20 text-emerald-200 border-emerald-600/40";
    case "SKIPPED":
      return "bg-zinc-600/20 text-zinc-200 border-zinc-600/40";
    case "FAILED":
      return "bg-red-600/20 text-red-200 border-red-600/40";
    case "UNKNOWN":
    default:
      return "bg-amber-600/20 text-amber-200 border-amber-600/40";
  }
}

function StageChip({ s }: { s: StageFlag }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs",
        badgeClass(s.status),
      ].join(" ")}
      title={s.detail ?? undefined}
    >
      <span className="font-medium">{s.label}</span>
      <span className="opacity-80">{s.status}</span>
    </span>
  );
}

function VowelChip({ v }: { v: string }) {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-sm font-semibold text-zinc-100">
      {v}
    </span>
  );
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

export interface ReadoutCardProps {
  result: unknown | null;
  // optional override for summary string if you already compute one elsewhere
  summaryText?: string | null;
  className?: string;
}

export function ReadoutCard(props: ReadoutCardProps) {
  const { result, summaryText, className } = props;

  const model: ReadoutModelV0_1 | null = React.useMemo(() => {
    if (!result) return null;
    return buildReadoutModelV0_1(result);
  }, [result]);

  const jsonText = React.useMemo(() => {
    if (!result) return "";
    try {
      return JSON.stringify(result, null, 2);
    } catch {
      return String(result);
    }
  }, [result]);

  const computedSummary = React.useMemo(() => {
    if (!model) return "";
    // Summary must be strictly derived from model fields (no invention).
    const modeLabel = model.mode === "strict" ? "Strict" : model.mode === "open" ? "Open" : "Unknown";
    const norm = model.normalizedWord ? `normalized="${model.normalizedWord}"` : "normalized=N/A";
    const strictInput = model.strictInput ? `strictInput="${model.strictInput}"` : "strictInput=N/A";
    const path = model.vowelPathText ? `path=${model.vowelPathText}` : "path=NONE";
    const c = `candidates=${model.candidatesCount}`;
    const v = model.engineVersion ? `engine=${model.engineVersion}` : "engine=N/A";
    const ms = model.latencyMs != null ? `${model.latencyMs}ms` : "ms=N/A";
    return `${modeLabel} · ${ms} · ${v} · ${norm} · ${strictInput} · ${path} · ${c}`;
  }, [model]);

  const finalSummary = summaryText ?? computedSummary;

  return (
    <Card className={["bg-zinc-950 text-zinc-100 border-zinc-800", className ?? ""].join(" ")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Readout</CardTitle>
            <div className="mt-1 text-xs text-zinc-400">
              UI contract: <span className="text-zinc-300">{model?.contractVersion ?? "ui-telemetry-v0.1"}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-8 border border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              disabled={!model}
              onClick={() => copyToClipboard(finalSummary)}
              title="Copy deterministic summary line"
            >
              Copy Summary
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="h-8 border border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              disabled={!model}
              onClick={() => copyToClipboard(jsonText)}
              title="Copy full JSON payload"
            >
              Copy JSON
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {!model ? (
          <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-300">
            No result yet. Run an analysis to populate telemetry.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Primary line */}
            <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <div className="font-semibold text-zinc-100">
                  {model.word || "—"}
                </div>

                <div className="text-zinc-300">
                  Mode:{" "}
                  <span className="font-medium text-zinc-100">
                    {model.mode === "strict" ? "Strict" : model.mode === "open" ? "Open" : "Unknown"}
                  </span>
                </div>

                <div className="text-zinc-300">
                  strictInput:{" "}
                  <span className="font-medium text-zinc-100">
                    {model.strictInput ?? "N/A"}
                  </span>
                </div>

                <div className="text-zinc-300">
                  engine:{" "}
                  <span className="font-medium text-zinc-100">
                    {model.engineVersion ?? "N/A"}
                  </span>
                </div>

                <div className="text-zinc-300">
                  latency:{" "}
                  <span className="font-medium text-zinc-100">
                    {model.latencyMs != null ? `${model.latencyMs} ms` : "N/A"}
                  </span>
                </div>

                <div className="text-zinc-300">
                  candidates:{" "}
                  <span className="font-medium text-zinc-100">
                    {model.candidatesCount}
                  </span>
                </div>
              </div>

              {model.normalizedWord && (
                <div className="mt-2 text-xs text-zinc-400">
                  normalizedWord: <span className="text-zinc-200">{model.normalizedWord}</span>
                </div>
              )}
            </div>

            {/* Vowel Path */}
            <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">Vowel Path</div>
                <div
                  className={[
                    "rounded-md border px-2 py-1 text-xs",
                    model.detected
                      ? "border-emerald-700/60 bg-emerald-700/15 text-emerald-200"
                      : "border-amber-700/60 bg-amber-700/15 text-amber-200",
                  ].join(" ")}
                >
                  {model.detected ? "✅ detected" : "⚠️ none"}
                </div>
              </div>

              <div className="mt-2">
                {(() => {
                  const vp = model.vowelPath ?? [];
                  return vp.length ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {vp.map((v, idx) => (
                        <React.Fragment key={`${v}-${idx}`}>
                          <VowelChip v={v} />
                          {idx < vp.length - 1 ? (
                            <span className="text-zinc-500">→</span>
                          ) : null}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-400">No voice path detected.</div>
                  );
                })()}
              </div>
            </div>

            {/* Stage strip */}
            <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-3">
              <div className="text-sm font-medium">What ran?</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {model.stages.map((s) => (
                  <StageChip key={s.id} s={s} />
                ))}
              </div>

              <div className="mt-2 text-xs text-zinc-400">
                ops: <span className="text-zinc-200">{model.opsCount ?? "N/A"}</span> · signals:{" "}
                <span className="text-zinc-200">{model.signalsCount ?? "N/A"}</span>
              </div>
            </div>

            {/* Deterministic summary (copy preview) */}
            <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-3">
              <div className="text-xs text-zinc-400">Summary (deterministic)</div>
              <div className="mt-1 font-mono text-xs text-zinc-200 whitespace-pre-wrap break-words">
                {finalSummary}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ReadoutCard;
