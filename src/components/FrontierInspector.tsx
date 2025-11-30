// src/components/FrontierInspector.tsx
"use client";

import React from "react";

type FrontierInspectorProps = {
  result: any; // keep loose to avoid TS fights
};

type Path = {
  id?: string;
  label?: string;
  voicePath?: string[];
  vowelPath?: string[];
  score?: number;
};

function pathVoicePath(path: Path): string[] {
  return (path.voicePath ?? path.vowelPath ?? []) as string[];
}

export function FrontierInspector({ result }: FrontierInspectorProps) {
  const frontier: Path[] = (result?.frontierPaths ?? []) as Path[];

  if (!frontier || frontier.length === 0) {
    return null; // nothing to show
  }

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Engine Inspector · Frontier Paths
          </h2>
          <p className="text-sm text-slate-400">
            Alternate Seven-Voices paths the solver considered for this word.
            These are secondary to the primary path but still valid candidates.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
          <div className="grid grid-cols-4 gap-2 border-b border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-300">
            <div>#</div>
            <div>Path</div>
            <div>Label / Id</div>
            <div>Score (if any)</div>
          </div>

          {frontier.map((path, idx) => {
            const voices = pathVoicePath(path);
            const label =
              path.label || path.id || `candidate-${idx + 1}`;
            const pathStr =
              voices && voices.length > 0
                ? voices.join(" → ")
                : "—";

            return (
              <div
                key={idx}
                className="grid grid-cols-4 gap-2 border-t border-slate-900/60 px-4 py-2 text-xs text-slate-200"
              >
                <div>{idx + 1}</div>
                <div className="font-medium text-slate-100">{pathStr}</div>
                <div className="text-slate-300">{label}</div>
                <div className="text-slate-300">
                  {typeof path.score === "number" ? path.score : "—"}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          Frontier paths help you see how the engine could have interpreted the
          word differently in terms of Seven-Voices movement. They are useful
          for debugging and for future &quot;multi-truth&quot; views.
        </p>
      </div>
    </section>
  );
}
