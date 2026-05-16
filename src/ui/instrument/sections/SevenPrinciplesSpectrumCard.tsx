'use client';

import React from "react";

type MissingReason = "not_emitted" | "malformed" | "unknown";
type Present<T> = { kind: "present"; value: T };
type Missing = { kind: "missing"; missing: MissingReason; note?: string };
type PresentOrMissing<T> = Present<T> | Missing;

type SpectrumSection = {
  vowels?: unknown;
  colors?: unknown;
  notes?: unknown;
  roles?: unknown;
  polarities?: unknown;
  rings?: unknown;
  indices1?: unknown;
  ringIndex?: unknown;
  crossesCenter?: unknown;
  endsOnE?: unknown;
  endsOnË?: unknown;
  drift?: unknown;
};

type SpectrumVM = {
  surface?: unknown;
  functional?: unknown;
  delta?: unknown;
};

function asStringArray(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  return x.map((v) => (v == null ? "" : String(v))).filter((s) => s.length > 0);
}

function unwrapSection(x: unknown): { section: SpectrumSection | null; state: "present" | "missing" | "malformed" } {
  if (!x || typeof x !== "object") return { section: null, state: "missing" };

  const r = x as Record<string, unknown>;

  // PresentOrMissing wrapper case
  if (r["kind"] === "present" && r["value"] && typeof r["value"] === "object") {
    return { section: r["value"] as SpectrumSection, state: "present" };
  }
  if (r["kind"] === "missing") {
    return { section: null, state: "missing" };
  }

  // Legacy / direct section object case
  if (r["vowels"] || r["colors"] || r["notes"]) {
    return { section: r as SpectrumSection, state: "present" };
  }

  return { section: null, state: "malformed" };
}

function ChipRow(props: { label: string; values: string[]; fallback?: string }) {
  const v = props.values.length ? props.values : [props.fallback ?? "—"];
  return (
    <div className="flex flex-wrap gap-2">
      {v.map((s, i) => (
        <span
          key={i}
          className="inline-flex items-center rounded-[8px] border border-[#303a45] bg-[#10161e] px-2 py-1 font-mono text-xs text-[#d7dde7]"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function SectionCard(props: { label: string; data: unknown }) {
  const { section, state } = unwrapSection(props.data);

  const vowels = asStringArray(section?.vowels);
  const colors = asStringArray(section?.colors);
  const notes = asStringArray(section?.notes);
  const roles = asStringArray(section?.roles);
  const polarities = asStringArray(section?.polarities);
  const rings = asStringArray(section?.rings);

  const meta: string[] = [];
  const drift = section?.drift != null ? String(section.drift) : "";
  const crossesCenter = section?.crossesCenter === true ? "crosses O" : "";
  const endsOnE = section?.endsOnE === true ? "ends on E" : "";
  const endsOnË = section?.endsOnË === true ? "ends on Ë" : "";
  [drift, crossesCenter, endsOnE, endsOnË].filter(Boolean).forEach((s) => meta.push(s));

  const hasAny =
    vowels.length || colors.length || notes.length || roles.length || polarities.length || rings.length;

  return (
    <div className="rounded-[12px] border border-[#303a45] bg-[#0d1117] p-3 text-[#f5f7fb]">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm font-semibold text-[#f5f7fb]">{props.label}</div>
        {state !== "present" ? <div className="text-xs text-[#8ea4ba]">{state}</div> : null}
      </div>

      {!hasAny ? (
        <div className="mt-2 text-xs text-[#8ea4ba]">—</div>
      ) : (
        <div className="mt-2 space-y-2">
          <ChipRow label="Vowels" values={vowels} />
          {roles.length ? <ChipRow label="Roles" values={roles} /> : null}
          {polarities.length ? <ChipRow label="Polarities" values={polarities} /> : null}
          {rings.length ? <ChipRow label="Rings" values={rings} /> : null}

          {/* compact per-vowel detail line */}
          <div className="mt-1 flex flex-wrap gap-2">
            {vowels.map((v, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#303a45] bg-[#10161e] px-2 py-1 text-xs text-[#d7dde7]"
              >
                <span className="font-mono text-sm text-[#f5f7fb]">{v}</span>
                <span className="text-[#8ea4ba]">{colors[i] ?? "—"}</span>
                <span className="text-[#8ea4ba]">{notes[i] ?? "—"}</span>
              </span>
            ))}
          </div>

          {meta.length ? (
            <div className="text-xs text-[#8ea4ba]">{meta.join(" · ")}</div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function SevenPrinciplesSpectrumCard(props: { spectrum: unknown }) {
  const s = (props?.spectrum && typeof props.spectrum === "object") ? (props.spectrum as SpectrumVM) : {};

  const surface = s.surface;
  const functional = s.functional;

  const surfaceState = unwrapSection(surface).state;
  const functionalState = unwrapSection(functional).state;

  const notEmitted = surfaceState !== "present" && functionalState !== "present";

  return (
    <div className="rounded-[12px] border border-[#2f3742] bg-[#10161e] p-4 text-[#f5f7fb]">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-base font-semibold text-[#f5f7fb]">Seven Principles Spectrum</div>
        {notEmitted ? <div className="text-xs text-[#8ea4ba]">not emitted</div> : null}
      </div>

      <div className="mt-3 space-y-2">
        <SectionCard label="Surface" data={surface} />
        <SectionCard label="Functional" data={functional} />
      </div>
    </div>
  );
}

export default SevenPrinciplesSpectrumCard;
