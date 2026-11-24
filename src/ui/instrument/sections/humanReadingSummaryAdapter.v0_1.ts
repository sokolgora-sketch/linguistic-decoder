import { extractSevenVowelsFromString } from "@/shared/math7.core";
import type { AlbanianKaikkiExactLexicalSourceFactV0_1 } from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import { getReviewedExternalLexiconProductionSourceRowsV0_1 } from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { projectReviewedExternalLexiconProductionRowForRuntimeV0_1 } from "@/shared/reviewedExternalLexiconRuntimeProjection.v0_1";
import type {
  CandidateRowVM,
  MotivationDiscoveryV0_2VM,
  PresentOrMissing,
  RootMapVM,
} from "@/ui/telemetry/types";
import { sameAlbanianSourceForm } from "@/ui/instrument/albanianSourceFormIdentity.v0_1";
import type {
  CurrentWordFunctionalReasoningCandidateV0_1,
  CurrentWordFunctionalReasoningProjectionV0_1,
  FunctionalFamilyPathV0_1,
  RuntimeFjaloriSourceResponseV0_1,
} from "@/ui/instrument/sections/currentWordSourceFunctionalSuggestionAdapter.v0_1";

export type HumanReadingSourceSenseV0_1 = Readonly<{
  exactForm: string;
  partOfSpeech: string | null;
  gloss: string;
  provider: "FjaloriShqip" | "Kaikki";
  sourceIdentity: string;
  sourceUrl: string;
  locator: string;
  sourceAttribution: string;
  evidenceStatus: "CITATION_ENTERED_UNVERIFIED" | "OBSERVED_EXTERNAL_SNAPSHOT" | "reviewed_accepted" | "UNKNOWN_OR_NULL";
}>;

export type HumanReadingFamilySenseV0_1 = Readonly<{
  form: string;
  partOfSpeech: string | null;
  gloss: string;
  sourceIdentity: string | null;
  sourceUrl: string | null;
}>;

export type HumanReadingFunctionalGroupV0_1 = Readonly<{
  groupId: string;
  operator: string;
  functionText: string;
  functionSourceUrl: string;
  functionSourceLabel: string;
  targetForm: string;
  targetGlosses: readonly string[];
  targetPartOfSpeech: string | null;
  relationship: "ACTION_TO_EVENT_OR_RESULT" | "KNOWING_TO_KNOWLEDGE" | "SOURCE_LINKED_PROPOSAL";
  familyForms: readonly string[];
  familySenses: readonly HumanReadingFamilySenseV0_1[];
  functionalPaths: readonly FunctionalFamilyPathV0_1[];
  explanation: string;
  candidates: readonly CurrentWordFunctionalReasoningCandidateV0_1[];
}>;

export type HumanReadingReviewedLexicalFunctionV0_1 = Readonly<{
  operator: string;
  functionText: string;
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  locator: string;
  evidenceText: string;
}>;

export type HumanReadingSummaryProjectionV0_1 = Readonly<{
  word: string;
  meanings: readonly HumanReadingSourceSenseV0_1[];
  writtenVoiceEvents: readonly Readonly<{ voice: string; position: number }>[];
  functionalReadings: readonly HumanReadingFunctionalGroupV0_1[];
  reviewedLexicalFunctions: readonly HumanReadingReviewedLexicalFunctionV0_1[];
  functionalCandidates: readonly CandidateRowVM[];
  sourceAvailability: "AVAILABLE" | "NOT_AVAILABLE";
  alternativesAvailable: boolean;
  technicalReasonCodes: readonly string[];
  sourceFactStatus: string;
  interpretationBoundaries: readonly string[];
}>;

function exactSenseKey(sense: HumanReadingSourceSenseV0_1): string {
  return [
    sense.provider,
    sense.exactForm.normalize("NFC").trim().toLocaleLowerCase("sq-AL"),
    sense.sourceIdentity,
    sense.locator,
    sense.gloss.trim().toLocaleLowerCase("en-US"),
  ].join("\u0000");
}

function providerLabel(provider: "FJALORISHQIP" | "KAIKKI"): HumanReadingSourceSenseV0_1["provider"] {
  return provider === "FJALORISHQIP" ? "FjaloriShqip" : "Kaikki";
}

function addSense(
  senses: Map<string, HumanReadingSourceSenseV0_1>,
  sense: HumanReadingSourceSenseV0_1,
): void {
  if (!sense.gloss.trim() || !sense.exactForm.trim()) return;
  senses.set(exactSenseKey(sense), sense);
}

function presentValue<T>(value: PresentOrMissing<T> | undefined): T | null {
  return value?.kind === "present" ? value.value : null;
}

function matchesReviewedSourceRow(
  candidate: CandidateRowVM,
  sourceRow: ReturnType<typeof getReviewedExternalLexiconProductionSourceRowsV0_1>[number],
): boolean {
  const sourceId = presentValue(candidate.sourceId);
  const language = presentValue(candidate.language);
  const form = presentValue(candidate.form);
  const sourceKind = presentValue(candidate.sourceKind);
  const sourceStatus = presentValue(candidate.sourceStatus);
  const embryo = presentValue(candidate.embryo);
  const gloss = presentValue(candidate.plainStandaloneGloss);
  const semanticBridge = presentValue(candidate.semanticBridge);
  const evidenceRefs = presentValue(candidate.evidenceRefs) ?? [];
  const normalize = (value: string) => value.normalize("NFC").trim().toLocaleLowerCase("sq-AL");

  if (
    candidate.id !== sourceRow.candidateId ||
    sourceId !== sourceRow.sourceId ||
    !language || !form || !sourceKind || !sourceStatus || !embryo || !gloss ||
    !semanticBridge ||
    presentValue(candidate.claimType) !== "functionalMotivation" ||
    presentValue(candidate.validationOutcome) !== "validated"
  ) return false;

  const hasReviewedCitation = sourceRow.externalCitations.some((citation) =>
    citation.citationStatus === "reviewed_accepted" && evidenceRefs.includes(citation.citationId),
  );
  return Boolean(
    sourceRow.isolatedStandaloneForm &&
    sourceKind === sourceRow.sourceKind &&
    sourceStatus === sourceRow.sourceStatus &&
    normalize(language) === normalize(sourceRow.candidateLanguage) &&
    sameAlbanianSourceForm(form, sourceRow.isolatedStandaloneForm) &&
    normalize(embryo) === normalize(sourceRow.embryo) &&
    normalize(gloss) === normalize(sourceRow.plainStandaloneGloss ?? "") &&
    semanticBridge === sourceRow.semanticBridge &&
    hasReviewedCitation,
  );
}

export type HumanReadingCandidateAuthorityV0_1 = "Reviewed" | "Partial" | "Proposed";

export function humanReadingCandidateAuthorityV0_1(
  candidate: CandidateRowVM,
): HumanReadingCandidateAuthorityV0_1 {
  const validationOutcome = presentValue(candidate.validationOutcome);
  if (validationOutcome === "partial") return "Partial";
  if (validationOutcome !== "validated") return "Proposed";

  const hasReviewedSourceAuthorization =
    getReviewedExternalLexiconProductionSourceRowsV0_1().some((sourceRow) =>
      matchesReviewedSourceRow(candidate, sourceRow),
    );
  return hasReviewedSourceAuthorization ? "Reviewed" : "Proposed";
}

function buildReviewedLexicalFunctions(
  word: string,
  candidates: readonly CandidateRowVM[],
  rootMap: PresentOrMissing<RootMapVM> | undefined,
  reviewedOperators: readonly string[],
): HumanReadingReviewedLexicalFunctionV0_1[] {
  if (rootMap?.kind !== "present") return [];
  const reviewedOperatorSet = new Set(reviewedOperators.map((operator) =>
    operator.normalize("NFC").trim().toLocaleUpperCase("sq-AL"),
  ));
  const productionRows = getReviewedExternalLexiconProductionSourceRowsV0_1();

  return rootMap.value.keys.flatMap((key) => {
    const operator = key.token.trim();
    if (
      key.status !== "supported" ||
      !sameAlbanianSourceForm(operator, word) ||
      !reviewedOperatorSet.has(operator.normalize("NFC").toLocaleUpperCase("sq-AL"))
    ) return [];

    const sourceRow = productionRows.find((row) =>
      sameAlbanianSourceForm(row.embryo, operator) &&
      sameAlbanianSourceForm(row.isolatedStandaloneForm ?? "", word),
    );
    if (!sourceRow) return [];
    const candidate = candidates.find((row) => matchesReviewedSourceRow(row, sourceRow));
    if (!candidate) return [];

    const projection = projectReviewedExternalLexiconProductionRowForRuntimeV0_1(sourceRow);
    const citation = sourceRow.externalCitations.find((row) =>
      row.citationStatus === "reviewed_accepted" && projection?.evidenceRefs.includes(row.citationId),
    );
    if (!projection || !citation?.attestedGloss || !citation.sourceTitle || !citation.sourceUrlOrArchiveRef || !citation.entryLocator) {
      return [];
    }

    return [{
      operator,
      functionText: citation.attestedGloss,
      sourceId: sourceRow.sourceId,
      sourceTitle: citation.sourceTitle,
      sourceUrl: citation.sourceUrlOrArchiveRef,
      locator: citation.entryLocator,
      evidenceText: projection.evidenceText,
    }];
  });
}

function buildExactFunctionalCandidates(
  word: string,
  candidates: readonly CandidateRowVM[],
): CandidateRowVM[] {
  const unique = new Map<string, CandidateRowVM>();
  for (const candidate of candidates) {
    const chain = presentValue(candidate.expansionChain);
    const statement = presentValue(candidate.functionalStatement);
    const validation = presentValue(candidate.validationOutcome);
    const boundary = presentValue(candidate.claimBoundary) ?? "";
    const targetWord = presentValue(candidate.targetWord);
    if (
      presentValue(candidate.claimType) !== "functionalMotivation" ||
      (validation !== "validated" && validation !== "partial") ||
      presentValue(candidate.userDecisionPosture) !== "user_decides" ||
      !/not historical origin/iu.test(boundary) ||
      !chain || chain.length < 2 ||
      !sameAlbanianSourceForm(chain[chain.length - 1], word) ||
      chain.slice(0, -1).every((form) => sameAlbanianSourceForm(form, word)) ||
      (targetWord && !sameAlbanianSourceForm(targetWord, word)) ||
      !statement?.trim()
    ) continue;
    unique.set(candidate.id, candidate);
  }
  return [...unique.values()];
}

function candidateRelationship(
  candidate: CurrentWordFunctionalReasoningCandidateV0_1,
): HumanReadingFunctionalGroupV0_1["relationship"] | null {
  const relationships = new Set(candidate.familyNetwork.reasoningSteps.map(({ relationshipType }) => relationshipType));
  if (candidate.familyNetwork.transitionNetworks.some(({ semanticOperation }) =>
    semanticOperation === "ACTION_TO_NOMINAL_EVENT_OR_RESULT_PROPOSAL",
  ) || relationships.has("VERB_ACTION_TO_NOMINAL_RESULT_HYPOTHESIS")) {
    return "ACTION_TO_EVENT_OR_RESULT";
  }
  if (relationships.has("EPISTEMIC_FUNCTION_TO_KNOWLEDGE_SENSE_HYPOTHESIS")) {
    return "KNOWING_TO_KNOWLEDGE";
  }
  return null;
}

function functionSummary(
  relationship: HumanReadingFunctionalGroupV0_1["relationship"],
  operator: string,
  functionText: string,
  targetForm: string,
  targetGloss: string,
  familySenses: readonly HumanReadingFamilySenseV0_1[],
  functionalPaths: readonly FunctionalFamilyPathV0_1[],
): string {
  const displayTargetForm = targetForm.toLocaleUpperCase("sq-AL");
  if (relationship === "SOURCE_LINKED_PROPOSAL") {
    return `A source-linked functional proposal is available for ${displayTargetForm}; its recorded wording and attribution are in Sources.`;
  }
  if (relationship === "KNOWING_TO_KNOWLEDGE") {
    return `${operator} is recorded with the function “${functionText}”. This suggests a possible knowing-to-knowledge connection for ${displayTargetForm}’s “${targetGloss}” sense, but the sources do not establish that relationship.`;
  }
  if (functionalPaths.length) {
    const familyForms = [...new Set(functionalPaths.map(({ nodes }) =>
      nodes[1].exactForm.toLocaleUpperCase("sq-AL"),
    ))];
    const familyClause = familyForms.length > 1
      ? `${familyForms.slice(0, -1).join(", ")} and ${familyForms[familyForms.length - 1]}`
      : familyForms[0];
    return `The reviewed ${operator} function (“${functionText}”) and recorded action senses for ${familyClause} support a proposed functional progression to ${displayTargetForm}. The links are hypotheses, not source-reported relations; morphology, intermediate state, and history remain unresolved.`;
  }
  const familyForms = [...new Set(familySenses
    .filter(({ gloss }) => /\b(?:divide|dividing|divided|separate|separating|separation|split|cut)\b/iu.test(gloss))
    .map(({ form }) => form.toLocaleUpperCase("sq-AL")))];
  const familyClause = familyForms.length
    ? ` Separate ${familyForms.join(" and ")} entries also describe dividing or separating.`
    : "";
  return `${operator} is recorded with the function “${functionText}”.${familyClause} Together, these entries suggest a possible action-to-event connection for ${displayTargetForm}, but do not establish how the word was formed.`;
}

function buildFunctionalGroups(
  word: string,
  projection: CurrentWordFunctionalReasoningProjectionV0_1 | null,
): HumanReadingFunctionalGroupV0_1[] {
  if (!projection || projection.status !== "CANDIDATES_AVAILABLE") return [];
  const groups = new Map<string, {
    operator: string;
    functionText: string;
    functionSourceUrl: string;
    functionSourceLabel: string;
    targetForm: string;
    targetGlosses: Set<string>;
    targetPartOfSpeech: string | null;
    relationship: HumanReadingFunctionalGroupV0_1["relationship"];
    familyForms: Set<string>;
    familySenses: Map<string, HumanReadingFamilySenseV0_1>;
    functionalPaths: Map<string, FunctionalFamilyPathV0_1>;
    candidates: CurrentWordFunctionalReasoningCandidateV0_1[];
  }>();

  for (const candidate of projection.candidates) {
    if (!sameAlbanianSourceForm(candidate.targetSource.exactSourceForm, word) ||
        !sameAlbanianSourceForm(candidate.familyNetwork.target?.exactForm ?? "", word) ||
        candidate.familyNetwork.status !== "CONDITIONAL_FAMILY_READING") continue;
    const relationship = candidateRelationship(candidate);
    if (!relationship) continue;
    const glosses = candidate.targetSource.glosses.map((gloss) => gloss.trim()).filter(Boolean);
    if (!glosses.length || !candidate.embryoEvidence.attestedGloss.trim()) continue;
    const key = [
      candidate.operator,
      candidate.embryoEvidence.sourceId,
      candidate.embryoEvidence.attestedGloss.trim().toLocaleLowerCase("en-US"),
      candidate.targetSource.exactSourceForm.normalize("NFC").trim().toLocaleLowerCase("sq-AL"),
      glosses.map((gloss) => gloss.toLocaleLowerCase("en-US")).sort().join("\u0001"),
    ].join("\u0000");
    const group = groups.get(key) ?? {
      operator: candidate.operator,
      functionText: candidate.embryoEvidence.attestedGloss,
      functionSourceUrl: candidate.embryoEvidence.sourceUrl,
      functionSourceLabel: candidate.embryoEvidence.sourceTitle,
      targetForm: candidate.targetSource.exactSourceForm,
      targetGlosses: new Set<string>(),
      targetPartOfSpeech: candidate.targetSource.partOfSpeech,
      relationship,
      familyForms: new Set<string>(),
      familySenses: new Map<string, HumanReadingFamilySenseV0_1>(),
      functionalPaths: new Map<string, FunctionalFamilyPathV0_1>(),
      candidates: [],
    };
    glosses.forEach((gloss) => group.targetGlosses.add(gloss));
    candidate.familyNetwork.functionalPaths.forEach((path) => group.functionalPaths.set(path.pathId, path));
    candidate.familyNetwork.transitionNetworks.forEach((transition) => {
      const familyForm = transition.familyForm?.trim();
      if (familyForm) group.familyForms.add(familyForm);
      const familySense = transition.familySense;
      if (!familyForm || !familySense?.gloss.trim()) return;
      const familyRecord = candidate.familyNetwork.familySourceRecords.find(({ sourceIdentity }) =>
        sourceIdentity === transition.familySourceIdentity,
      );
      const familySenseKey = [
        transition.familySourceIdentity ?? familyForm,
        familySense.entryIndex,
        familySense.senseIndex,
        familySense.gloss.trim().toLocaleLowerCase("en-US"),
      ].join("\u0000");
      group.familySenses.set(familySenseKey, {
        form: familyForm,
        partOfSpeech: familySense.partOfSpeech,
        gloss: familySense.gloss,
        sourceIdentity: transition.familySourceIdentity,
        sourceUrl: familyRecord?.sourceUrl ?? null,
      });
    });
    group.candidates.push(candidate);
    groups.set(key, group);
  }

  return [...groups.entries()].map(([groupId, group]) => {
    const targetGlosses = [...group.targetGlosses];
    return {
      groupId,
      operator: group.operator,
      functionText: group.functionText,
      functionSourceUrl: group.functionSourceUrl,
      functionSourceLabel: group.functionSourceLabel,
      targetForm: group.targetForm,
      targetGlosses,
      targetPartOfSpeech: group.targetPartOfSpeech,
      relationship: group.relationship,
      familyForms: [...group.familyForms],
      familySenses: [...group.familySenses.values()],
      functionalPaths: [...group.functionalPaths.values()],
      explanation: functionSummary(
        group.relationship,
        group.operator,
        group.functionText,
        group.targetForm,
        targetGlosses.join("; "),
        [...group.familySenses.values()],
        [...group.functionalPaths.values()],
      ),
      candidates: group.candidates,
    };
  });
}

export function buildHumanReadingSummaryV0_1(input: Readonly<{
  word: string;
  discovery?: PresentOrMissing<MotivationDiscoveryV0_2VM>;
  functionalReasoning: CurrentWordFunctionalReasoningProjectionV0_1 | null;
  runtimeSourceResponse: RuntimeFjaloriSourceResponseV0_1 | null;
  candidateRows?: readonly CandidateRowVM[];
  rootMap?: PresentOrMissing<RootMapVM>;
  reviewedOperators?: readonly string[];
}>): HumanReadingSummaryProjectionV0_1 {
  const meanings = new Map<string, HumanReadingSourceSenseV0_1>();
  const discovery = input.discovery?.kind === "present" ? input.discovery.value : null;
  const functionalReadings = buildFunctionalGroups(input.word, input.functionalReasoning);
  const candidateRows = input.candidateRows ?? [];
  const reviewedLexicalFunctions = buildReviewedLexicalFunctions(
    input.word,
    candidateRows,
    input.rootMap,
    input.reviewedOperators ?? [],
  );
  const functionalCandidates = buildExactFunctionalCandidates(input.word, candidateRows);

  const runtime = input.runtimeSourceResponse;
  if (runtime?.status === "available" &&
      sameAlbanianSourceForm(runtime.queryForm, input.word) &&
      sameAlbanianSourceForm(runtime.exactSourceForm, input.word)) {
    runtime.senses.forEach((sense) => addSense(meanings, {
      exactForm: runtime.exactSourceForm,
      partOfSpeech: sense.partOfSpeech,
      gloss: sense.gloss,
      provider: "FjaloriShqip",
      sourceIdentity: `fjalorishqip:${runtime.queryForm}:entry-${sense.entryIndex}:sense-${sense.senseIndex}`,
      sourceUrl: runtime.apiUrl,
      locator: `Entry ${sense.entryIndex} · Sense ${sense.senseIndex}`,
      sourceAttribution: sense.senseSource,
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
    }));
  }

  for (const candidate of input.functionalReasoning?.candidates ?? []) {
    if (!sameAlbanianSourceForm(candidate.targetSource.exactSourceForm, input.word)) continue;
    candidate.targetSource.glosses.forEach((gloss) => addSense(meanings, {
      exactForm: candidate.targetSource.exactSourceForm,
      partOfSpeech: candidate.targetSource.partOfSpeech,
      gloss,
      provider: providerLabel(candidate.targetSource.provider),
      sourceIdentity: candidate.targetSource.sourceIdentity,
      sourceUrl: candidate.targetSource.sourceUrl,
      locator: candidate.targetSource.locator,
      sourceAttribution: candidate.targetSource.provider,
      evidenceStatus: candidate.targetSource.evidenceStatus,
    }));
  }

  const sourceFacts = (discovery?.exactLexicalSourceFacts ?? []).filter((fact) =>
    fact.languageCode === "sq" && sameAlbanianSourceForm(fact.form, input.word),
  );
  for (const fact of sourceFacts) {
    fact.senses.forEach((sense, index) => sense.glosses.forEach((gloss) => addSense(meanings, {
      exactForm: fact.form,
      partOfSpeech: fact.partOfSpeech,
      gloss,
      provider: "Kaikki",
      sourceIdentity: fact.sourceRecordId,
      sourceUrl: fact.sourceSnapshot.sourceUrl,
      locator: `${fact.entryLocator} · sense ${sense.senseId ?? index + 1}`,
      sourceAttribution: fact.sourceSnapshot.sourceFamilyId,
      evidenceStatus: "OBSERVED_EXTERNAL_SNAPSHOT",
    })));
  }

  const primary = discovery?.albanianLexicalReading?.primarySourceFact;
  if (primary && sameAlbanianSourceForm(primary.form, input.word) && !meanings.size) {
    primary.meaningGlosses.forEach((gloss) => addSense(meanings, {
      exactForm: primary.form,
      partOfSpeech: primary.partOfSpeech,
      gloss,
      provider: "Kaikki",
      sourceIdentity: primary.sourceRecordId,
      sourceUrl: sourceFacts.find((fact) => fact.sourceRecordId === primary.sourceRecordId)?.sourceSnapshot.sourceUrl ?? "",
      locator: primary.entryLocator,
      sourceAttribution: "Kaikki",
      evidenceStatus: "OBSERVED_EXTERNAL_SNAPSHOT",
    }));
  }

  const bridge = discovery?.albanianLexicalReading?.functionalMeaningBridge;
  const bridgePrimary = bridge?.sourceFacts?.primary;
  const bridgeHypothesis = bridge?.functionalHypothesis;
  if (functionalReadings.length === 0 && bridge?.status === "SUPPORTED" &&
      bridgePrimary && sameAlbanianSourceForm(bridgePrimary.form, input.word) &&
      bridgeHypothesis?.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" &&
      bridgeHypothesis.statement?.trim()) {
    functionalReadings.push({
      groupId: `source-linked:${bridgePrimary.sourceRecordId}`,
      operator: "",
      functionText: bridgeHypothesis.statement,
      functionSourceUrl: sourceFacts.find((fact) => fact.sourceRecordId === bridgePrimary.sourceRecordId)
        ?.sourceSnapshot.sourceUrl ?? "",
      functionSourceLabel: "Source-linked exploratory proposal",
      targetForm: bridgePrimary.form,
      targetGlosses: bridgePrimary.meaningGlosses,
      targetPartOfSpeech: primary?.partOfSpeech ?? null,
      relationship: "SOURCE_LINKED_PROPOSAL",
      familyForms: bridge.relatedForm ? [bridge.relatedForm] : [],
      familySenses: [],
      functionalPaths: [],
      explanation: bridgeHypothesis.statement,
      candidates: [],
    });
  }

  const exactCodePoints = Array.from(input.word);
  const writtenVoiceEvents = exactCodePoints.flatMap((character, position) => {
    const voice = extractSevenVowelsFromString(character)[0];
    return voice ? [{ voice, position }] : [];
  });

  return {
    word: input.word,
    meanings: [...meanings.values()],
    writtenVoiceEvents,
    functionalReadings,
    reviewedLexicalFunctions,
    functionalCandidates,
    sourceAvailability: meanings.size ? "AVAILABLE" : "NOT_AVAILABLE",
    alternativesAvailable: [...meanings.values()].length > 1 || functionalReadings.length > 1 ||
      functionalReadings.some(({ candidates }) => candidates.some(({ familyNetwork }) =>
        familyNetwork.transitionNetworks.length > 1 || familyNetwork.familySourceRecords.some(({ senses }) => senses.length > 1),
      )),
    technicalReasonCodes: [
      ...(input.functionalReasoning?.reasonCodes ?? []),
      ...(input.functionalReasoning?.candidates.flatMap(({ familyNetwork }) => [
        ...familyNetwork.reasonCodes,
        ...familyNetwork.familySourceRecords.flatMap(({ reasonCodes }) => reasonCodes),
        ...familyNetwork.transitionNetworks.flatMap(({ reasonCodes }) => reasonCodes),
        ...familyNetwork.reasoningSteps.flatMap(({ reasonCodes }) => reasonCodes),
      ]) ?? []),
      ...(discovery?.albanianLexicalReading?.functionalMeaningBridge.reasonCodes ?? []),
    ],
    sourceFactStatus: discovery?.exactLexicalSourceStatus?.status ?? "NOT_EMITTED",
    interpretationBoundaries: [
      ...functionalReadings.flatMap(({ candidates }) => candidates.flatMap(({ familyNetwork }) => [
        ...familyNetwork.unresolvedMaterial,
        ...familyNetwork.transitionNetworks.flatMap(({ unresolvedDependencies }) => unresolvedDependencies),
      ])),
      ...(discovery?.albanianLexicalReading?.functionalMeaningBridge.status === "SUPPORTED"
        ? [discovery.albanianLexicalReading.functionalMeaningBridge.claimBoundary]
        : []),
    ],
  };
}
