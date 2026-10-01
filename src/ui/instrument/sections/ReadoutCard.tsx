"use client";

import React from "react";
import type {
  TelemetryReadout,
  PresentOrMissing,
  SpokenPronunciationProvenanceV0_1VM,
  Vowel,
} from "../../telemetry/types";
import { VoicePathCompare } from "../VoicePathCompare";
import { PhoneticIpaPanelV0_1 } from "./PhoneticIpaPanel.v0.1";

function renderPOM<T>(
  pom: PresentOrMissing<T> | undefined,
  renderValue: (v: T) => React.ReactNode,
  fallbackLabel = "Not emitted by engine (yet)."
) {
  if (!pom) {
    return <span className="text-slate-500">{fallbackLabel}</span>;
  }
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

function pomSummary<T>(
  pom: PresentOrMissing<T>,
  renderValue: (v: T) => string = (v) => String(v),
  fallbackLabel = "not emitted"
) {
  return pom.kind === "present" ? renderValue(pom.value) : fallbackLabel;
}

function StatusChip({ label, tone = "neutral" }: { label: string; tone?: "green" | "blue" | "neutral" }) {
  const toneClass =
    tone === "green"
      ? "border-[#2f5a3d] bg-[#101712] text-[#b7d8c1]"
      : tone === "blue"
        ? "border-[#355a7a] bg-[#111a24] text-[#cfe6ff]"
        : "border-[#303a45] bg-[#0d1117] text-[#d7dde7]";

  return (
    <span className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase ${toneClass}`}>
      {label}
    </span>
  );
}

function pronunciationVariantStatus(value: SpokenPronunciationProvenanceV0_1VM): string {
  if (value.status === "defined") {
    return value.variants.length === 1
      ? "single variant accepted"
      : `${value.variants.length} variants agree on the canonical path`;
  }

  if (value.reasonCode === "PRONUNCIATION_VARIANT_AMBIGUOUS") {
    return `${value.variants.length} variants unresolved; no winner selected`;
  }

  if (!value.variants.length) return "no pronunciation variant";
  return `${value.variants.length} variants; spoken path is Null`;
}

function spokenPathText(path: Vowel[] | null): string {
  return path?.length ? path.join(" → ") : "Null";
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
    <div className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase text-[#8ea4ba]">overview readout</div>
          <div className="mt-1 text-base font-semibold text-[#f5f7fb]">Readout</div>
          <div className="mt-1 break-words text-lg font-semibold text-[#f5f7fb]">{readout.word}</div>
          <div className="mt-1 text-sm font-mono text-[#d7dde7]">
            normalized: {renderPOM(readout.normalizedWord, (v) => <span>{String(v)}</span>)}
          </div>
          <div className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
            VM-backed readout for the current word. Use Evidence for handoff text and Advanced for raw audit payloads.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusChip label={`status=${statusBadge.toLowerCase()}`} tone={readout.status === "detected" ? "green" : "neutral"} />
          <StatusChip label={`mode=${pomSummary(readout.mode)}`} tone="blue" />
          <StatusChip label={`engine=${pomSummary(readout.engineVersion)}`} />
          <button
            type="button"
            className="rounded-[8px] border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
            onClick={onCopySummary}
          >
            Copy Summary
          </button>
          {onCopyFullJson ? (
            <button
              type="button"
              className="rounded-[8px] border border-[#303a45] bg-[#0d1117] px-3 py-1.5 text-sm font-semibold text-[#d7dde7] transition hover:border-[#4b5b6c] hover:bg-[#151b24]"
              onClick={onCopyFullJson}
            >
              Copy Full JSON
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="text-xs font-semibold uppercase text-[#8ea4ba]">Run context</div>
          <div className="mt-2 space-y-1 text-sm font-mono text-[#d7dde7]">
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

        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="text-xs font-semibold uppercase text-[#8ea4ba]">Detection</div>
          <div className="mt-2 text-sm font-mono text-[#d7dde7]">
            <div>
              Spoken / canonical Voice path:{" "}
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

            <div
              data-testid="spoken-pronunciation-provenance"
              className="mt-3 rounded-[9px] border border-[#355a7a] bg-[#111a24] p-3 text-xs text-[#d7dde7]"
            >
              <div className="font-semibold uppercase tracking-[0.12em] text-[#8ea4ba]">
                Spoken pronunciation authority
              </div>
              {renderPOM(
                readout.spokenPronunciation,
                (pronunciation) => (
                  <div className="mt-2 space-y-1.5 font-mono">
                    <div>source profile: {pronunciation.sourceProfileId}</div>
                    <div>notation: {pronunciation.sourceNotation}</div>
                    <div>source revision: {pronunciation.sourceRevision}</div>
                    <div>variant status: {pronunciationVariantStatus(pronunciation)}</div>
                    <div>
                      pronunciation: {pronunciation.variants.length
                        ? pronunciation.variants
                            .map((variant) => `${variant.sourceForm}: ${variant.sourcePronunciation}`)
                            .join(" | ")
                        : "Null"}
                    </div>
                    {pronunciation.status === "null" ? (
                      <div className="text-amber-200">
                        spoken path: Null ({pronunciation.reasonCode ?? "reason not emitted"})
                      </div>
                    ) : (
                      <div className="text-emerald-200">
                        spoken path: {spokenPathText(readout.voicePath.kind === "present" ? readout.voicePath.value : null)}
                      </div>
                    )}
                  </div>
                ),
                "Spoken pronunciation provenance not emitted"
              )}
              <div className="mt-2 text-[11px] leading-5 text-[#9fb1bf]">
                This source establishes pronunciation evidence only. Orthographic vowels remain separate compatibility evidence and are not spoken authority.
              </div>
            </div>

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

      <div className="mt-4 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3 text-[11px] leading-5 text-[#7d8ea3]">
        Boundary: deterministic readout only; spoken/canonical and candidate paths are not word-specific functional evidence; no origin proof; no forced answer.
      </div>
    </div>
  );
}
