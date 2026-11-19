import {
  buildSymbolicFunctionalContentV0_1,
  type SymbolicFunctionalContentInputV0_1,
  type SymbolicFunctionalContentResultV0_1,
} from "@/shared/openInstrument/symbolicFunctionalContentEngine.v0_1";
import type { SymbolicFunctionalCompositionResultV0_3 } from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";
import { sameAlbanianSourceForm } from "@/ui/instrument/albanianSourceFormIdentity.v0_1";

export type RuntimeAlbanianSourceSenseRecordV0_1 = Readonly<{
  entryIndex: number;
  senseIndex: number;
  partOfSpeech: string | null;
  gloss: string;
  glossLanguage: "en" | "sq";
  senseSource: string;
  tags: readonly string[];
  entrySources: readonly string[];
}>;

/** A response-position selection from the existing FjaloriShqip API adapter, not a source-issued sense ID. */
export type RuntimeAlbanianSourceSenseSelectionV0_1 = Readonly<{
  exactSourceForm: string;
  apiUrl: string;
  licence: "CC BY-SA 4.0";
  analysisLanguage: string;
  analysisVariety: string;
  recordSources: readonly string[];
  selectedSense: RuntimeAlbanianSourceSenseRecordV0_1;
  alternativeSenses: readonly RuntimeAlbanianSourceSenseRecordV0_1[];
}>;

export type RuntimeComputedVoiceContributionV0_1 = Readonly<{
  operationId: string;
  voiceEventId: string;
  voice: string;
  position: number;
  operatorText: string;
  inputText: string;
  outputText: string;
  contribution: string;
  inputSymbolId: string;
  outputSymbolId: string;
  claimLayer: "EXPLORATORY_HYPOTHESIS";
  evidenceStatus: "USER_PROPOSED";
  sourceIds: readonly [];
}>;

export type CurrentWordExploratoryMotivationProjectionV0_1 = Readonly<{
  status: "CONDITIONAL_SUGGESTION" | "PARTIAL_NULL";
  sourceContent: SymbolicFunctionalContentResultV0_1 | null;
  selectedSense: RuntimeAlbanianSourceSenseSelectionV0_1 | null;
  computedContributions: readonly RuntimeComputedVoiceContributionV0_1[];
  conditionalExplanation: string | null;
  unresolved: readonly string[];
  reasonCodes: readonly string[];
  wholeWordStatus: "PARTIAL_NULL";
  interpretationClaimLayer: "EXPLORATORY_HYPOTHESIS";
  interpretationEvidenceStatus: "USER_PROPOSED";
  sourceAuthorityPromotion: "NONE";
  historicalOrigin: "NOT_CLAIMED";
  noSingleWinner: true;
  userDecisionPosture: "user_decides";
}>;

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

function responseSenseLabel(sense: RuntimeAlbanianSourceSenseRecordV0_1): string {
  return `Entry ${sense.entryIndex} · Sense ${sense.senseIndex} · ${sense.partOfSpeech ?? "part of speech UNKNOWN_OR_NULL"}`;
}

function validFjaloriSelection(
  selection: RuntimeAlbanianSourceSenseSelectionV0_1,
  analyzedWord: string,
): boolean {
  if (!sameAlbanianSourceForm(selection.exactSourceForm, analyzedWord) ||
      selection.licence !== "CC BY-SA 4.0" || !selection.selectedSense.gloss.trim() ||
      !isAlbanianLanguage(selection.analysisLanguage) ||
      !nonempty(selection.analysisVariety) ||
      !selection.selectedSense.senseSource.trim() ||
      !Number.isInteger(selection.selectedSense.entryIndex) || selection.selectedSense.entryIndex < 1 ||
      !Number.isInteger(selection.selectedSense.senseIndex) || selection.selectedSense.senseIndex < 1) return false;
  try {
    const canonicalWord = analyzedWord.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
    return selection.apiUrl === `https://fjalorishqip.org/api/v1/fjala/${encodeURIComponent(canonicalWord)}.json`;
  } catch {
    return false;
  }
}

function selectedSenseContent(
  selection: RuntimeAlbanianSourceSenseSelectionV0_1,
  analyzedWord: string,
  language: string,
  variety: string,
): SymbolicFunctionalContentResultV0_1 {
  const sourceId = `fjalorishqip-api:${analyzedWord.normalize("NFC").trim().toLocaleLowerCase("sq-AL")}`;
  const recordDescription = (sense: RuntimeAlbanianSourceSenseRecordV0_1) =>
    `${responseSenseLabel(sense)} · gloss language ${sense.glossLanguage} · sense attribution ${sense.senseSource} · entry sources ${sense.entrySources.join(", ") || "UNKNOWN_OR_NULL"}`;
  return buildSymbolicFunctionalContentV0_1({
    target: {
      exactSpelling: analyzedWord,
      language,
      variety,
      selectedSense: {
        senseId: `fjalori-response:${selection.selectedSense.entryIndex}:${selection.selectedSense.senseIndex}`,
        label: selection.selectedSense.gloss,
        definition: selection.selectedSense.gloss,
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: [sourceId],
        functionalFrame: "UNKNOWN_OR_NULL",
      },
      alternativeSenses: selection.alternativeSenses.map((sense) => ({
        senseId: `fjalori-response:${sense.entryIndex}:${sense.senseIndex}`,
        label: sense.gloss,
        definition: sense.gloss,
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: [sourceId],
        functionalFrame: "UNKNOWN_OR_NULL",
      })),
    },
    sources: [{
      sourceId,
      label: `FjaloriShqip API response · ${selection.selectedSense.senseSource}`,
      url: selection.apiUrl,
      locator: `${recordDescription(selection.selectedSense)} · response position, not a source-issued sense ID · record sources ${selection.recordSources.join(", ") || "UNKNOWN_OR_NULL"} · licence ${selection.licence}`,
      citationStatus: "CITATION_ENTERED_UNVERIFIED",
      licensingStatus: "NOT_ASSESSED",
    }],
    segmentationCandidates: [],
    functionCandidates: [],
    componentFunctionBindings: [],
    voiceRoleCandidates: [],
    consonantAssociationCandidates: [],
    compositionOperations: [],
    alternativeReadings: [],
    unresolvedClaims: [{
      claimId: "source-sense-does-not-establish-symbolic-relationship",
      text: "This source response reports a lexical sense; it does not report or verify a symbolic or derivational relationship.",
      sourceIds: [sourceId],
    }],
  });
}

function computedVoiceContributions(
  evaluation: SymbolicFunctionalCompositionResultV0_3,
): Readonly<{
  contributions: readonly RuntimeComputedVoiceContributionV0_1[];
  unresolved: readonly string[];
}> {
  if (!evaluation.ok) {
    return { contributions: [], unresolved: evaluation.reasonCodes.map((reason) => `EVALUATION_${reason}`) };
  }

  const contributions: RuntimeComputedVoiceContributionV0_1[] = [];
  const unresolved: string[] = [];
  const verifiedVoiceOperationIds = new Set<string>();
  const voiceTraces = evaluation.operationTrace.filter(({ kind }) => kind === "APPLY_VOICE_OPERATOR");

  for (const trace of voiceTraces) {
    const event = evaluation.voiceEvents.find(({ eventId }) => eventId === trace.targetVoiceEventId);
    const input = evaluation.symbols.find(({ symbolId }) => symbolId === trace.inputSymbolId);
    const output = evaluation.symbols.find(({ symbolId }) => symbolId === trace.outputSymbolId);
    const dependencyTraces = evaluation.operationTrace.filter(({ operationId }) => trace.dependsOn.includes(operationId));
    const directSpectrumInput = input?.symbolKind === "SPECTRUM_ASSOCIATION" && input.unit !== undefined && input.span !== undefined
      ? input
      : null;
    const directOccurrence = directSpectrumInput
      ? evaluation.spectrumOccurrences.find(({ unit, span }) =>
        unit === directSpectrumInput.unit && span.start === directSpectrumInput.span?.start && span.end === directSpectrumInput.span?.end)
      : undefined;
    const directCandidateId = input?.provenance.spectrumCandidateIds.length === 1
      ? input.provenance.spectrumCandidateIds[0]
      : undefined;
    const directCandidate = directOccurrence?.associationCandidates.find(({ candidateId }) => candidateId === directCandidateId);
    const directSelectionDependencyValid = Boolean(
      directOccurrence && directCandidate &&
      directOccurrence.selectedAssociationIds.includes(directCandidate.candidateId) &&
      directSpectrumInput?.text === directCandidate.association &&
      dependencyTraces.length === 1 &&
      dependencyTraces[0].kind === "SELECT_SPECTRUM_CANDIDATE" &&
      dependencyTraces[0].status === "COMPUTED" && dependencyTraces[0].reasonCodes.length === 0 &&
      dependencyTraces[0].contribution === `${directOccurrence.unit}@${directOccurrence.span.start}-${directOccurrence.span.end} selects “${directCandidate.association}”.`,
    );
    const transformedProducerDependencyValid = Boolean(
      input?.symbolKind === "VOICE_TRANSFORM" && dependencyTraces.length === 1 &&
      dependencyTraces[0].kind === "APPLY_VOICE_OPERATOR" &&
      dependencyTraces[0].status === "COMPUTED" && dependencyTraces[0].reasonCodes.length === 0 &&
      dependencyTraces[0].outputSymbolId === trace.inputSymbolId &&
      verifiedVoiceOperationIds.has(dependencyTraces[0].operationId),
    );
    const application = output?.provenance.voiceApplications.find(({ voiceEventId }) => voiceEventId === trace.targetVoiceEventId);
    const traceIdentityValid = Boolean(
      event && event.position >= 0 && event.appliedOperationIds.includes(trace.operationId) &&
      event.selectedOperator?.candidateId === trace.operatorCandidateId &&
      trace.operatorProvenance?.provenanceClass === "OWNER_SUPPLIED_PROVISIONAL_VOICE_OPERATOR_HYPOTHESIS" &&
      trace.operatorProvenance.claimLayer === "EXPLORATORY_HYPOTHESIS" &&
      trace.operatorProvenance.evidenceStatus === "USER_PROPOSED" &&
      trace.operatorProvenance.sourceIds.length === 0 &&
      trace.status === "COMPUTED" && trace.reasonCodes.length === 0 &&
      trace.inputSymbolId && trace.outputSymbolId && trace.contribution &&
      input && output && output.symbolKind === "VOICE_TRANSFORM" && output.text === trace.contribution.split(" → ").at(-1) &&
      input.provenance.claimLayer === "EXPLORATORY_HYPOTHESIS" &&
      input.provenance.evidenceStatus === "USER_PROPOSED" && input.provenance.sourceIds.length === 0 &&
      (directSelectionDependencyValid || transformedProducerDependencyValid) &&
      application?.inputSymbolId === trace.inputSymbolId &&
      application.operatorCandidateId === trace.operatorCandidateId &&
      application.claimLayer === "EXPLORATORY_HYPOTHESIS" &&
      application.evidenceStatus === "USER_PROPOSED" && application.sourceIds.length === 0 &&
      output.provenance.claimLayer === "EXPLORATORY_HYPOTHESIS" &&
      output.provenance.evidenceStatus === "USER_PROPOSED" && output.provenance.sourceIds.length === 0,
    );
    if (!traceIdentityValid || !event || !input || !output || !trace.operatorProvenance ||
        !trace.inputSymbolId || !trace.outputSymbolId || !trace.contribution) {
      unresolved.push(`VOICE_OPERATION_NOT_VERIFIABLY_COMPUTED:${trace.operationId}`);
      continue;
    }
    verifiedVoiceOperationIds.add(trace.operationId);
    contributions.push({
      operationId: trace.operationId,
      voiceEventId: event.eventId,
      voice: event.voice,
      position: event.position,
      operatorText: trace.operatorProvenance.operatorText,
      inputText: input.text,
      outputText: output.text,
      contribution: trace.contribution,
      inputSymbolId: input.symbolId,
      outputSymbolId: output.symbolId,
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
    });
  }

  for (const event of evaluation.voiceEvents) {
    if (!event.appliedOperationIds.length) unresolved.push(`VOICE_OPERATOR_UNSELECTED:${event.voice}@${event.position}`);
  }
  for (const occurrence of evaluation.spectrumOccurrences) {
    if (!occurrence.selectedAssociationIds.length) unresolved.push(`SPECTRUM_ASSOCIATION_UNSELECTED:${occurrence.unit}@${occurrence.span.start}`);
  }
  for (const unmatched of evaluation.unmatchedLetterSpans) {
    unresolved.push(`UNMATCHED_LETTER:${unmatched.exactText}@${unmatched.span.start}`);
  }
  for (const trace of voiceTraces) {
    if (trace.status !== "COMPUTED" || trace.reasonCodes.length) {
      unresolved.push(...trace.reasonCodes);
    }
  }
  return { contributions, unresolved: [...new Set(unresolved)].sort() };
}

/**
 * Combines an explicitly selected source sense with outputs already computed by
 * the v0.3 evaluator. It formats a conditional proposal but never evaluates or
 * upgrades the source-to-symbolic relationship.
 */
export function buildCurrentWordExploratoryMotivationV0_1(input: Readonly<{
  analyzedWord: string;
  draftTargetWord: string;
  language: string;
  variety: string;
  selectedSourceSense: RuntimeAlbanianSourceSenseSelectionV0_1 | null;
  evaluation: SymbolicFunctionalCompositionResultV0_3;
}>): CurrentWordExploratoryMotivationProjectionV0_1 {
  const reasonCodes: string[] = [];
  if (!input.analyzedWord || input.draftTargetWord !== input.analyzedWord) reasonCodes.push("CURRENT_WORD_IDENTITY_MISMATCH");
  if (!isAlbanianLanguage(input.language)) reasonCodes.push("TARGET_LANGUAGE_NOT_ALBANIAN");
  if (!isCompatibleAlbanianVariety(input.variety)) reasonCodes.push("TARGET_VARIETY_REQUIRED");
  const selection = input.selectedSourceSense;
  if (!selection) reasonCodes.push("SOURCE_SENSE_NOT_SELECTED");
  else if (!validFjaloriSelection(selection, input.analyzedWord)) reasonCodes.push("SOURCE_SENSE_IDENTITY_OR_PROVENANCE_INVALID");
  else {
    const normalize = (value: string) => value.normalize("NFC").trim().toLocaleLowerCase("en-US");
    const selectedLanguage = normalize(input.language);
    const analysisLanguage = normalize(selection.analysisLanguage);
    const selectedIsAlbanian = selectedLanguage === "sq" || selectedLanguage.startsWith("sq-") || selectedLanguage.includes("albanian");
    const analysisIsAlbanian = analysisLanguage === "sq" || analysisLanguage.startsWith("sq-") || analysisLanguage.includes("albanian");
    if (selectedLanguage && selectedLanguage !== analysisLanguage && (!selectedIsAlbanian || !analysisIsAlbanian)) {
      reasonCodes.push("SOURCE_LANGUAGE_IDENTITY_MISMATCH");
    }
    if (input.variety.trim() && selection.analysisVariety.trim() && normalize(input.variety) !== normalize(selection.analysisVariety)) {
      reasonCodes.push("SOURCE_DIALECT_IDENTITY_MISMATCH");
    }
  }
  if (input.evaluation.ok && input.evaluation.target.exactSpelling !== input.analyzedWord) {
    reasonCodes.push("SYMBOLIC_EVALUATION_TARGET_MISMATCH");
  }

  const sourceContent = selection && !reasonCodes.length
    ? selectedSenseContent(selection, input.analyzedWord, input.language, input.variety)
    : null;
  if (sourceContent && !sourceContent.ok) reasonCodes.push(...sourceContent.reasonCodes);
  const sourceResult = sourceContent?.ok ? sourceContent : null;
  const computed = computedVoiceContributions(input.evaluation);
  const unresolved = [...new Set([...computed.unresolved, ...reasonCodes])].sort();
  const conditionalExplanation = sourceResult && computed.contributions.length
    ? `If these user-selected symbolic hypotheses are explored as a lens on the source-reported sense “${sourceResult.content.target.selectedSense.definition}”, the computed sequence ${computed.contributions.map(({ outputText }) => `“${outputText}”`).join(" → ")} could be proposed as a conditional functional framing of that sense.`
    : null;
  if (!computed.contributions.length) reasonCodes.push("NO_VERIFIABLY_COMPUTED_VOICE_OUTPUTS");
  reasonCodes.push("SOURCE_SYMBOLIC_RELATION_NOT_REPORTED", "WHOLE_WORD_FUNCTION_NOT_ESTABLISHED");

  return {
    status: conditionalExplanation && !computed.unresolved.some((item) => item.startsWith("VOICE_OPERATION_NOT_VERIFIABLY_COMPUTED:"))
      ? "CONDITIONAL_SUGGESTION"
      : "PARTIAL_NULL",
    sourceContent: sourceResult,
    selectedSense: sourceResult ? selection : null,
    computedContributions: computed.contributions,
    conditionalExplanation,
    unresolved,
    reasonCodes: [...new Set(reasonCodes)].sort(),
    wholeWordStatus: "PARTIAL_NULL",
    interpretationClaimLayer: "EXPLORATORY_HYPOTHESIS",
    interpretationEvidenceStatus: "USER_PROPOSED",
    sourceAuthorityPromotion: "NONE",
    historicalOrigin: "NOT_CLAIMED",
    noSingleWinner: true,
    userDecisionPosture: "user_decides",
  };
}

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
