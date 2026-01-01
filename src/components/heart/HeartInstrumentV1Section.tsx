"use client";

import React from "react";

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

export function HeartInstrumentV1Section(props: { data: unknown }) {
  const rec = isRecord(props.data) ? props.data : null;
  if (!rec) return null;

  const basis = asString(rec.basisNfc) || asString(rec.basis) || "—";
  const surfaceVowels = asStringArray(rec.surfaceVowels) || [];
  const principlesPath = asStringArray(rec.principlesPath) || [];

  const math7 = isRecord(rec.math7) ? rec.math7 : (isRecord(rec.surfaceMath7) ? rec.surfaceMath7 : null);
  const values1to7 = math7 ? (asNumberArray(math7.values1to7) || []) : [];
  const total1to7 = math7 && typeof math7.total1to7 === "number" ? math7.total1to7 : null;
  const totalMod7 = math7 && typeof math7.totalMod7 === "number" ? math7.totalMod7 : null;
  const wrapCount = math7 && typeof math7.wrapCount === "number" ? math7.wrapCount : null;
  const jumps = math7 ? (asNumberArray(math7.jumps) || []) : [];
  const events = math7 ? (asStringArray(math7.events) || []) : [];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold">Heart Instrument</div>
          <div className="mt-1 text-xs text-gray-400">Basis: <span className="text-gray-200">{basis}</span></div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs text-gray-400">Surface vowels</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {surfaceVowels.length ? surfaceVowels.map((v, i) => (
              <span key={i} className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                {v}
              </span>
            )) : <span className="text-gray-500">—</span>}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs text-gray-400">Principles path</div>
          <div className="mt-1">
            {principlesPath.length ? (
              <div className="text-sm">{principlesPath.join(" → ")}</div>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="text-xs text-gray-400">Math7</div>

        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <div><span className="text-gray-400">total1to7:</span> <span className="text-gray-200">{total1to7 ?? "—"}</span></div>
          <div><span className="text-gray-400">totalMod7:</span> <span className="text-gray-200">{totalMod7 ?? "—"}</span></div>
          <div><span className="text-gray-400">wrapCount:</span> <span className="text-gray-200">{wrapCount ?? "—"}</span></div>
        </div>

        <div className="mt-2">
          <div className="text-xs text-gray-400">values1to7</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {values1to7.length ? values1to7.map((n, i) => (
              <span key={i} className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                {n}
              </span>
            )) : <span className="text-gray-500">—</span>}
          </div>
        </div>

        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-gray-400">jumps</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {jumps.length ? jumps.map((n, i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                  {n}
                </span>
              )) : <span className="text-gray-500">—</span>}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">events</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {events.length ? events.map((e, i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-xs">
                  {e}
                </span>
              )) : <span className="text-gray-500">—</span>}
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
