"use client";

import React from "react";

type Props = {
  /** Future: meaning/functional root telemetry. For now: VM carries none. */
  available?: boolean;
};

export function MeaningCard({ available }: Props) {
  return (
    <section className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
      <div className="text-sm font-semibold text-slate-100">Meaning</div>
      <div className="mt-4">
        {available ? (
          <div className="text-sm text-slate-200">Meaning telemetry available.</div>
        ) : (
          <div className="text-sm text-slate-500">Not available in this engine version.</div>
        )}
      </div>
    </section>
  );
}
