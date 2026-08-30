"use client";

import type {
  SevenVoiceFunctionalRecurrenceResearchAvailableV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceResearchCatalog.v0_1";

export function
CrossLanguageRecurrenceCardV0_1(
  {
    result,
  }: {
    result:
      SevenVoiceFunctionalRecurrenceResearchAvailableV0_1;
  },
) {
  return (
    <section
      aria-label="Cross-Language Recurrence research"
      className="rounded-[14px] border border-[#355a7a] bg-[#101820] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] sm:p-5"
      data-testid="cross-language-recurrence-card"
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">
          Cross-Language Recurrence
        </div>

        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
          Research hypothesis
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#8ea4ba]">
            Shared functional nucleus
          </div>

          <div
            className="mt-2 font-mono text-[34px] font-semibold text-[#f5f7fb]"
            data-testid="fvr-shared-nucleus"
          >
            {result.sharedFunctionalNucleus.length
              ? result.sharedFunctionalNucleus.join(" · ")
              : "Null"}
          </div>

          <div className="mt-2 text-xs leading-5 text-[#9fb1bf]">
            Deterministic only within the admitted comparison forms.
          </div>

          <div
            className="mt-3 rounded-[8px] border border-[#303a45] bg-black/20 p-2 text-xs leading-5 text-[#aeb7c5]"
            data-testid="fvr-mode-separation"
          >
            This FVR comparison path is separate from the single-word
            functional normalization shown elsewhere. WATER → UOTER is an
            explicit ZË-RO project-doctrine comparison form for this research
            cohort; it does not replace the Analyze V1 functional path.
          </div>
        </div>

        <div className="space-y-3">
          {result.observations.map(
            (
              observation,
            ) => (
              <div
                key={
                  observation.recurrenceEvidenceId
                }
                className="rounded-[10px] border border-[#303a45] bg-[#151515] p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-[#f5f7fb]">
                    {observation.languageId}
                    {observation.languageVariety
                      ? ` — ${observation.languageVariety}`
                      : ""}
                  </div>

                  <div className="font-mono text-[11px] text-[#8ea4ba]">
                    {observation.comparisonMode}
                  </div>
                </div>

                <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-[#7f8d9d]">
                      Surface
                    </div>
                    <div className="mt-1 font-mono text-[#dce7f3]">
                      {observation.surfaceForm}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-[#7f8d9d]">
                      Comparison
                    </div>
                    <div className="mt-1 font-mono text-[#dce7f3]">
                      {observation.comparisonForm}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-[#7f8d9d]">
                      Voice path
                    </div>
                    <div className="mt-1 font-mono text-[#dce7f3]">
                      {observation.voicePath.length
                        ? observation.voicePath.join("-")
                        : "Null"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-[#9fb1bf]">
                  {observation.citations.map(
                    (
                      citation,
                    ) => (
                      <div
                        key={
                          citation.citationId
                        }
                      >
                        <a
                          href={
                            citation.sourceUrlOrArchiveRef
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-[#4d7fa8] underline-offset-2 hover:text-white"
                        >
                          {citation.sourceTitle}
                        </a>
                        {" — "}
                        {citation.entryLocator}
                      </div>
                    ),
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mt-4 rounded-[10px] border border-[#303a45] bg-black/20 p-3 text-xs leading-5 text-[#aeb7c5]">
        <strong className="text-[#dce7f3]">
          Truth boundary:
        </strong>{" "}
        the recurrence observation is factual within these declared,
        source-admitted comparison forms. The meaning attributed to the
        recurrent voice remains a research hypothesis.
        {" "}
        Not historical origin, cognacy, borrowing, candidate truth,
        language superiority, or universality.
      </div>
    </section>
  );
}
