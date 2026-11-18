import {
  buildSymbolicFunctionalContentV0_1,
  type SymbolicFunctionalContentInputV0_1,
  type SymbolicFunctionalContentResultV0_1,
} from "@/shared/openInstrument/symbolicFunctionalContentEngine.v0_1";
import { sameAlbanianSourceForm } from "@/ui/instrument/albanianSourceFormIdentity.v0_1";

export type CurrentWordSourceFunctionalSuggestionDraftV0_1 = Readonly<{
  analyzedWord: string;
  draftTargetWord: string;
  language: string;
  variety: string;
  sourceTargetForm: string;
  targetSenseLabel: string;
  targetSenseDefinition: string;
  targetSourceLabel: string;
  targetSourceUrl: string;
  targetSourceLocator: string;
  relatedVerbForm: string;
  verbFunctionText: string;
  verbSourceLabel: string;
  verbSourceUrl: string;
  verbSourceLocator: string;
  sourceReportsActionRelation: boolean;
  alternativeSenseLabel: string;
  alternativeSenseDefinition: string;
}>;

export type CurrentWordSourceFunctionalSuggestionProjectionV0_1 = Readonly<{
  status: "CONDITIONAL_SUGGESTION" | "PARTIAL_NULL";
  result: SymbolicFunctionalContentResultV0_1 | null;
  reasonCodes: readonly string[];
}>;

const nonempty = (value: string) => value.normalize("NFC").trim().length > 0;

function isAlbanianLanguage(value: string): boolean {
  const normalized = value.normalize("NFC").trim().toLocaleLowerCase("en-US");
  return normalized === "sq" || normalized.startsWith("sq-") || normalized === "albanian";
}

function isCompatibleAlbanianVariety(value: string): boolean {
  return nonempty(value) && value.normalize("NFC").trim() !== "UNKNOWN_OR_NULL" &&
    !/\b(english|latin|greek|turkish|arabic)\b/iu.test(value);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function failure(...reasonCodes: string[]): CurrentWordSourceFunctionalSuggestionProjectionV0_1 {
  return { status: "PARTIAL_NULL", result: null, reasonCodes: [...new Set(reasonCodes)].sort() };
}

/**
 * Projects explicitly entered, citation-backed sense/function inputs through
 * the existing content engine. It never fetches sources or infers morphology.
 */
export function buildCurrentWordSourceFunctionalSuggestionV0_1(
  draft: CurrentWordSourceFunctionalSuggestionDraftV0_1,
): CurrentWordSourceFunctionalSuggestionProjectionV0_1 {
  const reasons: string[] = [];
  if (!draft.analyzedWord || draft.draftTargetWord !== draft.analyzedWord) reasons.push("CURRENT_WORD_IDENTITY_MISMATCH");
  if (!draft.sourceTargetForm.trim()) reasons.push("SOURCE_TARGET_FORM_REQUIRED");
  else if (!sameAlbanianSourceForm(draft.sourceTargetForm, draft.analyzedWord)) reasons.push("SOURCE_TARGET_FORM_MISMATCH");
  if (!isAlbanianLanguage(draft.language)) reasons.push("TARGET_LANGUAGE_NOT_ALBANIAN");
  if (!isCompatibleAlbanianVariety(draft.variety)) reasons.push("TARGET_VARIETY_REQUIRED");
  if (!nonempty(draft.targetSenseLabel) || !nonempty(draft.targetSenseDefinition)) reasons.push("SOURCE_TARGET_SENSE_REQUIRED");
  if (!nonempty(draft.targetSourceLabel) || !nonempty(draft.targetSourceLocator)) reasons.push("TARGET_SOURCE_CITATION_REQUIRED");
  if (!isHttpUrl(draft.targetSourceUrl)) reasons.push("TARGET_SOURCE_URL_INVALID");
  if (!nonempty(draft.relatedVerbForm) || !nonempty(draft.verbFunctionText)) reasons.push("SOURCE_VERB_FUNCTION_REQUIRED");
  if (!nonempty(draft.verbSourceLabel) || !nonempty(draft.verbSourceLocator)) reasons.push("VERB_SOURCE_CITATION_REQUIRED");
  if (!isHttpUrl(draft.verbSourceUrl)) reasons.push("VERB_SOURCE_URL_INVALID");
  if (!draft.sourceReportsActionRelation) reasons.push("SOURCE_ACTION_RELATION_NOT_ENTERED");

  const alternativeEntered = nonempty(draft.alternativeSenseLabel) || nonempty(draft.alternativeSenseDefinition);
  if (alternativeEntered && (!nonempty(draft.alternativeSenseLabel) || !nonempty(draft.alternativeSenseDefinition))) {
    reasons.push("ALTERNATIVE_SENSE_INCOMPLETE");
  }
  if (reasons.length) return failure(...reasons);

  const selectedSenseId = "entered-source-action-sense";
  const targetSourceId = "entered-target-source-citation";
  const verbSourceId = "entered-verb-source-citation";
  const functionCandidateId = "entered-related-verb-function";
  const input: SymbolicFunctionalContentInputV0_1 = {
    target: {
      exactSpelling: draft.analyzedWord,
      language: draft.language,
      variety: draft.variety,
      selectedSense: {
        senseId: selectedSenseId,
        label: draft.targetSenseLabel.trim(),
        definition: draft.targetSenseDefinition.trim(),
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: [targetSourceId],
        functionalFrame: "ACTION_OF_VERB_FUNCTION",
      },
      alternativeSenses: alternativeEntered ? [{
        senseId: "entered-source-alternative-sense",
        label: draft.alternativeSenseLabel.trim(),
        definition: draft.alternativeSenseDefinition.trim(),
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: [targetSourceId],
        functionalFrame: "OTHER",
      }] : [],
    },
    sources: [
      {
        sourceId: targetSourceId,
        label: draft.targetSourceLabel.trim(),
        url: draft.targetSourceUrl.trim(),
        locator: draft.targetSourceLocator.trim(),
        citationStatus: "CITATION_ENTERED_UNVERIFIED",
        licensingStatus: "NOT_ASSESSED",
      },
      {
        sourceId: verbSourceId,
        label: draft.verbSourceLabel.trim(),
        url: draft.verbSourceUrl.trim(),
        locator: draft.verbSourceLocator.trim(),
        citationStatus: "CITATION_ENTERED_UNVERIFIED",
        licensingStatus: "NOT_ASSESSED",
      },
    ],
    segmentationCandidates: [],
    functionCandidates: [{
      candidateId: functionCandidateId,
      exactForm: draft.relatedVerbForm.trim(),
      // Local pointer to the citation locator, not a claim of an official source sense ID.
      sourceSenseId: `entered-citation-locator:${draft.verbSourceLocator.trim()}`,
      functionText: draft.verbFunctionText.trim(),
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: [verbSourceId],
    }],
    componentFunctionBindings: [],
    voiceRoleCandidates: [],
    consonantAssociationCandidates: [],
    compositionOperations: [{
      operationId: "entered-source-action-relation",
      operationType: "ACTION_OF_VERB_FUNCTION",
      candidateLabel: "Source-entered action-of-verb function",
      targetSenseId: selectedSenseId,
      functionCandidateId,
      operationStatus: "SOURCE_REPORTED_UNVERIFIED",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      relationSourceIds: [targetSourceId],
    }],
    alternativeReadings: [],
    unresolvedClaims: [],
  };
  const result = buildSymbolicFunctionalContentV0_1(input);
  if (!result.ok) return failure(...result.reasonCodes);
  return { status: "CONDITIONAL_SUGGESTION", result, reasonCodes: [] };
}
