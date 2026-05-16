'use client';

import React from "react";

type Props = {
  onCopyEvidencePackage: () => void;
};

export function EvidencePackageCard(props: Props) {
  return (
    <div className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div className="text-sm font-semibold text-slate-100">Evidence Package</div>
      <div className="mt-1 text-xs text-slate-500">
        VM-only export bundle for sharing and audit. No raw payload.
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
          onClick={props.onCopyEvidencePackage}
        >
          Copy Evidence Package
        </button>
      </div>
    </div>
  );
}
