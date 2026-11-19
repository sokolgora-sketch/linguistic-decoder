import {
  buildSymbolicFunctionalContentV0_1,
  type SymbolicFunctionalContentInputV0_1,
  type SymbolicFunctionalContentResultV0_1,
  type SymbolicFunctionalSourceV0_1,
} from "@/shared/openInstrument/symbolicFunctionalContentEngine.v0_1";
import type { SymbolicFunctionalCompositionResultV0_3 } from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";
import { extractSevenVowelsFromString } from "@/shared/math7.core";
import { classifyFreeOperatorEvidenceV0_1 } from "@/shared/freeOperatorEvidence.v0_1";
import {
  DA_FREE_OPERATOR_PROFILE_V0_1,
  freeOperatorProfileFormMatchesV0_1,
  freeOperatorProfileGlossMatchesV0_1,
  type FreeOperatorProfileV0_1,
  type FreeOperatorProfileTermSetV0_1,
} from "@/shared/freeOperatorProfile.v0_1";
import { PROTO_ROOTS_V1, type ProtoRoot } from "@/shared/protoRoots.v1";
import { canonicalOperatorProfilesV0_1 } from "@/shared/canonicalOperatorProfile.v0_1";
import { reviewedExternalLexiconSourceRowCandidateRegistryV0_1 } from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  projectFunctionalMotivationTraceV0_1,
  type FunctionalMotivationTraceInputV0_1,
  type FunctionalMotivationTraceProjectionV0_1,
  type ProjectFunctionalMotivationTraceResultV0_1,
} from "@/shared/openInstrument/functionalMotivationTrace.v0_1";
import { sameAlbanianSourceForm } from "@/ui/instrument/albanianSourceFormIdentity.v0_1";
import type { AlbanianKaikkiExactLexicalSourceFactV0_1 } from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";

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

export type RuntimeFjaloriSourceResponseV0_1 =
  | Readonly<{
      requestKey: string;
      queryForm: string;
      status: "available";
      exactSourceForm: string;
      apiUrl: string;
      licence: "CC BY-SA 4.0";
      analysisLanguage: string;
      analysisVariety: string;
      recordSources: readonly string[];
      senses: readonly RuntimeAlbanianSourceSenseRecordV0_1[];
    }>
  | Readonly<{
      requestKey: string;
      queryForm: string;
      status: "loading" | "network-failure" | "timeout" | "unavailable" | "http-not-found" | "http-error" | "invalid";
      httpStatus: number | null;
      exactSourceForm: null;
      apiUrl: string;
      licence: null;
      analysisLanguage: string;
      analysisVariety: string;
      recordSources: readonly [];
      senses: readonly [];
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
  sourceCitations: readonly SymbolicFunctionalSourceV0_1[];
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

export type CurrentWordDaAnchoredEmbryoOccurrenceV0_1 = Readonly<{
  occurrenceId: string;
  exactSurface: string;
  span: Readonly<{ start: number; end: number }>;
}>;

export type CurrentWordDaFunctionalMotivationCandidateV0_1 = Readonly<{
  candidateId: string;
  occurrence: CurrentWordDaAnchoredEmbryoOccurrenceV0_1;
  targetSource:
    | Readonly<{
        provider: "KAIKKI";
        sourceFact: AlbanianKaikkiExactLexicalSourceFactV0_1;
        senseOrdinal: number;
        senseId: string | null;
      }>
    | Readonly<{
        provider: "FJALORISHQIP";
        responseStatus: "available";
        exactSourceForm: string;
        apiUrl: string;
        licence: "CC BY-SA 4.0";
        analysisLanguage: string;
        analysisVariety: string;
        recordSources: readonly string[];
        responsePosition: Readonly<{ entryIndex: number; senseIndex: number }>;
        partOfSpeech: string | null;
        glossLanguage: "en" | "sq";
        senseSource: string;
        tags: readonly string[];
        entrySources: readonly string[];
        citationStatus: "CITATION_ENTERED_UNVERIFIED";
        licensingStatus: "NOT_ASSESSED";
      }>;
  targetSenseOrdinal: number;
  targetSenseId: string | null;
  targetSenseGlosses: readonly string[];
  familySupport: readonly Readonly<{ form: string; categories: readonly string[] }>[];
  familyNetwork: FreeOperatorFamilyFunctionalNetworkProjectionV0_1;
  functionalReading: string;
  claimLayer: "EXPLORATORY_HYPOTHESIS";
  generatedBy: "DA_REVIEWED_SOURCE_PLUS_EXACT_FORM";
  selectionStatus: "UNSELECTED";
  unresolvedMaterial: readonly string[];
  wholeWordStatus: "PARTIAL_NULL";
  sourceAuthorityPromotion: "NONE";
  historicalOrigin: "NOT_CLAIMED";
  noSingleWinner: true;
  userDecisionPosture: "user_decides";
}>;

export type CurrentWordDaFunctionalMotivationProjectionV0_1 = Readonly<{
  status: "CANDIDATES_AVAILABLE" | "PARTIAL_NULL";
  candidates: readonly CurrentWordDaFunctionalMotivationCandidateV0_1[];
  reasonCodes: readonly string[];
}>;

export type CurrentWordDaStandaloneEvidenceV0_1 = Readonly<{
  operator: "DA";
  sourceForm: string;
  attestedGloss: string;
  dialect: "Gheg Albanian";
  sourceId: string;
  candidateId: string;
  sourceStatus: "reviewed_accepted";
  citationId: string;
  citationStatus: "reviewed_accepted";
  sourceTitle: string;
  sourceAuthorOrEditor: string;
  sourcePublisherOrHost: string;
  sourceDateOrVersion: string;
  sourceUrl: string;
  locator: string;
  grammarNote: string;
  reviewNote: string;
  claimLayer: "SOURCE_FACT";
  freeOperatorCategories: readonly string[];
}>;

export type FreeOperatorFamilyFormProjectionV0_1 = Readonly<{
  form: string;
  profileClassification: "DIRECT_FREE_OPERATOR_FORM" | "DERIVATIVE_FAMILY_SUPPORT";
  profileCategories: readonly string[];
  profileGlossTerms: readonly string[];
  carrierAnnotation: Readonly<{
    gloss: string;
    dialect: string | null;
    claimLayer: "EXPLORATORY_HYPOTHESIS";
    evidenceStatus: "CANDIDATE_CARRIER_ANNOTATION_NOT_SOURCE_FACT";
    sourceIds: readonly [];
  }> | null;
}>;

export type FreeOperatorFamilyFunctionalNetworkProjectionV0_1 = Readonly<{
  status: "CONDITIONAL_FAMILY_READING" | "PARTIAL_NULL";
  operator: string;
  embryo: Readonly<{
    form: string;
    functionText: string;
    sourceId: string;
    sourceStatus: "reviewed_accepted";
    claimLayer: "SOURCE_FACT";
  }>;
  directForms: readonly FreeOperatorFamilyFormProjectionV0_1[];
  derivativeFamilyForms: readonly FreeOperatorFamilyFormProjectionV0_1[];
  target: Readonly<{
    exactForm: string;
    senseText: string;
    sourceIdentity: string;
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED" | "OBSERVED_EXTERNAL_SNAPSHOT";
    claimLayer: "SOURCE_FACT";
  }> | null;
  functionalEquation: string | null;
  explanation: string | null;
  claimLayer: "EXPLORATORY_HYPOTHESIS";
  evidenceStatus: "GENERATED_UNSELECTED_CANDIDATE";
  selectionStatus: "UNSELECTED";
  wholeWordStatus: "PARTIAL_NULL";
  unresolvedMaterial: readonly string[];
  reasonCodes: readonly string[];
  sourceAuthorityPromotion: "NONE";
  historicalOrigin: "NOT_CLAIMED";
  noSingleWinner: true;
  userDecisionPosture: "user_decides";
}>;

type FreeOperatorFamilyFunctionalNetworkInputV0_1 = Readonly<{
  profile: FreeOperatorProfileV0_1;
  protoRoot: ProtoRoot | null;
  reviewedEmbryo: CurrentWordDaStandaloneEvidenceV0_1;
  targetForm: string;
  targetSense: Readonly<{
    exactSourceForm: string;
    glosses: readonly string[];
    sourceIdentity: string;
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED" | "OBSERVED_EXTERNAL_SNAPSHOT";
  }> | null;
}>;

function familyFormProjectionsV0_1(
  protoRoot: ProtoRoot | null,
  termSet: FreeOperatorProfileTermSetV0_1,
  profileClassification: FreeOperatorFamilyFormProjectionV0_1["profileClassification"],
): FreeOperatorFamilyFormProjectionV0_1[] {
  return termSet.forms.map((form) => {
    const carrier = protoRoot?.carriers.find(({ lang, form: carrierForm }) =>
      lang === "sq" && sameAlbanianSourceForm(carrierForm, form),
    );
    const gloss = carrier?.gloss?.normalize("NFC").trim() ?? "";
    return {
      form,
      profileClassification,
      profileCategories: termSet.categories,
      profileGlossTerms: termSet.glossTerms,
      carrierAnnotation: gloss
        ? {
            gloss,
            dialect: carrier?.dialect ?? null,
            claimLayer: "EXPLORATORY_HYPOTHESIS" as const,
            evidenceStatus: "CANDIDATE_CARRIER_ANNOTATION_NOT_SOURCE_FACT" as const,
            sourceIds: [] as const,
          }
        : null,
    };
  });
}

/**
 * Projects existing operator-profile and carrier records into a family-level
 * functional proposal. Registry membership is shown as profile data; carrier
 * glosses remain exploratory annotations and never establish morphology.
 */
export function projectFreeOperatorFamilyFunctionalNetworkV0_1(
  input: FreeOperatorFamilyFunctionalNetworkInputV0_1,
): FreeOperatorFamilyFunctionalNetworkProjectionV0_1 {
  const directForms = familyFormProjectionsV0_1(
    input.protoRoot,
    input.profile.directFreeOperator,
    "DIRECT_FREE_OPERATOR_FORM",
  );
  const derivativeFamilyForms = familyFormProjectionsV0_1(
    input.protoRoot,
    input.profile.derivativeFamilySupport,
    "DERIVATIVE_FAMILY_SUPPORT",
  );
  const reasons: string[] = [];
  const directFormMatches = freeOperatorProfileFormMatchesV0_1(
    input.profile.directFreeOperator.forms,
    input.reviewedEmbryo.sourceForm,
  );
  const reviewedFunctionMatches = freeOperatorProfileGlossMatchesV0_1(
    input.profile.directFreeOperator.glossTerms,
    input.reviewedEmbryo.attestedGloss,
  );
  if (!input.protoRoot || !freeOperatorProfileFormMatchesV0_1([input.profile.operator], input.protoRoot.id)) {
    reasons.push("FREE_OPERATOR_PROFILE_ROOT_RECORD_MISMATCH");
  }
  if (!directFormMatches || input.reviewedEmbryo.sourceStatus !== "reviewed_accepted") {
    reasons.push("REVIEWED_EMBRYO_NOT_IN_DIRECT_PROFILE_FORMS");
  }
  if (!reviewedFunctionMatches) reasons.push("REVIEWED_EMBRYO_FUNCTION_OUTSIDE_PROFILE_DOMAIN");
  if (!derivativeFamilyForms.length) reasons.push("DERIVATIVE_FAMILY_SUPPORT_NOT_AVAILABLE");
  if (!input.targetSense) {
    reasons.push("EXACT_TARGET_SOURCE_SENSE_NOT_AVAILABLE");
  } else {
    if (!sameAlbanianSourceForm(input.targetSense.exactSourceForm, input.targetForm)) {
      reasons.push("EXACT_TARGET_SOURCE_FORM_MISMATCH");
    }
    if (!input.targetSense.sourceIdentity.trim()) reasons.push("EXACT_TARGET_SOURCE_IDENTITY_NOT_AVAILABLE");
    if (!input.targetSense.glosses.some((gloss) => gloss.trim())) {
      reasons.push("EXACT_TARGET_SOURCE_SENSE_GLOSS_NOT_AVAILABLE");
    }
    if (!input.targetSense.glosses.some((gloss) =>
      freeOperatorProfileGlossMatchesV0_1(
        [...input.profile.directFreeOperator.glossTerms, ...input.profile.derivativeFamilySupport.glossTerms],
        gloss,
      ),
    )) {
      reasons.push("TARGET_SENSE_OUTSIDE_PROFILE_FUNCTION_DOMAIN");
    }
  }

  const targetSenseText = input.targetSense?.glosses.join("; ") ?? "";
  const target = input.targetSense && targetSenseText
    ? {
        exactForm: input.targetSense.exactSourceForm,
        senseText: targetSenseText,
        sourceIdentity: input.targetSense.sourceIdentity,
        evidenceStatus: input.targetSense.evidenceStatus,
        claimLayer: "SOURCE_FACT" as const,
      }
    : null;
  const familyCarrierAnnotations = [...directForms, ...derivativeFamilyForms]
    .flatMap(({ form, carrierAnnotation }) => carrierAnnotation
      ? [`${form.toLocaleUpperCase("sq-AL")} “${carrierAnnotation.gloss}”`]
      : []);
  const familyFormsText = [
    directForms.length
      ? `direct profile forms ${directForms.map(({ form }) => form.toLocaleUpperCase("sq-AL")).join(" / ")}`
      : "direct profile forms UNKNOWN_OR_NULL",
    derivativeFamilyForms.length
      ? `derivative-family support ${derivativeFamilyForms.map(({ form }) => form.toLocaleUpperCase("sq-AL")).join(" / ")}`
      : "derivative-family support UNKNOWN_OR_NULL",
  ].join("; ");
  const familyGlossesText = familyCarrierAnnotations.join("; ") || "UNKNOWN_OR_NULL";
  const targetFormLabel = target?.exactForm.toLocaleUpperCase("sq-AL") ?? input.targetForm.toLocaleUpperCase("sq-AL");
  const explanation = target && !reasons.length
    ? `The reviewed ${input.reviewedEmbryo.dialect} source gives ${input.reviewedEmbryo.sourceForm.toLocaleUpperCase("sq-AL")} the function “${input.reviewedEmbryo.attestedGloss}.” That function offers a bounded functional point of comparison for the exact-form source sense “${target.senseText}” in ${targetFormLabel}: splitting or dividing can be considered in relation to a division or separation sense. The profile separately lists ${familyFormsText}; optional ProtoRoots carrier annotations include ${familyGlossesText} and remain exploratory candidates, not source facts or selected intermediate meanings. An intermediate result-state function remains UNKNOWN_OR_NULL unless independently characterized. This does not establish that the listed forms descend from one another or that ${targetFormLabel} has this morphology.`
    : null;
  const functionalEquation = target && !reasons.length
    ? `FUNCTIONAL READING · reviewed ${input.reviewedEmbryo.sourceForm.toLocaleUpperCase("sq-AL")} function “${input.reviewedEmbryo.attestedGloss}” → exact-form ${targetFormLabel} sense “${target.senseText}” · ${familyFormsText}; optional carrier annotations ${familyGlossesText}; intermediate result-state function UNKNOWN_OR_NULL · conditional functional proposal, not a morphological sequence`
    : null;
  const finalReasons = [...new Set(reasons)].sort();
  return {
    status: !finalReasons.length && target && explanation && functionalEquation
      ? "CONDITIONAL_FAMILY_READING"
      : "PARTIAL_NULL",
    operator: input.profile.operator.toLocaleUpperCase("sq-AL"),
    embryo: {
      form: input.reviewedEmbryo.sourceForm,
      functionText: input.reviewedEmbryo.attestedGloss,
      sourceId: input.reviewedEmbryo.sourceId,
      sourceStatus: input.reviewedEmbryo.sourceStatus,
      claimLayer: "SOURCE_FACT",
    },
    directForms,
    derivativeFamilyForms,
    target,
    functionalEquation,
    explanation,
    claimLayer: "EXPLORATORY_HYPOTHESIS",
    evidenceStatus: "GENERATED_UNSELECTED_CANDIDATE",
    selectionStatus: "UNSELECTED",
    wholeWordStatus: "PARTIAL_NULL",
    unresolvedMaterial: [
      "Profile membership and carrier annotations do not establish a linear morphological or historical derivation",
      "Intermediate result-state function remains UNKNOWN_OR_NULL unless independently characterized",
      "Target internal segmentation remains UNKNOWN_OR_NULL",
      "Target-specific source-to-family relation remains an EXPLORATORY_HYPOTHESIS",
    ],
    reasonCodes: finalReasons,
    sourceAuthorityPromotion: "NONE",
    historicalOrigin: "NOT_CLAIMED",
    noSingleWinner: true,
    userDecisionPosture: "user_decides",
  };
}

export type CurrentWordDaAnchoredEmbryoCandidateProjectionV0_1 = Readonly<{
  status: "CANDIDATE_AVAILABLE" | "CONDITIONAL_PROPOSAL" | "PARTIAL_NULL";
  occurrences: readonly CurrentWordDaAnchoredEmbryoOccurrenceV0_1[];
  selectedOccurrenceId: string | null;
  standaloneEvidence: CurrentWordDaStandaloneEvidenceV0_1 | null;
  selectedSourceSense: Readonly<{
    label: string;
    responsePosition: string;
    sourceId: string;
    claimLayer: "SOURCE_FACT";
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED";
  }> | null;
  alternatives: readonly Readonly<{
    label: string;
    claimLayer: "SOURCE_FACT";
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED";
  }>[];
  computedVoiceOperations: readonly RuntimeComputedVoiceContributionV0_1[];
  exactCodePoints: readonly Readonly<{ character: string; position: number }>[];
  writtenVoices: readonly Readonly<{ voice: string; position: number }>[];
  overlappingVoiceEvents: readonly Readonly<{ voice: string; position: number }>[];
  derivativeFamilySupport: readonly Readonly<{ form: string; categories: readonly string[] }>[];
  homophoneCollisionAlternatives: readonly Readonly<{ form: string; glossTerms: readonly string[]; categories: readonly string[] }>[];
  functionalReading: string | null;
  reasoningTrace: FunctionalMotivationTraceProjectionV0_1 | null;
  generatedFunctionalMotivation: CurrentWordDaFunctionalMotivationProjectionV0_1;
  unresolvedMaterial: readonly string[];
  reasonCodes: readonly string[];
  targetMappingClaimLayer: "EXPLORATORY_HYPOTHESIS";
  targetMappingEvidenceStatus: "USER_PROPOSED" | "NOT_SELECTED";
  wholeWordStatus: "PARTIAL_NULL";
  sourceAuthorityPromotion: "NONE";
  historicalOrigin: "NOT_CLAIMED";
  noSingleWinner: true;
  userDecisionPosture: "user_decides";
}>;

type DaStandaloneSourceResolutionV0_1 = Readonly<{
  evidence: CurrentWordDaStandaloneEvidenceV0_1;
  profileClassification: ReturnType<typeof classifyFreeOperatorEvidenceV0_1>;
}>;

function daStandaloneSourceResolutionV0_1(): DaStandaloneSourceResolutionV0_1 | null {
  const canonicalProfile = canonicalOperatorProfilesV0_1.find(({ operatorId }) => operatorId === "DA");
  const sourceRow = canonicalProfile
    ? reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(({ sourceId }) => sourceId === canonicalProfile.sourceId)
    : undefined;
  if (!sourceRow || sourceRow.sourceStatus !== "reviewed_accepted") return null;

  const citation = sourceRow.externalCitations.find((candidate) =>
    candidate.citationStatus === "reviewed_accepted" &&
    candidate.attestedForm?.normalize("NFC").trim().toLocaleLowerCase("sq-AL") === "da" &&
    Boolean(candidate.attestedGloss?.trim()) && Boolean(candidate.sourceUrlOrArchiveRef?.trim()) &&
    Boolean(candidate.entryLocator?.trim()),
  );
  if (!citation?.attestedForm || !citation.attestedGloss || !citation.sourceUrlOrArchiveRef ||
      !citation.entryLocator || !citation.citationId || !citation.sourceTitle ||
      !citation.sourceAuthorOrEditor || !citation.sourcePublisherOrHost ||
      !citation.sourceDateOrVersion || !citation.attestedGrammarNote || !citation.reviewNote ||
      !canonicalProfile || canonicalProfile.embryo !== "DA" || sourceRow.embryo !== "DA") return null;

  const profileClassification = classifyFreeOperatorEvidenceV0_1({
    operator: "DA",
    attestedForm: citation.attestedForm,
    attestedGloss: citation.attestedGloss,
    dialect: "Gheg Albanian",
  });
  if (!profileClassification.categories.includes("free_operator_attested") ||
      profileClassification.categories.includes("functional_motivation_supported")) return null;

  return {
    evidence: {
      operator: "DA",
      sourceForm: citation.attestedForm,
      attestedGloss: citation.attestedGloss,
      dialect: "Gheg Albanian",
      sourceId: sourceRow.sourceId,
      candidateId: sourceRow.candidateId,
      sourceStatus: "reviewed_accepted",
      citationId: citation.citationId,
      citationStatus: "reviewed_accepted",
      sourceTitle: citation.sourceTitle,
      sourceAuthorOrEditor: citation.sourceAuthorOrEditor,
      sourcePublisherOrHost: citation.sourcePublisherOrHost,
      sourceDateOrVersion: citation.sourceDateOrVersion,
      sourceUrl: citation.sourceUrlOrArchiveRef,
      locator: citation.entryLocator,
      grammarNote: citation.attestedGrammarNote,
      reviewNote: citation.reviewNote,
      claimLayer: "SOURCE_FACT",
      freeOperatorCategories: profileClassification.categories,
    },
    profileClassification,
  };
}

function exactOrthographicOccurrencesV0_1(target: string, sourceForm: string): CurrentWordDaAnchoredEmbryoOccurrenceV0_1[] {
  const targetCodePoints = Array.from(target);
  const foldedTarget = targetCodePoints.map((character) => character.normalize("NFC").toLocaleLowerCase("sq-AL"));
  const foldedSource = Array.from(sourceForm.normalize("NFC").toLocaleLowerCase("sq-AL"));
  if (!foldedSource.length || foldedSource.some((character) => !character)) return [];

  const occurrences: CurrentWordDaAnchoredEmbryoOccurrenceV0_1[] = [];
  for (let start = 0; start <= foldedTarget.length - foldedSource.length; start += 1) {
    const matches = foldedSource.every((character, offset) => foldedTarget[start + offset] === character);
    if (!matches) continue;
    const end = start + foldedSource.length;
    occurrences.push({
      occurrenceId: target + "|" + sourceForm + "|" + start + ":" + end,
      exactSurface: targetCodePoints.slice(start, end).join(""),
      span: { start, end },
    });
  }
  return occurrences;
}

function generatedDaFunctionalMotivationV0_1(input: Readonly<{
  analyzedWord: string;
  draftTargetWord: string;
  identityMatches: boolean;
  language: string;
  variety: string;
  sourceResolution: DaStandaloneSourceResolutionV0_1 | null;
  occurrences: readonly CurrentWordDaAnchoredEmbryoOccurrenceV0_1[];
  sourceFacts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  fjaloriSourceResponse: RuntimeFjaloriSourceResponseV0_1 | null;
  exactCodePoints: readonly Readonly<{ character: string; position: number }>[];
  writtenVoices: readonly Readonly<{ voice: string; position: number }>[];
}>): CurrentWordDaFunctionalMotivationProjectionV0_1 {
  const hardReasonCodes: string[] = [];
  if (!input.analyzedWord || input.draftTargetWord !== input.analyzedWord) hardReasonCodes.push("CURRENT_WORD_IDENTITY_MISMATCH");
  if (!input.identityMatches) hardReasonCodes.push("ANALYSIS_IDENTITY_NOT_CONFIRMED");
  if (!isAlbanianLanguage(input.language)) hardReasonCodes.push("TARGET_LANGUAGE_NOT_ALBANIAN");
  if (!isCompatibleAlbanianVariety(input.variety)) hardReasonCodes.push("TARGET_VARIETY_REQUIRED");
  if (!input.sourceResolution) hardReasonCodes.push("DA_REVIEWED_STANDALONE_SOURCE_NOT_AVAILABLE");
  if (!input.occurrences.length) hardReasonCodes.push("DA_EXACT_SUBSTRING_NOT_FOUND");

  const sourceFacts = input.sourceFacts.filter((fact) =>
    fact.language === "Albanian" && fact.languageCode === "sq" &&
    fact.attestationTruth === "fact" && fact.sourceStatus === "observed_external_snapshot" &&
    fact.sourceRecordId.trim().length > 0 && fact.entryLocator.trim().length > 0 &&
    sameAlbanianSourceForm(fact.form, input.analyzedWord) &&
    /^[0-9a-f]{64}$/iu.test(fact.sourceSnapshot.sha256) && fact.sourceSnapshot.bytes > 0,
  );
  const response = input.fjaloriSourceResponse;
  const canonicalQueryForm = response?.queryForm.normalize("NFC").trim().toLocaleLowerCase("sq-AL") ?? "";
  const fjaloriResponseIdentityValid = response?.status === "available" &&
    sameAlbanianSourceForm(response.queryForm, input.analyzedWord) &&
    sameAlbanianSourceForm(response.exactSourceForm, input.analyzedWord) &&
    response.requestKey === `${response.queryForm}\u0000${canonicalQueryForm}` &&
    response.licence === "CC BY-SA 4.0" &&
    response.apiUrl === `https://fjalorishqip.org/api/v1/fjala/${encodeURIComponent(canonicalQueryForm)}.json` &&
    isAlbanianLanguage(response.analysisLanguage) && isAlbanianLanguage(input.language) &&
    (!input.variety.trim() || !response.analysisVariety.trim() ||
      normalizeSourceContext(response.analysisVariety) === normalizeSourceContext(input.variety));
  const fjaloriSenses = fjaloriResponseIdentityValid && response?.status === "available"
    ? response.senses.filter((sense) =>
        Number.isInteger(sense.entryIndex) && sense.entryIndex > 0 &&
        Number.isInteger(sense.senseIndex) && sense.senseIndex > 0 &&
        sense.gloss.trim().length > 0 && sense.senseSource.trim().length > 0,
      ).map((sense) => ({ response, sense }))
    : [];
  const sourceSenses = [
    ...sourceFacts.flatMap((sourceFact) => sourceFact.senses.map((sense, senseIndex) => ({
      provider: "KAIKKI" as const,
      sourceFact,
      sense,
      senseOrdinal: senseIndex + 1,
      senseId: sense.senseId ?? null,
      glosses: sense.glosses.map((gloss) => gloss.trim()).filter(Boolean),
    }))),
    ...fjaloriSenses.map(({ response: sourceResponse, sense }) => ({
      provider: "FJALORISHQIP" as const,
      sourceResponse,
      sense,
      senseOrdinal: sense.senseIndex,
      senseId: null,
      glosses: [sense.gloss.trim()],
    })),
  ];
  const sourceSensesWithGlosses = sourceSenses.filter(({ glosses }) => glosses.length > 0);
  const reasonCodes: string[] = [...hardReasonCodes];
  if (response?.status === "available" && !fjaloriResponseIdentityValid) {
    reasonCodes.push("FJALORISHQIP_SOURCE_IDENTITY_OR_PROVENANCE_INVALID");
  }
  if (response && response.status !== "available" && !sourceFacts.length) {
    reasonCodes.push(`FJALORISHQIP_SOURCE_${response.status.replaceAll("-", "_").toLocaleUpperCase("en-US")}`);
  }
  if (!sourceSenses.length) reasonCodes.push("EXACT_TARGET_SOURCE_FACTS_NOT_AVAILABLE");
  else if (!sourceSensesWithGlosses.length) reasonCodes.push("EXACT_TARGET_SOURCE_SENSE_GLOSSES_NOT_AVAILABLE");
  const daFunctionalGlossTerms = [
    ...DA_FREE_OPERATOR_PROFILE_V0_1.directFreeOperator.glossTerms,
    ...DA_FREE_OPERATOR_PROFILE_V0_1.derivativeFamilySupport.glossTerms,
  ];
  const matchingSourceSenses = sourceSensesWithGlosses.filter(({ glosses }) =>
    glosses.some((gloss) => freeOperatorProfileGlossMatchesV0_1(daFunctionalGlossTerms, gloss)),
  );
  if (sourceSensesWithGlosses.length && !matchingSourceSenses.length) {
    reasonCodes.push("DA_FUNCTIONAL_DOMAIN_NOT_MATCHED_TO_TARGET_SENSE");
  }

  const candidates = !hardReasonCodes.length && input.sourceResolution
    ? input.occurrences.flatMap((occurrence) => matchingSourceSenses.flatMap((senseRecord) => {
          const targetSenseGlosses = senseRecord.glosses;
          const targetSource = senseRecord.provider === "KAIKKI"
            ? {
                provider: "KAIKKI" as const,
                sourceFact: senseRecord.sourceFact,
                senseOrdinal: senseRecord.senseOrdinal,
                senseId: senseRecord.senseId,
              }
            : {
                provider: "FJALORISHQIP" as const,
                responseStatus: "available" as const,
                exactSourceForm: senseRecord.sourceResponse.exactSourceForm,
                apiUrl: senseRecord.sourceResponse.apiUrl,
                licence: senseRecord.sourceResponse.licence,
                analysisLanguage: senseRecord.sourceResponse.analysisLanguage,
                analysisVariety: senseRecord.sourceResponse.analysisVariety,
                recordSources: senseRecord.sourceResponse.recordSources,
                responsePosition: { entryIndex: senseRecord.sense.entryIndex, senseIndex: senseRecord.sense.senseIndex },
                partOfSpeech: senseRecord.sense.partOfSpeech,
                glossLanguage: senseRecord.sense.glossLanguage,
                senseSource: senseRecord.sense.senseSource,
                tags: senseRecord.sense.tags,
                entrySources: senseRecord.sense.entrySources,
                citationStatus: "CITATION_ENTERED_UNVERIFIED" as const,
                licensingStatus: "NOT_ASSESSED" as const,
              };
          const sourceIdentity = senseRecord.provider === "KAIKKI"
            ? senseRecord.sourceFact.sourceRecordId
            : `fjalorishqip:${canonicalQueryForm}:entry-${senseRecord.sense.entryIndex}:sense-${senseRecord.sense.senseIndex}`;
          const targetExactSourceForm = senseRecord.provider === "KAIKKI"
            ? senseRecord.sourceFact.form
            : senseRecord.sourceResponse.exactSourceForm;
          const familyNetwork = projectFreeOperatorFamilyFunctionalNetworkV0_1({
            profile: DA_FREE_OPERATOR_PROFILE_V0_1,
            protoRoot: PROTO_ROOTS_V1.find(({ id }) =>
              freeOperatorProfileFormMatchesV0_1([DA_FREE_OPERATOR_PROFILE_V0_1.operator], id),
            ) ?? null,
            reviewedEmbryo: input.sourceResolution!.evidence,
            targetForm: input.analyzedWord,
            targetSense: {
              exactSourceForm: targetExactSourceForm,
              glosses: targetSenseGlosses,
              sourceIdentity,
              evidenceStatus: senseRecord.provider === "KAIKKI"
                ? "OBSERVED_EXTERNAL_SNAPSHOT"
                : "CITATION_ENTERED_UNVERIFIED",
            },
          });
          if (familyNetwork.status !== "CONDITIONAL_FAMILY_READING" || !familyNetwork.explanation) {
            reasonCodes.push(...familyNetwork.reasonCodes.map((reason) => `DA_FAMILY_NETWORK_${reason}`));
            return [];
          }
          const unresolvedMaterial = [
            `${occurrence.exactSurface}@${occurrence.span.start}-${occurrence.span.end} is observed spelling structure, not an established morpheme boundary`,
            "The DA-family-to-target functional relationship is an unselected exploratory hypothesis, not a source-reported derivation",
            "Internal segmentation and morphology remain UNKNOWN_OR_NULL",
            ...familyNetwork.unresolvedMaterial,
            ...input.exactCodePoints
              .filter(({ position, character }) =>
                (position < occurrence.span.start || position >= occurrence.span.end) &&
                extractSevenVowelsFromString(character).length === 0,
              )
              .map(({ character, position }) => `${character}@${position} functional association UNKNOWN_OR_NULL`),
            ...input.writtenVoices.map(({ voice, position }) => `${voice}@${position} symbolic role UNKNOWN_OR_NULL; written Voice preserved`),
            "Complete whole-word functional derivation remains UNKNOWN_OR_NULL",
          ];
          return [{
            candidateId: `da-functional:${sourceIdentity}:${senseRecord.senseOrdinal}:${occurrence.span.start}-${occurrence.span.end}`,
            occurrence,
            targetSource,
            targetSenseOrdinal: senseRecord.senseOrdinal,
            targetSenseId: senseRecord.senseId,
            targetSenseGlosses,
            familyNetwork,
            familySupport: DA_FREE_OPERATOR_PROFILE_V0_1.derivativeFamilySupport.forms.map((form) => ({
              form,
              categories: DA_FREE_OPERATOR_PROFILE_V0_1.derivativeFamilySupport.categories,
            })),
            functionalReading: familyNetwork.explanation,
            claimLayer: "EXPLORATORY_HYPOTHESIS" as const,
            generatedBy: "DA_REVIEWED_SOURCE_PLUS_EXACT_FORM" as const,
            selectionStatus: "UNSELECTED" as const,
            unresolvedMaterial,
            wholeWordStatus: "PARTIAL_NULL" as const,
            sourceAuthorityPromotion: "NONE" as const,
            historicalOrigin: "NOT_CLAIMED" as const,
            noSingleWinner: true as const,
            userDecisionPosture: "user_decides" as const,
          }];
        }))
    : [];

  const finalReasonCodes = [...new Set(reasonCodes)].sort();
  return {
    status: candidates.length ? "CANDIDATES_AVAILABLE" : "PARTIAL_NULL",
    candidates,
    reasonCodes: candidates.length ? [] : finalReasonCodes,
  };
}

function buildDaAnchoredFunctionalTraceV0_1(input: Readonly<{
  analyzedWord: string;
  language: string;
  variety: string;
  occurrence: CurrentWordDaAnchoredEmbryoOccurrenceV0_1;
  evidence: CurrentWordDaStandaloneEvidenceV0_1;
  selectedSense: RuntimeAlbanianSourceSenseSelectionV0_1;
  selectedSenseDefinition: string;
  selectedSenseSourceId: string;
  computedContributions: readonly RuntimeComputedVoiceContributionV0_1[];
  unresolvedMaterial: readonly string[];
  functionalReading: string;
}>): ProjectFunctionalMotivationTraceResultV0_1 {
  const targetSource = {
    sourceId: input.selectedSenseSourceId,
    label: "FjaloriShqip API response · " + input.selectedSense.selectedSense.senseSource,
    url: input.selectedSense.apiUrl,
    locator: "Entry " + input.selectedSense.selectedSense.entryIndex + " · Sense " + input.selectedSense.selectedSense.senseIndex +
      " · response position, not a source-issued sense ID · entry sources " +
      (input.selectedSense.selectedSense.entrySources.join(", ") || "UNKNOWN_OR_NULL"),
    citationStatus: "CITATION_ENTERED_UNVERIFIED" as const,
    licensingStatus: "NOT_ASSESSED" as const,
  };
  const daSource = {
    sourceId: input.evidence.sourceId,
    label: input.evidence.sourceAuthorOrEditor + " · " + input.evidence.sourceDateOrVersion,
    url: input.evidence.sourceUrl,
    locator: input.evidence.locator,
    citationStatus: "CITATION_ENTERED_UNVERIFIED" as const,
    licensingStatus: "NOT_ASSESSED" as const,
  };
  const exactCodePoints = Array.from(input.analyzedWord).map((character, position) => ({ character, position }));
  const targetVoiceEvents = exactCodePoints.flatMap(({ character, position }) => {
    const voice = extractSevenVowelsFromString(character)[0];
    return voice ? [{ voice, position }] : [];
  });
  const unresolvedClaims = input.unresolvedMaterial.map((text) => ({
    text,
    claimLayer: "UNKNOWN_OR_NULL" as const,
    status: "UNKNOWN_OR_NULL",
    sourceIds: [] as const,
  }));
  const traceInput: FunctionalMotivationTraceInputV0_1 = {
    target: {
      exactSpelling: input.analyzedWord,
      language: input.language,
      variety: input.variety,
      grammaticalCategory: input.selectedSense.selectedSense.partOfSpeech ?? "UNKNOWN_OR_NULL",
      selectedSense: input.selectedSenseDefinition,
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: [input.selectedSenseSourceId],
      expectedCodePoints: exactCodePoints,
      expectedWrittenVoices: targetVoiceEvents,
    },
    sources: [targetSource, daSource],
    terms: [
      {
        id: "standalone-da",
        spelling: input.evidence.sourceForm.toLocaleUpperCase("sq-AL"),
        functionText: input.evidence.attestedGloss,
        claimLayer: "SOURCE_FACT",
        status: "source row " + input.evidence.sourceStatus + "; citation metadata " + input.evidence.citationStatus,
        sourceIds: [input.evidence.sourceId],
        roleNote: "standalone Gheg lexical function only; not a target segmentation",
        freeOperatorClassification: input.evidence.freeOperatorCategories.join(", "),
      },
      {
        id: "selected-whole-word-sense",
        spelling: input.analyzedWord,
        functionText: input.selectedSenseDefinition,
        claimLayer: "SOURCE_FACT",
        status: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: [input.selectedSenseSourceId],
        roleNote: "explicitly selected runtime lexical sense; not a derivation",
      },
    ],
    equation: {
      contributorTermIds: ["standalone-da"],
      resultText: input.selectedSenseDefinition,
      targetDescription: "selected whole-word source sense; target mapping remains user-proposed",
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      status: "USER_PROPOSED",
      sourceIds: [],
    },
    functionalReading: {
      text: input.functionalReading,
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      status: "USER_PROPOSED",
      sourceIds: [],
    },
    surfaceReconstruction: {
      components: [{
        spelling: input.analyzedWord,
        functionText: "exact whole-word spelling; internal segmentation UNKNOWN_OR_NULL",
        claimLayer: "UNKNOWN_OR_NULL",
        status: "WHOLE_WORD_SURFACE_ONLY",
        unresolved: true,
      }],
      expectedStatus: "EXACT_MATCH",
      note: "The whole target spelling is preserved without segmentation. The DA occurrence is an overlapping substring candidate at [" +
        input.occurrence.span.start + "," + input.occurrence.span.end + "); it is not asserted as a morpheme boundary.",
      sourceIds: [],
    },
    operations: [],
    alternatives: input.selectedSense.alternativeSenses.map((sense) => ({
      text: "Alternative source sense: " + sense.gloss,
      claimLayer: "SOURCE_FACT",
      status: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: [input.selectedSenseSourceId],
    })),
    contrasts: [],
    unresolved: unresolvedClaims,
    notes: [
      "The reviewed DA source row's separate DA-to-DAM/DAMAGE functional candidate is not transferred to this target.",
      "NDAJ, NDARË, and NDARE remain derivative-family support and are not used as direct standalone DA evidence.",
      "The DA profile records a give/gave/given homophone collision; it is preserved as a separate lexical alternative and is not assigned to this target occurrence.",
      "The observed DA span overlaps a written Voice event; that is the same conserved event, not an additional occurrence.",
      "The FjaloriShqip and DA source identities remain separate; their existence does not by itself establish corroboration or sense equivalence.",
      "This is not a claim of pronunciation, historical origin, or an exact reconstruction of Petro Zheji's method.",
    ],
    reasoningSteps: [
      {
        id: "selected-whole-word-sense",
        title: "Selected whole-word sense",
        from: input.analyzedWord,
        relationshipType: "explicitly selected lexical sense",
        to: input.selectedSenseDefinition,
        claimLayer: "SOURCE_FACT",
        status: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: [input.selectedSenseSourceId],
        evidenceNote: "Selected FjaloriShqip response position Entry " + input.selectedSense.selectedSense.entryIndex +
          ", Sense " + input.selectedSense.selectedSense.senseIndex + "; response position is not a source-issued sense identifier.",
        supportBoundary: "The lexical sense is a source-reported input and does not establish internal segmentation or symbolic function.",
      },
      {
        id: "observed-da-substring",
        title: "Observed DA substring candidate",
        from: input.analyzedWord + " code-point span [" + input.occurrence.span.start + "," + input.occurrence.span.end + ")",
        relationshipType: "exact orthographic substring",
        to: input.occurrence.exactSurface,
        claimLayer: "DERIVED_STRUCTURE",
        status: "OBSERVED_IN_TARGET_SPELLING",
        sourceIds: [],
        evidenceNote: "The exact surface and zero-based end-exclusive span are computed from the analyzed spelling.",
        supportBoundary: "This observation does not establish a morpheme boundary, target sense, or derivational relationship.",
        exactStructure: input.occurrence.exactSurface + "@[" + input.occurrence.span.start + "," + input.occurrence.span.end + ")",
      },
      {
        id: "standalone-da-function",
        title: "Standalone DA lexical function",
        from: input.evidence.dialect + " " + input.evidence.sourceForm,
        relationshipType: "reviewed standalone lexical source record",
        to: input.evidence.attestedGloss,
        claimLayer: "SOURCE_FACT",
        status: input.evidence.sourceStatus + " source row; " + input.evidence.citationStatus + " citation metadata",
        sourceIds: [input.evidence.sourceId],
        evidenceNote: input.evidence.sourceTitle + "; " + input.evidence.locator + "; source record " +
          input.evidence.sourceId + "; citation " + input.evidence.citationId + ".",
        supportBoundary: "This source supports standalone Gheg DA only. It does not establish this DA substring as a component of the target.",
      },
      {
        id: "explicit-da-target-mapping",
        title: "User-authorized DA-to-target proposal",
        from: input.occurrence.exactSurface + "@[" + input.occurrence.span.start + "," + input.occurrence.span.end + ") · " + input.evidence.attestedGloss,
        relationshipType: "user-proposed functional alignment",
        to: input.analyzedWord + " · " + input.selectedSenseDefinition,
        claimLayer: "EXPLORATORY_HYPOTHESIS",
        status: "USER_PROPOSED",
        sourceIds: [],
        evidenceNote: "This relation appears only after explicit user selection; no target mapping is inferred from substring matching.",
        supportBoundary: "The proposal does not establish morphology, historical derivation, or a complete whole-word explanation.",
      },
      ...input.computedContributions.map((contribution) => ({
        id: "voice-operation-" + contribution.operationId,
        title: "Computed user-selected Voice operation",
        from: contribution.voice + "@" + contribution.position + " · " + contribution.operatorText + "(" + contribution.inputText + ")",
        relationshipType: "evaluated symbolic transformation",
        to: contribution.outputText,
        claimLayer: "EXPLORATORY_HYPOTHESIS" as const,
        status: "COMPUTED_FROM_USER_PROPOSED_INPUTS",
        sourceIds: [] as const,
        evidenceNote: "Operation " + contribution.operationId + "; input " + contribution.inputSymbolId +
          "; output " + contribution.outputSymbolId + "; sourceIds empty.",
        supportBoundary: contribution.voice === "A" && contribution.position >= input.occurrence.span.start && contribution.position < input.occurrence.span.end
          ? "The A event is the single written Voice event also contained in the DA substring span; the event is reused once and is not an independent DA occurrence."
          : "A deterministic symbolic computation over user-selected hypotheses; it does not validate the DA-to-target proposal.",
      })),
      ...input.unresolvedMaterial.map((text, index) => ({
        id: "unresolved-" + index,
        title: "Unresolved target material",
        from: input.analyzedWord,
        relationshipType: "unsupported or unassigned structure",
        to: text,
        claimLayer: "UNKNOWN_OR_NULL" as const,
        status: "UNKNOWN_OR_NULL",
        sourceIds: [] as const,
        evidenceNote: "No qualifying component function or relationship is established by these inputs.",
        supportBoundary: "Retained as Null; no meaning is assigned.",
      })),
    ],
  };
  return projectFunctionalMotivationTraceV0_1(traceInput);
}

export function buildCurrentWordDaAnchoredEmbryoCandidateV0_1(input: Readonly<{
  analyzedWord: string;
  draftTargetWord: string;
  identityMatches: boolean;
  language: string;
  variety: string;
  selectedSourceSense: RuntimeAlbanianSourceSenseSelectionV0_1 | null;
  exactSourceFacts?: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  fjaloriSourceResponse?: RuntimeFjaloriSourceResponseV0_1 | null;
  evaluation: SymbolicFunctionalCompositionResultV0_3;
  proposedOccurrenceId: string | null;
}>): CurrentWordDaAnchoredEmbryoCandidateProjectionV0_1 {
  const reasons: string[] = [];
  if (!input.analyzedWord || input.draftTargetWord !== input.analyzedWord) reasons.push("CURRENT_WORD_IDENTITY_MISMATCH");
  if (!input.identityMatches) reasons.push("ANALYSIS_IDENTITY_NOT_CONFIRMED");
  if (!isAlbanianLanguage(input.language)) reasons.push("TARGET_LANGUAGE_NOT_ALBANIAN");
  if (!isCompatibleAlbanianVariety(input.variety)) reasons.push("TARGET_VARIETY_REQUIRED");

  const sourceResolution = daStandaloneSourceResolutionV0_1();
  if (!sourceResolution) reasons.push("DA_REVIEWED_STANDALONE_SOURCE_NOT_AVAILABLE");
  const occurrences = sourceResolution
    ? exactOrthographicOccurrencesV0_1(input.analyzedWord, sourceResolution.evidence.sourceForm)
    : [];
  if (sourceResolution && occurrences.length === 0) reasons.push("DA_EXACT_SUBSTRING_NOT_FOUND");
  const proposedOccurrence = input.proposedOccurrenceId
    ? occurrences.find(({ occurrenceId }) => occurrenceId === input.proposedOccurrenceId) ?? null
    : null;
  if (input.proposedOccurrenceId && !proposedOccurrence) reasons.push("DA_TARGET_MAPPING_SELECTION_NOT_IN_CURRENT_CANDIDATES");

  const exploratory = buildCurrentWordExploratoryMotivationV0_1({
    analyzedWord: input.analyzedWord,
    draftTargetWord: input.draftTargetWord,
    language: input.language,
    variety: input.variety,
    selectedSourceSense: input.selectedSourceSense,
    evaluation: input.evaluation,
  });
  const sourceContent = exploratory.sourceContent?.ok ? exploratory.sourceContent.content : null;
  if (input.evaluation.ok) {
    if (input.evaluation.target.exactSpelling !== input.analyzedWord || input.evaluation.target.exactSpelling !== input.draftTargetWord) {
      reasons.push("SYMBOLIC_EVALUATION_TARGET_MISMATCH");
    }
    if (sourceContent && JSON.stringify(input.evaluation.target.codePoints) !== JSON.stringify(sourceContent.target.codePoints)) {
      reasons.push("TARGET_CODE_POINT_ACCOUNTING_MISMATCH");
    }
    if (sourceContent && JSON.stringify(input.evaluation.target.writtenVoices) !== JSON.stringify(sourceContent.target.writtenVoices)) {
      reasons.push("TARGET_WRITTEN_VOICE_PATH_MISMATCH");
    }
  } else {
    reasons.push(...input.evaluation.reasonCodes.map((reason) => "SYMBOLIC_EVALUATION_" + reason));
  }
  reasons.push(...exploratory.unresolved
    .filter((reason) => reason.startsWith("VOICE_OPERATION_NOT_VERIFIABLY_COMPUTED:"))
    .map((reason) => "SYMBOLIC_" + reason));
  if (proposedOccurrence && !input.selectedSourceSense) reasons.push("TARGET_SOURCE_SENSE_NOT_SELECTED");
  if (proposedOccurrence && !sourceContent) reasons.push("TARGET_SOURCE_SENSE_NOT_VALID_FOR_CURRENT_WORD");
  if (proposedOccurrence && exploratory.computedContributions.length === 0) {
    reasons.push("NO_VERIFIABLY_COMPUTED_VOICE_OUTPUTS");
  }

  const exactCodePoints = Array.from(input.analyzedWord).map((character, position) => ({ character, position }));
  const writtenVoices = exactCodePoints.flatMap(({ character, position }) => {
    const voice = extractSevenVowelsFromString(character)[0];
    return voice ? [{ voice, position }] : [];
  });
  const overlappingVoiceEvents = proposedOccurrence
    ? writtenVoices.filter(({ position }) => position >= proposedOccurrence.span.start && position < proposedOccurrence.span.end)
    : [];
  const alternatives = input.identityMatches ? sourceContent?.target.alternativeSenses.map(({ label }) => ({
    label,
    claimLayer: "SOURCE_FACT" as const,
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED" as const,
  })) ?? [] : [];
  const unresolvedMaterial = [...new Set([
    ...exploratory.unresolved,
    ...(proposedOccurrence ? [
      "DA occurrence is not established as a morpheme or derivational component",
      "INTERNAL_SEGMENTATION_OR_MORPHOLOGY_NOT_ESTABLISHED",
      ...exactCodePoints
        .filter(({ position, character }) =>
          (position < proposedOccurrence.span.start || position >= proposedOccurrence.span.end) &&
          extractSevenVowelsFromString(character).length === 0,
        )
        .map(({ character, position }) => `${character}@${position} functional association UNKNOWN_OR_NULL`),
    ] : []),
    ...writtenVoices
      .filter(({ position }) => !exploratory.computedContributions.some((contribution) => contribution.position === position))
      .map(({ voice, position }) => `${voice}@${position} functional role UNKNOWN_OR_NULL`),
    ...(proposedOccurrence && overlappingVoiceEvents.length
      ? [overlappingVoiceEvents.map(({ voice, position }) => `${voice}@${position}`).join(", ") +
        " is the conserved written Voice event overlapping the DA span; no separate vowel occurrence is created"]
      : []),
    ...(proposedOccurrence && exploratory.computedContributions.length === 0
      ? ["No computed Voice operation is available to accompany the DA proposal"]
      : []),
  ])].sort();

  const reasonCodes = [...new Set(reasons)].sort();
  const proposalReady = Boolean(
    proposedOccurrence && sourceResolution && sourceContent && input.evaluation.ok &&
    !reasonCodes.length && exploratory.computedContributions.length > 0,
  );
  let functionalReading: string | null = null;
  let reasoningTrace: FunctionalMotivationTraceProjectionV0_1 | null = null;
  if (proposalReady && proposedOccurrence && sourceResolution && sourceContent && input.selectedSourceSense) {
    const operations = exploratory.computedContributions.map(({ voice, position, operatorText, inputText, outputText }) =>
      voice + "@" + position + " " + operatorText + "(" + inputText + ") → " + outputText,
    ).join(" · ");
    const overlapText = overlappingVoiceEvents.length
      ? overlappingVoiceEvents.map(({ voice, position }) => voice + "@" + position).join(", ")
      : "none";
    functionalReading = "The reviewed standalone Gheg source record reports " + sourceResolution.evidence.sourceForm +
      " (“" + sourceResolution.evidence.attestedGloss + "”). The exact target spelling contains " +
      proposedOccurrence.exactSurface + " at code-point span [" + proposedOccurrence.span.start + "," + proposedOccurrence.span.end +
      "). If you interpret this occurrence as a functional embryo, the source-reported function “" + sourceResolution.evidence.attestedGloss +
      "” may help motivate the selected whole-word source sense “" +
      sourceContent.target.selectedSense.definition + "”. The separately computed, user-selected Voice outputs are " + operations +
      ". The substring overlaps written Voice event " + overlapText +
      "; that event is conserved once. This target mapping is USER_PROPOSED / EXPLORATORY_HYPOTHESIS, not an established morpheme or derivation. Other structure and the complete whole-word function remain UNKNOWN_OR_NULL.";
    const selectedSenseSourceId = sourceContent.target.selectedSense.sourceIds[0];
    const traceResult = buildDaAnchoredFunctionalTraceV0_1({
      analyzedWord: input.analyzedWord,
      language: input.language,
      variety: input.variety,
      occurrence: proposedOccurrence,
      evidence: sourceResolution.evidence,
      selectedSense: input.selectedSourceSense,
      selectedSenseDefinition: sourceContent.target.selectedSense.definition,
      selectedSenseSourceId,
      computedContributions: exploratory.computedContributions,
      unresolvedMaterial,
      functionalReading,
    });
    if (traceResult.status === "READY") {
      reasoningTrace = traceResult.projection;
    } else {
      reasons.push(...traceResult.reasonCodes.map((reason) => "FUNCTIONAL_TRACE_" + reason));
      functionalReading = null;
    }
  }

  const finalReasonCodes = [...new Set(reasons)].sort();
  const selectedOccurrenceId = proposedOccurrence?.occurrenceId ?? null;
  return {
    status: functionalReading ? "CONDITIONAL_PROPOSAL" : occurrences.length && !finalReasonCodes.length ? "CANDIDATE_AVAILABLE" : "PARTIAL_NULL",
    occurrences,
    selectedOccurrenceId,
    standaloneEvidence: sourceResolution?.evidence ?? null,
    selectedSourceSense: input.identityMatches && sourceContent && input.selectedSourceSense
      ? {
          label: sourceContent.target.selectedSense.definition,
          responsePosition: "Entry " + input.selectedSourceSense.selectedSense.entryIndex + " · Sense " + input.selectedSourceSense.selectedSense.senseIndex,
          sourceId: sourceContent.target.selectedSense.sourceIds[0],
          claimLayer: "SOURCE_FACT",
          evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        }
      : null,
    alternatives,
    computedVoiceOperations: input.evaluation.ok && !finalReasonCodes.some((reason) => reason === "SYMBOLIC_EVALUATION_TARGET_MISMATCH")
      ? exploratory.computedContributions
      : [],
    exactCodePoints,
    writtenVoices,
    overlappingVoiceEvents,
    derivativeFamilySupport: DA_FREE_OPERATOR_PROFILE_V0_1.derivativeFamilySupport.forms.map((form) => ({
      form,
      categories: DA_FREE_OPERATOR_PROFILE_V0_1.derivativeFamilySupport.categories,
    })),
    homophoneCollisionAlternatives: DA_FREE_OPERATOR_PROFILE_V0_1.homophoneCollisions.flatMap((collision) =>
      collision.forms.map((form) => ({ form, glossTerms: collision.glossTerms, categories: collision.categories })),
    ),
    functionalReading,
    reasoningTrace,
    unresolvedMaterial,
    reasonCodes: finalReasonCodes,
    targetMappingClaimLayer: "EXPLORATORY_HYPOTHESIS",
    targetMappingEvidenceStatus: selectedOccurrenceId ? "USER_PROPOSED" : "NOT_SELECTED",
    wholeWordStatus: "PARTIAL_NULL",
    sourceAuthorityPromotion: "NONE",
    historicalOrigin: "NOT_CLAIMED",
    noSingleWinner: true,
    userDecisionPosture: "user_decides",
    generatedFunctionalMotivation: generatedDaFunctionalMotivationV0_1({
      analyzedWord: input.analyzedWord,
      draftTargetWord: input.draftTargetWord,
      identityMatches: input.identityMatches,
      language: input.language,
      variety: input.variety,
      sourceResolution,
      occurrences,
      sourceFacts: input.exactSourceFacts ?? [],
      fjaloriSourceResponse: input.fjaloriSourceResponse ?? null,
      exactCodePoints,
      writtenVoices,
    }),
  };
}

const nonempty = (value: string) => value.normalize("NFC").trim().length > 0;

function normalizeSourceContext(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}

function sameSourceOrigin(left: string, right: string): boolean {
  try {
    return new URL(left).origin === new URL(right).origin;
  } catch {
    return true;
  }
}

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
  return { status: "PARTIAL_NULL", result: null, sourceCitations: [], reasonCodes: [...new Set(reasonCodes)].sort() };
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
  return { status: "CONDITIONAL_SUGGESTION", result, sourceCitations: input.sources, reasonCodes: [] };
}
