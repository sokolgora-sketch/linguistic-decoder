"use client";

import { useMemo, useState } from "react";
import {
  buildSingleWordFunctionalMotivationProposalV0_1,
  type SingleWordFunctionalMotivationInputV0_1,
  type SingleWordFunctionalMotivationSegmentInputV0_1,
  type SingleWordFunctionalMotivationTransformationInputV0_1,
  type SingleWordSegmentEvidenceStatusV0_1,
  type SingleWordTransparencyV0_1,
} from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";
import {
  examineSingleWordMechanicalInterpretationV0_1,
  notSubmittedMechanicalInterpretationV0_1,
  type MechanicalEditInputV0_1,
  type MechanicalEditKindV0_1,
  type SingleWordMechanicalExaminerResultV0_1,
} from "@/shared/openInstrument/singleWordMechanicalExaminer.v0_1";
import { analyzeStructuralInputV0_2 } from "@/shared/structuralHypothesisDiscovery.v0_2";
import type { MotivationDiscoveryV0_1VM, PresentOrMissing } from "@/ui/telemetry/types";
import { FjaloriCrossSourceEvidenceV0_1 } from "@/ui/instrument/sections/FjaloriCrossSourceEvidence.v0_1";

type DraftSegment = SingleWordFunctionalMotivationSegmentInputV0_1;
type DraftTransformation = SingleWordFunctionalMotivationTransformationInputV0_1;
type DraftMechanicalOperation = Omit<MechanicalEditInputV0_1, "position"> & { position: number | "" };
type SelectedComponentSourceLookupV0_1 = Readonly<{ componentIndex: number; exactSpelling: string }>;
type ExaminedMechanicalDraft = Readonly<{
  snapshot: string;
  result: SingleWordMechanicalExaminerResultV0_1;
}>;

export type SingleWordCurrentWordEvidenceContextV0_1 = Readonly<{
  analyzedWord: string;
  discovery?: PresentOrMissing<MotivationDiscoveryV0_1VM>;
}>;

function blankSegment(): DraftSegment {
  return {
    exactSpelling: "",
    proposedMeaning: "",
    proposedGrammaticalRole: "",
    language: "",
    dialect: "",
    evidenceStatus: "USER_PROPOSED",
    evidenceReference: "",
    unresolved: false,
  };
}

function blankTransformation(): DraftTransformation {
  return { from: "", to: "", explanation: "", evidenceReference: "" };
}

function blankMechanicalOperation(): DraftMechanicalOperation {
  return { kind: "SUBSTITUTE", position: 0, expectedText: "", replacementText: "" };
}

const inputClass = "mt-1 w-full rounded border border-[#46505c] bg-[#0d1117] px-2 py-1.5 text-sm text-[#f5f7fb] placeholder:text-[#7f8b99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]";
const labelClass = "block text-xs font-medium text-[#c5ced8]";

function evidenceStatusLabel(status: SingleWordSegmentEvidenceStatusV0_1): string {
  switch (status) {
    case "USER_PROPOSED":
      return "user proposed";
    case "CITATION_ENTERED_UNVERIFIED":
      return "citation entered; unverified";
    case "UNKNOWN_OR_NULL":
      return "Unknown / Null";
  }
}

function transparencyLabel(value: SingleWordTransparencyV0_1): string {
  switch (value) {
    case "ATOMIC":
      return "atomic";
    case "METAPHORICAL":
      return "metaphorical";
    case "OPAQUE":
      return "opaque";
    case "UNKNOWN_OR_NULL":
      return "Unknown / Null";
  }
}

function displayVoicePath(path: readonly string[]): string {
  return path.length ? path.join(" → ") : "∅";
}

function sameAlbanianSourceForm(left: string, right: string): boolean {
  return left.normalize("NFC").trim().toLocaleLowerCase("sq-AL") ===
    right.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
}

function isExactAlbanianEtymologyLinkV0_1(link: { sourceForm: string; reference: string }): boolean {
  const sourceForm = link.sourceForm.normalize("NFC").trim();
  const body = sourceForm.startsWith("-") ? sourceForm.slice(1) : sourceForm;
  return Boolean(body) && !sourceForm.startsWith("--") && /^[\p{L}]+$/u.test(body) &&
    link.reference.normalize("NFC").trim() === sourceForm + "#Albanian";
}

function isSourceReportedNounMeaningV0_1(gloss: string): boolean {
  const normalized = gloss.normalize("NFC").trim();
  return normalized.length > 0 &&
    !/^(?:to\s+|inflection of\b|form of\b|alternative form of\b|plural of\b|past (?:form|tense|participle) of\b)/iu.test(normalized);
}

function isExplicitAgentNounFormationGlossV0_1(gloss: string): boolean {
  const normalized = gloss.normalize("NFC").replace(/\s+/gu, " ").trim();
  if (!normalized || /\b(?:maybe|perhaps|possibly|presumably|probably|likely)\b/iu.test(normalized)) return false;
  return /\b(?:form|forms|create|creates)\s+(?:(?:a|an)\s+)?agent nouns?\b/iu.test(normalized);
}

type SourceMotivationSenseCandidateV0_1 = Readonly<{
  sourceForm: string;
  sourceRecordId: string;
  entryLocator: string;
  sourceSenseOrdinal: number;
  senseId: string;
  glosses: readonly string[];
}>;

type ValidatedSuffixTemplateForMotivationV0_1 = Readonly<{
  baseForm: string;
  suffixForm: string;
  baseGlossAnnotation: string | null;
}>;

function validatedSuffixTemplateForMotivationV0_1(input: Readonly<{
  relation: Readonly<{
    relation: string;
    sourceAuthoredExplanation: string | null;
    references: readonly Readonly<{ sourceForm: string; reference: string | null }>[];
  }>;
  primary: Readonly<{
    etymologyText: string | null;
    etymologyTemplates?: readonly Readonly<{
      name: string;
      args: Readonly<Record<string, string>>;
      expansion: string;
    }>[];
  }>;
}>): ValidatedSuffixTemplateForMotivationV0_1 | null {
  const references = input.relation.references;
  const templates = input.primary.etymologyTemplates ?? [];
  const template = templates[0];
  if (
    input.relation.relation !== "SOURCE_AUTHORED_SUFFIX_TEMPLATE" ||
    references.length !== 2 || templates.length !== 1 || template?.name !== "suffix"
  ) return null;

  const [baseReference, suffixReference] = references;
  const args = template.args;
  const hasAnnotationArgument = Object.prototype.hasOwnProperty.call(args, "t1");
  const allowedArgumentKeys = new Set(["1", "2", "3", "4", "t1"]);
  const annotation = args["t1"]?.normalize("NFC").trim() ?? "";
  const rawSuffix = args["3"]?.normalize("NFC").trim() ?? "";
  const suffixBody = rawSuffix.startsWith("-") && !rawSuffix.startsWith("--")
    ? rawSuffix.slice(1)
    : rawSuffix;
  const referencedSuffixBody = suffixReference?.sourceForm.startsWith("-") &&
    !suffixReference.sourceForm.startsWith("--")
    ? suffixReference.sourceForm.slice(1)
    : "";
  const baseForm = baseReference?.sourceForm.normalize("NFC").trim() ?? "";
  const expectedExpansion = annotation
    ? `${baseForm} (“${annotation}”) + -${suffixBody}`
    : `${baseForm} + -${suffixBody}`;
  const normalizeTemplateText = (value: string) =>
    value.normalize("NFC").trim().replace(/\s+/gu, " ").replace(/\.$/u, "").toLocaleLowerCase("sq-AL");
  const explanation = normalizeTemplateText(input.primary.etymologyText ?? "");
  const expectedExplanation = normalizeTemplateText(`From ${expectedExpansion}`);
  const argumentKeys = Object.keys(args);

  if (
    args["1"] !== "sq" ||
    !baseForm ||
    args["2"]?.normalize("NFC").trim() !== baseForm ||
    !suffixBody ||
    suffixBody !== referencedSuffixBody ||
    (args["4"] !== undefined && args["4"] !== "") ||
    argumentKeys.some((key) => !allowedArgumentKeys.has(key)) ||
    (hasAnnotationArgument && !annotation) ||
    (annotation !== "" && /[\r\n()+“”"]/u.test(annotation)) ||
    template.expansion.normalize("NFC").trim() !== expectedExpansion ||
    (explanation !== expectedExplanation && explanation !== `${expectedExplanation} noun suffix`) ||
    normalizeTemplateText(input.relation.sourceAuthoredExplanation ?? "") !== explanation
  ) return null;

  const referenceBase = baseReference?.reference;
  const referenceSuffix = suffixReference?.reference;
  if (
    !baseReference || !suffixReference || !referenceBase || !referenceSuffix ||
    !isExactAlbanianEtymologyLinkV0_1({ sourceForm: baseForm, reference: referenceBase }) ||
    !isExactAlbanianEtymologyLinkV0_1({ sourceForm: suffixReference.sourceForm, reference: referenceSuffix }) ||
    referenceBase !== `${baseForm}#Albanian` ||
    referenceSuffix !== `${suffixReference.sourceForm}#Albanian`
  ) return null;

  return {
    baseForm,
    suffixForm: `-${suffixBody}`,
    baseGlossAnnotation: annotation || null,
  };
}

function glossContainsSourceAnnotationV0_1(annotation: string, gloss: string): boolean {
  const annotationTokens = annotation.normalize("NFC").toLocaleLowerCase("sq-AL").match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
  const glossTokens = new Set(gloss.normalize("NFC").toLocaleLowerCase("sq-AL").match(/[\p{L}\p{M}\p{N}]+/gu) ?? []);
  return annotationTokens.length > 0 && annotationTokens.every((token) => glossTokens.has(token));
}

function isAlbanianSourceContextV0_1(discovery: MotivationDiscoveryV0_1VM): boolean {
  const languageValues = [discovery.inputLanguage, discovery.sourceFact.language]
    .map((value) => value.normalize("NFC").trim().toLocaleLowerCase("en-US"))
    .filter((value) => value.length > 0 && value !== "unknown");
  const profile = discovery.inputProfile.normalize("NFC").trim().toLocaleLowerCase("en-US");
  const identifiesAlbanian = (value: string) =>
    value === "sq" || value.startsWith("sq-") || value.includes("albanian");
  const hasAlbanianIdentity = [...languageValues, profile].some(identifiesAlbanian);
  const hasConflictingLanguage = languageValues.some((value) => !identifiesAlbanian(value));
  const hasConflictingProfile = /\b(english|latin|greek|turkish|arabic)\b/u.test(profile);
  return hasAlbanianIdentity && !hasConflictingLanguage && !hasConflictingProfile;
}

function CurrentWordEvidenceSectionV0_1({
  analyzedWord,
  draftTargetWord,
  context,
}: {
  analyzedWord: string;
  draftTargetWord: string;
  context?: SingleWordCurrentWordEvidenceContextV0_1;
}) {
  const contextMatchesTarget = context?.analyzedWord === analyzedWord;
  const discoveryState = context?.discovery;
  const discovery = discoveryState?.kind === "present" ? discoveryState.value : null;
  const discoveryMatchesContext = discovery?.inputWord === context?.analyzedWord;
  const visibleDiscovery = contextMatchesTarget && discoveryMatchesContext ? discovery : null;
  const sourceContextIsAlbanian = visibleDiscovery
    ? isAlbanianSourceContextV0_1(visibleDiscovery)
    : false;
  const sourceStatus = sourceContextIsAlbanian
    ? visibleDiscovery?.exactLexicalSourceStatus
    : undefined;
  const sourceInputWord = visibleDiscovery?.inputWord;
  const sourceFacts = sourceStatus?.status === "MATCHES_FOUND" && sourceContextIsAlbanian
    ? (visibleDiscovery?.exactLexicalSourceFacts ?? []).filter((fact) =>
        fact.languageCode === "sq" && sourceInputWord !== undefined && sameAlbanianSourceForm(fact.form, sourceInputWord),
      )
    : [];
  const lexicalPrimarySourceFact = visibleDiscovery?.albanianLexicalReading?.primarySourceFact ?? null;
  const lexicalPrimaryRecordBinding = !lexicalPrimarySourceFact
    ? "UNKNOWN_OR_NULL"
    : !sameAlbanianSourceForm(lexicalPrimarySourceFact.form, visibleDiscovery?.inputWord ?? "")
      ? "MISMATCH"
      : sourceFacts.length === 0
        ? "UNKNOWN_OR_NULL"
        : sourceFacts.some((fact) => fact.sourceRecordId === lexicalPrimarySourceFact.sourceRecordId)
          ? "MATCH"
          : "MISMATCH";
  const voiceProvenance = visibleDiscovery?.derivedStructure.voicePathProvenance;
  const writtenInputMatches = voiceProvenance?.writtenInput.inputForm === visibleDiscovery?.inputWord;
  const writtenInput = writtenInputMatches ? voiceProvenance?.writtenInput : undefined;
  const selectedPath = voiceProvenance?.selectedPath;
  const structuralHypotheses = visibleDiscovery?.derivedStructure.structuralHypotheses ?? [];
  const structuralAnalysis = useMemo(
    () => visibleDiscovery && sourceContextIsAlbanian
      ? analyzeStructuralInputV0_2(visibleDiscovery.inputWord)
      : null,
    [visibleDiscovery, sourceContextIsAlbanian],
  );
  const lexicalReading = sourceContextIsAlbanian ? visibleDiscovery?.albanianLexicalReading : undefined;
  const sourceComponentReading = lexicalReading?.sourceLinkedComponentReading ?? null;
  const componentTargetRecordBinding = sourceComponentReading
    ? !sameAlbanianSourceForm(sourceComponentReading.primary.form, visibleDiscovery?.inputWord ?? "") ||
      sourceComponentReading.relation.primarySourceRecordId !== sourceComponentReading.primary.sourceRecordId ||
      sourceComponentReading.relation.primaryEntryLocator !== sourceComponentReading.primary.entryLocator
      ? "MISMATCH"
      : sourceFacts.length === 0
        ? "UNKNOWN_OR_NULL"
        : sourceFacts.some((fact) => fact.sourceRecordId === sourceComponentReading.primary.sourceRecordId)
          ? "MATCH"
          : "MISMATCH"
    : "UNKNOWN_OR_NULL";
  const componentResolutionReasonsAllowed = new Set([
    "SOURCE_COMPONENT_LOOKUP_UNAVAILABLE",
    "SOURCE_COMPONENT_RECORD_NOT_FOUND",
    "SOURCE_COMPONENT_RECORD_AMBIGUOUS",
    "SOURCE_COMPONENT_RECORD_IDENTITY_DUPLICATE",
    "SOURCE_COMPONENT_RECORD_LOOKUP_FAILED",
    "PRIMARY_MEANING_EVIDENCE_MISSING",
    "SOURCE_COMPONENT_MEANING_EVIDENCE_MISSING",
  ]);
  const componentReferenceForms = sourceComponentReading?.relation.references ?? [];
  const componentReferencesAreStructured = Boolean(sourceComponentReading &&
    componentTargetRecordBinding === "MATCH" &&
    sourceComponentReading.relation.relation !== "SOURCE_COMPOUND_ARITY_UNSUPPORTED" &&
    componentReferenceForms.length >= 2 &&
    componentReferenceForms.length === sourceComponentReading.componentResolutions.length &&
    new Set(componentReferenceForms.map((item) =>
      item.sourceForm.normalize("NFC").trim().toLocaleLowerCase("sq-AL"),
    )).size === componentReferenceForms.length &&
    sourceComponentReading.componentResolutions.every((resolution, index) => {
      const reference = componentReferenceForms[index];
      const resolutionHasReason = resolution.reasonCodes.some((reason) =>
        componentResolutionReasonsAllowed.has(reason),
      );
      const resolutionStatusIsConsistent = resolution.status === "RESOLVED"
        ? resolution.sourceRecordIds.length === 1 &&
          sourceComponentReading.components.some((component) =>
            component.sourceRecordId === resolution.sourceRecordIds[0] &&
            sameAlbanianSourceForm(component.form, resolution.sourceForm),
          )
        : resolution.status === "AMBIGUOUS"
          ? resolution.reasonCodes.includes("SOURCE_COMPONENT_RECORD_AMBIGUOUS") &&
            (resolution.sourceRecordIds.length > 1
              ? resolution.sourceRecordIds.every((sourceRecordId) =>
                  sourceComponentReading.components.some((component) =>
                    component.sourceRecordId === sourceRecordId &&
                    sameAlbanianSourceForm(component.form, resolution.sourceForm),
                  ),
                )
              : resolution.reasonCodes.includes("SOURCE_COMPONENT_RECORD_IDENTITY_DUPLICATE"))
          : resolution.status === "UNRESOLVED" &&
            resolution.sourceRecordIds.length === 0 &&
            resolutionHasReason;
      return Boolean(reference?.reference) &&
        isExactAlbanianEtymologyLinkV0_1({
          sourceForm: reference?.sourceForm ?? "",
          reference: reference?.reference ?? "",
        }) &&
        resolution.sourceForm === reference?.sourceForm &&
        resolution.reference === reference?.reference &&
        resolutionStatusIsConsistent;
    }) &&
    sourceComponentReading.reasonCodes.every((reason) => componentResolutionReasonsAllowed.has(reason)));
  const componentSurfaceJoin = componentReferencesAreStructured && sourceComponentReading
    ? componentReferenceForms.map((reference, index) => {
        const form = reference.sourceForm.normalize("NFC").trim();
        const isAffixNotation = index > 0 && form.startsWith("-") && !form.startsWith("--");
        return isAffixNotation ? form.slice(1) : form;
      }).join("")
    : null;
  const surfaceJoinMatchesTarget = componentSurfaceJoin !== null
    ? sameAlbanianSourceForm(componentSurfaceJoin, visibleDiscovery?.inputWord ?? "")
    : null;

  const sourceComparison = lexicalReading?.sourceLinkedComparison ?? null;
  const comparisonRecordInternallyBound = Boolean(sourceComparison &&
    sourceComparison.primary.sourceRecordId === sourceComparison.relation.primarySourceRecordId &&
    sourceComparison.primary.entryLocator === sourceComparison.relation.primaryEntryLocator &&
    (sourceComparison.related ? (
      sourceComparison.related.sourceRecordId === sourceComparison.relation.relatedSourceRecordId &&
      sourceComparison.related.entryLocator === sourceComparison.relation.relatedEntryLocator &&
      sameAlbanianSourceForm(sourceComparison.related.form, sourceComparison.relation.relatedForm)
    ) : sourceComparison.relation.relatedSourceRecordId === null));
  const comparisonTargetRecords = sourceComparison
    ? [sourceComparison.primary, ...(sourceComparison.related ? [sourceComparison.related] : [])]
      .filter((record) => sameAlbanianSourceForm(record.form, visibleDiscovery?.inputWord ?? ""))
    : [];
  const sourceComparisonTargetBinding = !sourceComparison
    ? "UNKNOWN_OR_NULL"
    : !comparisonRecordInternallyBound
      ? "MISMATCH"
      : comparisonTargetRecords.length !== 1
        ? "UNKNOWN_OR_NULL"
        : sourceFacts.length === 0
          ? "UNKNOWN_OR_NULL"
          : sourceFacts.some((fact) => fact.sourceRecordId === comparisonTargetRecords[0]?.sourceRecordId)
            ? "MATCH"
            : "MISMATCH";
  const sourceComparisonTargetRecord = sourceComparisonTargetBinding === "MATCH"
    ? comparisonTargetRecords[0] ?? null
    : null;
  const linkedTargetForms = sourceComparisonTargetRecord?.etymologyLinks ?? [];
  const linkedTargetFormsAreStructured = Boolean(
    linkedTargetForms.length >= 2 &&
    linkedTargetForms.every((link) => isExactAlbanianEtymologyLinkV0_1(link)) &&
    new Set(linkedTargetForms.map((link) =>
      link.sourceForm.normalize("NFC").trim().toLocaleLowerCase("sq-AL"),
    )).size === linkedTargetForms.length,
  );
  const linkedFormSurfaceJoin = linkedTargetFormsAreStructured
    ? linkedTargetForms.map((link, index) => {
        const form = link.sourceForm.normalize("NFC").trim();
        const isAffixNotation = index > 0 && form.startsWith("-") && !form.startsWith("--");
        return isAffixNotation ? form.slice(1) : form;
      }).join("")
    : null;
  const linkedFormSurfaceMatchesTarget = linkedFormSurfaceJoin !== null
    ? sameAlbanianSourceForm(linkedFormSurfaceJoin, visibleDiscovery?.inputWord ?? "")
    : null;

  const functionalBridge = lexicalReading?.functionalMeaningBridge;
  const functionalBridgeRecords = functionalBridge?.sourceFacts
    ? [functionalBridge.sourceFacts.primary, ...(functionalBridge.sourceFacts.related ? [functionalBridge.sourceFacts.related] : [])]
      .filter((record) => sameAlbanianSourceForm(record.form, visibleDiscovery?.inputWord ?? ""))
    : [];
  const functionalBridgeTargetBinding = !functionalBridge || functionalBridge.status !== "SUPPORTED"
    ? "UNKNOWN_OR_NULL"
    : !functionalBridge.sourceFacts || functionalBridgeRecords.length !== 1
      ? "UNKNOWN_OR_NULL"
      : sourceFacts.length === 0
        ? "UNKNOWN_OR_NULL"
        : sourceFacts.some((fact) => fact.sourceRecordId === functionalBridgeRecords[0]?.sourceRecordId)
          ? "MATCH"
          : "MISMATCH";
  const sourceComponentMeaningGroups = sourceComponentReading
    ? sourceComponentReading.componentResolutions.map((resolution) => {
        const records = resolution.sourceRecordIds.flatMap((sourceRecordId) =>
          sourceComponentReading.components.filter((component) =>
            component.sourceRecordId === sourceRecordId &&
            sameAlbanianSourceForm(component.form, resolution.sourceForm),
          ),
        );
        return { resolution, records };
      })
    : [];
  const componentRecordAmbiguityOnly = Boolean(
    sourceComponentReading?.status === "NULL" &&
    sourceComponentReading.reasonCodes.length > 0 &&
    sourceComponentReading.reasonCodes.every((reason) => reason === "SOURCE_COMPONENT_RECORD_AMBIGUOUS") &&
    sourceComponentReading.componentResolutions.some((resolution) => resolution.status === "AMBIGUOUS"),
  );
  const sourceComponentSenseEvidenceComplete = Boolean(
    (sourceComponentReading?.status === "SUPPORTED" || componentRecordAmbiguityOnly) &&
    componentReferencesAreStructured &&
    sourceComponentMeaningGroups.length >= 2 &&
    sourceComponentMeaningGroups.every(({ resolution, records }) =>
      (resolution.status === "RESOLVED" || resolution.status === "AMBIGUOUS") &&
      resolution.sourceRecordIds.length > 0 &&
      new Set(resolution.sourceRecordIds).size === resolution.sourceRecordIds.length &&
      records.length === resolution.sourceRecordIds.length &&
      records.every((record) => record.sourceSenses?.some((sense) =>
        sense.glosses.some((gloss) => gloss.trim().length > 0),
      )),
    ),
  );
  const sourceMotivationBaseNounSenseCandidates: SourceMotivationSenseCandidateV0_1[] = [];
  const sourceMotivationAgentNounSuffixSenses: SourceMotivationSenseCandidateV0_1[] = [];
  for (const { resolution, records } of sourceComponentMeaningGroups) {
    const isSuffixForm = resolution.sourceForm.startsWith("-");
    for (const record of records) {
      const recordPartOfSpeech = record.partOfSpeech?.normalize("NFC").trim().toLocaleLowerCase("en-US");
      if (isSuffixForm && recordPartOfSpeech === "suffix") {
        for (const sense of record.sourceSenses ?? []) {
          const qualifyingGlosses = sense.glosses.filter(isExplicitAgentNounFormationGlossV0_1);
          if (typeof sense.senseId !== "string" || !sense.senseId.trim() || qualifyingGlosses.length === 0) continue;
          sourceMotivationAgentNounSuffixSenses.push({
            sourceForm: resolution.sourceForm,
            sourceRecordId: record.sourceRecordId,
            entryLocator: record.entryLocator,
            sourceSenseOrdinal: sense.sourceSenseOrdinal,
            senseId: sense.senseId,
            glosses: qualifyingGlosses,
          });
        }
      } else if (!isSuffixForm && recordPartOfSpeech === "noun") {
        for (const sense of record.sourceSenses ?? []) {
          if (typeof sense.senseId !== "string" || !sense.senseId.trim() || sense.glosses.length === 0 ||
            !sense.glosses.every(isSourceReportedNounMeaningV0_1)) continue;
          sourceMotivationBaseNounSenseCandidates.push({
            sourceForm: resolution.sourceForm,
            sourceRecordId: record.sourceRecordId,
            entryLocator: record.entryLocator,
            sourceSenseOrdinal: sense.sourceSenseOrdinal,
            senseId: sense.senseId,
            glosses: sense.glosses,
          });
        }
      }
    }
  }
  const sourceMotivationSuffixTemplate = sourceComponentReading
    ? validatedSuffixTemplateForMotivationV0_1(sourceComponentReading)
    : null;
  const sourceMotivationBaseNounSenses = sourceMotivationSuffixTemplate
    ? sourceMotivationBaseNounSenseCandidates.flatMap((candidate) => {
        if (!sourceMotivationSuffixTemplate.baseGlossAnnotation) {
          return sourceMotivationBaseNounSenseCandidates.length === 1 ? [candidate] : [];
        }
        const matchingGlosses = candidate.glosses.filter((gloss) =>
          glossContainsSourceAnnotationV0_1(sourceMotivationSuffixTemplate.baseGlossAnnotation!, gloss),
        );
        return matchingGlosses.length > 0 ? [{ ...candidate, glosses: matchingGlosses }] : [];
      })
    : [];
  const isBoundedAgentSuffixFormation = Boolean(
    sourceMotivationSuffixTemplate &&
    sourceComponentMeaningGroups.length === 2 &&
    sourceComponentMeaningGroups.filter(({ resolution }) => resolution.sourceForm.startsWith("-")).length === 1 &&
    sourceComponentMeaningGroups.filter(({ resolution }) => !resolution.sourceForm.startsWith("-")).length === 1 &&
    sourceComponentMeaningGroups.some(({ resolution }) =>
      !resolution.sourceForm.startsWith("-") &&
      sameAlbanianSourceForm(resolution.sourceForm, sourceMotivationSuffixTemplate.baseForm),
    ) &&
    sourceComponentMeaningGroups.some(({ resolution }) =>
      resolution.sourceForm.startsWith("-") &&
      sameAlbanianSourceForm(resolution.sourceForm, sourceMotivationSuffixTemplate.suffixForm),
    ) &&
    sourceMotivationBaseNounSenses.length > 0 &&
    sourceMotivationAgentNounSuffixSenses.length > 0,
  );
  const exactComponentTargetSenses = sourceComponentReading?.primary.sourceSenses ?? [];
  const exactComponentTargetRecord = sourceComponentReading?.primary ?? null;
  const exactComponentTargetFact = sourceFacts.find((fact) =>
    fact.sourceRecordId === exactComponentTargetRecord?.sourceRecordId &&
    fact.entryLocator === exactComponentTargetRecord?.entryLocator,
  );
  const exactComponentTargetSensesMatchFact = Boolean(
    exactComponentTargetFact &&
    exactComponentTargetSenses.length === exactComponentTargetFact.senses.length &&
    exactComponentTargetSenses.every((sense, index) => {
      const sourceSense = exactComponentTargetFact.senses[index];
      return Boolean(sourceSense &&
        sense.senseId === sourceSense.senseId &&
        sense.glosses.length === sourceSense.glosses.length &&
        sense.glosses.every((gloss, glossIndex) => gloss === sourceSense.glosses[glossIndex]),
      );
    }),
  );
  const componentTargetSenseEvidenceComplete = Boolean(
    componentTargetRecordBinding === "MATCH" &&
    exactComponentTargetSenses.length > 0 &&
    exactComponentTargetSenses.some((sense) => sense.glosses.some((gloss) => gloss.trim().length > 0)) &&
    exactComponentTargetSensesMatchFact,
  );
  const functionalBridgeSensesMatchComponentTarget = Boolean(
    functionalBridgeRecords.length === 1 &&
    exactComponentTargetSenses.length === functionalBridgeRecords[0]?.sourceSenses.length &&
    exactComponentTargetSenses.every((sense, index) => {
      const bridgeSense = functionalBridgeRecords[0]?.sourceSenses[index];
      return Boolean(bridgeSense &&
        sense.senseId === bridgeSense.senseId &&
        sense.glosses.length === bridgeSense.glosses.length &&
        sense.glosses.every((gloss, glossIndex) => gloss === bridgeSense.glosses[glossIndex]),
      );
    }),
  );
  const functionalBridgeMatchesComponentTarget = Boolean(
    functionalBridge?.status === "SUPPORTED" &&
    functionalBridgeTargetBinding === "MATCH" &&
    functionalBridge.functionalHypothesis.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" &&
    functionalBridge.functionalHypothesis.functionalOperation &&
    functionalBridge.sourceFacts &&
    functionalBridgeRecords.length === 1 &&
    functionalBridgeRecords[0]?.sourceRecordId === sourceComponentReading?.primary.sourceRecordId &&
    functionalBridgeRecords[0]?.entryLocator === sourceComponentReading?.primary.entryLocator &&
    functionalBridgeSensesMatchComponentTarget,
  );
  const structuralSourceSuffixAlignment = (() => {
    if (
      !sourceContextIsAlbanian ||
      sourceStatus?.status !== "MATCHES_FOUND" ||
      !visibleDiscovery ||
      !sourceComponentReading ||
      sourceComponentReading.relation.relation !== "SOURCE_AUTHORED_SUFFIX_TEMPLATE" ||
      sourceComponentReading.primary.partOfSpeech?.normalize("NFC").trim().toLocaleLowerCase("en-US") !== "noun" ||
      componentTargetRecordBinding !== "MATCH" ||
      !componentReferencesAreStructured ||
      !componentTargetSenseEvidenceComplete ||
      !functionalBridgeMatchesComponentTarget ||
      functionalBridge?.functionalHypothesis.functionalOperation !== "AGENT" ||
      !sourceMotivationSuffixTemplate ||
      !structuralAnalysis ||
      structuralAnalysis.analysisStatus !== "analyzed" ||
      structuralAnalysis.inputVoiceSequenceStatus !== "complete" ||
      structuralAnalysis.inputForm !== visibleDiscovery.inputWord ||
      structuralAnalysis.hypotheses.some((hypothesis) =>
        hypothesis.losslessDecomposition.conservation.status !== "complete",
      )
    ) return null;

    const suffixReferenceIndex = componentReferenceForms.findIndex((reference) =>
      reference.sourceForm === sourceMotivationSuffixTemplate.suffixForm,
    );
    const baseReferenceIndex = componentReferenceForms.findIndex((reference) =>
      reference.sourceForm === sourceMotivationSuffixTemplate.baseForm,
    );
    const suffixResolution = sourceComponentReading.componentResolutions[suffixReferenceIndex];
    const baseResolution = sourceComponentReading.componentResolutions[baseReferenceIndex];
    if (
      suffixReferenceIndex < 0 ||
      baseReferenceIndex < 0 ||
      !suffixResolution ||
      !baseResolution ||
      suffixResolution.status !== "RESOLVED" ||
      suffixResolution.sourceRecordIds.length !== 1
    ) return null;

    const suffixSourceRecordId = suffixResolution.sourceRecordIds[0];
    const suffixRecord = sourceComponentReading.components.find((record) =>
      record.sourceRecordId === suffixSourceRecordId &&
      sameAlbanianSourceForm(record.form, suffixResolution.sourceForm) &&
      record.partOfSpeech?.normalize("NFC").trim().toLocaleLowerCase("en-US") === "suffix",
    );
    const agentNounSuffixSenses = sourceMotivationAgentNounSuffixSenses.filter((candidate) =>
      candidate.sourceRecordId === suffixSourceRecordId &&
      candidate.entryLocator === suffixRecord?.entryLocator,
    );
    if (!suffixRecord || agentNounSuffixSenses.length === 0) return null;

    const suffixBody = sourceMotivationSuffixTemplate.suffixForm.startsWith("-") &&
      !sourceMotivationSuffixTemplate.suffixForm.startsWith("--")
      ? sourceMotivationSuffixTemplate.suffixForm.slice(1)
      : "";
    const inputCharacters = Array.from(visibleDiscovery.inputWord.normalize("NFC"));
    const suffixCharacters = Array.from(suffixBody.normalize("NFC"));
    if (suffixCharacters.length === 0) return null;

    const suffixStart = inputCharacters.length - suffixCharacters.length;
    const targetSuffix = suffixStart >= 0
      ? inputCharacters.slice(suffixStart).join("")
      : "";
    const targetHasExactSuffix = Boolean(targetSuffix) && sameAlbanianSourceForm(targetSuffix, suffixBody);
    const suffixSourceSpan = targetHasExactSuffix
      ? { start: suffixStart, end: inputCharacters.length }
      : null;
    const matchingEngineComponents = suffixSourceSpan
      ? structuralAnalysis.hypotheses.flatMap((hypothesis) =>
          hypothesis.losslessDecomposition.components
            .filter((component) =>
              component.componentKind === "extracted_component" &&
              sameAlbanianSourceForm(component.form, suffixBody) &&
              component.sourceSpan.start === suffixSourceSpan.start &&
              component.sourceSpan.end === suffixSourceSpan.end,
            )
            .map((component) => ({ hypothesisId: hypothesis.hypothesisId, component })),
        )
      : [];
    const comparisonStatus = !suffixSourceSpan
      ? "UNKNOWN" as const
      : matchingEngineComponents.length > 0
        ? "MATCHED_ENGINE_REDUCTION" as const
        : "NO_MATCHING_REDUCTION" as const;
    const baseSurface = suffixSourceSpan
      ? inputCharacters.slice(0, suffixSourceSpan.start).join("")
      : null;
    const baseSurfaceSpan = suffixSourceSpan
      ? { start: 0, end: suffixSourceSpan.start }
      : null;
    const baseEngineComponents = baseSurface !== null && baseSurfaceSpan
      ? structuralAnalysis.hypotheses.flatMap((hypothesis) =>
          hypothesis.losslessDecomposition.components
            .filter((component) =>
              component.componentKind !== "whole_input" &&
              sameAlbanianSourceForm(component.form, baseSurface) &&
              component.sourceSpan.start === baseSurfaceSpan.start &&
              component.sourceSpan.end === baseSurfaceSpan.end,
            )
            .map((component) => ({ hypothesisId: hypothesis.hypothesisId, component })),
        )
      : [];

    return {
      comparisonStatus,
      targetSourceRecordId: sourceComponentReading.primary.sourceRecordId,
      targetEntryLocator: sourceComponentReading.primary.entryLocator,
      targetSenseIds: sourceComponentReading.primary.sourceSenses?.map((sense) => sense.senseId) ?? [],
      sourceAuthoredExplanation: sourceComponentReading.relation.sourceAuthoredExplanation,
      suffixReference: componentReferenceForms[suffixReferenceIndex]!,
      suffixResolution,
      suffixRecord,
      agentNounSuffixSenses,
      suffixBody,
      suffixSourceSpan,
      matchingEngineComponents,
      baseReference: componentReferenceForms[baseReferenceIndex]!,
      baseResolution,
      baseRecords: sourceComponentReading.components.filter((record) =>
        baseResolution.sourceRecordIds.includes(record.sourceRecordId),
      ),
      baseSurface,
      baseSurfaceSpan,
      baseSurfaceMatchesSourceForm: baseSurface !== null &&
        sameAlbanianSourceForm(baseSurface, sourceMotivationSuffixTemplate.baseForm),
      baseEngineComponents,
      writtenVoiceEvents: structuralAnalysis.inputVoiceEvents,
    };
  })();
  const sourceMotivatedExplanationAvailable = Boolean(
    sourceContextIsAlbanian &&
    sourceComponentMeaningGroups.length >= 2 &&
    sourceComponentSenseEvidenceComplete &&
    componentTargetSenseEvidenceComplete &&
    functionalBridgeMatchesComponentTarget &&
    functionalBridge?.functionalHypothesis.functionalOperation === "AGENT" &&
    isBoundedAgentSuffixFormation,
  );
  const sourceMotivatedBaseForm = sourceMotivationBaseNounSenses[0]?.sourceForm ?? "UNKNOWN_OR_NULL";
  const sourceMotivatedSuffixForm = sourceMotivationAgentNounSuffixSenses[0]?.sourceForm ?? "UNKNOWN_OR_NULL";
  const sourceMotivatedBaseGlosses = sourceMotivationBaseNounSenses
    .flatMap((candidate) => candidate.glosses)
    .map((gloss) => `“${gloss}”`)
    .join("; ");
  const sourceMotivatedBaseSenseQualification = sourceMotivationSuffixTemplate?.baseGlossAnnotation
    ? `The source-template gloss annotation “${sourceMotivationSuffixTemplate.baseGlossAnnotation}” matches these candidate glosses by complete-token inclusion; this is a candidate filter, not an exact sense crosswalk.`
    : "One source-reported noun candidate is available without a template gloss annotation; exact sense crosswalk remains UNKNOWN_OR_NULL.";
  const sourceMotivatedSuffixGlosses = sourceMotivationAgentNounSuffixSenses
    .flatMap((candidate) => candidate.glosses)
    .map((gloss) => `“${gloss}”`)
    .join("; ");
  const sourceMotivatedTargetGlosses = exactComponentTargetSenses
    .flatMap((sense) => sense.glosses)
    .filter((gloss) => gloss.trim().length > 0)
    .map((gloss) => `“${gloss}”`)
    .join("; ");

  return (
    <section
      aria-label="Current Word Evidence"
      data-testid="single-word-current-evidence"
      className="mt-4 rounded-lg border border-[#34495a] bg-[#0d141b] p-3 text-xs leading-5 text-[#d7dde7]"
    >
      <h3 className="text-sm font-semibold text-[#f5f7fb]">Current Word Evidence</h3>
      <p className="mt-1 text-[#aeb7c5]">
        Read-only context from this analysis. It does not fill proposal fields, select a source sense, or validate a user-entered citation.
      </p>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded border border-[#303843] bg-[#10161c] p-2">
          <div className="font-semibold uppercase tracking-[0.1em] text-[#8ea4ba]">ANALYZED WORD</div>
          <div className="mt-1 break-words font-mono text-sm text-[#f5f7fb]">
            {context?.analyzedWord ?? "not supplied"}
          </div>
        </div>
        <div className="min-w-0 rounded border border-[#303843] bg-[#10161c] p-2">
          <div className="font-semibold uppercase tracking-[0.1em] text-[#8ea4ba]">ANALYSIS LANGUAGE / PROFILE</div>
          <div className="mt-1 break-words">
            {visibleDiscovery
              ? `${visibleDiscovery.inputLanguage} · ${visibleDiscovery.inputProfile}`
              : "not emitted"}
          </div>
          {visibleDiscovery ? (
            <div className="break-words text-[#9fb1bf]">
              Analysis source status: {visibleDiscovery.sourceFact.sourceStatus}
            </div>
          ) : null}
        </div>
      </div>

      {!context ? (
        <p className="mt-2" data-testid="single-word-evidence-context-unavailable">
          Analysis context was not supplied. Source and structural evidence are not inferred here.
        </p>
      ) : null}
      {context && !contextMatchesTarget ? (
        <p className="mt-2 rounded border border-[#674b3a] bg-[#1a1411] p-2 text-[#efccaa]" data-testid="single-word-evidence-word-mismatch">
          Evidence context is for {context.analyzedWord}, while this workbench belongs to {analyzedWord}. Source and structural details are withheld to prevent cross-word mixing.
        </p>
      ) : null}
      {contextMatchesTarget && !discoveryState ? (
        <p className="mt-2" data-testid="single-word-discovery-not-emitted">
          Discovery evidence: NOT_EMITTED. Exact source, Voice-path provenance, and structural candidates are unavailable in this analysis payload.
        </p>
      ) : null}
      {contextMatchesTarget && discoveryState?.kind === "missing" ? (
        <p className="mt-2" data-testid="single-word-discovery-missing">
          Discovery evidence: MISSING · {discoveryState.missing}
          {discoveryState.note ? ` · ${discoveryState.note}` : ""}. No source meaning or structural claim is inferred from the missing payload.
        </p>
      ) : null}
      {contextMatchesTarget && discovery && !discoveryMatchesContext ? (
        <p className="mt-2 rounded border border-[#674b3a] bg-[#1a1411] p-2 text-[#efccaa]" data-testid="single-word-discovery-word-mismatch">
          Discovery input {discovery.inputWord} does not match analyzed word {context?.analyzedWord}; its evidence is withheld.
        </p>
      ) : null}

      {visibleDiscovery ? (
        <section aria-label="Progressive evidence trace" data-testid="single-word-progressive-evidence-trace" className="mt-3 rounded border border-[#34495a] bg-[#10161c] p-2">
          <h4 className="font-semibold text-[#f5f7fb]">Progressive evidence trace</h4>
          <p className="mt-1 text-[#9fb1bf]">The steps keep source facts, structural candidates, source relations, and whole-word interpretations distinct. No step supplies an embryo meaning or selects a winning sense.</p>
          <ol className="mt-2 space-y-2">
            <li>
          <section data-testid="single-word-current-source-evidence" className="rounded border border-[#303843] bg-[#10161c] p-2">
            <h4 className="font-semibold text-[#dce9ca]">1 · Albanian Kaikki whole-word source</h4>
            <div className="mt-1 break-words">Analyzed form: {visibleDiscovery.inputWord} · language {visibleDiscovery.inputLanguage} · profile {visibleDiscovery.inputProfile}</div>
            {sourceContextIsAlbanian ? (
              <div className="mt-1">
                Exact-form lookup: {sourceStatus?.status ?? "NOT_EMITTED"}
                {sourceStatus?.queryForm ? ` · query ${sourceStatus.queryForm}` : ""}
                {sourceStatus?.reasonCode ? ` · ${sourceStatus.reasonCode}` : ""}
              </div>
            ) : (
              <p className="mt-1 text-[#aeb7c5]">NOT_APPLICABLE_FOR_LANGUAGE · The Albanian source result is withheld outside an identified Albanian analysis context; no Albanian lexical conclusion is displayed.</p>
            )}
            {sourceStatus?.status === "SOURCE_NOT_FOUND" ? (
              <p className="mt-1 text-[#aeb7c5]">The exact-form lookup returned no source record; this does not establish lexical absence.</p>
            ) : null}
            {sourceStatus?.status === "UNAVAILABLE" ? (
              <p className="mt-1 text-[#aeb7c5]">The source was unavailable; no lexical conclusion follows.</p>
            ) : null}
            {sourceStatus?.status === "NOT_QUERIED" ? (
              <p className="mt-1 text-[#aeb7c5]">The source was not queried; no lexical conclusion follows.</p>
            ) : null}
            {sourceContextIsAlbanian && sourceStatus?.status === "MATCHES_FOUND" && sourceFacts.length === 0 ? (
              <p className="mt-1 text-[#aeb7bf]">
                MATCHES_FOUND was emitted without a displayable exact-form source fact in this payload.
              </p>
            ) : null}
            {sourceFacts.length > 0 ? (
              <>
                <p className="mt-1 text-[#9fb1bf]">Source senses are shown read-only; none is selected for a component proposal.</p>
                <ol className="mt-2 space-y-2">
                  {sourceFacts.map((fact) => (
                    <li key={fact.sourceRecordId} className="min-w-0 rounded border border-[#26323d] p-2">
                      <div className="break-words font-mono">{fact.sourceRecordId}</div>
                      <div className="break-words text-[#aeb7c5]">
                        Entry {fact.entryLocator} · {fact.form} · {fact.partOfSpeech ?? "part of speech Unknown / Null"}
                      </div>
                      <div className="break-words text-[#9fb1bf]">
                        {fact.language} · {fact.sourceStatus} · {fact.attestationTruth.toUpperCase()} · {fact.sourceSnapshot.sourceFamilyId} · SHA-256 {fact.sourceSnapshot.sha256}
                      </div>
                      <div className="break-all text-[#9fb1bf]">Source snapshot: {fact.sourceSnapshot.sourceUrl}</div>
                      {fact.senses.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                          {fact.senses.map((sense, senseIndex) => (
                            <li key={`${fact.sourceRecordId}:${sense.senseId ?? senseIndex}`} className="break-words">
                              Sense {sense.senseId ?? "UNKNOWN_OR_NULL"}: {sense.glosses.length ? sense.glosses.join("; ") : "Unknown / Null"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-1">Source senses: not emitted.</div>
                      )}
                      {fact.ipaObservations.length > 0 ? (
                        <div className="mt-1 text-[#9fb1bf]">
                          Source-reported IPA observations: {fact.ipaObservations.map((observation) => observation.ipa ?? "Unknown / Null").join("; ")}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </section>
            </li>
            <li>
          <section data-testid="single-word-current-voice-evidence" className="rounded border border-[#315147] bg-[#101714] p-2">
            <h4 className="font-semibold text-[#a9d2bf]">2 · Written Seven-Voices path (complete orthographic events)</h4>
            {writtenInput ? (
              <>
                <div className="mt-1 font-mono text-base text-[#f5f7fb]">{displayVoicePath(writtenInput.voicePath)}</div>
                <div className="break-words">
                  Authority: {writtenInput.representationAuthority} · pronunciation: {writtenInput.pronunciationAuthority}
                </div>
                <div className="break-words text-[#a9d2bf]">
                  {writtenInput.events.length
                    ? writtenInput.events.map((event) => `${event.voice} at source position ${event.sourcePosition} (${event.sourceCharacter})`).join(" · ")
                    : "No written Voice events"}
                </div>
                <div className="break-words text-[#9fb1bf]">
                  Positions are zero-based Unicode code points in the NFC written input; sequence status: {writtenInput.inputVoiceSequenceStatus}.
                </div>
              </>
            ) : (
              <p className="mt-1">Written path provenance: NOT_EMITTED or input-form mismatch. A selected derived path is not substituted for spelling.</p>
            )}
            {structuralAnalysis ? (
              <div className="mt-2 rounded border border-[#263a33] p-2" data-testid="single-word-progressive-written-analysis">
                <div>v0.2 orthographic recheck: {structuralAnalysis.analysisStatus} · sequence {structuralAnalysis.inputVoiceSequenceStatus}</div>
                <div className="font-mono">Complete input events: {displayVoicePath(structuralAnalysis.inputVoiceEvents.map((event) => event.voice))}</div>
                <div className="break-words">
                  {structuralAnalysis.inputVoiceEvents.length
                    ? structuralAnalysis.inputVoiceEvents.map((event) => `${event.voice} at source position ${event.sourcePosition} (${event.sourceCharacter})`).join(" · ")
                    : "No complete input Voice events emitted; status remains Unknown / Null."}
                </div>
                <div className="break-words text-[#9fb1bf]">
                  Albanian graphemes: {structuralAnalysis.inputGraphemes.length
                    ? structuralAnalysis.inputGraphemes.map((grapheme) => {
                        const exactSourceGrapheme = Array.from(visibleDiscovery.inputWord.normalize("NFC"))
                          .slice(grapheme.sourceSpan.start, grapheme.sourceSpan.end)
                          .join("");
                        return `${exactSourceGrapheme || grapheme.grapheme} [${grapheme.sourceSpan.start}, ${grapheme.sourceSpan.end}) ${grapheme.graphemeKind}`;
                      }).join(" · ")
                    : "Unknown / Null"}
                </div>
                <div className="text-[#9fb1bf]">
                  API/event sequence comparison: {writtenInput
                    ? JSON.stringify(structuralAnalysis.inputVoiceEvents.map((event) => event.voice)) === JSON.stringify(writtenInput.voicePath)
                      ? "MATCH"
                      : "MISMATCH · both outputs are retained"
                    : "UNKNOWN_OR_NULL · API written provenance not emitted"}
                </div>
                <div className="text-[#9fb1bf]">Representation is orthographic; pronunciation authority is not established.</div>
              </div>
            ) : (
              <p className="mt-2 text-[#9fb1bf]">v0.2 Albanian grapheme analysis: UNKNOWN_OR_NULL because this discovery does not identify an Albanian language/profile context.</p>
            )}
            {selectedPath ? (
              <div className="mt-2 rounded border border-[#263a33] p-2">
                <div className="font-semibold">
                  {selectedPath.selectionKind === "profile_solver_selected" ? "Solver-selected path" : "Selected derived path"}
                </div>
                <div className="font-mono text-sm">{displayVoicePath(selectedPath.voicePath)}</div>
                <div className="break-words text-[#a9d2bf]">
                  Selection: {selectedPath.selectionKind} · legacy source: {selectedPath.legacySource} · relation to written path: {selectedPath.relationshipToWritten}
                </div>
                <div className="text-[#9fb1bf]">This derived sequence is displayed separately; it is not a literal spelling inventory or an independent pronunciation claim.</div>
              </div>
            ) : (
              <div className="mt-2 rounded border border-[#263a33] p-2">
                <div className="font-semibold">Legacy derived path (separate from spelling)</div>
                <div className="font-mono text-sm">{displayVoicePath(visibleDiscovery.derivedStructure.voicePath)}</div>
                <div className="text-[#9fb1bf]">
                  Source: {visibleDiscovery.derivedStructure.voicePathSource}. Written provenance is not available; pronunciation authority is not inferred.
                </div>
              </div>
            )}
          </section>
            </li>
            <li>
          <section data-testid="single-word-current-structural-evidence" className="rounded border border-[#3f3a2b] bg-[#15130f] p-2">
            <h4 className="font-semibold text-[#f0ddb0]">3 · Structural candidates and component tree</h4>
            {structuralAnalysis ? (
              <div className="mt-2" data-testid="single-word-progressive-v02-structure">
                <div className="font-semibold">Lossless v0.2 analysis · {structuralAnalysis.analysisStatus}</div>
                {structuralAnalysis.hypotheses.length ? (
                  <ol className="mt-1 space-y-2">
                    {structuralAnalysis.hypotheses.map((hypothesis) => (
                      <li key={hypothesis.hypothesisId} className="min-w-0 rounded border border-[#303843] p-2">
                        <div className="break-words font-mono">{hypothesis.hypothesisId} · structural candidate {hypothesis.embryo}</div>
                        <div className="break-words">Expansion: {hypothesis.expansionChain.join(" → ") || "not emitted"}</div>
                        <div className="break-words text-[#c5b995]">Reason codes: {hypothesis.reasonCodes.join(", ") || "none emitted"}</div>
                        <div className="mt-1">Components (source order; lexical meaning not evaluated):</div>
                        <ul className="mt-1 space-y-1">
                          {hypothesis.losslessDecomposition.components.map((component) => (
                            <li key={component.componentId} className="break-words">
                              <span className="font-mono">{component.form}</span> · {component.componentKind} · source span [{component.sourceSpan.start}, {component.sourceSpan.end}) · graphemes {component.graphemeIds.join(", ") || "none"} · Voices {displayVoicePath(component.voiceEvents.map((event) => event.voice))} · meaning UNKNOWN_OR_NULL
                            </li>
                          ))}
                        </ul>
                        <div className="mt-1 break-words text-[#9fb1bf]">
                          Conservation: {hypothesis.losslessDecomposition.conservation.status} · event order preserved {String(hypothesis.losslessDecomposition.conservation.eventOrderPreserved)} · grapheme order preserved {String(hypothesis.losslessDecomposition.conservation.graphemeOrderPreserved)} · no digraph split {String(hypothesis.losslessDecomposition.conservation.noDigraphSplit)} · reconstructed {hypothesis.losslessDecomposition.reconstructedBasis}
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-1">No v0.2 reduction candidate emitted. The complete written events above remain available; candidate meaning is UNKNOWN_OR_NULL.</p>
                )}
                {structuralAnalysis.excludedHypotheses.length ? (
                  <ul className="mt-1 text-[#c5b995]">
                    {structuralAnalysis.excludedHypotheses.map((excluded) => (
                      <li key={excluded.hypothesisId}>
                        {excluded.hypothesisId} excluded: Albanian digraph {excluded.digraph} would be split at source position {excluded.splitSourcePosition}.
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-1 text-[#9fb1bf]">Candidate order is deterministic output order; none is promoted as the best root or assigned a lexical meaning.</div>
              </div>
            ) : null}
            {structuralHypotheses.length ? (
              <ul className="mt-2 space-y-2" data-testid="single-word-progressive-legacy-structure">
                <li className="text-[#9fb1bf]">Legacy discovery hypotheses (v0.1), kept separate from v0.2 decompositions:</li>
                {structuralHypotheses.map((hypothesis) => (
                  <li key={hypothesis.hypothesisId} className="min-w-0 break-words">
                    <div className="font-mono">{hypothesis.hypothesisId} · embryo {hypothesis.embryo}</div>
                    <div>Expansion: {hypothesis.expansionChain.join(" → ") || "not emitted"}</div>
                    <div className="text-[#c5b995]">Reason codes: {hypothesis.reasonCodes.join(", ") || "none emitted"}</div>
                  </li>
                ))}
              </ul>
            ) : !structuralAnalysis ? (
              <p className="mt-1">Structural analysis not emitted for this Albanian context; this level remains UNKNOWN_OR_NULL.</p>
            ) : (
              <p className="mt-1">No structural hypotheses emitted by the legacy v0.1 field; v0.2 output remains shown separately above.</p>
            )}
            <p className="mt-1 text-[#c5b995]">Structure supplies candidate form only. It does not assign component meaning, morphology, historical derivation, or embryo function.</p>
          </section>
            </li>
            <li>
              <section data-testid="single-word-progressive-source-relationships" className="rounded border border-[#303843] bg-[#10161c] p-2">
                <h4 className="font-semibold text-[#dce9ca]">4 · Source-authored relationships and sense alternatives</h4>
                {sourceContextIsAlbanian ? (
                  <div>Exact-form source status: {sourceStatus?.status ?? "NOT_EMITTED"} · source relation evidence is shown only if emitted by the current Discovery.</div>
                ) : (
                  <div>Albanian source relations: UNKNOWN_OR_NULL · no Albanian context is established.</div>
                )}
                {sourceComponentReading && componentTargetRecordBinding === "MATCH" ? (
                  <div className="mt-2 rounded border border-[#26323d] p-2">
                    <div>Source-linked component reading: {sourceComponentReading.status} · {sourceComponentReading.relation.relation}</div>
                    <div className="break-words">Target record: {sourceComponentReading.primary.sourceRecordId} · {sourceComponentReading.primary.entryLocator} · {sourceComponentReading.primary.form} · {sourceComponentReading.primary.partOfSpeech ?? "POS UNKNOWN_OR_NULL"}</div>
                    <div>Target record/query binding: {componentTargetRecordBinding}</div>
                    <div className="break-words">Source-authored explanation: {sourceComponentReading.relation.sourceAuthoredExplanation ?? "UNKNOWN_OR_NULL"}</div>
                    <div className="break-words">Validated source-attributed component forms (ordered; separate from lexical records): {sourceComponentReading.relation.references.map((reference) => reference.sourceForm).join(" + ") || "UNKNOWN_OR_NULL"}</div>
                    {componentSurfaceJoin !== null ? (
                      <div className="break-words" data-testid="single-word-source-surface-join">
                        Structured source-form concatenation (leading affix hyphen omitted as notation only): {surfaceJoinMatchesTarget === null
                          ? `${componentSurfaceJoin.toLocaleUpperCase("sq-AL")} · comparison UNKNOWN_OR_NULL`
                          : `${componentSurfaceJoin.toLocaleUpperCase("sq-AL")} ${surfaceJoinMatchesTarget ? "=" : "≠"} ${visibleDiscovery.inputWord.toLocaleUpperCase("sq-AL")} · ${surfaceJoinMatchesTarget ? "EXACT_SURFACE_JOIN" : "SURFACE_MISMATCH"}`}
                      </div>
                    ) : (
                      <div>Structured component-form reconstruction: UNKNOWN_OR_NULL · the validated ordered references do not support a safe concatenation.</div>
                    )}
                    <div className="mt-1">Component reference resolution (source order):</div>
                    <ol className="mt-1 space-y-1">
                      {sourceComponentReading.componentResolutions.map((resolution, index) => (
                        <li key={`${resolution.sourceForm}:${index}`} className="break-words">
                          {index + 1}. {resolution.sourceForm} · {resolution.status} · reference {resolution.reference ?? "UNKNOWN_OR_NULL"} · source records {resolution.sourceRecordIds.join(", ") || "UNKNOWN_OR_NULL"} · reasons {resolution.reasonCodes.join(", ") || "none emitted"}
                        </li>
                      ))}
                    </ol>
                    <div className="mt-1">Component source records and senses (source order; alternatives retained):</div>
                    <ol className="mt-1 space-y-1">
                      {sourceComponentReading.components.map((component) => (
                        <li key={component.sourceRecordId} className="break-words">
                          {component.form} · {component.partOfSpeech ?? "POS UNKNOWN_OR_NULL"} · {component.sourceRecordId} · {component.entryLocator}
                          {component.sourceSenses?.length ? (
                            <ul className="ml-3 list-disc">
                              {component.sourceSenses.map((sense, senseIndex) => (
                                <li key={`${component.sourceRecordId}:${sense.senseId ?? senseIndex}`}>
                                  Sense {sense.sourceSenseOrdinal}: {sense.senseId ?? "UNKNOWN_OR_NULL"} · {sense.glosses.join("; ") || "UNKNOWN_OR_NULL"}
                                </li>
                              ))}
                            </ul>
                          ) : <span> · source senses UNKNOWN_OR_NULL</span>}
                        </li>
                      ))}
                    </ol>
                    <div className="mt-1 break-words">Relationship interpretation: {sourceComponentReading.exploratoryRelationship.status} · {sourceComponentReading.exploratoryRelationship.statement ?? "UNKNOWN_OR_NULL"}</div>
                    {sourceComponentReading.exploratoryRelationship.alternatives.length ? (
                      <ul className="ml-3 list-disc">
                        {sourceComponentReading.exploratoryRelationship.alternatives.map((alternative, index) => <li key={`${index}:${alternative}`}>{alternative}</li>)}
                      </ul>
                    ) : null}
                    <div className="break-words">Relationship claim boundary: {sourceComponentReading.claimBoundary}</div>
                    <div className="break-words">Target/component exact-sense crosswalk: UNKNOWN_OR_NULL · no canonical sense alignment is emitted by this record-level relationship.</div>
                    {structuralSourceSuffixAlignment ? (
                      <div className="mt-2 rounded border border-[#46523b] bg-[#121811] p-2" data-testid="single-word-structural-source-component-alignment" data-status={structuralSourceSuffixAlignment.comparisonStatus}>
                        <div className="font-semibold">Source-positioned component comparison · {structuralSourceSuffixAlignment.comparisonStatus}</div>
                        <div className="break-words">Exact target binding: {structuralSourceSuffixAlignment.targetSourceRecordId} · {structuralSourceSuffixAlignment.targetEntryLocator} · senses {structuralSourceSuffixAlignment.targetSenseIds.join(", ") || "UNKNOWN_OR_NULL"}.</div>
                        <div className="break-words">Source-authored relationship: {structuralSourceSuffixAlignment.sourceAuthoredExplanation ?? "UNKNOWN_OR_NULL"}</div>
                        <div className="break-words">Source suffix {structuralSourceSuffixAlignment.suffixReference.sourceForm} · reference {structuralSourceSuffixAlignment.suffixReference.reference ?? "UNKNOWN_OR_NULL"} · resolution {structuralSourceSuffixAlignment.suffixResolution.status} · record {structuralSourceSuffixAlignment.suffixRecord.sourceRecordId} · {structuralSourceSuffixAlignment.suffixRecord.entryLocator} · POS {structuralSourceSuffixAlignment.suffixRecord.partOfSpeech ?? "UNKNOWN_OR_NULL"}.</div>
                        <div className="break-words">Agent-noun suffix evidence references: {structuralSourceSuffixAlignment.agentNounSuffixSenses.map((candidate) => `${candidate.sourceRecordId} (${candidate.entryLocator}; sense ${candidate.senseId}; ${candidate.glosses.join("; ")})`).join(" · ")}</div>
                        {structuralSourceSuffixAlignment.suffixSourceSpan ? (
                          <div className="break-words">Exact suffix surface span: {structuralSourceSuffixAlignment.suffixBody} [{structuralSourceSuffixAlignment.suffixSourceSpan.start}, {structuralSourceSuffixAlignment.suffixSourceSpan.end}) · Unicode code points in NFC input.</div>
                        ) : (
                          <div>Exact suffix surface span: UNKNOWN_OR_NULL · the source suffix spelling is not an exact target ending.</div>
                        )}
                        {structuralSourceSuffixAlignment.matchingEngineComponents.length ? (
                          <ol className="mt-1 space-y-1">
                            {structuralSourceSuffixAlignment.matchingEngineComponents.map(({ hypothesisId, component }) => (
                              <li key={`${hypothesisId}:${component.componentId}`} className="break-words">
                                Engine component: {component.form} · hypothesis {hypothesisId} · component {component.componentId} · source span [{component.sourceSpan.start}, {component.sourceSpan.end}) · {component.operationId ?? "operation UNKNOWN_OR_NULL"} · written Voice events {component.voiceEvents.map((event) => `${event.voice}@${event.sourcePosition}`).join(" → ") || "∅"} · meaning {component.meaning === null ? "UNKNOWN_OR_NULL" : "not emitted"} · {component.claimBoundary}.
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <div>No exact source-positioned extracted engine component matched this suffix · {structuralSourceSuffixAlignment.comparisonStatus}.</div>
                        )}
                        <div className="break-words">Source base {structuralSourceSuffixAlignment.baseReference.sourceForm} · resolution {structuralSourceSuffixAlignment.baseResolution.status} · source records {structuralSourceSuffixAlignment.baseResolution.sourceRecordIds.join(", ") || "UNKNOWN_OR_NULL"} · exact sense alternatives remain above.</div>
                        {structuralSourceSuffixAlignment.baseRecords.length ? (
                          <div className="break-words">Base-record evidence references: {structuralSourceSuffixAlignment.baseRecords.map((record) => `${record.sourceRecordId} (${record.entryLocator}; ${record.partOfSpeech ?? "POS UNKNOWN_OR_NULL"})`).join(" · ")}</div>
                        ) : null}
                        {structuralSourceSuffixAlignment.baseSurfaceSpan && structuralSourceSuffixAlignment.baseSurface !== null ? (
                          <div className="break-words">Target prefix surface {structuralSourceSuffixAlignment.baseSurface} [{structuralSourceSuffixAlignment.baseSurfaceSpan.start}, {structuralSourceSuffixAlignment.baseSurfaceSpan.end}) · exact source-base spelling {structuralSourceSuffixAlignment.baseSurfaceMatchesSourceForm ? "MATCH" : "MISMATCH"} · engine components matching target-prefix surface (not source-base correspondence) {structuralSourceSuffixAlignment.baseEngineComponents.map(({ component }) => `${component.form} (${component.componentKind}; ${component.operationId ?? "operation UNKNOWN_OR_NULL"})`).join(" · ") || "UNKNOWN_OR_NULL"}.</div>
                        ) : null}
                        <div className="break-words">Complete written Voice events: {structuralSourceSuffixAlignment.writtenVoiceEvents.map((event) => `${event.voice}@${event.sourcePosition}`).join(" → ") || "∅"} · orthographic only; pronunciation authority not established.</div>
                        <div className="break-words">Boundary: exact source-record, spelling, and source-span correspondence only. It does not prove derivation, a target-to-component sense crosswalk, historical change, or component/embryo meaning. Whole-word function remains the separate exploratory reading above.</div>
                      </div>
                    ) : null}
                  </div>
                ) : sourceComponentReading ? (
                  <div className="mt-2 rounded border border-[#674b3a] p-2" data-testid="single-word-source-component-withheld">
                    Source component relationship withheld from this analyzed word: target record/query binding {componentTargetRecordBinding}. Its source record payload does not authorize a relationship or functional reading for the current exact source record.
                  </div>
                ) : null}
                {lexicalReading?.relatedForms.length && lexicalPrimaryRecordBinding === "MATCH" ? (
                  <div className="mt-2 rounded border border-[#26323d] p-2">
                    <div>Source-reported related forms (original order):</div>
                    <ol className="mt-1 space-y-1">
                      {lexicalReading.relatedForms.map((related, index) => (
                        <li key={`${related.entryLocator}:${index}`} className="break-words">
                          {related.form} · {related.relation} · {related.sourceRecordId ?? "source record UNKNOWN_OR_NULL"} · {related.entryLocator} · {related.partOfSpeech ?? "POS UNKNOWN_OR_NULL"} · {related.meaningGlosses.join("; ") || "UNKNOWN_OR_NULL"}
                          {related.etymologyText ? <span> · source text: {related.etymologyText}</span> : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
                {sourceComparison ? sourceComparisonTargetBinding === "MATCH" ? (
                  <div className="mt-2 rounded border border-[#26323d] p-2" data-testid="single-word-progressive-source-comparison">
                    <div>Source-linked comparison: {sourceComparison.status} · {sourceComparison.relation.relation} · {sourceComparison.summary.text}</div>
                    <div className="break-words">Primary record: {sourceComparison.primary.sourceRecordId} · {sourceComparison.primary.entryLocator} · related form {sourceComparison.relation.relatedForm} · related record {sourceComparison.relation.relatedSourceRecordId ?? "UNKNOWN_OR_NULL"} · {sourceComparison.relation.relatedEntryLocator}</div>
                    {[sourceComparison.primary, ...(sourceComparison.related ? [sourceComparison.related] : [])].map((record) => (
                      <div key={record.sourceRecordId} className="mt-1 break-words">
                        {record.form} source senses (original order): {record.sourceSenses?.length
                          ? record.sourceSenses.map((sense) => `${sense.sourceSenseOrdinal}:${sense.senseId ?? "UNKNOWN_OR_NULL"}=${sense.glosses.join("; ") || "UNKNOWN_OR_NULL"}`).join(" · ")
                          : "UNKNOWN_OR_NULL"}
                      </div>
                    ))}
                    {sourceComparisonTargetRecord?.etymologyText ? (
                      <div className="mt-1 break-words" data-testid="single-word-target-etymology-text">
                        Target-record source-attributed etymology prose (not parsed into components): {sourceComparisonTargetRecord.etymologyText} · {sourceComparisonTargetRecord.sourceRecordId} · {sourceComparisonTargetRecord.entryLocator}
                      </div>
                    ) : null}
                    {sourceComparisonTargetRecord?.etymologyLinks.length ? (
                      <div className="mt-1 break-words">
                        Target-record source-attributed etymology links (ordered): {sourceComparisonTargetRecord.etymologyLinks.map((link) => `${link.sourceForm} (${link.reference})`).join(" · ")}
                      </div>
                    ) : null}
                    {linkedFormSurfaceJoin !== null ? (
                      <div className="mt-1 break-words" data-testid="single-word-source-linked-form-join">
                        Linked-form concatenation (leading affix hyphen omitted as notation only; not a component-sense or historical analysis): {linkedFormSurfaceJoin.toLocaleUpperCase("sq-AL")} {linkedFormSurfaceMatchesTarget ? "=" : "≠"} {visibleDiscovery.inputWord.toLocaleUpperCase("sq-AL")} · {linkedFormSurfaceMatchesTarget ? "EXACT_SURFACE_JOIN" : "SURFACE_MISMATCH"}
                      </div>
                    ) : (
                      <div className="mt-1">Linked-form reconstruction: UNKNOWN_OR_NULL · ordered exact-form Albanian links are unavailable.</div>
                    )}
                    <div>Independent component record/sense resolution: UNKNOWN_OR_NULL unless emitted by the separate component-reading contract; exact-sense alignment is not established.</div>
                    <div className="break-words">Comparison claim boundary: {sourceComparison.claimBoundary}</div>
                    <div>Cross-source exact-sense identity: UNKNOWN_OR_NULL unless separately emitted by a sense-alignment contract.</div>
                  </div>
                ) : (
                  <div className="mt-2 rounded border border-[#674b3a] p-2" data-testid="single-word-progressive-source-comparison-withheld">
                    Source-linked comparison withheld: target record/query binding {sourceComparisonTargetBinding}. The comparison payload does not authorize a relationship or function for the current exact source record.
                  </div>
                ) : null}
                {lexicalReading?.senseAlignedLexicalRole ? (
                  <div className="mt-2 rounded border border-[#26323d] p-2" data-testid="single-word-progressive-sense-alignment">
                    <div>Separate sense-aligned lexical-role contract: {lexicalReading.senseAlignedLexicalRole.status} · lineage independence {lexicalReading.senseAlignedLexicalRole.lineageIndependence} · functional operation Null.</div>
                    {lexicalReading.senseAlignedLexicalRole.candidates.length ? (
                      <ol className="mt-1 space-y-1">
                        {lexicalReading.senseAlignedLexicalRole.candidates.map((candidate, index) => (
                          <li key={`${candidate.sourceFact.sourceRecordId}:${candidate.sourceFact.sourceSenseId ?? index}:${index}`} className="break-words">
                            Kaikki {candidate.sourceFact.sourceRecordId} · sense {candidate.sourceFact.sourceSenseOrdinal} / {candidate.sourceFact.sourceSenseId ?? "UNKNOWN_OR_NULL"} · {candidate.sourceFact.form} · synonym {candidate.sourceFact.synonym ?? "UNKNOWN_OR_NULL"} · glosses {candidate.sourceFact.glosses.join("; ") || "UNKNOWN_OR_NULL"} · AlbaNet {candidate.crossSourceFact?.sourceRecordId ?? "UNKNOWN_OR_NULL"} · synset {candidate.crossSourceFact?.synsetId ?? "UNKNOWN_OR_NULL"} · inference {candidate.inference.status} / {candidate.inference.roleLabel ?? "UNKNOWN_OR_NULL"} · {candidate.reasonCodes.join(", ") || "no reason codes"}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <div className="mt-1">UNKNOWN_OR_NULL · {lexicalReading.senseAlignedLexicalRole.reasonCodes.join(", ") || "no candidate evidence"}</div>
                    )}
                    <div className="mt-1 break-words">{lexicalReading.senseAlignedLexicalRole.claimBoundary} No single winner; user decides. This contract does not establish an embryo function or a component-sense crosswalk.</div>
                  </div>
                ) : (
                  <div className="mt-1">Separate exact sense-alignment artifact: UNKNOWN_OR_NULL · not emitted in this Discovery.</div>
                )}
                {!sourceComponentReading && !lexicalReading?.relatedForms.length && !lexicalReading?.sourceLinkedComparison ? (
                  <p className="mt-1">No source-authored component relation is available in this Discovery payload: UNKNOWN_OR_NULL. A spelling resemblance or user proposal is not a source relation.</p>
                ) : null}
                {sourceComponentReading?.status === "SUPPORTED" &&
                sourceComponentReading.functionalHypothesis.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" &&
                componentTargetRecordBinding === "MATCH" ? (
                  <div className="mt-2 break-words" data-testid="single-word-source-component-hypothesis">
                    Source-component role hypothesis: EXPLORATORY · {sourceComponentReading.functionalHypothesis.statement ?? "UNKNOWN_OR_NULL"} · functional operation {sourceComponentReading.functionalHypothesis.functionalOperation ?? "Null"}.
                    <div>Evidence references: {sourceComponentReading.functionalHypothesis.evidenceRefs.map((reference) => `${reference.sourceRecordId} (${reference.entryLocator}; senses ${reference.senseIds.join(", ") || "UNKNOWN_OR_NULL"})`).join(" · ") || "UNKNOWN_OR_NULL"}</div>
                    <div>Claim boundary: {sourceComponentReading.functionalHypothesis.claimBoundary}</div>
                  </div>
                ) : null}
              </section>
            </li>
            <li>
              <section data-testid="single-word-progressive-functional-reading" className="rounded border border-[#34495a] bg-[#10161c] p-2">
                <h4 className="font-semibold text-[#dce9ca]">5 · Existing whole-word functional reading or Null</h4>
                {lexicalReading?.functionalFamilyReading && lexicalPrimaryRecordBinding === "MATCH" ? (
                  <div className="mb-2 rounded border border-[#26323d] p-2" data-testid="single-word-progressive-functional-family">
                    <div>Source-family reading: EXPLORATORY_FUNCTIONAL_FAMILY · operation {lexicalReading.functionalFamilyReading.functionalOperation}</div>
                    <div className="break-words">{lexicalReading.functionalFamilyReading.statement}</div>
                    <ol className="mt-1 space-y-1">
                      <li className="break-words">Primary: {lexicalReading.functionalFamilyReading.primary.form} · {lexicalReading.functionalFamilyReading.primary.sourceRecordId} · {lexicalReading.functionalFamilyReading.primary.senseId} · {lexicalReading.functionalFamilyReading.primary.meaningGlosses.join("; ")}</li>
                      {lexicalReading.functionalFamilyReading.members.map((member, index) => (
                        <li key={`${member.sourceRecordId}:${member.senseId}:${index}`} className="break-words">
                          {member.form} · {member.sourceRecordId} · {member.senseId} · {member.meaningGlosses.join("; ")} · {member.sourceRelation} · evidence {member.evidenceBasis.join(", ")}
                        </li>
                      ))}
                    </ol>
                    <div className="break-words">{lexicalReading.functionalFamilyReading.claimBoundary} {lexicalReading.functionalFamilyReading.alternatives.join(" ")}</div>
                    <div className="text-[#9fb1bf]">Same-source family evidence does not establish independent corroboration or embryo meaning.</div>
                  </div>
                ) : null}
                {lexicalReading?.functionalMeaningBridge?.status === "SUPPORTED" && functionalBridgeTargetBinding === "MATCH" ? (
                  <>
                    <div>Whole-word bridge: SUPPORTED · operation {lexicalReading.functionalMeaningBridge.functionalHypothesis.functionalOperation ?? "Null"} · {lexicalReading.functionalMeaningBridge.functionalHypothesis.status}</div>
                    <div className="break-words">{lexicalReading.functionalMeaningBridge.functionalHypothesis.statement ?? "UNKNOWN_OR_NULL"}</div>
                    {lexicalReading.functionalMeaningBridge.functionalHypothesis.alternatives.length ? (
                      <ul className="ml-3 list-disc">
                        {lexicalReading.functionalMeaningBridge.functionalHypothesis.alternatives.map((alternative, index) => <li key={`${index}:${alternative}`}>{alternative}</li>)}
                      </ul>
                    ) : null}
                    <div className="break-words">Bridge claim boundary: {lexicalReading.functionalMeaningBridge.claimBoundary}</div>
                  </>
                ) : lexicalReading?.functionalMeaningBridge?.status === "SUPPORTED" ? (
                  <div data-testid="single-word-progressive-functional-bridge-withheld">
                    Whole-word functional bridge withheld: exact target record/query binding {functionalBridgeTargetBinding}. Functional operation UNKNOWN_OR_NULL for this displayed source record.
                  </div>
                ) : (
                  <div>Whole-word functional bridge: UNKNOWN_OR_NULL{lexicalReading?.functionalMeaningBridge?.reasonCodes.length ? ` · ${lexicalReading.functionalMeaningBridge.reasonCodes.join(", ")}` : " · no supported bridge emitted"}</div>
                )}
                {lexicalReading?.interpretation.status === "EXPLORATORY_ZHEJI_READING" && functionalBridgeTargetBinding === "MATCH" ? (
                  <div className="mt-1 break-words">Existing product interpretation: EXPLORATORY · {lexicalReading.interpretation.statement ?? "UNKNOWN_OR_NULL"}</div>
                ) : null}
                {lexicalReading?.interpretation.alternatives.length ? (
                  <ul className="ml-3 list-disc">
                    {lexicalReading.interpretation.alternatives.map((alternative, index) => <li key={`${index}:${alternative}`}>{alternative}</li>)}
                  </ul>
                ) : null}
                {sourceMotivatedExplanationAvailable && sourceComponentReading && functionalBridge?.status === "SUPPORTED" ? (
                  <div className="mt-2 rounded border border-[#46523b] bg-[#121811] p-2" data-testid="single-word-progressive-source-motivated-explanation">
                    <h5 className="font-semibold">Possible source-motivated explanation · CONDITIONAL_INFERENCE</h5>
                    <p className="mt-1" data-testid="single-word-progressive-source-motivated-pairing">
                      Exact target form: {visibleDiscovery?.inputWord}. The source attributes these ordered component forms: {sourceComponentReading.relation.references.map((reference) => reference.sourceForm).join(" + ")}. If a source-reported noun sense of {sourceMotivatedBaseForm} (candidate glosses: {sourceMotivatedBaseGlosses}) and an explicitly agent-noun-forming sense of {sourceMotivatedSuffixForm} (candidate glosses: {sourceMotivatedSuffixGlosses}) apply to this exact source-attributed suffix formation, a person associated with the source-reported base meaning {sourceMotivatedBaseGlosses} is consistent with the existing whole-word AGENT hypothesis and the target source-meaning alternatives {sourceMotivatedTargetGlosses}. This is a conditional functional motivation, not a source-authored compound meaning, selected sense, exact sense crosswalk, or asserted derivation.
                    </p>
                    <div className="mt-1 break-words">Conditional source-sense evidence candidates (source order; none selected):</div>
                    <ul className="ml-3 list-disc">
                      {sourceMotivationBaseNounSenses.map((candidate) => (
                        <li key={`${candidate.sourceRecordId}:${candidate.senseId}`}>
                          Noun candidate · {candidate.sourceForm} · {candidate.sourceRecordId} · sense {candidate.sourceSenseOrdinal} {candidate.senseId} · {candidate.glosses.join("; ")}
                        </li>
                      ))}
                      {sourceMotivationAgentNounSuffixSenses.map((candidate) => (
                        <li key={`${candidate.sourceRecordId}:${candidate.senseId}`}>
                          Agent-noun-forming suffix candidate · {candidate.sourceForm} · {candidate.sourceRecordId} · sense {candidate.sourceSenseOrdinal} {candidate.senseId} · {candidate.glosses.join("; ")}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-1 break-words" data-testid="single-word-progressive-source-motivated-candidate-qualification">
                      {sourceMotivatedBaseSenseQualification}
                    </div>
                    <div className="mt-1 break-words">Source-attributed relationship: {sourceComponentReading.relation.sourceAuthoredExplanation ?? "UNKNOWN_OR_NULL"} · {sourceComponentReading.primary.sourceRecordId} · {sourceComponentReading.primary.entryLocator}</div>
                    <div className="mt-2">Component sense alternatives (source order; none selected):</div>
                    <ol className="mt-1 space-y-1">
                      {sourceComponentMeaningGroups.map(({ resolution, records }, componentIndex) => (
                        <li key={`${resolution.sourceForm}:${componentIndex}`} className="break-words">
                          {componentIndex + 1}. {resolution.sourceForm} · {resolution.status}
                          <ul className="ml-3 list-disc">
                            {records.map((record) => (
                              <li key={record.sourceRecordId} className="break-words">
                                {record.sourceRecordId} · {record.entryLocator} · {record.partOfSpeech ?? "POS UNKNOWN_OR_NULL"}
                                <ul className="ml-3 list-[circle]">
                                  {(record.sourceSenses ?? []).map((sense, senseIndex) => (
                                    <li key={`${record.sourceRecordId}:${sense.senseId ?? senseIndex}`}>
                                      Sense {sense.sourceSenseOrdinal}: {sense.senseId ?? "UNKNOWN_OR_NULL"} · {sense.glosses.join("; ") || "UNKNOWN_OR_NULL"}
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-2">Exact target record senses (source order; none selected):</div>
                    <ul className="ml-3 list-disc">
                      {exactComponentTargetSenses.map((sense, senseIndex) => (
                        <li key={`${sourceComponentReading.primary.sourceRecordId}:${sense.senseId ?? senseIndex}`} className="break-words">
                          {sourceComponentReading.primary.sourceRecordId} · {sourceComponentReading.primary.entryLocator} · Sense {sense.sourceSenseOrdinal}: {sense.senseId ?? "UNKNOWN_OR_NULL"} · {sense.glosses.join("; ") || "UNKNOWN_OR_NULL"}
                        </li>
                      ))}
                    </ul>
                    {componentSurfaceJoin !== null ? (
                      <div className="mt-1 break-words">
                        Source-form reconstruction: {componentSurfaceJoin.toLocaleUpperCase("sq-AL")} {surfaceJoinMatchesTarget ? "=" : "≠"} {visibleDiscovery?.inputWord.toLocaleUpperCase("sq-AL")} · {surfaceJoinMatchesTarget ? "EXACT_SURFACE_JOIN" : "SURFACE_MISMATCH"}. The comparison does not authorize a spelling change.
                      </div>
                    ) : null}
                    <div className="mt-1 break-words">Whole-word evidence remains {functionalBridge.functionalHypothesis.status} · {functionalBridge.functionalHypothesis.functionalOperation}. Component-sense alignment and independent embryo function remain UNKNOWN_OR_NULL; source-record juxtaposition is not independent corroboration. Claim boundary: {functionalBridge.claimBoundary}</div>
                  </div>
                ) : null}
                <div className="mt-1 font-semibold">Structural embryo meaning/function: UNKNOWN_OR_NULL. Structural candidates do not establish a lexical meaning or functional operation.</div>
                <div>No single winner: {visibleDiscovery.noSingleWinner ? "true" : "UNKNOWN_OR_NULL"} · user decision posture: {visibleDiscovery.userDecisionPosture}.</div>
              </section>
            </li>
          </ol>
        </section>
      ) : null}

      {contextMatchesTarget && !visibleDiscovery ? (
        <section aria-label="Progressive evidence trace" data-testid="single-word-progressive-evidence-trace" className="mt-3 rounded border border-[#34495a] bg-[#10161c] p-2">
          <h4 className="font-semibold text-[#f5f7fb]">Progressive evidence trace</h4>
          <div className="mt-1">Analyzed form: {context?.analyzedWord ?? analyzedWord}</div>
          <div className="break-words">Discovery status: {!discoveryState
            ? "NOT_EMITTED"
            : discoveryState.kind === "missing"
              ? `MISSING · ${discoveryState.missing}${discoveryState.note ? ` · ${discoveryState.note}` : ""}`
              : `WITHHELD_INPUT_MISMATCH · Discovery input ${discovery?.inputWord ?? "UNKNOWN_OR_NULL"} does not match this analyzed form`}</div>
          <ol className="mt-2 space-y-1">
            <li>1 · Whole-word source facts and target senses: UNKNOWN_OR_NULL.</li>
            <li>2 · Written Voice events and graphemes: UNKNOWN_OR_NULL; no matching Discovery payload is available.</li>
            <li>3 · Structural candidates and decomposition: UNKNOWN_OR_NULL.</li>
            <li>4 · Source-authored relationships and sense alignment: UNKNOWN_OR_NULL.</li>
            <li>5 · Whole-word function: UNKNOWN_OR_NULL · embryo meaning/function: UNKNOWN_OR_NULL.</li>
          </ol>
          <p className="mt-1 text-[#9fb1bf]">Withheld or missing evidence is not a negative lexical finding. No proposal fields are populated from this state.</p>
        </section>
      ) : null}

      {contextMatchesTarget && draftTargetWord !== analyzedWord ? (
        <p className="mt-2 rounded border border-[#674b3a] bg-[#1a1411] p-2 text-[#efccaa]" data-testid="single-word-proposal-evidence-target-mismatch">
          The editable proposal target is {draftTargetWord}; evidence above remains tied to analyzed word {analyzedWord} and is not transferred.
        </p>
      ) : null}
    </section>
  );
}

function validationMessageForReasonCode(reasonCode: string): string {
  const segmentMatch = /^SEGMENT_(\d+)_(.+)$/u.exec(reasonCode);
  if (segmentMatch) {
    const [, number, reason] = segmentMatch;
    switch (reason) {
      case "EXACT_SPELLING_REQUIRED":
        return `Component ${number} spelling: enter one component of up to 80 characters.`;
      case "MEANING_MALFORMED":
        return `Component ${number} meaning: use 300 characters or fewer.`;
      case "GRAMMATICAL_ROLE_MALFORMED":
        return `Component ${number} grammatical role: use 200 characters or fewer.`;
      case "MEANING_AND_ROLE_REQUIRED_OR_MARK_UNRESOLVED":
        return `Component ${number}: enter both a meaning and role, or mark it not yet explained.`;
      case "LANGUAGE_REQUIRED":
        return `Component ${number} language: enter a language matching the target language.`;
      case "LANGUAGE_MUST_MATCH_TARGET":
        return `Component ${number} language must match the target language.`;
      case "DIALECT_MALFORMED":
        return `Component ${number} dialect: use 80 characters or fewer.`;
      case "EVIDENCE_STATUS_UNSUPPORTED":
        return `Component ${number} evidence status: select one of the listed statuses.`;
      case "EVIDENCE_REFERENCE_MALFORMED":
        return `Component ${number} evidence reference: use 500 characters or fewer.`;
      case "CITATION_REFERENCE_REQUIRED":
        return `Component ${number} evidence reference: add a citation locator (up to 500 characters) or change the evidence status.`;
      case "UNRESOLVED_FLAG_REQUIRED":
        return `Component ${number}: set whether it is not yet explained.`;
      case "MALFORMED":
        return `Component ${number}: check the spelling, meaning, role, language, dialect, and evidence fields.`;
      default:
        return `Component ${number}: review the field values and limits shown above.`;
    }
  }

  const transformationMatch = /^TRANSFORMATION_(\d+)_(.+)$/u.exec(reasonCode);
  if (transformationMatch) {
    const [, number, reason] = transformationMatch;
    if (reason === "SOURCE_AND_TARGET_REQUIRED") {
      return `Transformation ${number}: enter both From and To values.`;
    }
    if (reason === "MALFORMED") {
      return `Transformation ${number}: From/To allow 80 characters each, explanation 300, and evidence reference 500.`;
    }
  }

  switch (reasonCode) {
    case "MALFORMED_PROPOSAL":
      return "Proposal: check that all fields have valid values.";
    case "TARGET_WORD_REQUIRED_AS_ONE_SUPPORTED_TOKEN":
      return "Exact target word: enter one supported word of up to 80 Unicode code points.";
    case "TARGET_LANGUAGE_REQUIRED":
      return "Target language: enter a language of up to 80 characters.";
    case "TARGET_DIALECT_MALFORMED":
      return "Target dialect: use 80 characters or fewer.";
    case "TWO_TO_TWELVE_ORDERED_SEGMENTS_REQUIRED":
      return "Components: add between 2 and 12 ordered components.";
    case "UNRESOLVED_CONNECTING_MATERIAL_MALFORMED":
      return "Connecting material: use 500 characters or fewer.";
    case "ZERO_TO_EIGHT_TRANSFORMATIONS_REQUIRED":
      return "Transformations: keep the list between 0 and 8 items.";
    case "FUNCTIONAL_EXPLANATION_REQUIRED":
      return "Proposed functional explanation: enter 1–1,000 characters.";
    case "TRANSPARENCY_LEVEL_UNSUPPORTED":
      return "Transparency: select one of the listed descriptions.";
    case "ORTHOGRAPHIC_STRUCTURE_ANALYSIS_FAILED":
      return "Written Voice analysis is unavailable for this target word.";
    default:
      return "This field needs correction. Check its label and the limits shown above.";
  }
}

export function SingleWordMotivationWorkbenchV0_1({
  initialTargetWord,
  currentWordEvidence,
}: {
  initialTargetWord: string;
  currentWordEvidence?: SingleWordCurrentWordEvidenceContextV0_1;
}) {
  const [targetWord, setTargetWord] = useState(initialTargetWord);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [targetDialect, setTargetDialect] = useState("");
  const [segments, setSegments] = useState<DraftSegment[]>([blankSegment(), blankSegment()]);
  const [selectedComponentSource, setSelectedComponentSource] = useState<SelectedComponentSourceLookupV0_1 | null>(null);
  const [unresolvedConnectingMaterial, setUnresolvedConnectingMaterial] = useState("");
  const [transformations, setTransformations] = useState<DraftTransformation[]>([]);
  const [mechanicalOperations, setMechanicalOperations] = useState<DraftMechanicalOperation[]>([]);
  const [examinedMechanicalDraft, setExaminedMechanicalDraft] = useState<ExaminedMechanicalDraft | null>(null);
  const [functionalExplanation, setFunctionalExplanation] = useState("");
  const [transparency, setTransparency] = useState<SingleWordTransparencyV0_1>("UNKNOWN_OR_NULL");

  const input = useMemo<SingleWordFunctionalMotivationInputV0_1>(() => ({
    targetWord,
    targetLanguage,
    targetDialect,
    segments,
    unresolvedConnectingMaterial,
    transformations,
    functionalExplanation,
    transparency,
  }), [targetWord, targetLanguage, targetDialect, segments, unresolvedConnectingMaterial, transformations, functionalExplanation, transparency]);
  const result = useMemo(() => buildSingleWordFunctionalMotivationProposalV0_1(input), [input]);
  const mechanicalDraftSnapshot = useMemo(() => JSON.stringify({ input, mechanicalOperations }), [input, mechanicalOperations]);
  const currentMechanicalResult = examinedMechanicalDraft?.snapshot === mechanicalDraftSnapshot
    ? examinedMechanicalDraft.result
    : null;
  const mechanicalResultIsStale = examinedMechanicalDraft !== null && currentMechanicalResult === null;
  const notSubmittedResult = useMemo(() => notSubmittedMechanicalInterpretationV0_1(
    targetWord,
    segments.map((segment) => segment.exactSpelling),
  ), [targetWord, segments]);

  function updateSegment(index: number, update: Partial<DraftSegment>) {
    if (
      selectedComponentSource?.componentIndex === index &&
      typeof update.exactSpelling === "string" &&
      update.exactSpelling !== selectedComponentSource.exactSpelling
    ) {
      setSelectedComponentSource(null);
    }
    setSegments((current) => current.map((segment, at) => at === index ? { ...segment, ...update } : segment));
  }

  function removeSegment(index: number) {
    setSelectedComponentSource(null);
    setSegments((current) => current.filter((_, at) => at !== index));
  }

  function updateTransformation(index: number, update: Partial<DraftTransformation>) {
    setTransformations((current) => current.map((item, at) => at === index ? { ...item, ...update } : item));
  }

  function updateMechanicalOperation(index: number, update: Partial<DraftMechanicalOperation>) {
    setMechanicalOperations((current) => current.map((item, at) => at === index ? { ...item, ...update } : item));
  }

  function moveMechanicalOperation(index: number, offset: -1 | 1) {
    setMechanicalOperations((current) => {
      const nextIndex = index + offset;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex]!, next[index]!];
      return next;
    });
  }

  function examineMechanicalDraft() {
    const examined = examineSingleWordMechanicalInterpretationV0_1({
      submitted: true,
      targetWord,
      componentSpellings: segments.map((segment) => segment.exactSpelling),
      operations: mechanicalOperations.map((operation) => ({
        ...operation,
        position: operation.position === "" ? Number.NaN : operation.position,
      })),
    });
    setExaminedMechanicalDraft({ snapshot: mechanicalDraftSnapshot, result: examined });
  }

  function clearInterpretation() {
    setTargetWord(initialTargetWord);
    setTargetLanguage("");
    setTargetDialect("");
    setSegments([blankSegment(), blankSegment()]);
    setSelectedComponentSource(null);
    setUnresolvedConnectingMaterial("");
    setTransformations([]);
    setMechanicalOperations([]);
    setExaminedMechanicalDraft(null);
    setFunctionalExplanation("");
    setTransparency("UNKNOWN_OR_NULL");
  }

  return (
    <section
      aria-label="Single-word functional motivation workbench"
      data-testid="single-word-motivation-workbench"
      className="rounded-[12px] border border-[#53604a] bg-[#111710] p-4"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b9cf8a]">
        SINGLE-WORD MOTIVATION WORKBENCH
      </div>
      <h2 className="mt-1 text-base font-semibold text-[#f5f7fb]">Propose components inside one word</h2>
      <p className="mt-1 max-w-3xl text-xs leading-5 text-[#aeb7c5]">
        This is a user-authored functional motivation proposal. Segment citations are entered by you and are not independently verified here; a proposed compound is not an attested compound or an embryo meaning.
      </p>
      <p className="mt-1 max-w-3xl text-xs leading-5 text-[#aeb7c5]">
        Keep component languages aligned with the target language; record dialect differences separately.
      </p>
      <p data-testid="single-word-motivation-field-limits" className="mt-1 max-w-4xl text-xs leading-5 text-[#aeb7c5]">
        Limits: target word 80 Unicode code points; target/component language and dialect 80 characters; component spelling 80, meaning 300, role 200; evidence references and connecting material 500; transformation endpoints 80, explanation 300, reference 500; functional explanation 1,000 characters. Use 2–12 components and at most 8 transformations.
      </p>

      <CurrentWordEvidenceSectionV0_1
        analyzedWord={initialTargetWord}
        draftTargetWord={targetWord}
        context={currentWordEvidence}
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          Exact target word
          <input aria-label="Exact target word" maxLength={80} className={inputClass} value={targetWord} onChange={(event) => setTargetWord(event.target.value)} />
        </label>
        <label className={labelClass}>
          Target language
          <input aria-label="Target language" maxLength={80} className={inputClass} value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)} placeholder="Language or code" />
        </label>
        <label className={labelClass}>
          Target dialect (optional)
          <input aria-label="Target dialect" maxLength={80} className={inputClass} value={targetDialect} onChange={(event) => setTargetDialect(event.target.value)} placeholder="Unknown / not specified" />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {segments.map((segment, index) => (
          <fieldset key={index} className="rounded-lg border border-[#354234] bg-[#0d1117] p-3">
            <legend className="px-1 text-xs font-semibold text-[#dce9ca]">Component {index + 1}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Exact component spelling
                <input aria-label={`Component ${index + 1} exact spelling`} maxLength={80} className={inputClass} value={segment.exactSpelling} onChange={(event) => updateSegment(index, { exactSpelling: event.target.value })} />
              </label>
              <label className={labelClass}>
                Proposed meaning
                <input aria-label={`Component ${index + 1} proposed meaning`} maxLength={300} className={inputClass} value={segment.proposedMeaning} onChange={(event) => updateSegment(index, { proposedMeaning: event.target.value })} disabled={segment.unresolved} />
              </label>
              <label className={labelClass}>
                Proposed grammatical role
                <input aria-label={`Component ${index + 1} grammatical role`} maxLength={200} className={inputClass} value={segment.proposedGrammaticalRole} onChange={(event) => updateSegment(index, { proposedGrammaticalRole: event.target.value })} disabled={segment.unresolved} />
              </label>
              <label className={labelClass}>
                Language
                <input aria-label={`Component ${index + 1} language`} maxLength={80} className={inputClass} value={segment.language} onChange={(event) => updateSegment(index, { language: event.target.value })} />
              </label>
              <label className={labelClass}>
                Dialect (optional)
                <input aria-label={`Component ${index + 1} dialect`} maxLength={80} className={inputClass} value={segment.dialect} onChange={(event) => updateSegment(index, { dialect: event.target.value })} />
              </label>
              <label className={labelClass}>
                Segment evidence status
                <select
                  aria-label={`Component ${index + 1} evidence status`}
                  className={inputClass}
                  value={segment.evidenceStatus}
                  onChange={(event) => updateSegment(index, { evidenceStatus: event.target.value as SingleWordSegmentEvidenceStatusV0_1 })}
                >
                  <option value="USER_PROPOSED">User proposed</option>
                  <option value="CITATION_ENTERED_UNVERIFIED">Citation entered; unverified</option>
                  <option value="UNKNOWN_OR_NULL">Unknown / Null</option>
                </select>
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Evidence source / citation locator
                <input aria-label={`Component ${index + 1} evidence reference`} maxLength={500} className={inputClass} value={segment.evidenceReference} onChange={(event) => updateSegment(index, { evidenceReference: event.target.value })} placeholder="URL, work and entry/sense locator, or leave blank" />
                <span className="mt-1 block text-[11px] leading-4 text-[#9fb1bf]">Up to 500 characters; required when evidence status is “Citation entered; unverified.”</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#c5ced8] sm:col-span-2">
                <input aria-label={`Component ${index + 1} not yet explained`} type="checkbox" checked={segment.unresolved} onChange={(event) => updateSegment(index, { unresolved: event.target.checked })} />
                Component not yet explained
              </label>
            </div>
            <button
              type="button"
              aria-label={"Check source for component " + (index + 1)}
              data-testid="single-word-component-source-check"
              className="mt-2 rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!segment.exactSpelling.trim()}
              onClick={() => setSelectedComponentSource({ componentIndex: index, exactSpelling: segment.exactSpelling })}
            >
              Check source
            </button>
            {selectedComponentSource?.componentIndex === index ? (
              <div data-testid="single-word-component-source-evidence" className="mt-3 rounded border border-[#46505c] bg-[#10131d] p-2">
                <p className="text-xs text-[#d5d9e8]">
                  <strong>Selected exact component spelling:</strong>{" "}
                  <span data-testid="single-word-component-source-spelling">{selectedComponentSource.exactSpelling}</span>
                </p>
                <p className="mt-1 text-xs text-[#aeb4ce]">
                  <strong>User-proposed meaning (as entered):</strong>{" "}
                  {segment.unresolved ? "UNKNOWN_OR_NULL" : segment.proposedMeaning || "UNKNOWN_OR_NULL"}. USER_PROPOSED.
                  This Albanian form lookup does not verify that meaning, the recorded language/dialect, or an exact sense alignment.
                </p>
                <p className="mt-1 text-xs text-[#aeb4ce]">
                  <strong>User-proposed grammatical role:</strong>{" "}
                  {segment.unresolved ? "UNKNOWN_OR_NULL" : segment.proposedGrammaticalRole || "UNKNOWN_OR_NULL"}. USER_PROPOSED.
                </p>
                <p className="mt-1 text-xs text-[#aeb4ce]">
                  <strong>Recorded language/dialect (as entered):</strong>{" "}
                  {segment.language || "UNKNOWN_OR_NULL"}{segment.dialect ? " · " + segment.dialect : ""}.
                </p>
                <FjaloriCrossSourceEvidenceV0_1
                  key={selectedComponentSource.componentIndex + ":" + selectedComponentSource.exactSpelling}
                  word={selectedComponentSource.exactSpelling}
                  context="component"
                  proposalMeaning={segment.unresolved ? "" : segment.proposedMeaning}
                  componentProposal={{
                    componentId: String(index),
                    exactSpelling: segment.exactSpelling,
                    proposedMeaning: segment.proposedMeaning,
                    proposedGrammaticalRole: segment.proposedGrammaticalRole,
                    language: segment.language,
                    dialect: segment.dialect,
                    unresolved: segment.unresolved,
                  }}
                />
              </div>
            ) : null}
            {segments.length > 2 ? (
              <button type="button" className="mt-2 rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca]" onClick={() => removeSegment(index)}>
                Remove component {index + 1}
              </button>
            ) : null}
          </fieldset>
        ))}
        <button type="button" data-testid="single-word-add-component" className="rounded border border-[#53604a] px-3 py-1.5 text-xs font-semibold text-[#dce9ca] hover:bg-[#1b2418]" onClick={() => setSegments((current) => [...current, blankSegment()])}>
          Add component
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          Unexplained connecting material or role
          <textarea aria-label="Unexplained connecting material" maxLength={500} className={inputClass} rows={2} value={unresolvedConnectingMaterial} onChange={(event) => setUnresolvedConnectingMaterial(event.target.value)} placeholder="Keep unexplained material explicit; do not repair it silently." />
        </label>
        <label className={labelClass}>
          Proposed functional explanation
          <textarea aria-label="Proposed functional explanation" maxLength={1000} className={inputClass} rows={2} value={functionalExplanation} onChange={(event) => setFunctionalExplanation(event.target.value)} placeholder="How might the proposed component meanings motivate the word's function?" />
          <span data-testid="single-word-functional-explanation-count" className="mt-1 block text-[11px] leading-4 text-[#9fb1bf]">{functionalExplanation.length}/1,000 characters · enter at least one character.</span>
        </label>
        <label className={labelClass}>
          Transparency description
          <select aria-label="Transparency description" className={inputClass} value={transparency} onChange={(event) => setTransparency(event.target.value as SingleWordTransparencyV0_1)}>
            <option value="UNKNOWN_OR_NULL">Unknown / Null</option>
            <option value="ATOMIC">Atomic</option>
            <option value="METAPHORICAL">Metaphorical</option>
            <option value="OPAQUE">Opaque</option>
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-lg border border-[#354234] bg-[#0d1117] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#dce9ca]">Declared transformations</div>
          <button type="button" data-testid="single-word-add-transformation" className="rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca] disabled:cursor-not-allowed disabled:opacity-50" disabled={transformations.length >= 8} onClick={() => setTransformations((current) => [...current, blankTransformation()])}>
            Add transformation
          </button>
        </div>
        {transformations.length ? transformations.map((transformation, index) => (
          <div key={index} className="mt-2 grid gap-2 sm:grid-cols-2">
            <label className={labelClass}>From<input aria-label={`Transformation ${index + 1} from`} maxLength={80} className={inputClass} value={transformation.from} onChange={(event) => updateTransformation(index, { from: event.target.value })} /></label>
            <label className={labelClass}>To<input aria-label={`Transformation ${index + 1} to`} maxLength={80} className={inputClass} value={transformation.to} onChange={(event) => updateTransformation(index, { to: event.target.value })} /></label>
            <label className={labelClass}>Explanation<input aria-label={`Transformation ${index + 1} explanation`} maxLength={300} className={inputClass} value={transformation.explanation} onChange={(event) => updateTransformation(index, { explanation: event.target.value })} /></label>
            <label className={labelClass}>Evidence reference (optional)<input aria-label={`Transformation ${index + 1} evidence reference`} maxLength={500} className={inputClass} value={transformation.evidenceReference} onChange={(event) => updateTransformation(index, { evidenceReference: event.target.value })} /></label>
            <div data-testid="single-word-transformation-unverified" className="flex flex-wrap items-center gap-2 text-xs text-[#d5c28f] sm:col-span-2">
              <span>User-declared, unverified; this transformation is recorded and never applied to make the spelling match.</span>
              <button type="button" aria-label={`Remove transformation ${index + 1}`} className="underline" onClick={() => setTransformations((current) => current.filter((_, at) => at !== index))}>Remove</button>
            </div>
          </div>
        )) : <p className="mt-2 text-xs text-[#9fb1bf]">None declared.</p>}
      </div>

      <section
        aria-label="Mechanical replay"
        data-testid="single-word-mechanical-replay"
        className="mt-4 rounded-lg border border-[#53604a] bg-[#0d1117] p-3"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#dce9ca]">Mechanical replay</h3>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-[#aeb7c5]">
              This separately replays only the exact edits you declare at zero-based Unicode code-point positions. It does not verify meaning, morphology, etymology, pronunciation, or a source relationship.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="single-word-examine-interpretation"
              className="rounded border border-[#82985d] bg-[#26311d] px-3 py-1.5 text-xs font-semibold text-[#f0f5e7]"
              onClick={examineMechanicalDraft}
            >
              Examine Interpretation
            </button>
            <button
              type="button"
              data-testid="single-word-clear-interpretation"
              className="rounded border border-[#53604a] px-3 py-1.5 text-xs text-[#dce9ca]"
              onClick={clearInterpretation}
            >
              Clear / reset interpretation
            </button>
          </div>
        </div>

        <div className="mt-3 rounded border border-[#303843] bg-[#10131d] p-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold text-[#dce9ca]">Explicit ordered mechanical operations</div>
            <button
              type="button"
              data-testid="single-word-add-mechanical-operation"
              className="rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={mechanicalOperations.length >= 8}
              onClick={() => setMechanicalOperations((current) => [...current, blankMechanicalOperation()])}
            >
              Add mechanical operation
            </button>
          </div>
          <p className="mt-1 text-[11px] leading-4 text-[#9fb1bf]">
            Position is measured in Unicode code points of the current intermediate spelling. Expected text must match exactly; a rejected edit stops the remaining sequence.
          </p>
          {mechanicalOperations.length ? mechanicalOperations.map((operation, index) => (
            <fieldset key={index} data-testid="single-word-mechanical-operation" className="mt-2 rounded border border-[#354234] p-2">
              <legend className="px-1 text-[11px] font-semibold text-[#dce9ca]">Operation {index + 1}</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <label className={labelClass}>
                  Operation type
                  <select
                    aria-label={`Mechanical operation ${index + 1} type`}
                    className={inputClass}
                    value={operation.kind}
                    onChange={(event) => {
                      const kind = event.target.value as MechanicalEditKindV0_1;
                      updateMechanicalOperation(index, {
                        kind,
                        expectedText: kind === "INSERT" ? "" : operation.expectedText,
                        replacementText: kind === "OMIT" ? "" : operation.replacementText,
                      });
                    }}
                  >
                    <option value="INSERT">Insert</option>
                    <option value="OMIT">Omit</option>
                    <option value="SUBSTITUTE">Substitute</option>
                  </select>
                </label>
                <label className={labelClass}>
                  Zero-based position
                  <input
                    aria-label={`Mechanical operation ${index + 1} position`}
                    type="number"
                    min={0}
                    step={1}
                    inputMode="numeric"
                    className={inputClass}
                    value={operation.position}
                    onChange={(event) => updateMechanicalOperation(index, {
                      position: event.target.value === "" ? "" : Number(event.target.value),
                    })}
                  />
                </label>
                {operation.kind !== "INSERT" ? (
                  <label className={labelClass}>
                    Exact expected text
                    <input
                      aria-label={`Mechanical operation ${index + 1} expected text`}
                      maxLength={80}
                      className={inputClass}
                      value={operation.expectedText}
                      onChange={(event) => updateMechanicalOperation(index, { expectedText: event.target.value })}
                    />
                  </label>
                ) : null}
                {operation.kind !== "OMIT" ? (
                  <label className={labelClass}>
                    Replacement text
                    <input
                      aria-label={`Mechanical operation ${index + 1} replacement text`}
                      maxLength={80}
                      className={inputClass}
                      value={operation.replacementText}
                      onChange={(event) => updateMechanicalOperation(index, { replacementText: event.target.value })}
                    />
                  </label>
                ) : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <button type="button" aria-label={`Move mechanical operation ${index + 1} up`} disabled={index === 0} className="underline disabled:opacity-40" onClick={() => moveMechanicalOperation(index, -1)}>Move up</button>
                <button type="button" aria-label={`Move mechanical operation ${index + 1} down`} disabled={index === mechanicalOperations.length - 1} className="underline disabled:opacity-40" onClick={() => moveMechanicalOperation(index, 1)}>Move down</button>
                <button type="button" aria-label={`Remove mechanical operation ${index + 1}`} className="underline text-[#f0c5b8]" onClick={() => setMechanicalOperations((current) => current.filter((_, at) => at !== index))}>Remove</button>
                <span className="text-[#d5c28f]">USER_DECLARED_UNVERIFIED · never treated as linguistic evidence</span>
              </div>
            </fieldset>
          )) : <p className="mt-2 text-xs text-[#9fb1bf]">No mechanical edits declared; Examine will compare the exact component concatenation as entered.</p>}
        </div>

        <div aria-live="polite" className="mt-3 rounded border border-[#303843] bg-[#10131d] p-3 text-xs leading-5 text-[#d7dde7]">
          {mechanicalResultIsStale ? (
            <p data-testid="single-word-mechanical-result-stale" className="mb-2 rounded border border-[#746541] bg-[#18140e] p-2 text-[#f0ddb0]">
              STALE — interpretation inputs changed after the last examination. The previous replay is hidden; examine the current draft to see a new result.
            </p>
          ) : null}
          {currentMechanicalResult ? (
            <div data-testid="single-word-mechanical-result" data-status={currentMechanicalResult.status}>
              <div><strong>Status:</strong> {currentMechanicalResult.status}</div>
              <div><strong>Exact target, unchanged:</strong> <span className="font-mono">{currentMechanicalResult.targetWord}</span></div>
              <div><strong>Raw component concatenation:</strong> <span className="font-mono">{currentMechanicalResult.rawConcatenation || "∅"}</span></div>
              <div><strong>Last valid intermediate:</strong> <span className="font-mono">{currentMechanicalResult.lastValidIntermediate || "∅"}</span></div>
              {currentMechanicalResult.status === "EXAMINED" ? (
                <>
                  <div><strong>Final mechanical spelling:</strong> <span className="font-mono">{currentMechanicalResult.finalMechanicalSpelling}</span></div>
                  <div><strong>Exact comparison:</strong> {currentMechanicalResult.exactComparison}</div>
                  <div><strong>NFC equivalence (separate from exact spelling):</strong> {currentMechanicalResult.nfcEquivalent === null ? "NOT_COMPUTED" : currentMechanicalResult.nfcEquivalent ? "YES" : "NO"}</div>
                </>
              ) : (
                <div className="text-[#f0ddb0]">No final mechanical spelling was produced. Review rejected operations before examining again.</div>
              )}
              {currentMechanicalResult.operationResults.length ? (
                <ol data-testid="single-word-mechanical-operation-ledger" className="mt-2 list-inside list-decimal space-y-1">
                  {currentMechanicalResult.operationResults.map((operation, index) => (
                    <li key={index}>
                      <span className="font-semibold">{operation.kind} @ {operation.position ?? "invalid"}: {operation.status}</span>
                      {operation.intermediateBefore !== null ? <span className="font-mono"> · {operation.intermediateBefore} → {operation.intermediateAfter ?? "not applied"}</span> : null}
                      {operation.reasonCodes.length ? <span> · {operation.reasonCodes.join(", ")}</span> : null}
                    </li>
                  ))}
                </ol>
              ) : null}
              {currentMechanicalResult.reasonCodes.length ? <div className="mt-2 text-[#f0ddb0]">Reason codes: {currentMechanicalResult.reasonCodes.join(", ")}</div> : null}
              {currentMechanicalResult.warnings.length ? (
                <ul data-testid="single-word-mechanical-warnings" className="mt-2 list-inside list-disc text-[#f0ddb0]">
                  {currentMechanicalResult.warnings.map((item, index) => <li key={`${item.code}:${index}`}>{item.code}: {item.message}</li>)}
                </ul>
              ) : <p className="mt-2 text-[#9fb1bf]">No digraph or Unicode warnings reported.</p>}
              <p className="mt-2 border-t border-[#303843] pt-2 text-[#d5c28f]">
                Mechanical spelling replay only · {currentMechanicalResult.authority} · linguistic validity {currentMechanicalResult.linguisticValidity}. This result does not establish a source fact, component meaning, derivation, historical origin, spoken Voice path, or functional operation.
              </p>
            </div>
          ) : (
            <div data-testid="single-word-mechanical-result" data-status="NOT_SUBMITTED">
              <div><strong>Status:</strong> {notSubmittedResult.status}</div>
              <div><strong>Exact target:</strong> <span className="font-mono">{notSubmittedResult.targetWord}</span></div>
              <div><strong>Current raw component concatenation:</strong> <span className="font-mono">{notSubmittedResult.rawConcatenation || "∅"}</span></div>
              <p className="mt-1 text-[#9fb1bf]">No mechanical interpretation has been submitted for examination. This is not a linguistic conclusion.</p>
            </div>
          )}
        </div>
      </section>

      <div className="mt-4" aria-live="polite">
        {result.status === "INVALID" ? (
          <div data-testid="single-word-proposal-incomplete" className="rounded border border-[#584c34] bg-[#18140e] p-3 text-xs leading-5 text-[#f0ddb0]">
            <p className="font-semibold">Correct these fields to see the proposal:</p>
            <ul data-testid="single-word-validation-messages" className="mt-1 list-inside list-disc">
              {result.reasonCodes.map((reasonCode) => (
                <li key={reasonCode}>{validationMessageForReasonCode(reasonCode)}</li>
              ))}
            </ul>
          </div>
        ) : (
          <article data-testid="single-word-proposal-result" className="rounded-lg border border-[#53604a] bg-[#111710] p-3 text-sm leading-6 text-[#d7dde7]">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="font-mono text-base text-white">{result.proposal.target.exactWord}</strong>
              <span>{result.proposal.target.language}{result.proposal.target.dialect ? ` · ${result.proposal.target.dialect}` : ""}</span>
              <span className="rounded-full border border-[#746541] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#f0ddb0]">PROPOSED</span>
            </div>
            <div className="mt-2 font-mono">{result.proposal.segments.map((segment) => segment.exactSpelling).join(" + ")} → {result.proposal.reconstruction.exactConcatenation}</div>
            <div>Target spelling: <span className="font-mono">{result.proposal.reconstruction.targetSpelling}</span> · {result.proposal.reconstruction.formComparison}</div>
            <div className="mt-2 space-y-1">
              {result.proposal.segments.map((segment, index) => (
                <div key={`${index}:${segment.exactSpelling}`} data-testid="single-word-proposal-segment">
                  <span className="font-mono">{segment.exactSpelling}</span> — {segment.proposedMeaning ?? "meaning Unknown / Null"} · role {segment.proposedGrammaticalRole ?? "Unknown / Null"} · {segment.language}{segment.dialect ? ` (${segment.dialect})` : ""} · {evidenceStatusLabel(segment.evidence.status)}{segment.evidence.sourceReference ? ` · ${segment.evidence.sourceReference}` : ""}
                  {segment.unresolved ? " · not yet explained" : ""}
                  {segment.evidence.status === "CITATION_ENTERED_UNVERIFIED" ? " · citation entered by user; not independently verified" : ""}
                </div>
              ))}
            </div>
            {result.proposal.unresolvedConnectingMaterial ? <div className="mt-2">Unexplained connecting material: {result.proposal.unresolvedConnectingMaterial}</div> : null}
            {result.proposal.declaredTransformations.map((transformation, index) => (
              <div key={index} className="mt-1 text-[#d5c28f]">
                Declared transform {transformation.from} → {transformation.to}: user-declared and unverified; not applied.
              </div>
            ))}
            <div className="mt-2"><strong>Functional motivation:</strong> {result.proposal.functionalMotivation.explanation} · {transparencyLabel(result.proposal.functionalMotivation.transparency)}</div>
            <div className="mt-1">Strict embryo meaning: <strong>Unknown / Null</strong> · compound attestation: not claimed · historical origin: not claimed.</div>
            <div className="mt-2 rounded border border-[#303843] bg-[#0b0f0c] p-2">
              <div className="font-semibold">Written Seven-Voices events</div>
              <div className="font-mono">{result.proposal.writtenStructure.status === "COMPLETE" ? result.proposal.writtenStructure.voicePath.join(" → ") || "∅" : "Unknown / Null"}</div>
              <div className="text-xs text-[#9fb1bf]">
                {result.proposal.writtenStructure.status === "COMPLETE"
                  ? `${result.proposal.writtenStructure.eventCount} events retained in order; source code-point positions ${result.proposal.writtenStructure.voiceEvents.map((event) => event.sourcePosition).join(", ") || "none"}.`
                  : `Structure unavailable: ${result.proposal.writtenStructure.reasonCode ?? "unknown"}.`}
                {" "}Orthographic only; pronunciation authority not established.
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
