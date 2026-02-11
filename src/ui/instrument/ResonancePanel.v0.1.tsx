'use client';

import React from "react";

type Maybe<T> =
  | { kind: "present"; value: T }
  | { kind: "missing"; missing: "not_emitted" | "malformed" | "unknown"; note?: string };

type ResonanceBucketCounts = { source?: unknown; boundary?: unknown; manifest?: unknown };

type ResonanceSection = {
  vowels?: unknown;
  signature?: unknown;
  polaritySymbol?: unknown;
  bucketCounts?: ResonanceBucketCounts;
  transitions?: unknown;
};

type ResonanceProfileV1 = {
  version?: unknown;
  surface?: ResonanceSection;
  normalized?: ResonanceSection;
};

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono">
      {label}
    </span>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-xs text-neutral-500">{k}</div>
      <div className="text-xs">{v}</div>
    </div>
  );
}

export function ResonancePanelV01(props: { resonanceProfileV1: Maybe<ResonanceProfileV1> }) {
  const m: Maybe<ResonanceProfileV1> =
      props.resonanceProfileV1 ??
      { kind: "missing", missing: "not_emitted", note: "resonanceProfileV1" };

  if (m.kind !== "present") {
    return (
      <div className="rounded-lg border p-3">
        <div className="text-sm font-semibold">Resonance</div>
        <div className="mt-2 text-xs text-neutral-500">
          Missing: {m.missing}{m.note ? ` — ${m.note}` : ""}
        </div>
      </div>
    );
  }

  const rp = m.value ?? {};
  const surface = rp.surface ?? {};
  const normalized = rp.normalized ?? {};

  const surfaceVowels: string[] = Array.isArray(surface.vowels) ? surface.vowels.map(String) : [];
  const normVowels: string[] = Array.isArray(normalized.vowels) ? normalized.vowels.map(String) : [];

  const surfaceSig = String(surface.signature ?? "UNKNOWN");
  const normSig = String(normalized.signature ?? "UNKNOWN");

  const surfacePol = String(surface.polaritySymbol ?? "∅");
  const normPol = String(normalized.polaritySymbol ?? "∅");

  const surfaceCounts = surface.bucketCounts ?? {};
  const normCounts = normalized.bucketCounts ?? {};

  const surfaceTrans: string[] = Array.isArray(surface.transitions) ? surface.transitions.map(String) : [];
  const normTrans: string[] = Array.isArray(normalized.transitions) ? normalized.transitions.map(String) : [];

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-semibold">Resonance</div>
        <div className="text-xs text-neutral-500 font-mono">v{String(rp.version ?? "0.1")}</div>
      </div>

      <div className="mt-3 grid gap-3">
        <div className="grid gap-2">
          <div className="text-xs font-semibold">Surface</div>
          <Row
            k="Vowels"
            v={
              <div className="flex flex-wrap gap-1 justify-end">
                {surfaceVowels.length ? surfaceVowels.map((v, i) => <Chip key={i} label={v} />) : <span className="text-neutral-500">—</span>}
              </div>
            }
          />
          <Row k="Signature" v={<span className="font-mono">{surfaceSig}</span>} />
          <Row k="Polarity" v={<span className="font-mono">{surfacePol}</span>} />
          <Row
            k="Buckets"
            v={
              <span className="font-mono">
                s:{Number(surfaceCounts.source ?? 0)} b:{Number(surfaceCounts.boundary ?? 0)} m:{Number(surfaceCounts.manifest ?? 0)}
              </span>
            }
          />
          <Row
            k="Transitions"
            v={
              <span className="font-mono">
                {surfaceTrans.length ? surfaceTrans.join(", ") : "—"}
              </span>
            }
          />
        </div>

        <div className="grid gap-2 border-t pt-3">
          <div className="text-xs font-semibold">Normalized</div>
          <Row
            k="Vowels"
            v={
              <div className="flex flex-wrap gap-1 justify-end">
                {normVowels.length ? normVowels.map((v, i) => <Chip key={i} label={v} />) : <span className="text-neutral-500">—</span>}
              </div>
            }
          />
          <Row k="Signature" v={<span className="font-mono">{normSig}</span>} />
          <Row k="Polarity" v={<span className="font-mono">{normPol}</span>} />
          <Row
            k="Buckets"
            v={
              <span className="font-mono">
                s:{Number(normCounts.source ?? 0)} b:{Number(normCounts.boundary ?? 0)} m:{Number(normCounts.manifest ?? 0)}
              </span>
            }
          />
          <Row
            k="Transitions"
            v={
              <span className="font-mono">
                {normTrans.length ? normTrans.join(", ") : "—"}
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}
