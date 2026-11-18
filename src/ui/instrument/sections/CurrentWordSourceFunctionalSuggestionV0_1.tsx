"use client";

import { useMemo, useState } from "react";
import {
  buildCurrentWordSourceFunctionalSuggestionV0_1,
  type CurrentWordSourceFunctionalSuggestionDraftV0_1,
} from "@/ui/instrument/sections/currentWordSourceFunctionalSuggestionAdapter.v0_1";

const textFieldClass = "mt-1 w-full min-w-0 rounded border border-[#46505c] bg-[#0d1117] px-2 py-1.5 text-sm text-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]";
const fieldLabelClass = "block min-w-0 text-xs font-medium text-[#c5ced8]";

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
}: {
  analyzedWord: string;
  draftTargetWord: string;
  language: string;
  variety: string;
  identityMatches: boolean;
  runtimeSourceStatus?: Readonly<{ status: string; reasonCode?: string | null }>;
}) {
  const [fields, setFields] = useState(emptyFields);
  const [sourceReportsActionRelation, setSourceReportsActionRelation] = useState(false);
  const projection = useMemo(() => buildCurrentWordSourceFunctionalSuggestionV0_1({
    ...fields,
    analyzedWord,
    draftTargetWord,
    language,
    variety,
    sourceReportsActionRelation,
  }), [fields, analyzedWord, draftTargetWord, language, variety, sourceReportsActionRelation]);

  const update = (field: DraftField, value: string) => setFields((current) => ({ ...current, [field]: value }));
  const content = projection.result?.ok ? projection.result.content : null;
  const composition = content?.compositions.find(({ targetSenseId }) => targetSenseId === content.target.selectedSense.senseId);

  return (
    <section
      aria-label="Current-word source-linked functional suggestion"
      data-testid="current-word-source-functional-suggestion"
      className="mt-3 min-w-0 rounded border border-[#46505c] bg-[#0e1411] p-2 text-xs leading-5"
    >
      <h4 className="font-semibold text-[#d8e4ca]">Source-linked conditional function suggestion</h4>
      <p className="mt-1 text-[#aeb7c5]">
        Enter short source paraphrases and citations. Nothing is looked up or selected automatically. The generated action/process wording is a logical inference from the relation you record; citations stay unverified and linguistic applicability is not assessed. This remains separate from the symbolic hypotheses below.
      </p>
      <p className="mt-1 text-[#c5ced8]" data-testid="current-word-source-suggestion-runtime-status">
        Current exact-form source lookup: {runtimeSourceStatus?.status ?? "UNKNOWN_OR_NULL"}
        {runtimeSourceStatus?.reasonCode ? ` · ${runtimeSourceStatus.reasonCode}` : ""}. A missing runtime lookup does not become evidence here.
      </p>

      {!identityMatches ? (
        <p role="status" data-testid="current-word-source-suggestion-identity-null" className="mt-2 rounded border border-[#746541] bg-[#18140e] p-2 text-[#f0ddb0]">
          PARTIAL_NULL · current draft target does not match analyzed form {analyzedWord || "UNKNOWN_OR_NULL"}; entered source relationships are withheld.
        </p>
      ) : (
        <>
          <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
            <label className={fieldLabelClass}>
              Exact target form in cited source
              <input aria-label="Exact source target form" className={textFieldClass} value={fields.sourceTargetForm} onChange={(event) => update("sourceTargetForm", event.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Source-reported target sense label
              <input aria-label="Source-reported target sense label" className={textFieldClass} value={fields.targetSenseLabel} onChange={(event) => update("targetSenseLabel", event.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Short source paraphrase of the target sense
              <textarea aria-label="Source target sense paraphrase" className={textFieldClass} rows={2} value={fields.targetSenseDefinition} onChange={(event) => update("targetSenseDefinition", event.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Related verb form
              <input aria-label="Related source verb form" className={textFieldClass} value={fields.relatedVerbForm} onChange={(event) => update("relatedVerbForm", event.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Short source paraphrase of the verb function
              <textarea aria-label="Source verb function paraphrase" className={textFieldClass} rows={2} value={fields.verbFunctionText} onChange={(event) => update("verbFunctionText", event.target.value)} />
            </label>
          </div>

          <fieldset className="mt-2 min-w-0 rounded border border-[#38433a] p-2">
            <legend className="px-1 font-semibold text-[#d8e4ca]">Target sense citation</legend>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              <label className={fieldLabelClass}>Source label<input aria-label="Target source label" className={textFieldClass} value={fields.targetSourceLabel} onChange={(event) => update("targetSourceLabel", event.target.value)} /></label>
              <label className={fieldLabelClass}>Source URL<input aria-label="Target source URL" className={textFieldClass} value={fields.targetSourceUrl} onChange={(event) => update("targetSourceUrl", event.target.value)} /></label>
              <label className={fieldLabelClass}>Sense/relation locator<input aria-label="Target source locator" className={textFieldClass} value={fields.targetSourceLocator} onChange={(event) => update("targetSourceLocator", event.target.value)} /></label>
            </div>
          </fieldset>

          <fieldset className="mt-2 min-w-0 rounded border border-[#38433a] p-2">
            <legend className="px-1 font-semibold text-[#d8e4ca]">Verb-function citation</legend>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              <label className={fieldLabelClass}>Source label<input aria-label="Verb source label" className={textFieldClass} value={fields.verbSourceLabel} onChange={(event) => update("verbSourceLabel", event.target.value)} /></label>
              <label className={fieldLabelClass}>Source URL<input aria-label="Verb source URL" className={textFieldClass} value={fields.verbSourceUrl} onChange={(event) => update("verbSourceUrl", event.target.value)} /></label>
              <label className={fieldLabelClass}>Verb sense locator<input aria-label="Verb source locator" className={textFieldClass} value={fields.verbSourceLocator} onChange={(event) => update("verbSourceLocator", event.target.value)} /></label>
            </div>
          </fieldset>

          <label className="mt-2 flex min-w-0 items-start gap-2 text-xs text-[#c5ced8]">
            <input
              aria-label="Source explicitly relates this action sense to the verb"
              className="mt-1 shrink-0 accent-[#d8bb7a]"
              type="checkbox"
              checked={sourceReportsActionRelation}
              onChange={(event) => setSourceReportsActionRelation(event.target.checked)}
            />
            <span>I am recording that the target source explicitly defines this selected sense by reference to the cited verb. This assertion is entered by me; the source and relation remain CITATION_ENTERED_UNVERIFIED.</span>
          </label>

          <details className="mt-2 rounded border border-[#38433a] p-2">
            <summary className="cursor-pointer font-semibold text-[#d8e4ca]">Add a separate alternative target sense (optional)</summary>
            <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
              <label className={fieldLabelClass}>Alternative sense label<input aria-label="Alternative source sense label" className={textFieldClass} value={fields.alternativeSenseLabel} onChange={(event) => update("alternativeSenseLabel", event.target.value)} /></label>
              <label className={fieldLabelClass}>Short alternative sense paraphrase<textarea aria-label="Alternative source sense paraphrase" className={textFieldClass} rows={2} value={fields.alternativeSenseDefinition} onChange={(event) => update("alternativeSenseDefinition", event.target.value)} /></label>
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
              <div>Exact target form entered from source: {fields.sourceTargetForm}</div>
              <div>Representation authority: ORTHOGRAPHIC · pronunciation authority: NOT_ESTABLISHED</div>
              <div>Decision: {content.selection.mode} · {content.selection.userDecisionPosture}</div>
              <div>Production authority: {content.productionAuthority} · source authority promotion: {content.sourceAuthorityPromotion} · historical origin: {content.historicalOrigin}</div>
              <div>Engine relation source IDs: {composition?.provenance.relation.sourceIds.join(", ") || "UNKNOWN_OR_NULL"} · function source IDs: {composition?.provenance.function.sourceIds.join(", ") || "UNKNOWN_OR_NULL"}</div>
              <div>Unassigned target Voice roles: {content.voiceEvents.filter(({ roleStatus }) => roleStatus === "UNKNOWN_OR_NULL").map(({ voice, position }) => `${voice}@${position}`).join(", ") || "∅"} · UNKNOWN_OR_NULL</div>
              <div>Unassigned consonant associations: {content.consonantStructures.filter(({ status }) => status === "UNKNOWN_OR_NULL").map(({ character, position }) => `${character}@${position}`).join(", ") || "∅"} · UNKNOWN_OR_NULL</div>
              <div>Unresolved: {content.unresolved.map(({ text }) => text).join(" ") || "No additional unresolved items entered."}</div>
              <ul className="mt-1 list-disc pl-5">
                <li className="break-all">
                  Target: {fields.targetSourceLabel} · {fields.targetSourceUrl} · {fields.targetSourceLocator} · CITATION_ENTERED_UNVERIFIED · licensing NOT_ASSESSED
                </li>
                <li className="break-all">
                  Verb: {fields.verbSourceLabel} · {fields.verbSourceUrl} · {fields.verbSourceLocator} · CITATION_ENTERED_UNVERIFIED · licensing NOT_ASSESSED
                </li>
              </ul>
            </details>
          ) : null}
        </>
      )}
    </section>
  );
}
