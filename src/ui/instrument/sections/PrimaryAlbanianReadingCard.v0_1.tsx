"use client";

import type {
  AnalysisStatusV0_1VM,
  MotivationDiscoveryV0_1VM,
  PresentOrMissing,
} from "@/ui/telemetry/types";

const KAIKKI_ALBANIAN_URL =
  "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl";

function sameWord(left: string, right: string): boolean {
  return left.normalize("NFC").trim().toLocaleLowerCase("sq-AL") ===
    right.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
}

export function PrimaryAlbanianReadingCardV0_1({
  discovery,
  analysisStatus,
}: {
  discovery: PresentOrMissing<MotivationDiscoveryV0_1VM> | undefined;
  analysisStatus: PresentOrMissing<AnalysisStatusV0_1VM> | undefined;
}) {
  if (discovery?.kind !== "present") return null;

  const value = discovery.value;
  if (value.inputLanguage !== "sq" && value.inputProfile !== "albanian") return null;

  const reading = value.albanianLexicalReading;
  const exactSourceStatus = value.exactLexicalSourceStatus?.status ?? "NOT_EMITTED";
  const records = (value.exactLexicalSourceFacts ?? []).filter((fact) =>
    fact.languageCode === "sq" && sameWord(fact.form, value.inputWord),
  );
  const bridge = reading?.functionalMeaningBridge;
  const hypothesis = bridge?.functionalHypothesis;
  const supportedHypothesis = bridge?.status === "SUPPORTED" &&
    hypothesis?.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" &&
    typeof hypothesis.functionalOperation === "string" &&
    typeof hypothesis.statement === "string";
  const sourceComponentReading = reading?.sourceLinkedComponentReading ?? null;
  const sourceComponentHypothesis = sourceComponentReading?.functionalHypothesis;
  const sourceComponentPrimary = sourceComponentReading?.primary;
  const sourceComponentTargetIsBound = sourceComponentReading?.status === "SUPPORTED" &&
    sourceComponentPrimary != null &&
    sameWord(sourceComponentPrimary.form, value.inputWord) &&
    sourceComponentReading.relation.primarySourceRecordId === sourceComponentPrimary.sourceRecordId &&
    sourceComponentReading.relation.primaryEntryLocator === sourceComponentPrimary.entryLocator &&
    records.some((record) =>
      record.sourceRecordId === sourceComponentPrimary.sourceRecordId &&
      record.entryLocator === sourceComponentPrimary.entryLocator &&
      sameWord(record.form, sourceComponentPrimary.form),
    );
  const supportedSourceComponentHypothesis = exactSourceStatus === "MATCHES_FOUND" &&
    sourceComponentTargetIsBound &&
    sourceComponentReading?.relation.relation !== "SOURCE_COMPOUND_ARITY_UNSUPPORTED" &&
    sourceComponentReading?.relation.references.length > 0 &&
    sourceComponentHypothesis?.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" &&
    sourceComponentHypothesis.functionalOperation === null &&
    typeof sourceComponentHypothesis.statement === "string" &&
    sourceComponentHypothesis.statement.trim().length > 0 &&
    sourceComponentHypothesis.evidenceRefs.length > 0 &&
    sourceComponentHypothesis.reasonCodes.length === 0 &&
    sourceComponentHypothesis.claimBoundary.trim().length > 0 &&
    sourceComponentReading.reasonCodes.length === 0 &&
    sourceComponentReading.claimBoundary.trim().length > 0 &&
    sourceComponentHypothesis.noSingleWinner === true &&
    sourceComponentHypothesis.userDecisionPosture === "user_decides";
  const sourceUnavailable = exactSourceStatus === "UNAVAILABLE";

  return (
    <section
      aria-label="Albanian word reading"
      data-testid="primary-albanian-reading"
      className="rounded-xl border border-[#355a7a] bg-[#111a24] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4ba]">
            Albanian word reading
          </p>
          <h2 className="mt-1 text-base font-semibold text-[#f5f7fb]">
            {value.inputWord}
          </h2>
        </div>
        <span className="rounded-full border border-[#355a7a] px-2.5 py-1 text-[11px] font-semibold text-[#cfe6ff]">
          Source status · {exactSourceStatus}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <section
          aria-label="Source fact"
          data-testid="primary-albanian-source-fact"
          className="min-w-0 rounded-lg border border-[#273f55] bg-[#0d1117] p-3 text-sm leading-5 text-[#d7dde7]"
        >
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8fc6ef]">
            Source fact
          </h3>
          {records.length > 0 ? (
            <div className="mt-2 space-y-3">
              {records.map((record, recordIndex) => (
                <div
                  key={`${record.sourceRecordId}:${recordIndex}`}
                  className="min-w-0 border-t border-[#27313d] pt-2 first:border-0 first:pt-0"
                >
                  <p className="font-semibold">Kaikki Albanian · {record.form} · {record.partOfSpeech ?? "part of speech unavailable"}</p>
                  <p className="mt-1 break-all font-mono text-[11px] text-[#aeb7c5]">
                    Source record: {record.sourceRecordId}
                  </p>
                  {record.senses.length > 0 ? (
                    <ol className="mt-2 space-y-2">
                      {record.senses.map((sense, senseIndex) => (
                        <li
                          key={`${sense.senseId ?? "sense"}:${senseIndex}`}
                          className="rounded-md border border-[#27313d] bg-[#11161c] p-2"
                        >
                          <p className="text-[11px] font-semibold text-[#aeb7c5]">
                            Source sense {senseIndex + 1} · {sense.senseId ?? "sense ID unavailable"}
                          </p>
                          <p className="mt-1">Source meaning: {sense.glosses.join("; ") || "not supplied"}</p>
                          <p className="mt-1 text-xs text-[#aeb7c5]">
                            Categories: {(sense.categories ?? []).length > 0
                              ? (sense.categories ?? []).map((category, categoryIndex) => (
                                  <span key={`${category.name}:${categoryIndex}`}>
                                    {categoryIndex > 0 ? "; " : ""}
                                    {category.name}{category.orig ? ` · ${category.orig}` : ""}{category.source ? ` · source ${category.source}` : ""}
                                  </span>
                                ))
                              : "none recorded"}
                          </p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-2">No source senses were emitted.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2">
              {sourceUnavailable
                ? "The exact source is unavailable. No lexical meaning is inferred."
                : exactSourceStatus === "SOURCE_NOT_FOUND"
                  ? "This exact source query returned no record; this does not establish absence from Albanian."
                  : "No exact source record details were emitted; no lexical meaning is inferred."}
            </p>
          )}
        </section>

        <section
          aria-label="Exploratory functional interpretation"
          data-testid="primary-albanian-functional-reading"
          className="min-w-0 rounded-lg border border-[#5e4b22] bg-[#19140d] p-3 text-sm leading-5 text-[#f0ddb0]"
        >
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d8bb7a]">
            Exploratory functional interpretation
          </h3>
          {supportedHypothesis ? (
            <>
              <p className="mt-2 font-semibold">
                Functional role: {hypothesis.functionalOperation} · exploratory
              </p>
              <p className="mt-2 break-words">
                {hypothesis.functionalOperation === "AGENT"
                  ? "Source evidence for this exact reading supports this exploratory classification. It does not establish morphology, historical derivation, or embryo meaning."
                  : "This exploratory interpretation is bounded to the exact source evidence and sense above. It does not establish morphology, historical derivation, or embryo meaning."}
              </p>
            </>
          ) : (
            <p className="mt-2">
              UNKNOWN_OR_NULL · no supported functional interpretation is emitted for this exact source reading.
            </p>
          )}
        </section>

        {supportedSourceComponentHypothesis && sourceComponentReading && sourceComponentHypothesis ? (
          <section
            aria-label="Source-linked conditional component reading"
            data-testid="primary-albanian-source-component-hypothesis"
            className="min-w-0 rounded-lg border border-[#66532e] bg-[#1b180f] p-3 text-sm leading-5 text-[#f0ddb0]"
          >
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d8bb7a]">
              Source-linked conditional component reading
            </h3>
            <p className="mt-2 font-semibold">EXPLORATORY_FUNCTIONAL_HYPOTHESIS</p>
            <p className="mt-1 break-words">
              Source-attributed component forms (source order): {sourceComponentReading.relation.references
                .map((reference) => reference.sourceForm)
                .join(" + ")}
            </p>
            {sourceComponentReading.relation.sourceAuthoredExplanation ? (
              <p className="mt-1 break-words">
                Source-authored account (attributed): {sourceComponentReading.relation.sourceAuthoredExplanation}
              </p>
            ) : null}
            <p className="mt-2 break-words">{sourceComponentHypothesis.statement}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[#d5c28f]">
              <li>Grammatical role: unclassified by this component hypothesis.</li>
              <li>Canonical component-sense selection: UNKNOWN_OR_NULL; no single sense winner, user decides.</li>
              <li>Functional operation: Null — none is classified by this hypothesis.</li>
            </ul>
            {sourceComponentHypothesis.alternatives.length > 0 ? (
              <div className="mt-2 break-words text-xs">
                Alternatives: {sourceComponentHypothesis.alternatives.join(" ")}
              </div>
            ) : null}
            <div className="mt-2 break-words text-xs">
              Evidence references: {sourceComponentHypothesis.evidenceRefs
                .map((reference) => `${reference.sourceRecordId} · ${reference.entryLocator} · senses ${reference.senseIds.join(", ") || "UNKNOWN_OR_NULL"}`)
                .join(" | ")}
            </div>
            <p className="mt-2 break-words text-xs text-[#d5c28f]">
              Source-linked reading boundary: {sourceComponentReading.claimBoundary}
            </p>
            <p className="mt-1 break-words text-xs text-[#d5c28f]">
              Functional hypothesis boundary: {sourceComponentHypothesis.claimBoundary}
            </p>
            <p className="mt-1 text-xs text-[#aeb7c5]">
              Attributed source components do not independently prove morphology, derivation, historical origin, or embryo meaning.
            </p>
          </section>
        ) : null}

        <section
          aria-label="Canonical and structural candidate status"
          data-testid="primary-albanian-structural-status"
          className="min-w-0 rounded-lg border border-[#3b434d] bg-[#171c22] p-3 text-sm leading-5 text-[#d7dce3]"
        >
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#aeb7c5]">
            Canonical / structural candidate status
          </h3>
          {analysisStatus?.kind === "present" ? (
            <>
              <p className="mt-2 font-mono text-xs">{analysisStatus.value.status}</p>
              <p className="mt-1">{analysisStatus.value.summary}</p>
              <p className="mt-2 text-xs text-[#aeb7c5]">
                This status describes canonical candidates and reviewed evidence; it does not cancel the separate source fact or exploratory reading above.
              </p>
            </>
          ) : (
            <p className="mt-2">Canonical / structural candidate status was not emitted.</p>
          )}
        </section>

        <section
          aria-label="Unknown and Null boundaries"
          data-testid="primary-albanian-unknown-null"
          className="min-w-0 rounded-lg border border-[#493d59] bg-[#17131d] p-3 text-sm leading-5 text-[#d9c9ea]"
        >
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#c5a9df]">
            Unknown / Null
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Morphological decomposition: UNKNOWN_OR_NULL.</li>
            <li>Historical derivation: not established by these source facts.</li>
            <li>
              Source pronunciation: {reading?.sourcePronunciation?.status === "SUPPORTED" && reading.sourcePronunciation.rawIpa
                ? `${reading.sourcePronunciation.rawIpa} · current Kaikki record only, not frozen spoken authority.`
                : "Null / unavailable."}
            </li>
            <li>Independent embryo meaning or function: UNKNOWN_OR_NULL.</li>
          </ul>
        </section>
      </div>
    </section>
  );
}
