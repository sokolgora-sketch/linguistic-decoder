'use client';

import React from "react";

type Props = {
  onCopyEvidencePackage: () => void;
};

export function EvidencePackageCard(props: Props) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-sm font-semibold">Evidence Package</div>
      <div className="mt-1 text-xs opacity-70">
        VM-only export bundle for sharing and audit. No raw payload.
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={props.onCopyEvidencePackage}
        >
          Copy Evidence Package
        </button>
      </div>
    </div>
  );
}
