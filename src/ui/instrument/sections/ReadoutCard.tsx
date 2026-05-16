"use client";

import React from "react";
import type { TelemetryReadout, PresentOrMissing, Vowel } from "../../telemetry/types";
import { VoicePathCompare } from "../VoicePathCompare";
import { PhoneticIpaPanelV0_1 } from "./PhoneticIpaPanel.v0.1";

function renderPOM<T>(
  pom: PresentOrMissing<T>,
  renderValue: (v: T) => React.ReactNode,
  fallbackLabel = "Not emitted by engine (yet)."
) {
  if (pom.kind === "present") return renderValue(pom.value);
  return (
    <span className="text-slate-500">
      {fallbackLabel}
      {pom.note ? <span className="ml-2 text-slate-600">({pom.note})</span> : null}
    </span>
  );
}

function VowelChip({ v }: { v: Vowel }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border border-blue-400/40 bg-blue-500/10 px-2 py-0.5 text-xs font-mono text-blue-100">
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
  onCopyFullJson?: () => void;
}) {
  const statusBadge =
    readout.status === "detected" ? "Detected" : readout.status === "none" ? "None" : "Error";

  const phoneticIpaPOM = readout.phoneticIpaV0_1;

  return (
    <div className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-sm text-slate-500">Readout</div>
          <div className="text-lg font-semibold text-slate-100">{readout.word}</div>
          <div className="mt-1 text-sm font-mono text-slate-300">
            normalized: {renderPOM(readout.normalizedWord, (v) => <span>{String(v)}</span>)}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-green-400/40 bg-green-500/10 px-2 py-1 text-xs font-mono text-green-100">{statusBadge}</span>
          <button
            type="button"
            className="rounded-md border border-blue-400/50 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
            onClick={onCopySummary}
          >
            Copy Summary
          </button>
          {onCopyFullJson ? (
            <button
              type="button"
              className="rounded-md border border-slate-700 bg-slate-900/70 px-3 py-1 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              onClick={onCopyFullJson}
            >
              Copy Full JSON
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-black/25 p-3">
          <div className="text-xs text-slate-500">Run context</div>
          <div className="mt-2 space-y-1 text-sm font-mono text-slate-300">
            <div>mode: {renderPOM(readout.mode, (v) => <span>{String(v)}</span>)}</div>
            <div>
              strictInput:{" "}
              {renderPOM(
                readout.strictInput,
                (v) => <span>{String(v)}</span>,
                "Not emitted by engine (yet). (UI may derive from mode)"
              )}
            </div>
            <div>alphabet: {renderPOM(readout.alphabet, (v) => <span>{String(v)}</span>)}</div>
            <div>engine: {renderPOM(readout.engineVersion, (v) => <span>{String(v)}</span>)}</div>
            <div>created: {renderPOM(readout.createdAt, (v) => <span>{String(v)}</span>)}</div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-black/25 p-3">
          <div className="text-xs text-slate-500">Detection</div>
          <div className="mt-2 text-sm font-mono text-slate-300">
            <div>
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
            </div>

            <VoicePathCompare surface={readout.voicePathSurface} functional={readout.voicePathFunctional} />

            <div className="mt-3">
              principles: {renderPOM(readout.principlesPath, (arr) => <span>{arr.join(" → ")}</span>)}
            </div>

            <div className="mt-3">
              <div className="text-xs text-slate-500">Phonetic IPA</div>
              <div className="mt-2">
                <PhoneticIpaPanelV0_1 pom={phoneticIpaPOM} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>candidates: {readout.counts.candidates}</div>
              <div>ops: {renderPOM(readout.counts.ops, (n) => <span>{n}</span>)}</div>
              <div>notes: {renderPOM(readout.counts.notes, (n) => <span>{n}</span>)}</div>
              <div>signals: {renderPOM(readout.counts.signals, (n) => <span>{n}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
