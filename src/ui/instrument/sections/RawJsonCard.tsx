'use client';

import React from "react";

export function RawJsonCard(props: {
  pretty: string | null;
  onCopyFullJson?: () => void;
  engineVersion: string | null;
}) {
  const hasPretty = typeof props.pretty === "string" && props.pretty.length > 0;
  const engineLabel = props.engineVersion ?? "not_emitted";

  return (
    <section className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ea4ba]">audit payload</div>
          <div className="mt-1 text-base font-semibold tracking-wide text-[#f5f7fb]">Raw Engine JSON</div>
          <div className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
            Collapsed raw payload for inspection and export. Use the readable cards first; open this when you need audit detail.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#cfe6ff]">
              engine={engineLabel}
            </span>
            <span className="rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#d7dde7]">
              collapsed
            </span>
          </div>
        </div>
        {props.onCopyFullJson ? (
          <button
            type="button"
            className="rounded-[8px] border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
            onClick={props.onCopyFullJson}
          >
            Copy Full JSON
          </button>
        ) : null}
      </div>

      <div className="mt-4 text-sm">
        <details>
          <summary className="cursor-pointer select-none rounded-[8px] border border-[#27313d] bg-[#0d1117] px-3 py-2 text-sm font-semibold text-[#d7dde7] transition hover:border-[#4b5b6c]">
            Open JSON inspector
          </summary>

          <div className="mt-3 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3 text-[11px] leading-5 text-[#7d8ea3]">
            Boundary: raw audit payload only; readable cards remain the primary surface; no forced answer.
            <div className="mt-2">
              engine: <span className="font-mono text-[#d7dde7]">{engineLabel}</span>
            </div>
          </div>

          {hasPretty ? (
            <pre className="mt-3 max-h-[420px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3 text-xs font-mono leading-relaxed text-[#d7dde7]">
              {props.pretty}
            </pre>
          ) : (
            <div className="mt-3 rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3 text-xs text-[#8ea4ba]">
              Not available in this render mode. (VM-only boundary or missing payload.)
            </div>
          )}
        </details>
      </div>
    </section>
  );
}
