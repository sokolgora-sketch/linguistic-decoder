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
    return <div className="text-sm text-slate-500">Not available.</div>;
  }

  return (
    <div className="grid gap-1">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-3">
          <div className="text-sm text-slate-500">{k}</div>
          <div className="text-sm font-mono text-slate-200">{renderValue(v)}</div>
        </div>
      ))}
    </div>
  );
}

export function CountsRatiosCard(props: { readout: unknown; engineVersion?: string }) {
  const counts = pickCounts(props.readout);
  const ratios = pickRatios(props.readout);

  return (
    <section className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div>
        <div className="text-sm font-semibold text-slate-100">Counts / Ratios</div>
        {props.engineVersion ? (
          <div className="mt-1 text-xs text-slate-500">engine: {props.engineVersion}</div>
        ) : null}
      </div>
      <div className="mt-4 grid gap-4">
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-300">Counts</div>
          {counts ? renderKV(counts) : <div className="text-sm text-slate-500">Not available.</div>}
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-slate-300">Ratios</div>
          {ratios ? renderKV(ratios) : <div className="text-sm text-slate-500">Not available.</div>}
        </div>
      </div>
    </section>
  );
}
