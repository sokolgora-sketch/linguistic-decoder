"use client";

import React from "react";
import { normalizePrinciplesToLabels } from "@/v1/principles.vocab.v0.1";

type AnyRecord = Record<string, unknown>;

function isRecord(x: unknown): x is AnyRecord {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function asString(x: unknown): string | null {
  return typeof x === "string" ? x : null;
}

function asStringArray(x: unknown): string[] | null {
  if (!Array.isArray(x)) return null;
  if (!x.every((v) => typeof v === "string")) return null;
  return x as string[];
}

function asNumberArray(x: unknown): number[] | null {
  if (!Array.isArray(x)) return null;
  if (!x.every((v) => typeof v === "number")) return null;
  return x as number[];
}

function asNumber(x: unknown): number | null {
  return typeof x === "number" && Number.isFinite(x) ? x : null;
}

export function HeartInstrumentV1Section(props: { data: unknown }) {
  const rec = isRecord(props.data) ? props.data : null;
  if (!rec) return null;

  const basis = asString(rec.basisNfc) || asString(rec.basis) || "—";
  const surfaceVowels = asStringArray(rec.surfaceVowels) || [];
  const spokenVowels = asStringArray(rec.canonicalSpokenVoicePath);
  const principlesPathRaw = asStringArray(rec.principlesPath) || [];
  const spokenPrinciplesPathRaw = asStringArray(rec.spokenPrinciplesPath) || [];
  const principlesPath = normalizePrinciplesToLabels(principlesPathRaw);
  const spokenPrinciplesPath = normalizePrinciplesToLabels(spokenPrinciplesPathRaw);

  const math7 = isRecord(rec.spokenMath7) ? rec.spokenMath7 : null;

  const values1to7 = math7 ? asNumberArray(math7.values1to7) || [] : [];

  // These come from the embedded spoken-derived Math7 packet.
  const total1to7 = math7 ? asNumber((math7 as any).total1to7) : null;
  const totalMod7 = math7 ? asNumber((math7 as any).totalMod7) : null;

  const wrapCount = math7 ? asNumber((math7 as any).wrapCount) : null;
  const jumps = math7 ? asNumberArray((math7 as any).jumps) || [] : [];
  const events = math7 ? asStringArray((math7 as any).events) || [] : [];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold">Heart Instrument</div>
          <div className="mt-1 text-xs text-gray-400">
            Basis: <span className="text-gray-200">{basis}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs text-gray-400">Spoken / canonical Voice path</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {spokenVowels?.length ? (
              spokenVowels.map((v, i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                  {v}
                </span>
              ))
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Orthographic vowels (non-authoritative): {surfaceVowels.length ? surfaceVowels.join(" ") : "—"}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs text-gray-400">Spoken principles path</div>
          <div className="mt-1">
            {spokenPrinciplesPath.length ? (
              <div className="text-sm">{spokenPrinciplesPath.join(" → ")}</div>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Orthographic principles (compatibility only): {principlesPath.length ? principlesPath.join(" → ") : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="text-xs text-gray-400">Math7 (spoken-derived)</div>

        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <div>
            <span className="text-gray-400">spokenTotal1to7:</span>{" "}
            <span className="text-gray-200">{total1to7 ?? "—"}</span>
          </div>
          <div>
            <span className="text-gray-400">spokenTotalMod7:</span>{" "}
            <span className="text-gray-200">{totalMod7 ?? "—"}</span>
          </div>
          <div>
            <span className="text-gray-400">wrapCount:</span>{" "}
            <span className="text-gray-200">{wrapCount ?? "—"}</span>
          </div>
        </div>

        <div className="mt-2">
          <div className="text-xs text-gray-400">values1to7</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {values1to7.length ? (
              values1to7.map((n, i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                  {n}
                </span>
              ))
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>
        </div>

        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-gray-400">jumps</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {jumps.length ? (
                jumps.map((n, i) => (
                  <span key={i} className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                    {n}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">events</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {events.length ? (
                events.map((e, i) => (
                  <span key={i} className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                    {e}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer select-none text-xs text-gray-400">Raw heartInstrumentV1 JSON</summary>
        <pre className="mt-2 overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-gray-200">
{JSON.stringify(props.data, null, 2)}
        </pre>
      </details>
    </section>
  );
}
