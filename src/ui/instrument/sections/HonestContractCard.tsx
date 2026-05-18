"use client";

export const OPEN_INSTRUMENT_HONEST_CONTRACT =
  "Open Instrument explores sound-and-function resonance across languages. Candidates surfaced here are exploratory hypotheses, not established etymologies. Established historical etymology exists elsewhere (Etymonline, Wiktionary, OED) and is not the goal of this tool. The user decides what to make of the resonance patterns shown.";

export function HonestContractCard() {
  return (
    <section className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ea4ba]">honest contract</div>
      <div className="mt-1 text-base font-semibold tracking-wide text-[#f5f7fb]">What Open Instrument is</div>
      <p className="mt-3 max-w-4xl text-[13px] leading-6 text-[#c6d0dc]">
        {OPEN_INSTRUMENT_HONEST_CONTRACT}
      </p>
    </section>
  );
}
