// src/components/EngineInspector.tsx
"use client";

import React from "react";

// We keep it loose on purpose to avoid type drama
type EngineInspectorProps = {
  result: any;
};

const VOWEL_TRAITS: Record<
  string,
  {
    name: string;
    ring: "inner" | "middle" | "outer" | "center";
    role: string;
    principle: string;
    color: string;
  }
> = {
  A: {
    name: "A",
    ring: "outer",
    role: "Source / Father / Fire",
    principle: "Truth / Action",
    color: "#ff4d4d",
  },
  E: {
    name: "E",
    ring: "middle",
    role: "Flow / Expansion",
    principle: "Expansion / Movement",
    color: "#ff9f43",
  },
  I: {
    name: "I",
    ring: "inner",
    role: "Insight / Pattern",
    principle: "Insight / Focus",
    color: "#feca57",
  },
  O: {
    name: "O",
    ring: "center",
    role: "Heart / Mediator",
    principle: "Balance / Harmony",
    color: "#1dd1a1",
  },
  U: {
    name: "U",
    ring: "inner",
    role: "Field / Unity",
    principle: "Unity / Field",
    color: "#54a0ff",
  },
  Y: {
    name: "Y",
    ring: "middle",
    role: "Network / Bridge",
    principle: "Network Integrity",
    color: "#5f27cd",
  },
  "Ë": {
    name: "Ë",
    ring: "outer",
    role: "Completion / Mother",
    principle: "Evolution / Completion",
    color: "#ee82ee",
  },
};

const RING_LABEL: Record<string, string> = {
  inner: "Inner ring (I / U)",
  middle: "Middle ring (E / Y)",
  outer: "Outer ring (A / Ë)",
  center: "Center (O – Mediator)",
};

export function EngineInspector({ result }: EngineInspectorProps) {
  const primary = result?.primaryPath;
  const voicePath: string[] = primary?.voicePath ?? primary?.vowelPath ?? [];

  if (!primary || !voicePath || voicePath.length === 0) {
    return null; // nothing to inspect yet
  }

  const pathLabel = voicePath.join(" → ");

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Engine Inspector · Heart View
          </h2>
          <p className="text-sm text-slate-400">
            Internal view of the Seven-Voices heart for this word&apos;s{" "}
            <span className="font-medium text-slate-200">primary path</span>.
          </p>
        </div>

        {/* Path summary */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="text-sm text-slate-400">Primary Voice Path:</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm">
            {voicePath.map((v, idx) => {
              const traits = VOWEL_TRAITS[v] ?? null;
              return (
                <div key={idx} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-slate-500">→</span>}
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ backgroundColor: traits?.color ?? "#64748b" }}
                  >
                    {v}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-xs text-slate-500">({pathLabel})</div>
        </div>

        {/* Table of vowels on the path */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
          <div className="grid grid-cols-5 gap-2 border-b border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-300">
            <div>Step</div>
            <div>Voice</div>
            <div>Ring</div>
            <div>Role</div>
            <div>Principle</div>
          </div>
          {voicePath.map((v, idx) => {
            const traits = VOWEL_TRAITS[v] ?? null;
            return (
              <div
                key={idx}
                className="grid grid-cols-5 gap-2 border-t border-slate-900/60 px-4 py-2 text-xs text-slate-200"
              >
                <div>{idx + 1}</div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
                    style={{ backgroundColor: traits?.color ?? "#64748b" }}
                  >
                    {v}
                  </span>
                  <span>{v}</span>
                </div>
                <div className="text-slate-300">
                  {traits ? RING_LABEL[traits.ring] : "—"}
                </div>
                <div className="text-slate-300">
                  {traits?.role ?? "—"}
                </div>
                <div className="text-slate-300">
                  {traits?.principle ?? "—"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tiny explanation */}
        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          This view doesn&apos;t change the solver. It just shows how the
          current primary path walks through the Seven-Voices heart: inner vs
          outer rings and the mediator O, with their symbolic roles.
        </p>
      </div>
    </section>
  );
}
