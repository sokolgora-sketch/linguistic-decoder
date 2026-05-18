'use client';

import React from 'react';

type KV = Record<string, unknown>;

function asKV(x: unknown): KV | null {
  if (!x || typeof x !== 'object') return null;
  return x as KV;
}

function pickCounts(readout: unknown): KV | null {
  const r = asKV(readout);
  if (!r) return null;

  // Try the likely shapes without assuming one is canonical.
  const countsRatios = asKV(r["countsRatios"]);

  return (
    asKV(r["counts"]) ||
    (countsRatios ? asKV(countsRatios["counts"]) : null) ||
    asKV(r["summaryCounts"]) ||
    null
  );
}

function pickRatios(readout: unknown): KV | null {
  const r = asKV(readout);
  if (!r) return null;

  const countsRatios = asKV(r["countsRatios"]);

  return (
    asKV(r["ratios"]) ||
    (countsRatios ? asKV(countsRatios["ratios"]) : null) ||
    asKV(r["summaryRatios"]) ||
    null
  );
}

function safeJson(x: unknown): string {
  try {
    return JSON.stringify(x);
  } catch {
    return String(x);
  }
}

function renderValue(v: unknown): string {
  // Simple scalars
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v == null) return '—';

  // PresentOrMissing (POM) humanization
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (o && typeof o["kind"] === 'string') {
      if (o["kind"] === 'present') return String(o["value"] ?? '—');
      if (o["kind"] === 'missing') {
        const miss = typeof o["missing"] === 'string' ? o["missing"] : 'unknown';
        const note = typeof o["note"] === 'string' && o["note"] ? ` — ${o["note"]}` : '';
        return `missing (${miss})${note}`;
      }
    }
  }

  // Fallback: stable stringify (prevents "[object Object]")
  return safeJson(v);
}

function renderKV(obj: KV) {
  const entries = Object.entries(obj);

  if (!entries.length) {
    return <div className="text-sm text-[#7d8ea3]">Not available.</div>;
  }

  return (
    <div className="grid gap-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-3 rounded-[8px] border border-[#27313d] bg-[#0d1117] px-3 py-2">
          <div className="min-w-0 break-words text-sm text-[#8ea4ba]">{k}</div>
          <div className="text-right text-sm font-mono text-[#f5f7fb]">{renderValue(v)}</div>
        </div>
      ))}
    </div>
  );
}

export function CountsRatiosCard(props: { readout: unknown; engineVersion?: string }) {
  const counts = pickCounts(props.readout);
  const ratios = pickRatios(props.readout);

  return (
    <section className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase text-[#8ea4ba]">overview totals</div>
          <div className="mt-1 text-base font-semibold text-[#f5f7fb]">Counts / Ratios</div>
          <div className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
            Humanized VM counts and ratios for this readout. Missing means the engine did not emit that field.
          </div>
        </div>
        {props.engineVersion ? (
          <div className="shrink-0 rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase text-[#cfe6ff]">
            engine={props.engineVersion}
          </div>
        ) : null}
      </div>
      <div className="mt-4 grid gap-4">
        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="mb-3 text-xs font-semibold uppercase text-[#8ea4ba]">Counts</div>
          {counts ? renderKV(counts) : <div className="text-sm text-[#7d8ea3]">Not available.</div>}
        </div>

        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="mb-3 text-xs font-semibold uppercase text-[#8ea4ba]">Ratios</div>
          {ratios ? renderKV(ratios) : <div className="text-sm text-[#7d8ea3]">Not available.</div>}
        </div>
      </div>

      <div className="mt-4 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3 text-[11px] leading-5 text-[#7d8ea3]">
        Boundary: overview metrics only; no score order; no forced answer.
      </div>
    </section>
  );
}
