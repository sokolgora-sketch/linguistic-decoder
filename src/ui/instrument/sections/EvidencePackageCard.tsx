'use client';

import React from "react";
import { Copy } from "lucide-react";

type Props = {
  onCopyEvidenceSummary: () => void;
  onCopyEvidencePackage: () => void;
  engineVersion?: string | null;
};

export function EvidencePackageCard(props: Props) {
  const engineLabel = props.engineVersion ?? "not_emitted";

  return (
    <section className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ea4ba]">evidence export</div>
          <div className="mt-1 text-base font-semibold tracking-wide text-[#f5f7fb]">Evidence Package</div>
          <div className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
            Readable handoff text and JSON audit bundle for the current VM readout.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#cfe6ff]">
              engine={engineLabel}
            </span>
            <span className="rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#d7dde7]">
              source=VM
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8ea4ba]">Readable summary</div>
          <div className="mt-2 text-xs leading-5 text-[#aeb7c5]">
            Copies the compact text summary for chat handoff or review notes.
          </div>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-[8px] border border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-500/20"
            onClick={props.onCopyEvidenceSummary}
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            Copy Evidence Summary
          </button>
        </div>

        <div className="rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8ea4ba]">JSON audit bundle</div>
          <div className="mt-2 text-xs leading-5 text-[#aeb7c5]">
            Copies the structured evidence package for audit and reproducible inspection.
          </div>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-[8px] border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
            onClick={props.onCopyEvidencePackage}
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            Copy Evidence Package
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-3 text-[11px] leading-5 text-[#7d8ea3]">
        Boundary: VM-derived export actions only; raw engine JSON stays in Advanced; no origin proof; no forced answer.
      </div>
    </section>
  );
}
