"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildCurrentWordDaAnchoredEmbryoCandidateV0_1,
  buildCurrentWordExploratoryMotivationV0_1,
  buildCurrentWordSourceFunctionalSuggestionV0_1,
  type CurrentWordSourceFunctionalSuggestionDraftV0_1,
  type RuntimeAlbanianSourceSenseSelectionV0_1,
  type RuntimeFjaloriSourceResponseV0_1,
} from "@/ui/instrument/sections/currentWordSourceFunctionalSuggestionAdapter.v0_1";
import type { AlbanianKaikkiExactLexicalSourceFactV0_1 } from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import type { SymbolicFunctionalCompositionResultV0_3 } from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";
import { SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_3 } from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";

const textFieldClass = "mt-1 w-full min-w-0 rounded border border-[#46505c] bg-[#0d1117] px-2 py-1.5 text-sm text-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]";
const fieldLabelClass = "block min-w-0 text-xs font-medium text-[#c5ced8]";
const missingEvaluation: SymbolicFunctionalCompositionResultV0_3 = {
  ok: false,
  schemaVersion: SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_3,
  reasonCodes: ["SYMBOLIC_EVALUATION_NOT_SUPPLIED"],
};

type DraftField = Exclude<keyof CurrentWordSourceFunctionalSuggestionDraftV0_1,
  "analyzedWord" | "draftTargetWord" | "language" | "variety" | "sourceReportsActionRelation">;

const emptyFields: Pick<CurrentWordSourceFunctionalSuggestionDraftV0_1, DraftField> = {
  sourceTargetForm: "",
  targetSenseLabel: "",
  targetSenseDefinition: "",
  targetSourceLabel: "",
  targetSourceUrl: "",
  targetSourceLocator: "",
  relatedVerbForm: "",
  verbFunctionText: "",
  verbSourceLabel: "",
  verbSourceUrl: "",
  verbSourceLocator: "",
  alternativeSenseLabel: "",
  alternativeSenseDefinition: "",
};

export function CurrentWordSourceFunctionalSuggestionV0_1({
  analyzedWord,
  draftTargetWord,
  language,
  variety,
  identityMatches,
  runtimeSourceStatus,
  selectedSourceSense = null,
  sourceFacts = [],
  fjaloriSourceResponse = null,
  evaluation = missingEvaluation,
}: {
  analyzedWord: string;
  draftTargetWord: string;
  language: string;
  variety: string;
  identityMatches: boolean;
  runtimeSourceStatus?: Readonly<{ status: string; reasonCode?: string | null }>;
  selectedSourceSense?: RuntimeAlbanianSourceSenseSelectionV0_1 | null;
  sourceFacts?: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  fjaloriSourceResponse?: RuntimeFjaloriSourceResponseV0_1 | null;
  evaluation?: SymbolicFunctionalCompositionResultV0_3;
}) {
  const contextIdentity = [analyzedWord, draftTargetWord, language, variety]
    .map((value) => value.normalize("NFC").trim().toLocaleLowerCase("sq-AL"))
    .join("\u0000");
  const [fields, setFields] = useState(emptyFields);
  const [sourceReportsActionRelation, setSourceReportsActionRelation] = useState(false);
  const [draftContextIdentity, setDraftContextIdentity] = useState(contextIdentity);
  const identityIsCurrent = draftContextIdentity === contextIdentity;
  const currentFields = identityIsCurrent ? fields : emptyFields;
  const currentSourceReportsActionRelation = identityIsCurrent ? sourceReportsActionRelation : false;
  useEffect(() => {
    if (identityIsCurrent) return;
    setFields(emptyFields);
    setSourceReportsActionRelation(false);
    setDraftContextIdentity(contextIdentity);
  }, [contextIdentity, identityIsCurrent]);
  const projection = useMemo(() => buildCurrentWordSourceFunctionalSuggestionV0_1({
    ...currentFields,
    analyzedWord,
    draftTargetWord,
    language,
    variety,
    sourceReportsActionRelation: currentSourceReportsActionRelation,
  }), [currentFields, analyzedWord, draftTargetWord, language, variety, currentSourceReportsActionRelation]);

  const update = (field: DraftField, value: string) => setFields((current) => ({
    ...(identityIsCurrent ? current : emptyFields),
    [field]: value,
  }));
  const content = projection.result?.ok ? projection.result.content : null;
  const composition = content?.compositions.find(({ targetSenseId }) => targetSenseId === content.target.selectedSense.senseId);
  const exploratoryProjection = useMemo(() => buildCurrentWordExploratoryMotivationV0_1({
    analyzedWord,
    draftTargetWord,
    language,
    variety,
    selectedSourceSense,
    evaluation,
  }), [analyzedWord, draftTargetWord, language, variety, selectedSourceSense, evaluation]);
  const selectedSenseIdentity = selectedSourceSense
    ? [selectedSourceSense.exactSourceForm, selectedSourceSense.apiUrl,
      selectedSourceSense.selectedSense.entryIndex, selectedSourceSense.selectedSense.senseIndex,
      selectedSourceSense.selectedSense.senseSource, selectedSourceSense.selectedSense.gloss]
      .map((value) => String(value).normalize("NFC").trim().toLocaleLowerCase("sq-AL")).join("\u0001")
    : "NO_SENSE_SELECTED";
  const daProposalIdentity = contextIdentity + "\u0002" + (identityMatches ? "IDENTITY_MATCHED" : "IDENTITY_NOT_CONFIRMED") + "\u0002" + selectedSenseIdentity;
  const [daProposalStateIdentity, setDaProposalStateIdentity] = useState(daProposalIdentity);
  const [selectedDaOccurrenceId, setSelectedDaOccurrenceId] = useState<string | null>(null);
  const daProposalStateIsCurrent = daProposalStateIdentity === daProposalIdentity;
  useEffect(() => {
    if (daProposalStateIsCurrent) return;
    setSelectedDaOccurrenceId(null);
    setDaProposalStateIdentity(daProposalIdentity);
  }, [daProposalIdentity, daProposalStateIsCurrent]);
  const currentSelectedDaOccurrenceId = daProposalStateIsCurrent ? selectedDaOccurrenceId : null;
  const daCandidate = useMemo(() => buildCurrentWordDaAnchoredEmbryoCandidateV0_1({
    analyzedWord,
    draftTargetWord,
    identityMatches,
    language,
    variety,
    selectedSourceSense,
    evaluation,
    exactSourceFacts: sourceFacts,
    fjaloriSourceResponse,
    proposedOccurrenceId: currentSelectedDaOccurrenceId,
  }), [analyzedWord, draftTargetWord, identityMatches, language, variety, selectedSourceSense, sourceFacts, fjaloriSourceResponse, evaluation, currentSelectedDaOccurrenceId]);

  const selectDaOccurrence = (occurrenceId: string, checked: boolean) => {
    setDaProposalStateIdentity(daProposalIdentity);
    setSelectedDaOccurrenceId(checked ? occurrenceId : null);
  };

  return (
    <section
      aria-label="Current-word source-linked functional suggestion"
      data-testid="current-word-source-functional-suggestion"
      className="mt-3 min-w-0 rounded border border-[#46505c] bg-[#0e1411] p-2 text-xs leading-5"
    >
      <h4 className="font-semibold text-[#d8e4ca]">Source-linked conditional function suggestion</h4>
      <p className="mt-1 text-[#aeb7c5]">
        Generated DA candidates use exact-form lexical senses available from the analysis sources, the reviewed standalone DA record, and observed spelling structure. Provider records remain separate, and no source sense or interpretation is selected automatically. Optional Voice operations can add a separate symbolic layer; they are not required to see the functional candidate.
      </p>
      {daCandidate.occurrences.length ? (
      <div className="mt-2 min-w-0 rounded border border-[#53604a] bg-[#111710] p-2" data-testid="current-word-da-anchored-candidate">
        <h5 className="font-semibold text-[#f5f7fb]">DA-anchored functional embryo candidate</h5>
        {daCandidate.generatedFunctionalMotivation.candidates.length ? (
          <section className="mt-2 space-y-2 rounded border border-[#52614a] bg-[#0c120e] p-2" data-testid="current-word-da-family-functional-network">
            <h6 className="font-semibold text-[#d8e4ca]">Proposed embryo-to-family-to-word reading · unselected</h6>
            {daCandidate.generatedFunctionalMotivation.candidates.map((candidate) => (
              <article key={candidate.candidateId} className="min-w-0 space-y-1" data-testid="current-word-da-family-functional-candidate">
                <p className="break-words" data-testid="current-word-da-family-functional-equation">
                  {candidate.familyNetwork.functionalEquation}
                </p>
                <p className="break-words" data-testid="current-word-da-generated-functional-reading">
                  {candidate.familyNetwork.explanation}
                </p>
                <p className="break-words text-[10px] text-[#aeb7c5]">
                  {"Target sense candidate · SOURCE_FACT · "}
                  {candidate.familyNetwork.target?.evidenceStatus ?? "UNKNOWN_OR_NULL"}
                  {" · “"}
                  {candidate.targetSenseGlosses.join("; ")}
                  {"” · unselected."}
                </p>
                <p className="break-words text-[10px] text-[#aeb7c5]">
                  Profile direct forms: {candidate.familyNetwork.directForms.map(({ form, profileCategories }) => `${form.toLocaleUpperCase("sq-AL")} (${profileCategories.join(", ")})`).join(" · ") || "UNKNOWN_OR_NULL"} · derivative-family support: {candidate.familyNetwork.derivativeFamilyForms.map(({ form, profileCategories }) => `${form.toLocaleUpperCase("sq-AL")} (${profileCategories.join(", ")})`).join(" · ") || "UNKNOWN_OR_NULL"}.
                </p>
                <p className="break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-da-family-carrier-annotations">
                  ProtoRoots candidate annotations · EXPLORATORY_HYPOTHESIS · no source IDs: {[...candidate.familyNetwork.directForms, ...candidate.familyNetwork.derivativeFamilyForms].map(({ form, carrierAnnotation }) => `${form.toLocaleUpperCase("sq-AL")} ${carrierAnnotation ? `“${carrierAnnotation.gloss}”` : "UNKNOWN_OR_NULL"}`).join(" · ")}.
                </p>
                <p className="break-words text-[10px] text-[#aeb7c5]">
                  {candidate.familyNetwork.claimLayer} · {candidate.familyNetwork.selectionStatus} · whole-word {candidate.familyNetwork.wholeWordStatus} · sourceAuthorityPromotion {candidate.familyNetwork.sourceAuthorityPromotion} · historicalOrigin {candidate.familyNetwork.historicalOrigin} · no_single_winner / {candidate.familyNetwork.userDecisionPosture}.
                </p>
              </article>
            ))}
          </section>
        ) : null}
        {daCandidate.standaloneEvidence ? (
          <>
            <p className="mt-1 break-words" data-testid="current-word-da-source-fact">
              SOURCE_FACT · reviewed source row {daCandidate.standaloneEvidence.sourceStatus} · citation {daCandidate.standaloneEvidence.citationStatus}: Gheg {daCandidate.standaloneEvidence.sourceForm} — “{daCandidate.standaloneEvidence.attestedGloss}”.
            </p>
            <p className="mt-1 break-all text-[10px] text-[#aeb7c5]">
              {daCandidate.standaloneEvidence.sourceTitle} · {daCandidate.standaloneEvidence.sourceAuthorOrEditor} · {daCandidate.standaloneEvidence.locator} · source {daCandidate.standaloneEvidence.sourceId} · citation {daCandidate.standaloneEvidence.citationId} · <a className="underline" href={daCandidate.standaloneEvidence.sourceUrl} target="_blank" rel="noreferrer">source record</a>
            </p>
            <p className="mt-1 break-words text-[10px] text-[#aeb7c5]">
              DA-family forms {daCandidate.derivativeFamilySupport.map(({ form, categories }) => `${form} (${categories.join(", ")})`).join(" · ") || "UNKNOWN_OR_NULL"} remain separate derivative support. Homophone alternatives {daCandidate.homophoneCollisionAlternatives.map(({ form, glossTerms, categories }) => `${form} = ${glossTerms.join("/")} (${categories.join(", ")})`).join(" · ") || "UNKNOWN_OR_NULL"} are not assigned to this target.
            </p>
          </>
        ) : (
          <p role="status" className="mt-1 text-[#f0ddb0]">PARTIAL_NULL · {daCandidate.reasonCodes.join(" · ") || "DA source evidence unavailable"}</p>
        )}
        <p className="mt-2 break-words" data-testid="current-word-da-candidate-structure">
          DERIVED_STRUCTURE · {analyzedWord || "UNKNOWN_OR_NULL"}: {daCandidate.exactCodePoints.map(({ character, position }) => `${character}@${position}`).join(" · ") || "UNKNOWN_OR_NULL"} · written Voices {daCandidate.writtenVoices.map(({ voice, position }) => `${voice}@${position}`).join(" → ") || "∅"} · pronunciation NOT_ESTABLISHED.
        </p>
        {daCandidate.generatedFunctionalMotivation.candidates.length ? (
          <section className="mt-2 space-y-2" data-testid="current-word-da-generated-functional-candidates">
            <h6 className="font-semibold text-[#d8e4ca]">Generated functional-motivation candidates · unselected</h6>
            {daCandidate.generatedFunctionalMotivation.candidates.map((candidate) => (
              <article key={candidate.candidateId} className="min-w-0 rounded border border-[#465b42] bg-[#101710] p-2" data-testid="current-word-da-generated-functional-candidate">
                <p className="break-words" data-testid="current-word-da-generated-source-sense">
                  {candidate.targetSource.provider === "KAIKKI" ? (
                    <>SOURCE_FACT · Kaikki exact target form {candidate.targetSource.sourceFact.form} · {candidate.targetSource.sourceFact.sourceStatus} · attestation {candidate.targetSource.sourceFact.attestationTruth} · sense {candidate.targetSource.senseOrdinal}: {candidate.targetSenseGlosses.join("; ")} · {candidate.targetSource.sourceFact.sourceRecordId} · {candidate.targetSource.sourceFact.entryLocator}.</>
                  ) : (
                    <>SOURCE_FACT · FjaloriShqip response · response status {candidate.targetSource.responseStatus} · exact target form {candidate.targetSource.exactSourceForm} · Entry {candidate.targetSource.responsePosition.entryIndex} · Sense {candidate.targetSource.responsePosition.senseIndex} (response position, not a source-issued sense ID): {candidate.targetSenseGlosses.join("; ")} · sense attribution {candidate.targetSource.senseSource} · gloss language {candidate.targetSource.glossLanguage} · {candidate.targetSource.partOfSpeech ?? "part of speech UNKNOWN_OR_NULL"}.</>
                  )}
                </p>
                {candidate.targetSource.provider === "KAIKKI" ? (
                  <p className="mt-1 break-all text-[10px] text-[#aeb7c5]">
                    Source snapshot {candidate.targetSource.sourceFact.sourceSnapshot.sourceFamilyId} · SHA-256 {candidate.targetSource.sourceFact.sourceSnapshot.sha256} · {candidate.targetSource.sourceFact.sourceSnapshot.sourceUrl}
                  </p>
                ) : (
                  <p className="mt-1 break-all text-[10px] text-[#aeb7c5]" data-testid="current-word-da-generated-fjalori-provenance">
                    Record sources {candidate.targetSource.recordSources.join(" · ") || "UNKNOWN_OR_NULL"} · entry sources {candidate.targetSource.entrySources.join(" · ") || "UNKNOWN_OR_NULL"} · tags {candidate.targetSource.tags.join(" · ") || "UNKNOWN_OR_NULL"} · licence {candidate.targetSource.licence} · citation {candidate.targetSource.citationStatus} · licensing {candidate.targetSource.licensingStatus} · <a className="underline" href={candidate.targetSource.apiUrl} target="_blank" rel="noreferrer">source response</a>
                  </p>
                )}
                <p className="mt-1 break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-da-generated-structure">
                  DERIVED_STRUCTURE · exact DA span [{candidate.occurrence.span.start},{candidate.occurrence.span.end}) in {analyzedWord} · written Voices {daCandidate.writtenVoices.map(({ voice, position }) => `${voice}@${position}`).join(" → ") || "∅"}.
                </p>
                <p className="mt-1 break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-da-generated-claim-boundary">
                  {candidate.claimLayer} · generated candidate · {candidate.selectionStatus} · whole-word {candidate.wholeWordStatus} · sourceAuthorityPromotion {candidate.sourceAuthorityPromotion} · historicalOrigin {candidate.historicalOrigin} · no_single_winner / {candidate.userDecisionPosture}.
                </p>
                <p className="mt-1 break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-da-generated-unresolved">
                  Unresolved: {candidate.unresolvedMaterial.join(" · ") || "UNKNOWN_OR_NULL"}
                </p>
              </article>
            ))}
          </section>
        ) : (
          <p role="status" className="mt-2 break-words text-[#f0ddb0]" data-testid="current-word-da-generated-functional-null">
            PARTIAL_NULL · no conditional DA functional candidate is available · {daCandidate.generatedFunctionalMotivation.reasonCodes.join(" · ") || "UNKNOWN_OR_NULL"}. Missing exact-form source data does not establish that the target is absent from Albanian.
          </p>
        )}
        {daCandidate.occurrences.length ? (
          <fieldset className="mt-2 min-w-0 rounded border border-[#38433a] p-2">
            <legend className="px-1 font-semibold text-[#d8e4ca]">Optional DA target mapping for computed Voice enrichment · no automatic selection</legend>
            {daCandidate.occurrences.map((occurrence) => (
              <label key={occurrence.occurrenceId} className="mt-1 flex min-w-0 items-start gap-2 break-words text-[#c5ced8]">
                <input
                  type="checkbox"
                  aria-label={`Propose DA at code-point span ${occurrence.span.start} to ${occurrence.span.end}`}
                  className="mt-1 shrink-0 accent-[#d8bb7a]"
                  checked={currentSelectedDaOccurrenceId === occurrence.occurrenceId}
                  disabled={!selectedSourceSense || !identityMatches}
                  onChange={(event) => selectDaOccurrence(occurrence.occurrenceId, event.target.checked)}
                />
                <span>Explicit proposal: {occurrence.exactSurface} at zero-based code-point span [{occurrence.span.start},{occurrence.span.end}) · DERIVED_STRUCTURE. Align with selected whole-word sense only as USER_PROPOSED / EXPLORATORY_HYPOTHESIS; this is not a morpheme boundary or derivation.</span>
              </label>
            ))}
            {!selectedSourceSense ? <p role="status" className="mt-1 text-[#f0ddb0]">Select a whole-word source sense only if you want the optional operator-enriched trace below. The generated functional candidate above does not require this selection.</p> : null}
          </fieldset>
        ) : (
          <p role="status" className="mt-2 text-[#f0ddb0]" data-testid="current-word-da-candidate-null">
            No exact DA substring candidate in this spelling · {daCandidate.reasonCodes.join(" · ") || "DA_EXACT_SUBSTRING_NOT_FOUND"}.
          </p>
        )}
        {daCandidate.functionalReading ? (
          <>
            <p className="mt-2 break-words" data-testid="current-word-exploratory-explanation">{daCandidate.functionalReading}</p>
            <p className="mt-1 break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-da-computed-operations">
              COMPUTED from user-selected symbolic hypotheses: {daCandidate.computedVoiceOperations.map(({ voice, position, contribution }) => `${voice}@${position} · ${contribution}`).join(" · ") || "UNKNOWN_OR_NULL"}.
            </p>
            <p className="mt-1 break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-da-overlapping-voices">
              Voice overlap: {daCandidate.overlappingVoiceEvents.map(({ voice, position }) => `${voice}@${position}`).join(" · ") || "none"}; conserved once in the written path. Unresolved: {daCandidate.unresolvedMaterial.join(" · ") || "UNKNOWN_OR_NULL"}.
            </p>
            <p className="mt-1">Target mapping USER_PROPOSED / EXPLORATORY_HYPOTHESIS · whole-word PARTIAL_NULL · source-authority promotion NONE · historical origin NOT_CLAIMED · no_single_winner / user_decides</p>
          </>
        ) : currentSelectedDaOccurrenceId ? (
          <p role="status" className="mt-2 break-words text-[#f0ddb0]" data-testid="current-word-da-proposal-null">
            PARTIAL_NULL · proposal remains USER_PROPOSED, but no complete candidate explanation is available · {daCandidate.reasonCodes.join(" · ") || daCandidate.unresolvedMaterial.join(" · ") || "UNKNOWN_OR_NULL"}.
          </p>
        ) : (
          <p role="status" className="mt-2 text-[#aeb7c5]" data-testid="current-word-da-not-selected">
            Candidate only · no target mapping or interpretation is selected automatically · user_decides.
          </p>
        )}
        <details className="mt-2 rounded border border-[#38433a] p-2" data-testid="current-word-da-candidate-details">
          <summary className="cursor-pointer font-semibold text-[#d8e4ca]">View DA candidate trace and evidence</summary>
          {daCandidate.selectedSourceSense ? <p className="mt-1 break-words">Selected source sense SOURCE_FACT / {daCandidate.selectedSourceSense.evidenceStatus}: {daCandidate.selectedSourceSense.label} · {daCandidate.selectedSourceSense.responsePosition} · {daCandidate.selectedSourceSense.sourceId}.</p> : <p className="mt-1">Selected whole-word source sense UNKNOWN_OR_NULL.</p>}
          {daCandidate.alternatives.length ? <p className="mt-1 break-words">Alternative senses remain separate SOURCE_FACT candidates: {daCandidate.alternatives.map(({ label }) => label).join(" · ")}.</p> : null}
          {daCandidate.reasoningTrace ? (
            <ol className="mt-1 list-decimal space-y-1 pl-5" data-testid="current-word-da-reasoning-trace">
              {daCandidate.reasoningTrace.reasoningTrace.map((step) => <li key={step.id} className="break-words">{step.title}: {step.from} → {step.to} · {step.claimLayer} / {step.status} · {step.evidenceNote} · {step.supportBoundary}</li>)}
            </ol>
          ) : null}
          <p className="mt-1">Target mapping claim {daCandidate.targetMappingClaimLayer} / {daCandidate.targetMappingEvidenceStatus}; selected occurrence {daCandidate.selectedOccurrenceId ?? "NONE"}.</p>
          <p className="mt-1 break-words">Status {daCandidate.status} · source status {daCandidate.standaloneEvidence?.sourceStatus ?? "UNKNOWN_OR_NULL"} · citation status {daCandidate.standaloneEvidence?.citationStatus ?? "UNKNOWN_OR_NULL"} · unresolved {daCandidate.unresolvedMaterial.join(" · ") || "UNKNOWN_OR_NULL"} · reasons {daCandidate.reasonCodes.join(" · ") || "NONE"}.</p>
          <p className="mt-1">no_single_winner · selected candidate {daCandidate.selectedOccurrenceId ?? "NONE"} · user_decides · sourceAuthorityPromotion {daCandidate.sourceAuthorityPromotion} · historicalOrigin {daCandidate.historicalOrigin}.</p>
        </details>
      </div>
      ) : null}
      <div className="mt-2 rounded border border-[#53604a] bg-[#111710] p-2" data-testid="current-word-exploratory-motivation">
        <h5 className="font-semibold text-[#f5f7fb]">Conditional exploratory interpretation</h5>
        {exploratoryProjection.sourceContent?.ok ? (
          <>
            <p className="mt-1 break-words" data-testid="current-word-exploratory-selected-sense">
              SOURCE_FACT · CITATION_ENTERED_UNVERIFIED · {exploratoryProjection.sourceContent.content.target.selectedSense.label}
            </p>
            <p className="mt-1 break-words text-[10px] text-[#aeb7c5]">
              FjaloriShqip · {selectedSourceSense?.selectedSense.senseSource} · Entry {selectedSourceSense?.selectedSense.entryIndex} · Sense {selectedSourceSense?.selectedSense.senseIndex} · response position, not a source-issued sense ID · entry sources {selectedSourceSense?.selectedSense.entrySources.join(", ") || "UNKNOWN_OR_NULL"} · record sources {selectedSourceSense?.recordSources.join(", ") || "UNKNOWN_OR_NULL"}
            </p>
            {selectedSourceSense ? (
              <p className="mt-1 break-all text-[10px] text-[#aeb7c5]" data-testid="current-word-exploratory-source-citation">
                Source response: <a className="underline" href={selectedSourceSense.apiUrl} target="_blank" rel="noreferrer">{selectedSourceSense.apiUrl}</a> · {selectedSourceSense.licence} · citation CITATION_ENTERED_UNVERIFIED
              </p>
            ) : null}
            {daCandidate.functionalReading ? (
              <p className="mt-2 break-words text-[#aeb7c5]" data-testid="current-word-da-explanation-reference">
                The DA-anchored proposal and its computed explanation are shown above; this section does not repeat them.
              </p>
            ) : exploratoryProjection.conditionalExplanation ? (
              <p className="mt-2 break-words" data-testid="current-word-exploratory-explanation">
                {exploratoryProjection.conditionalExplanation}
              </p>
            ) : (
              <p role="status" className="mt-2 text-[#f0ddb0]" data-testid="current-word-exploratory-null">
                PARTIAL_NULL · choose at least one complete Voice operation with an explicit computed operand.
              </p>
            )}
            {exploratoryProjection.computedContributions.length && !daCandidate.functionalReading ? (
              <ol className="mt-2 space-y-1" data-testid="current-word-exploratory-computed-contributions">
                {exploratoryProjection.computedContributions.map((contribution) => (
                  <li key={contribution.operationId} className="break-words">
                    COMPUTED · {contribution.voice}@{contribution.position} · {contribution.contribution} · USER_PROPOSED / EXPLORATORY_HYPOTHESIS
                  </li>
                ))}
              </ol>
            ) : null}
            {exploratoryProjection.sourceContent.content.target.alternativeSenses.length ? (
              <div className="mt-2" data-testid="current-word-exploratory-alternatives">
                Other source response senses remain alternatives: {exploratoryProjection.sourceContent.content.target.alternativeSenses.map(({ label }) => label).join(" · ")} · CITATION_ENTERED_UNVERIFIED
              </div>
            ) : null}
            <p className="mt-2 break-words text-[#c5b995]">
              The source response reports the lexical gloss only; it does not establish a symbolic, morphological, or derivational relationship. Remaining material: {exploratoryProjection.unresolved.join(" · ") || "UNKNOWN_OR_NULL"}.
            </p>
            <p className="mt-1">Conditional proposal: {exploratoryProjection.status} · whole-word status: {exploratoryProjection.wholeWordStatus} · source-authority promotion {exploratoryProjection.sourceAuthorityPromotion} · historical origin {exploratoryProjection.historicalOrigin}</p>
            <p className="mt-1" data-testid="current-word-exploratory-decision">{exploratoryProjection.noSingleWinner ? "no_single_winner" : "UNKNOWN_OR_NULL"} · {exploratoryProjection.userDecisionPosture}</p>
            {exploratoryProjection.reasonCodes.length ? (
              <p className="mt-1 break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-exploratory-reason-codes">
                Reason codes: {exploratoryProjection.reasonCodes.join(" · ")}
              </p>
            ) : null}
          </>
        ) : (
          <p role="status" className="mt-1 text-[#f0ddb0]" data-testid="current-word-exploratory-null">
            PARTIAL_NULL · {exploratoryProjection.reasonCodes.join(" · ") || "No source sense is selected. Choose one explicitly in the Overview FjaloriShqip panel; no interpretation is selected automatically."}
          </p>
        )}
      </div>
      <p className="mt-1 text-[#c5ced8]" data-testid="current-word-source-suggestion-runtime-status">
        Existing analysis lexical-source status (separate from the selected FjaloriShqip response): {runtimeSourceStatus?.status ?? "UNKNOWN_OR_NULL"}
        {runtimeSourceStatus?.reasonCode ? ` · ${runtimeSourceStatus.reasonCode}` : ""}. A missing runtime lookup does not become evidence here.
      </p>

      <details className="mt-2 rounded border border-[#38433a] p-2" data-testid="current-word-source-functional-manual-fallback">
        <summary className="cursor-pointer font-semibold text-[#d8e4ca]">Optional manual research fallback · enter separate source claims</summary>
        <p className="mt-1 text-[10px] text-[#aeb7c5]">Enter an optional separately cited research relation here. Each claim remains user-entered and citation-unverified. This fallback is independent of the reviewed DA substring candidate above; neither input path verifies the other.</p>

      {!identityMatches ? (
        <p role="status" data-testid="current-word-source-suggestion-identity-null" className="mt-2 rounded border border-[#746541] bg-[#18140e] p-2 text-[#f0ddb0]">
          PARTIAL_NULL · current draft target does not match analyzed form {analyzedWord || "UNKNOWN_OR_NULL"}; entered source relationships are withheld.
        </p>
      ) : (
        <>
          <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
            <label className={fieldLabelClass}>
              Exact target form in cited source
              <input aria-label="Exact source target form" className={textFieldClass} value={currentFields.sourceTargetForm} onChange={(event) => update("sourceTargetForm", event.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Source-reported target sense label
              <input aria-label="Source-reported target sense label" className={textFieldClass} value={currentFields.targetSenseLabel} onChange={(event) => update("targetSenseLabel", event.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Short source paraphrase of the target sense
              <textarea aria-label="Source target sense paraphrase" className={textFieldClass} rows={2} value={currentFields.targetSenseDefinition} onChange={(event) => update("targetSenseDefinition", event.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Related verb form
              <input aria-label="Related source verb form" className={textFieldClass} value={currentFields.relatedVerbForm} onChange={(event) => update("relatedVerbForm", event.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Short source paraphrase of the verb function
              <textarea aria-label="Source verb function paraphrase" className={textFieldClass} rows={2} value={currentFields.verbFunctionText} onChange={(event) => update("verbFunctionText", event.target.value)} />
            </label>
          </div>

          <fieldset className="mt-2 min-w-0 rounded border border-[#38433a] p-2">
            <legend className="px-1 font-semibold text-[#d8e4ca]">Target sense citation</legend>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              <label className={fieldLabelClass}>Source label<input aria-label="Target source label" className={textFieldClass} value={currentFields.targetSourceLabel} onChange={(event) => update("targetSourceLabel", event.target.value)} /></label>
              <label className={fieldLabelClass}>Source URL<input aria-label="Target source URL" className={textFieldClass} value={currentFields.targetSourceUrl} onChange={(event) => update("targetSourceUrl", event.target.value)} /></label>
              <label className={fieldLabelClass}>Sense/relation locator<input aria-label="Target source locator" className={textFieldClass} value={currentFields.targetSourceLocator} onChange={(event) => update("targetSourceLocator", event.target.value)} /></label>
            </div>
          </fieldset>

          <fieldset className="mt-2 min-w-0 rounded border border-[#38433a] p-2">
            <legend className="px-1 font-semibold text-[#d8e4ca]">Verb-function citation</legend>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              <label className={fieldLabelClass}>Source label<input aria-label="Verb source label" className={textFieldClass} value={currentFields.verbSourceLabel} onChange={(event) => update("verbSourceLabel", event.target.value)} /></label>
              <label className={fieldLabelClass}>Source URL<input aria-label="Verb source URL" className={textFieldClass} value={currentFields.verbSourceUrl} onChange={(event) => update("verbSourceUrl", event.target.value)} /></label>
              <label className={fieldLabelClass}>Verb sense locator<input aria-label="Verb source locator" className={textFieldClass} value={currentFields.verbSourceLocator} onChange={(event) => update("verbSourceLocator", event.target.value)} /></label>
            </div>
          </fieldset>

          <label className="mt-2 flex min-w-0 items-start gap-2 text-xs text-[#c5ced8]">
            <input
              aria-label="Source explicitly relates this action sense to the verb"
              className="mt-1 shrink-0 accent-[#d8bb7a]"
              type="checkbox"
              checked={currentSourceReportsActionRelation}
              onChange={(event) => setSourceReportsActionRelation(event.target.checked)}
            />
            <span>I am recording that the target source explicitly defines this selected sense by reference to the cited verb. This assertion is entered by me; the source and relation remain CITATION_ENTERED_UNVERIFIED.</span>
          </label>

          <details className="mt-2 rounded border border-[#38433a] p-2">
            <summary className="cursor-pointer font-semibold text-[#d8e4ca]">Add a separate alternative target sense (optional)</summary>
            <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
              <label className={fieldLabelClass}>Alternative sense label<input aria-label="Alternative source sense label" className={textFieldClass} value={currentFields.alternativeSenseLabel} onChange={(event) => update("alternativeSenseLabel", event.target.value)} /></label>
              <label className={fieldLabelClass}>Short alternative sense paraphrase<textarea aria-label="Alternative source sense paraphrase" className={textFieldClass} rows={2} value={currentFields.alternativeSenseDefinition} onChange={(event) => update("alternativeSenseDefinition", event.target.value)} /></label>
            </div>
          </details>

          <div className="mt-2 rounded border border-[#38433a] p-2" data-testid="current-word-source-functional-suggestion-result">
            <h5 className="font-semibold text-[#f5f7fb]">Conditional suggestion</h5>
            {projection.status === "CONDITIONAL_SUGGESTION" && content && composition?.resultText ? (
              <>
                <p className="mt-1 break-words" data-testid="current-word-source-functional-suggestion-text">
                  {content.target.exactSpelling}: {composition.resultText}
                </p>
                <p className="mt-1">{content.target.selectedSense.label}: {content.target.selectedSense.definition}</p>
                <p className="mt-1">{content.functionCandidates[0]?.exactForm}: {content.functionCandidates[0]?.functionText}</p>
                <p className="mt-1" data-testid="current-word-source-functional-relation">
                  Why suggested: you recorded the target source as relating this selected action sense to the listed verb function. The app has not independently checked that source assertion.
                </p>
                {content.target.alternativeSenses.map((sense) => (
                  <p key={sense.senseId} className="mt-1" data-testid="current-word-source-functional-alternative">
                    Separate alternative · {sense.label}: {sense.definition} · CITATION_ENTERED_UNVERIFIED
                  </p>
                ))}
                <p className="mt-1">Status: LOGICAL_INFERENCE · relation and function SOURCE_FACT / CITATION_ENTERED_UNVERIFIED · linguistic applicability NOT_ASSESSED</p>
                <p className="mt-1">Written Voices: {content.target.writtenVoices.map(({ voice, position }) => `${voice}@${position}`).join(" → ") || "∅"} · pronunciation NOT_ESTABLISHED</p>
                <p className="mt-1">No morphology or consonant meanings are inferred here. Historical origin NOT_CLAIMED · source-authority promotion NONE.</p>
                <p className="mt-1" data-testid="current-word-source-functional-decision">no_single_winner · user_decides</p>
              </>
            ) : (
              <p role="status" data-testid="current-word-source-functional-null">
                UNKNOWN_OR_NULL · no source-linked suggestion is available from the current inputs.
                {projection.reasonCodes.length ? ` · ${projection.reasonCodes.join(" · ")}` : ""}
              </p>
            )}
          </div>

          {content ? (
            <details className="mt-2 rounded border border-[#38433a] p-2" data-testid="current-word-source-functional-details">
              <summary className="cursor-pointer font-semibold text-[#d8e4ca]">View source and structural accounting</summary>
              <div className="mt-2" data-testid="current-word-source-functional-code-points">
                Exact code points: {content.target.codePoints.map(({ character, position }) => `${character}@${position}`).join(" · ")}
              </div>
              <div>Exact target form entered from source: {currentFields.sourceTargetForm}</div>
              <div>Representation authority: ORTHOGRAPHIC · pronunciation authority: NOT_ESTABLISHED</div>
              <div>Decision: {content.selection.mode} · {content.selection.userDecisionPosture}</div>
              <div>Production authority: {content.productionAuthority} · source authority promotion: {content.sourceAuthorityPromotion} · historical origin: {content.historicalOrigin}</div>
              <div>Engine relation source IDs: {composition?.provenance.relation.sourceIds.join(", ") || "UNKNOWN_OR_NULL"} · function source IDs: {composition?.provenance.function.sourceIds.join(", ") || "UNKNOWN_OR_NULL"}</div>
              <div>Unassigned target Voice roles: {content.voiceEvents.filter(({ roleStatus }) => roleStatus === "UNKNOWN_OR_NULL").map(({ voice, position }) => `${voice}@${position}`).join(", ") || "∅"} · UNKNOWN_OR_NULL</div>
              <div>Unassigned consonant associations: {content.consonantStructures.filter(({ status }) => status === "UNKNOWN_OR_NULL").map(({ character, position }) => `${character}@${position}`).join(", ") || "∅"} · UNKNOWN_OR_NULL</div>
              <div>Unresolved: {content.unresolved.map(({ text }) => text).join(" ") || "No additional unresolved items entered."}</div>
              <ul className="mt-1 list-disc pl-5">
                <li className="break-all">
                  Target: {currentFields.targetSourceLabel} · {currentFields.targetSourceUrl} · {currentFields.targetSourceLocator} · CITATION_ENTERED_UNVERIFIED · licensing NOT_ASSESSED
                </li>
                <li className="break-all">
                  Verb: {currentFields.verbSourceLabel} · {currentFields.verbSourceUrl} · {currentFields.verbSourceLocator} · CITATION_ENTERED_UNVERIFIED · licensing NOT_ASSESSED
                </li>
              </ul>
            </details>
          ) : null}
        </>
      )}
      </details>
    </section>
  );
}
