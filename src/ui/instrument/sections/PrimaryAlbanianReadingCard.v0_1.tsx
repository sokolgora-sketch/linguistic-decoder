"use client";

import type {
  AnalysisStatusV0_2VM,
  MotivationDiscoveryV0_2VM,
  PresentOrMissing,
} from "@/ui/telemetry/types";
import { isInterpretationDecisionPolicyV0_1 } from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";
import { humanReadableStatusLabelV0_1, humanReadableStatusTextV0_1 } from "@/ui/instrument/sections/humanReadableStatusLabel.v0_1";

const KAIKKI_ALBANIAN_URL =
  "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl";

function sameWord(left: string, right: string): boolean {
  return left.normalize("NFC").trim().toLocaleLowerCase("sq-AL") ===
    right.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
}

function exactSourceStatusLabel(status: string): string {
  switch (status) {
    case "MATCHES_FOUND": return "Exact source record available";
    case "SOURCE_NOT_FOUND": return "No exact source record returned";
    case "UNAVAILABLE": return "Exact source could not be reached";
    case "NOT_QUERIED": return "Exact source not checked";
    default: return "Exact source status unavailable";
  }
}

export function PrimaryAlbanianReadingCardV0_1({
  discovery,
  analysisStatus,
}: {
  discovery: PresentOrMissing<MotivationDiscoveryV0_2VM> | undefined;
  analysisStatus: PresentOrMissing<AnalysisStatusV0_2VM> | undefined;
}) {
  if (discovery?.kind !== "present") return null;

  const value = discovery.value;
  if (value.inputLanguage !== "sq" && value.inputProfile !== "albanian") return null;

  const reading = value.albanianLexicalReading;
  const independentComposition = reading?.independentFunctionalComposition;
  const exactSourceStatus = value.exactLexicalSourceStatus?.status ?? "NOT_EMITTED";
  const records = (value.exactLexicalSourceFacts ?? []).filter((fact) =>
    fact.languageCode === "sq" && sameWord(fact.form, value.inputWord),
  );
  const nativeSeparativeReading = reading?.nativeSeparativeEventToState?.inputForm === value.inputWord
    ? reading.nativeSeparativeEventToState
    : null;
  const nativeSeparativeSourceAlternatives = nativeSeparativeReading
    ? [...new Map(nativeSeparativeReading.alternatives.map((alternative) =>
        [alternative.target.sourceRecordId, alternative] as const,
      )).values()]
    : [];
  const bridge = reading?.functionalMeaningBridge;
  const hypothesis = bridge?.functionalHypothesis;
  const primarySourceFact = reading?.primarySourceFact ?? null;
  const bridgePrimary = bridge?.sourceFacts?.primary ?? null;
  const bridgeRelated = bridge?.sourceFacts?.related ?? null;
  const sameSourceRecord = (
    left: { sourceRecordId: string; entryLocator: string; form: string } | null | undefined,
    right: { sourceRecordId: string; entryLocator: string; form: string } | null | undefined,
  ): boolean => left != null && right != null &&
    left.sourceRecordId === right.sourceRecordId &&
    left.entryLocator === right.entryLocator &&
    sameWord(left.form, right.form);
  const queriedSourceIdentityIsUnique = primarySourceFact !== null &&
    sameWord(primarySourceFact.form, value.inputWord) &&
    records.filter((record) => sameSourceRecord(record, primarySourceFact)).length === 1;
  const sourcePrimaryBinding = queriedSourceIdentityIsUnique &&
    sameSourceRecord(bridgePrimary, primarySourceFact);
  const relatedTargetBinding = (() => {
    if (!queriedSourceIdentityIsUnique || !reading || !bridge || !bridgePrimary || !bridgeRelated ||
      !sameSourceRecord(bridgeRelated, primarySourceFact) ||
      !sameWord(bridge.relatedForm ?? "", primarySourceFact?.form ?? "") ||
      records.filter((record) => sameSourceRecord(record, bridgeRelated)).length !== 1) return false;

    const structuredReference = bridge.sourceFacts?.structuredReference;
    if (!structuredReference || !structuredReference.referencedForm || !structuredReference.reference) return false;

    const matchingTargetAuthoredRelations = reading.relatedCandidateEvaluations.filter((candidate) => {
      const comparison = candidate.sourceLinkedComparison;
      const relation = comparison.relation;
      const candidateBridge = candidate.functionalMeaningBridge;
      const candidateBridgeFacts = candidateBridge.sourceFacts;
      const candidatePrimary = candidateBridgeFacts?.primary;
      const candidateRelated = candidateBridgeFacts?.related;
      const comparisonRelated = comparison.related;
      const comparisonPrimary = comparison.primary;
      const sameHypothesis = candidateBridge.functionalHypothesis.status === hypothesis?.status &&
        candidateBridge.functionalHypothesis.functionalOperation === hypothesis?.functionalOperation &&
        candidateBridge.functionalHypothesis.statement === hypothesis?.statement;

      const checks = {
        resolution: candidate.resolution === "RESOLVED",
        sourceRelation: candidate.sourceRelation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE",
        sourceRelationAssertion: candidate.sourceRelationAssertion === null,
        candidateRelatedForm: sameWord(candidate.relatedForm, primarySourceFact?.form ?? ""),
        comparisonStatus: comparison.status === "SUPPORTED",
        comparisonRelation: relation.relation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE",
        direction: relation.direction === "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE",
        comparisonRelationAssertion: relation.sourceRelationAssertion === null,
        relationPrimaryId: relation.primarySourceRecordId === bridgePrimary.sourceRecordId,
        relationPrimaryLocator: relation.primaryEntryLocator === bridgePrimary.entryLocator,
        relationRelatedId: relation.relatedSourceRecordId === bridgeRelated.sourceRecordId,
        relationRelatedLocator: relation.relatedEntryLocator === bridgeRelated.entryLocator,
        relationRelatedForm: sameWord(relation.relatedForm, bridgeRelated.form),
        referencedForm: sameWord(relation.referencedForm ?? "", bridgePrimary.form),
        reference: relation.reference === structuredReference.reference,
        structuredReferenceForm: sameWord(structuredReference.referencedForm ?? "", bridgePrimary.form),
        comparisonPrimary: sameSourceRecord(comparisonPrimary, bridgePrimary),
        comparisonRelated: sameSourceRecord(comparisonRelated, bridgeRelated),
        candidateBridgeStatus: candidateBridge.status === "SUPPORTED",
        candidateBridgeRelatedForm: sameWord(candidateBridge.relatedForm ?? "", bridge.relatedForm ?? ""),
        candidateBridgePrimary: sameSourceRecord(candidatePrimary, bridgePrimary),
        candidateBridgeRelated: sameSourceRecord(candidateRelated, bridgeRelated),
        candidateBridgeReference: candidateBridgeFacts?.structuredReference?.reference === structuredReference.reference,
        candidateBridgeReferenceForm: sameWord(candidateBridgeFacts?.structuredReference?.referencedForm ?? "", bridgePrimary.form),
        sameHypothesis,
      };
      return Object.values(checks).every(Boolean);
    });

    return matchingTargetAuthoredRelations.length === 1;
  })();
  const bridgeMatchesQueriedSource = reading?.status === "SUPPORTED" &&
    exactSourceStatus === "MATCHES_FOUND" &&
    (sourcePrimaryBinding || relatedTargetBinding);
  const supportedHypothesis = bridgeMatchesQueriedSource &&
    bridge?.status === "SUPPORTED" &&
    hypothesis?.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" &&
    (hypothesis.functionalOperation === "AGENT" || hypothesis.functionalOperation === "ENABLE_PASSAGE") &&
    typeof hypothesis.statement === "string" &&
    hypothesis.statement.trim().length > 0;
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
    isInterpretationDecisionPolicyV0_1(sourceComponentHypothesis.interpretationDecisionPolicy) &&
    sourceComponentHypothesis.userDecisionPosture === "user_decides";
  const nativeSourceDerivedInput = reading?.nativeDomainToAgentSourceDerivedInput;
  const nativeReading = exactSourceStatus === "MATCHES_FOUND" &&
    reading?.nativeDomainToAgent?.inputForm === value.inputWord &&
    reading.nativeDomainToAgent.alternatives.every((alternative) =>
      records.some((record) => record.sourceRecordId === alternative.target.sourceRecordId &&
        sameWord(record.form, alternative.target.form)),
    )
    ? reading.nativeDomainToAgent
    : null;
  const nativeCognitiveReading = exactSourceStatus === "MATCHES_FOUND" &&
    reading?.nativeCognitiveStateToContent?.inputForm === value.inputWord &&
    reading.nativeCognitiveStateToContent.alternatives.every((alternative) =>
      records.some((record) => record.sourceRecordId === alternative.target.sourceRecordId &&
        sameWord(record.form, alternative.target.form)),
    )
    ? reading.nativeCognitiveStateToContent
    : null;
  const sourceUnavailable = exactSourceStatus === "UNAVAILABLE";

  return (
    <section
      aria-label="Albanian word reading"
      data-testid="primary-albanian-reading"
      className="rounded-xl border border-[#355a7a] bg-[#111a24] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-[#f5f7fb]">Albanian source reading</h2>
        <span className="rounded-full border border-[#355a7a] px-2.5 py-1 text-[11px] font-semibold text-[#cfe6ff]">
          {exactSourceStatusLabel(exactSourceStatus)}
        </span>
      </div>

      {independentComposition ? (
        <section
          aria-label="Exploratory functional composition"
          data-testid="primary-albanian-independent-composition"
          className="mt-3 min-w-0 rounded-lg border border-[#5e4b22] bg-[#19140d] p-3 text-sm leading-5 text-[#f0ddb0] [overflow-wrap:anywhere]"
        >
          <h3 className="text-base font-semibold text-[#f5e8c8]">How the word could express a shared activity or state</h3>
          <ol className="mt-2 space-y-3">
            {independentComposition.alternatives.map((alternative, index) => (
              <li key={index} className="min-w-0 rounded border border-[#40361f] p-2">
                <p className="font-semibold">
                  {alternative.modifier.surface} + {alternative.activity.surface}
                  {alternative.unresolved.map(({ surface, start }) => (
                    <span key={start}> + {surface} (unresolved)</span>
                  ))}
                </p>
                <p className="mt-1">{alternative.explanation}</p>
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer">Source senses and smaller units</summary>
                  {[alternative.modifier, alternative.activity].map(({ surface, start, end, record, senseOrdinal }) => (
                    <p key={start} className="mt-1">
                      Written {surface}, letters {start + 1}–{end} · Kaikki {record.form}, sense {senseOrdinal + 1}: {record.senses[senseOrdinal]?.glosses.join("; ")}
                      {" · "}{record.sourceRecordId} · {record.entryLocator}
                    </p>
                  ))}
                  <p className="mt-1">
                    English comparison · OEWN 2025 {alternative.comparison.lemma}: {alternative.comparison.definition}
                    {" · "}{alternative.comparison.senseId} · {alternative.comparison.synsetId}
                  </p>
                  <p className="mt-1">Whole word · Kaikki sense {alternative.targetSenseOrdinal + 1}</p>
                  {alternative.smallerProbes.length > 0 ? (
                    <ul className="mt-1">
                      {alternative.smallerProbes.map((probe) => (
                        <li key={`${probe.start}:${probe.end}`}>
                          {probe.form} ({probe.start + 1}–{probe.end}) · function unresolved
                          {probe.records.map((record) => (
                            <p key={record.sourceRecordId}>
                              Kaikki {record.form}: {record.senses.flatMap(({ glosses }) => glosses).join("; ") || "meaning unavailable"}
                              {" · "}{record.entryLocator}
                            </p>
                          ))}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </details>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs">
            Smallest functional unit unresolved. Written Voices: {independentComposition.writtenVoices.map(({ voice, position }) => `${voice}@${position + 1}`).join(" → ") || "Unknown/Null"} · interpretation remains with the user.
          </p>
        </section>
      ) : null}

      {nativeSeparativeReading ? (
        <section
          aria-label="Native separative functional reasoning"
          data-testid="primary-albanian-native-separative"
          className="mt-3 min-w-0 rounded-lg border border-[#5e4b22] bg-[#19140d] p-3 text-sm leading-5 text-[#f0ddb0] [overflow-wrap:anywhere]"
        >
          <h3 className="text-base font-semibold text-[#f5e8c8]">Functional event to changed state · exploratory</h3>
          <p className="mt-1 text-xs text-[#d8bb7a]">Source meanings remain separate from the proposed functional bridge.</p>
          <div className="mt-3 space-y-3">
            {nativeSeparativeReading.alternatives.filter((alternative) =>
              alternative.compatibility === "COMPATIBLE_FUNCTION_FAMILY" && alternative.explanation,
            ).map((alternative) => (
              <article
                key={`${alternative.target.sourceRecordId}:${alternative.functionalEmbryo?.sourceId ?? "no-bridge"}`}
                className="min-w-0 rounded border border-[#40361f] p-2"
              >
                <p className="font-semibold">{alternative.functionalEmbryo?.form} → division / separation → changed state</p>
                <p className="mt-1"><span className="font-semibold">Action · source-reported:</span> {alternative.action.text}</p>
                <p><span className="font-semibold">Affected entity · inferred:</span> {alternative.patient.description.text}; identity Unknown/Null</p>
                <p><span className="font-semibold">Initial state · inferred:</span> {alternative.initialState.text}</p>
                <p><span className="font-semibold">Changed state · inferred:</span> {alternative.changedState.text}</p>
                <p><span className="font-semibold">Target meaning · AlbaNet source-reported:</span> {alternative.wholeWordMeaning.text}</p>
                <p className="mt-1">{alternative.explanation}</p>
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer">Source records and retained alternatives</summary>
                  <p className="mt-1">DA source row {alternative.functionalEmbryo?.sourceId}: {alternative.functionalEmbryo?.lexicalFunction}</p>
                  <p>{alternative.functionalEmbryo?.sourceTitle} · {alternative.functionalEmbryo?.citationId} · {alternative.functionalEmbryo?.locator}</p>
                  <a className="underline" href={alternative.functionalEmbryo?.citationUrl} target="_blank" rel="noreferrer">Open DA source citation</a>
                  <p className="mt-1">AlbaNet {alternative.target.synsetId} · {alternative.target.sourceRecordId} · {alternative.target.entryLocator}</p>
                  <p>Source revision {nativeSeparativeReading.albanetSource.revision} · SHA-256 {nativeSeparativeReading.albanetSource.sha256} · target status: {alternative.target.sourceStatus}</p>
                  <p>Functional compatibility is a hypothesis; no source relation or historical origin is claimed.</p>
                </details>
              </article>
            ))}
          </div>
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer">All {nativeSeparativeSourceAlternatives.length} source senses, including those without a bridge</summary>
            <ul className="mt-1 space-y-1">
              {nativeSeparativeSourceAlternatives.map((alternative) => (
                <li key={alternative.target.sourceRecordId}>
                  {alternative.target.synsetId} · {alternative.target.definitions.join("; ") || "Definition unavailable"} · {alternative.compatibility === "COMPATIBLE_FUNCTION_FAMILY" ? "hypothesis available" : "no bridge produced"} · {alternative.target.entryLocator}
                </li>
              ))}
            </ul>
          </details>
          <p className="mt-2 text-xs">Written Voices: {nativeSeparativeReading.writtenVoices.map(({ voice, position }) => `${voice}@${position + 1}`).join(" → ") || "Unknown/Null"} · orthographic only · interpretation remains with the user.</p>
        </section>
      ) : null}

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
                  <details className="mt-1 text-xs text-[#aeb7c5]" data-testid="primary-albanian-source-record-details">
                    <summary className="cursor-pointer">Source record and citation details</summary>
                    <div className="mt-1 break-words">Record {record.sourceRecordId} · entry {record.entryLocator}{record.sourceSnapshot?.sourceFamilyId ? ` · source family ${record.sourceSnapshot.sourceFamilyId}` : ""}</div>
                    {record.sourceSnapshot ? (
                      <div className="break-words">Snapshot SHA-256 {record.sourceSnapshot.sha256} · {record.sourceStatus} · attestation {record.attestationTruth} · pronunciation authority {record.pronunciationAuthority}</div>
                    ) : null}
                    {record.sourceSnapshot?.sourceUrl ? (
                      <a className="break-all underline" href={record.sourceSnapshot.sourceUrl} target="_blank" rel="noreferrer">Open source record</a>
                    ) : null}
                    {record.senses.some((sense) => sense.senseId) ? (
                      <div className="mt-1 break-words">Source sense IDs: {record.senses.map((sense, senseIndex) => sense.senseId ? `Sense ${senseIndex + 1} · ${sense.senseId}` : null).filter(Boolean).join(" · ")}</div>
                    ) : null}
                  </details>
                  {record.senses.length > 0 ? (
                    <ol className="mt-2 space-y-2">
                      {record.senses.map((sense, senseIndex) => (
                        <li
                          key={`${sense.senseId ?? "sense"}:${senseIndex}`}
                          className="rounded-md border border-[#27313d] bg-[#11161c] p-2"
                        >
                          <p className="text-[11px] font-semibold text-[#aeb7c5]">
                            Source sense {senseIndex + 1}
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
          {nativeCognitiveReading ? (
            <div className="mt-2 min-w-0 space-y-2" data-testid="primary-albanian-native-cognitive-state-to-content">
              <p className="font-semibold">Cognitive state to content · exploratory</p>
              {nativeCognitiveReading.alternatives.map((alternative) => (
                <div
                  key={JSON.stringify([alternative.base.sourceRecordId, alternative.base.senseId,
                    alternative.target.sourceRecordId, alternative.target.senseId, alternative.frame.senseId])}
                  className="min-w-0 space-y-1 [overflow-wrap:anywhere]"
                >
                  <p data-testid="primary-albanian-native-cognitive-explanation">{alternative.explanation}</p>
                  <p><span className="font-semibold">State of knowing (inferred):</span> {alternative.stateOfKnowing.text}</p>
                  <p><span className="font-semibold">Known content (inferred):</span> {alternative.knownContent.text}</p>
                  <p><span className="font-semibold">Acquisition · Unknown/Null:</span> {alternative.acquisition.reason}</p>
                  <p><span className="font-semibold">Unknown-to-known transition · Unknown/Null:</span> {alternative.unknownToKnownTransition.reason}</p>
                  <details className="mt-2 text-xs [overflow-wrap:anywhere]">
                    <summary className="cursor-pointer">Sources and unresolved parts</summary>
                    <p className="mt-1">Kaikki reports: {alternative.sourceRelation.sourceText}</p>
                    <p>Source record {alternative.sourceRelation.targetSourceRecordId} · {alternative.sourceRelation.targetEntryLocator}</p>
                    <p>Base record {alternative.sourceRelation.baseSourceRecordId} · {alternative.sourceRelation.baseEntryLocator}</p>
                    <p>Linked form {alternative.sourceRelation.sourceForm} · {alternative.sourceRelation.reference}</p>
                    <p>Kaikki source SHA-256 {alternative.sourceRelation.albanianSourceSha256}</p>
                    <p>Reviewed candidate: {alternative.sourceRelation.reviewedCandidateDisplayForm} · {alternative.sourceRelation.reviewedCandidateSourceId}</p>
                    <p>Base sense {alternative.base.senseId} · {alternative.base.entryLocator}</p>
                    <p>Target sense {alternative.target.senseId} · {alternative.target.entryLocator}</p>
                    <p>
                      Approximate English comparison ·{" "}
                      <a className="underline" href="https://en-word.net/" target="_blank" rel="noreferrer">Open English WordNet 2025</a>
                      {" "}· CC BY 4.0 · Princeton WordNet and Open English WordNet Community
                    </p>
                    <p>OEWN verb.cognition sense {alternative.frame.senseId} · {alternative.frame.synsetId}</p>
                    <p>Approximate definition: {alternative.frame.definition}</p>
                    <p>Archive SHA-256 {nativeCognitiveReading.oewnArtifactSha256}</p>
                    <p>{alternative.unresolved.join(" ")}</p>
                  </details>
                </div>
              ))}
            </div>
          ) : null}
          {nativeReading && (sourceComponentReading || nativeSourceDerivedInput) ? (
            <div className="mt-2 space-y-2" data-testid="primary-albanian-native-agent">
              <p className="font-semibold">Domain to agent role · exploratory</p>
              {nativeReading.alternatives.map(({ base, target, frames, explanation }) => (
                <div key={JSON.stringify([base.sourceRecordId, base.senseId, target.sourceRecordId, target.senseId])}>
                  <p data-testid="primary-albanian-native-agent-explanation">{explanation}</p>
                  <details className="mt-2 text-xs [overflow-wrap:anywhere]">
                    <summary className="cursor-pointer">Sources and alternatives</summary>
                    {sourceComponentReading
                      ? <p>Kaikki reports: {sourceComponentReading.relation.sourceAuthoredExplanation}</p>
                      : <p>
                          Source-reported relation: {nativeSourceDerivedInput?.bases.map(({ base, relation }) =>
                            `${base.form} record ${relation.sourceRelationAssertion.assertionScope === "SOURCE_SENSE"
                              ? `sense ${relation.sourceRelationAssertion.sourceSenseId}`
                              : ""} lists ${relation.form} as a derived form`,
                          ).join(" / ")}. Suffix function remains unresolved.
                        </p>}
                    <p>Base sense {base.senseId} · {base.entryLocator}</p>
                    <p>Target sense {target.senseId} · {target.entryLocator}</p>
                    <p>
                      Approximate English comparison ·{" "}
                      <a className="underline" href="https://en-word.net/" target="_blank" rel="noreferrer">Open English WordNet 2025</a>
                      {" "}·{" "}
                      <a className="underline" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
                      {" "}· Princeton WordNet and Open English WordNet Community
                    </p>
                    <p>Archive SHA-256 {nativeReading.oewnArtifactSha256}</p>
                    <ul>
                      {frames.map(({ senseId, synsetId }) => <li key={senseId}>{senseId} · {synsetId}</li>)}
                    </ul>
                    <p>Source meanings retained</p>
                    <ul>
                      {(sourceComponentReading
                        ? [sourceComponentReading.primary, ...sourceComponentReading.components]
                        : nativeSourceDerivedInput
                          ? [nativeSourceDerivedInput.target, ...nativeSourceDerivedInput.bases.map(({ base }) => base)]
                          : []).flatMap((record) =>
                        (record.sourceSenses ?? []).map((sense) => (
                          <li key={JSON.stringify([record.sourceRecordId, sense.sourceSenseOrdinal])}>
                            {record.form} · {sense.glosses.join(" / ")} · {sense.senseId ?? "Sense ID unavailable"} · {record.entryLocator}
                          </li>
                        )))}
                    </ul>
                    <p>Written Voices {nativeReading.writtenVoices.map(({ voice, position }) => `${voice}@${position}`).join(" → ")}</p>
                    <p>Suffix function, minimal embryo status, and functional Voice roles remain unresolved.</p>
                  </details>
                </div>
              ))}
            </div>
          ) : supportedHypothesis ? (
            <>
              <p className="mt-2 font-semibold">
                Functional role: {humanReadableStatusLabelV0_1(hypothesis.functionalOperation)} · exploratory
              </p>
              <p
                className="mt-2 break-words"
                data-testid="primary-albanian-functional-hypothesis-statement"
              >
                Word-specific explanation: {hypothesis.statement}
              </p>
              <p className="mt-2 break-words">
                {hypothesis.functionalOperation === "AGENT"
                  ? "Source evidence for this exact reading supports this exploratory classification. It does not establish morphology, historical derivation, or embryo meaning."
                  : "This exploratory interpretation is bounded to the exact source evidence and sense above. It does not establish morphology, historical derivation, or embryo meaning."}
              </p>
            </>
          ) : supportedSourceComponentHypothesis ? (
            <p className="mt-2">
              No functional operation is classified for this source reading. A separate source-linked conditional component proposal appears below; its component meaning remains unestablished.
            </p>
          ) : (
            <p className="mt-2">
              No supported functional interpretation is available for this exact source reading.
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
            <p className="mt-2 font-semibold">Exploratory functional proposal</p>
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
              <li>Component meaning is not established; more than one reading may be possible, and you decide.</li>
              <li>Functional operation: Null — none is classified by this hypothesis.</li>
            </ul>
            {sourceComponentHypothesis.alternatives.length > 0 ? (
              <div className="mt-2 break-words text-xs">
                Alternatives: {sourceComponentHypothesis.alternatives.join(" ")}
              </div>
            ) : null}
            <details className="mt-2 break-words text-xs">
              <summary className="cursor-pointer">Source record references</summary>
              {sourceComponentHypothesis.evidenceRefs
                .map((reference) => `${reference.sourceRecordId} · ${reference.entryLocator} · senses ${reference.senseIds.join(", ") || "UNKNOWN_OR_NULL"}`)
                .join(" | ")}
            </details>
            <p className="mt-2 break-words text-xs text-[#d5c28f]">
              Source-linked reading boundary: {humanReadableStatusTextV0_1(sourceComponentReading.claimBoundary)}
            </p>
            <p className="mt-1 break-words text-xs text-[#d5c28f]">
              Functional hypothesis boundary: {humanReadableStatusTextV0_1(sourceComponentHypothesis.claimBoundary)}
            </p>
            <details className="mt-1 text-xs">
              <summary className="cursor-pointer">Exact claim classifications</summary>
              Source boundary: {sourceComponentReading.claimBoundary} · functional boundary: {sourceComponentHypothesis.claimBoundary}
            </details>
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
              <p className="mt-2 text-xs">{humanReadableStatusLabelV0_1(analysisStatus.value.status)}</p>
              <p className="mt-1">{humanReadableStatusTextV0_1(analysisStatus.value.summary)}</p>
              <details className="mt-1 text-xs">
                <summary className="cursor-pointer">Exact status details</summary>
                {analysisStatus.value.status}
              </details>
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
            <li>Morphological decomposition: not established.</li>
            <li>Historical derivation: not established by these source facts.</li>
            <li>
              Source pronunciation: {reading?.sourcePronunciation?.status === "SUPPORTED" && reading.sourcePronunciation.rawIpa
                ? `${reading.sourcePronunciation.rawIpa} · current Kaikki record only, not frozen spoken authority.`
                : "Null / unavailable."}
            </li>
            <li>{nativeReading
              ? "Smallest functional embryo and suffix contribution remain unresolved."
              : "Independent component meaning or function: not established."}</li>
          </ul>
        </section>
      </div>
    </section>
  );
}
