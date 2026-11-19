"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildCurrentWordEmbryoWholeFunctionalBridgeV0_1,
  buildCurrentWordExploratoryMotivationV0_1,
  buildCurrentWordSourceFunctionalSuggestionV0_1,
  type CurrentWordSourceFunctionalSuggestionDraftV0_1,
  type RuntimeAlbanianSourceSenseSelectionV0_1,
} from "@/ui/instrument/sections/currentWordSourceFunctionalSuggestionAdapter.v0_1";
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
  evaluation = missingEvaluation,
}: {
  analyzedWord: string;
  draftTargetWord: string;
  language: string;
  variety: string;
  identityMatches: boolean;
  runtimeSourceStatus?: Readonly<{ status: string; reasonCode?: string | null }>;
  selectedSourceSense?: RuntimeAlbanianSourceSenseSelectionV0_1 | null;
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
  const embryoWholeBridge = useMemo(() => buildCurrentWordEmbryoWholeFunctionalBridgeV0_1({
    analyzedWord,
    draftTargetWord,
    language,
    variety,
    selectedSourceSense,
    sourceRelation: projection,
    evaluation,
  }), [analyzedWord, draftTargetWord, language, variety, selectedSourceSense, projection, evaluation]);

  return (
    <section
      aria-label="Current-word source-linked functional suggestion"
      data-testid="current-word-source-functional-suggestion"
      className="mt-3 min-w-0 rounded border border-[#46505c] bg-[#0e1411] p-2 text-xs leading-5"
    >
      <h4 className="font-semibold text-[#d8e4ca]">Source-linked conditional function suggestion</h4>
      <p className="mt-1 text-[#aeb7c5]">
        Select a lexical sense in the Overview source panel, then choose symbolic hypotheses above. When a separate cited action relation is entered, the bridge compares the two sources by exact target spelling only; it does not merge their source identities or assume their senses are equivalent.
      </p>
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
            {embryoWholeBridge.explanation ? (
              <div className="mt-2 rounded border border-[#53604a] bg-[#0d1117] p-2" data-testid="current-word-embryo-whole-bridge">
                <p className="break-words" data-testid="current-word-exploratory-explanation">{embryoWholeBridge.explanation}</p>
                <p className="mt-1 break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-embryo-whole-bridge-structure">
                  DERIVED_STRUCTURE · ORTHOGRAPHIC: {embryoWholeBridge.exactCodePoints.map(({ character, position }) => `${character}@${position}`).join(" · ")} · written Voices {embryoWholeBridge.writtenVoices.map(({ voice, position }) => `${voice}@${position}`).join(" → ") || "∅"} · pronunciation NOT_ESTABLISHED
                </p>
                <p className="mt-1 break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-embryo-whole-bridge-embryos">
                  Selected spectrum inputs: {embryoWholeBridge.selectedSpectrumInputs.map(({ unit, span, text, evidenceStatus }) => `${unit}@${span.start}${span.end - span.start > 1 ? `-${span.end}` : ""} “${text}” · ${evidenceStatus} / EXPLORATORY_HYPOTHESIS`).join(" · ") || "UNKNOWN_OR_NULL"}
                </p>
                <p className="mt-1 break-words text-[10px] text-[#aeb7c5]" data-testid="current-word-embryo-whole-bridge-unresolved">
                  Unresolved structure: {embryoWholeBridge.unresolvedMaterial.join(" · ") || "UNKNOWN_OR_NULL"}
                </p>
                {embryoWholeBridge.enteredActionRelation ? (
                  <p className="mt-1 break-all text-[10px] text-[#aeb7c5]" data-testid="current-word-embryo-whole-bridge-sources">
                    Separate relation: SOURCE_FACT / CITATION_ENTERED_UNVERIFIED · composed relation LOGICAL_INFERENCE / CITATION_ENTERED_UNVERIFIED. Citations: <a className="underline" href={embryoWholeBridge.enteredActionRelation.targetSourceUrl} target="_blank" rel="noreferrer">{embryoWholeBridge.enteredActionRelation.targetSourceLabel}</a> · {embryoWholeBridge.enteredActionRelation.targetSourceLocator} · <a className="underline" href={embryoWholeBridge.enteredActionRelation.verbSourceUrl} target="_blank" rel="noreferrer">{embryoWholeBridge.enteredActionRelation.verbSourceLabel}</a> · {embryoWholeBridge.enteredActionRelation.verbSourceLocator} · licensing NOT_ASSESSED
                  </p>
                ) : null}
                <p className="mt-1 text-[10px] text-[#aeb7c5]">
                  Exact target-form match only · cross-source sense alignment UNKNOWN_OR_NULL · bridge EXPLORATORY_HYPOTHESIS / USER_PROPOSED · whole-word PARTIAL_NULL · source-authority promotion NONE · historical origin NOT_CLAIMED · no_single_winner / user_decides
                </p>
              </div>
            ) : exploratoryProjection.conditionalExplanation ? (
              <p className="mt-2 break-words" data-testid="current-word-exploratory-explanation">
                {exploratoryProjection.conditionalExplanation}
              </p>
            ) : (
              <p role="status" className="mt-2 text-[#f0ddb0]" data-testid="current-word-exploratory-null">
                PARTIAL_NULL · choose at least one complete Voice operation with an explicit computed operand.
              </p>
            )}
            {embryoWholeBridge.status === "PARTIAL_NULL" && selectedSourceSense ? (
              <p role="status" className="mt-2 break-words text-[#f0ddb0]" data-testid="current-word-embryo-whole-bridge-null">
                Embryo-to-whole bridge PARTIAL_NULL · {embryoWholeBridge.reasonCodes.join(" · ") || "UNKNOWN_OR_NULL"}. Cross-source sense alignment and internal segmentation remain UNKNOWN_OR_NULL.
              </p>
            ) : null}
            {exploratoryProjection.computedContributions.length ? (
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
        <p className="mt-1 text-[10px] text-[#aeb7c5]">Enter a separately cited research relation here. Each claim remains user-entered and citation-unverified. If a runtime sense is selected, the generated bridge compares the separate inputs conditionally without merging their source identities or asserting sense equivalence.</p>

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
