"use client";

import React from "react";
import type { TelemetryReadout, PresentOrMissing, Vowel } from "../types";

function renderPOM<T>(
  pom: PresentOrMissing<T>,
  renderValue: (v: T) => React.ReactNode,
  fallbackLabel = "Not emitted by engine (yet)."
) {
  if (pom.kind === "present") return renderValue(pom.value);
  return (
    <span className="text-muted-foreground">
      {fallbackLabel}
      {pom.note ? <span className="ml-2 opacity-70">({pom.note})</span> : null}
    </span>
  );
}

function VowelChip({ v }: { v: Vowel }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-mono">
      {v}
    </span>
  );
}

export function ReadoutCard({
  readout,
  onCopySummary,
  onCopyFullJson,
}: {
  readout: TelemetryReadout;
  onCopySummary: () => void;
  onCopyFullJson: () => void;
}) {
  const statusBadge =
    readout.status === "detected"
      ? "Detected"
      : readout.status === "none"
        ? "None"
        : "Error";

  return (
    <div className="rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Readout</div>
          <div className="text-lg font-semibold">{readout.word}</div>
          <div className="mt-1 text-sm font-mono">
            normalized:{" "}
            {renderPOM(readout.normalizedWord, (v) => <span>{String(v)}</span>)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border px-2 py-1 text-xs">
            {statusBadge}
          </span>
          <button
            className="rounded-md border px-3 py-1 text-sm"
            onClick={onCopySummary}
          >
            Copy Summary
          </button>
          <button
            className="rounded-md border px-3 py-1 text-sm"
            onClick={onCopyFullJson}
          >
            Copy Full JSON
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground">Run context</div>
          <div className="mt-2 space-y-1 text-sm font-mono">
            <div>
              mode: {renderPOM(readout.mode, (v) => <span>{String(v)}</span>)}
            </div>
            <div>
              strictInput:{" "}
              {renderPOM(
                readout.strictInput,
                (v) => <span>{String(v)}</span>,
                "Not emitted by engine (yet). (UI may derive from mode)"
              )}
            </div>
            <div>
              alphabet:{" "}
              {renderPOM(readout.alphabet, (v) => <span>{String(v)}</span>)}
            </div>
            <div>
              engine:{" "}
              {renderPOM(readout.engineVersion, (v) => <span>{String(v)}</span>)}
            </div>
            <div>
              created:{" "}
              {renderPOM(readout.createdAt, (v) => <span>{String(v)}</span>)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground">Detection</div>
          <div className="mt-2 text-sm font-mono">
            voicePath:{" "}
            {renderPOM(
              readout.voicePath,


                
              (path) => (
                <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
                  {path.map((v, idx) => (
                    <VowelChip key={`${v}-${idx}`} v={v} />
                  ))}
                </span>
              ),
              "No voice path detected"
            )}

            {/* Voice path (surface vs functional) */}
            <div className="mt-2 text-xs opacity-80 space-y-1">
              <div>
                Voice path (surface):{" "}
                {readout.voicePathSurface?.kind === "present"
                  ? readout.voicePathSurface.value.join("-")
                  : "not_emitted"}
              </div>
              <div>
                Voice path (functional):{" "}
                {readout.voicePathFunctional?.kind === "present"
                  ? readout.voicePathFunctional.value.join("-")
                  : "not_emitted"}
              </div>
              <div>
                Delta:{" "}
                {readout.voicePathSurface?.kind === "present" &&
                readout.voicePathFunctional?.kind === "present"
                  ? (readout.voicePathSurface.value.join("-") ===
                    readout.voicePathFunctional.value.join("-")
                      ? "MATCH"
                      : "DIVERGE")
                  : "—"}
              </div>
            </div>
            </div>

            <div className="mt-3 text-sm font-mono">
            principles:{" "}
            {renderPOM(
              readout.principlesPath,
              (arr) => <span>{arr.join(" → ")}</span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-mono">
            <div>candidates: {readout.counts.candidates}</div>
            <div>
              ops: {renderPOM(readout.counts.ops, (n) => <span>{n}</span>)}
            </div>
            <div>
              notes: {renderPOM(readout.counts.notes, (n) => <span>{n}</span>)}
            </div>
            <div>
              signals:{" "}
              {renderPOM(readout.counts.signals, (n) => <span>{n}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
