"use client";

import type {
  AnalysisStatusCodeV0_1,
  AnalysisStatusV0_1VM,
  PresentOrMissing,
} from "@/ui/telemetry/types";

const STATUS_LABELS: Record<AnalysisStatusCodeV0_1, string> = {
  reviewed_functional_evidence: "Reviewed functional evidence",
  candidate_only: "Candidate only",
  structural_unreviewed: "Hypothesis — structural, unreviewed",
  null_no_supported_candidate: "Null — no supported candidate",
};

function joinOrNone(values: readonly string[]): string {
  return values.length > 0 ? values.join(", ") : "none";
}

export function AnalysisStatusCardV0_1({
  status,
}: {
  status: PresentOrMissing<AnalysisStatusV0_1VM>;
}) {
  if (status.kind !== "present") {
    return (
      <section
        aria-label="Analysis status"
        className="rounded-[12px] border border-[#3b434d] bg-[#171c22] p-4"
      >
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#aeb7c5]">
          Analysis status
        </div>
        <div className="mt-2 text-sm text-[#d7dce3]">
          Status not emitted.
        </div>
      </section>
    );
  }

  const value = status.value;

  return (
    <section
      aria-label="Analysis status"
      className="rounded-[12px] border border-[#3b434d] bg-[#171c22] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#aeb7c5]">
            Analysis status
          </div>
          <h3 className="mt-2 text-base font-semibold text-[#f5f7fb]">
            {STATUS_LABELS[value.status]}
          </h3>
        </div>

        <span className="rounded-full border border-[#5e4b22] bg-[#19140d] px-3 py-1 font-mono text-[11px] uppercase text-[#f0ddb0]">
          {value.status}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#c5ced8]">
        {value.summary}
      </p>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-[8px] border border-[#303843] bg-[#11161c] p-3">
          <dt className="text-xs text-[#8f9aa7]">Reviewed operators</dt>
          <dd className="mt-1 font-mono text-[#dce8f5]">
            {joinOrNone(value.reviewedOperators)}
          </dd>
        </div>

        <div className="rounded-[8px] border border-[#303843] bg-[#11161c] p-3">
          <dt className="text-xs text-[#8f9aa7]">Candidate-only operators</dt>
          <dd className="mt-1 font-mono text-[#dce8f5]">
            {joinOrNone(value.candidateOnlyOperators)}
          </dd>
        </div>

        <div className="rounded-[8px] border border-[#303843] bg-[#11161c] p-3">
          <dt className="text-xs text-[#8f9aa7]">Structural tokens</dt>
          <dd className="mt-1 font-mono text-[#dce8f5]">
            {joinOrNone(value.structuralTokens)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-[8px] border border-[#33423a] bg-[#111a16] p-3 text-xs leading-5 text-[#b7d8c1]">
        No historical-origin, transmission, winner, superiority, ownership, or
        candidate-truth claim is made. Structural output is not candidate truth.
        Null remains valid. User decides.
      </div>
    </section>
  );
}
