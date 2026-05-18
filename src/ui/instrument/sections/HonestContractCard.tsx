"use client";

export const OPEN_INSTRUMENT_HONEST_CONTRACT =
  "Open Instrument explores sound-and-function resonance across languages. Candidates surfaced here are exploratory hypotheses, not established etymologies. Established historical etymology exists elsewhere (Etymonline, Wiktionary, OED) and is not the goal of this tool. The user decides what to make of the resonance patterns shown.";

export function HonestContractCard() {
  return (
    <details
      open
      className="group rounded-[12px] border border-[#303a45] bg-[#10151c] shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ea4ba]">
            honest contract
          </span>
          <span className="mt-1 block text-base font-semibold tracking-wide text-[#f5f7fb]">
            What Open Instrument is
          </span>
        </span>
        <span className="shrink-0 rounded-full border border-[#304052] bg-[#0c1117] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9fb2c7] group-open:hidden">
          expand
        </span>
        <span className="hidden shrink-0 rounded-full border border-[#304052] bg-[#0c1117] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9fb2c7] group-open:inline">
          collapse
        </span>
      </summary>
      <div className="px-4 pb-4">
        <p className="max-w-4xl text-[13px] leading-6 text-[#c6d0dc]">
          {OPEN_INSTRUMENT_HONEST_CONTRACT}
        </p>
        <p className="mt-3 max-w-3xl text-[11px] leading-5 text-[#7f8fa3]">
          Visible by default. Collapse after reading; keep this boundary in mind before using candidates.
        </p>
      </div>
    </details>
  );
}
