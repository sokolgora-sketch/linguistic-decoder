'use client';

import React from "react";
import type { OriginClaimGatesVM } from "@/ui/telemetry/types";

type Props = {
  gates: OriginClaimGatesVM | null | undefined;
};

function metric(label: string, value: string) {
  return (
    <div className="rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">{label}</div>
      <div className="mt-1 font-mono text-[13px] text-[#f5f7fb]">{value}</div>
    </div>
  );
}

export function OriginClaimGatesCard({ gates }: Props) {
  if (!gates) return null;

  const status = gates.active ? "ON" : "OFF";
  const reasonCounts = gates.reasonCounts ?? {};
  const hasReasonCounts = Object.keys(reasonCounts).length > 0;

  return (
    <section className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ea4ba]">claim-gate diagnostics</div>
          <h3 className="mt-1 text-base font-semibold tracking-wide text-[#f5f7fb]">OriginClaim Gates</h3>
          <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
            Shows whether claim gates are active for this run and how candidate reason codes were counted.
          </p>
        </div>

        <div className="shrink-0 rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#cfe6ff]">
          flag=?{gates.flag}=1
        </div>
      </header>

      <div className="grid gap-2 sm:grid-cols-3">
        {metric("status", status)}
        {metric("candidates", String(gates.candidateCount))}
        {metric("reason codes", String(Object.keys(reasonCounts).length))}
      </div>

      <div className="mt-4 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-[#f5f7fb]">Gate state</div>
          <div className="font-mono text-xs text-[#9fb1bf]">Status: {status}</div>
        </div>
        <div className="mt-2 text-sm text-[#d7dde7]">
          Candidates: <span className="font-mono">{gates.candidateCount}</span>
        </div>
        <div className="mt-2 text-[11px] leading-5 text-[#7d8ea3]">
          Boundary: diagnostics only; no origin proof; no forced answer.
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Reason code counts</div>
        <pre className="mt-2 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-[8px] border border-[#27313d] bg-[#0d1117] p-3 font-mono text-xs leading-5 text-[#d7dde7]">
          {hasReasonCounts ? JSON.stringify(reasonCounts, null, 2) : "{}"}
        </pre>
      </div>
    </section>
  );
}

export default OriginClaimGatesCard;
