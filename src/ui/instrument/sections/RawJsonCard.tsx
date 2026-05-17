'use client';

import React from "react";

export function RawJsonCard(props: {
  pretty: string | null;
  onCopyFullJson?: () => void;
  engineVersion: string | null;
}) {
  const hasPretty = typeof props.pretty === "string" && props.pretty.length > 0;

  return (
    <section className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-100">Raw Engine JSON</div>
          <div className="mt-1 text-xs text-slate-500">Collapsed inspection payload</div>
        </div>
          {props.onCopyFullJson ? (
            <button
              type="button"
              className="rounded-md border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
              onClick={props.onCopyFullJson}
            >
              Copy Full JSON
            </button>
          ) : null}
      </div>

      <div className="mt-4 text-sm">
        <details>
          <summary className="cursor-pointer select-none text-sm text-slate-300">
            Show / hide (collapsed by default)
          </summary>

          <div className="mt-2 text-xs text-slate-500">
            engine: <span className="font-mono">{props.engineVersion ?? "not_emitted"}</span>
          </div>

          {hasPretty ? (
            <pre className="mt-2 max-h-[420px] max-w-full overflow-auto whitespace-pre-wrap break-words rounded-md border border-slate-800 bg-black/35 p-3 text-xs font-mono leading-relaxed text-slate-200">
              {props.pretty}
            </pre>
          ) : (
            <div className="mt-2 rounded-md border border-slate-800 bg-black/25 p-3 text-xs text-slate-400">
              Not available in this render mode. (VM-only boundary or missing payload.)
            </div>
          )}
        </details>
      </div>
    </section>
  );
}
