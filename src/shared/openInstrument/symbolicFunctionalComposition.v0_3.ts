import { manifestTrait } from "@/core/sevenVowelsTraits";
import type { Vowel } from "@/core/sevenVowelsCore";
import { extractSevenVowelsFromString, type SevenVowel } from "@/shared/math7.core";
import {
  EMBRIOMORPHEME_SPECTRUM_V0_1,
  TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1,
  getEmbriomorphemeAssociationV0_1,
  type EmbriomorphemeAssociationV0_1,
} from "@/shared/openInstrument/embriomorphemeSpectrum.v0_1";
import type { SymbolicFunctionalContentResultV0_1 } from "@/shared/openInstrument/symbolicFunctionalContentEngine.v0_1";
import { isSevenVoiceKey, type SevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";

export const SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_3 =
  "open-instrument.symbolic-functional-composition.v0_3" as const;

export type SymbolicVoiceOperatorCandidateV0_3 = Readonly<{
  candidateId: string;
  voice: SevenVoiceKey;
  operatorText: string;
  applicationPattern: string;
  provenanceClass: "OWNER_SUPPLIED_PROVISIONAL_VOICE_OPERATOR_HYPOTHESIS";
  claimLayer: "EXPLORATORY_HYPOTHESIS";
  evidenceStatus: "USER_PROPOSED";
  sourceIds: readonly [];
  citationStatus: "NO_CITATION_ENTERED";
  historicalStatus: "NOT_CLAIMED";
}>;

function voiceOperator(
  voice: SevenVoiceKey,
  operatorText: string,
  applicationPattern: string,
): SymbolicVoiceOperatorCandidateV0_3 {
  return Object.freeze({
    candidateId: `voice-${voice.toLowerCase()}:${operatorText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    voice,
    operatorText,
    applicationPattern,
    provenanceClass: "OWNER_SUPPLIED_PROVISIONAL_VOICE_OPERATOR_HYPOTHESIS",
    claimLayer: "EXPLORATORY_HYPOTHESIS",
    evidenceStatus: "USER_PROPOSED",
    sourceIds: [] as const,
    citationStatus: "NO_CITATION_ENTERED",
    historicalStatus: "NOT_CLAIMED",
  });
}

/** Separate research hypotheses; canonical Voice identity and trait data remain intact. */
export const SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_3: readonly SymbolicVoiceOperatorCandidateV0_3[] =
  Object.freeze([
    voiceOperator("A", "INITIATE / GROUND", "initiated({operand})"),
    voiceOperator("E", "EXPAND / OUTWARD", "expanded({operand})"),
    voiceOperator("I", "SPECIFY / FOCUS", "focused({operand})"),
    voiceOperator("O", "CONTAIN / ENCLOSE", "contained({operand})"),
    voiceOperator("U", "DEEPEN / NOURISH", "deepened({operand})"),
    voiceOperator("Y", "PROBE / REFLECT", "reflected({operand})"),
    voiceOperator("Ë", "CLOSE / NEUTRALIZE", "closed({operand})"),
  ]);

export type SymbolicSymbolProvenanceV0_3 = Readonly<{
  claimLayer: "EXPLORATORY_HYPOTHESIS";
  evidenceStatus: "USER_PROPOSED";
  sourceIds: readonly string[];
  spectrumCandidateIds: readonly string[];
  voiceApplications: readonly Readonly<{
    operatorCandidateId: string;
    voiceEventId: string;
    inputSymbolId: string;
    inputText: string;
    operatorText: string;
    applicationPattern: string;
    provenanceClass: "OWNER_SUPPLIED_PROVISIONAL_VOICE_OPERATOR_HYPOTHESIS";
    claimLayer: "EXPLORATORY_HYPOTHESIS";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
    citationStatus: "NO_CITATION_ENTERED";
    historicalStatus: "NOT_CLAIMED";
  }>[];
}>;

type SymbolicOperationBaseV0_3 = Readonly<{
  operationId: string;
  dependsOn: readonly string[];
}>;

export type SymbolicCompositionOperationV0_3 =
  | (SymbolicOperationBaseV0_3 & Readonly<{
      kind: "SELECT_SPECTRUM_CANDIDATE";
      occurrenceId: string;
      associationCandidateId: string;
      outputSymbolId: string;
    }>)
  | (SymbolicOperationBaseV0_3 & Readonly<{
      kind: "APPLY_VOICE_OPERATOR";
      voice: SevenVoiceKey;
      position: number;
      voiceEventId: string;
      operatorCandidateId: string;
      inputSymbolId: string;
      outputSymbolId: string;
    }>)
  | (SymbolicOperationBaseV0_3 & Readonly<{
      kind: "CONNECT_SYMBOLS";
      leftSymbolId: string;
      rightSymbolId: string;
      relationText: string;
      outputRelationId: string;
    }>)
  | (SymbolicOperationBaseV0_3 & Readonly<{
      kind: "REPRESENT_SYMBOLIC_TRANSFORMATION";
      relationIds: readonly string[];
      transformationLabel: string;
      outputTransformationId: string;
    }>)
  | (SymbolicOperationBaseV0_3 & Readonly<{
      kind: "EXPRESS_RESULT";
      transformationId: string;
      outputExpressionId: string;
      userProposedParaphrase?: string;
    }>);

export type SymbolicFunctionalCompositionInputV0_3 = Readonly<{
  target: Readonly<{
    exactSpelling: string;
    language: string;
    variety: string;
    wholeWordConcept: string;
  }>;
  operations: readonly SymbolicCompositionOperationV0_3[];
  /** Kept as a separate source-aware layer; it is never used as operator evidence. */
  sourceFunctionLayer?: SymbolicFunctionalContentResultV0_1;
}>;

export type SymbolicFunctionalCompositionFailureV0_3 = Readonly<{
  ok: false;
  schemaVersion: typeof SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_3;
  reasonCodes: readonly string[];
}>;

type SpectrumOccurrenceV0_3 = Readonly<{
  occurrenceId: string;
  unit: string;
  exactText: string;
  span: Readonly<{ start: number; end: number }>;
  associationCandidates: readonly EmbriomorphemeAssociationV0_1[];
  selectedAssociationIds: readonly string[];
  status: "SELECTED_HYPOTHESIS" | "UNKNOWN_OR_NULL";
}>;

type VoiceEventV0_3 = Readonly<{
  eventId: string;
  voice: SevenVowel;
  position: number;
  character: string;
  canonicalIdentity: SevenVoiceKey;
  existingTraitTableLabel: string;
  operatorCandidates: readonly SymbolicVoiceOperatorCandidateV0_3[];
  selectedOperator: SymbolicVoiceOperatorCandidateV0_3 | null;
  appliedOperationIds: readonly string[];
  status: "SELECTED_HYPOTHESIS" | "UNKNOWN_OR_NULL";
}>;

type SymbolNodeV0_3 = Readonly<{
  symbolId: string;
  symbolKind: "SPECTRUM_ASSOCIATION" | "VOICE_TRANSFORM";
  text: string;
  provenance: SymbolicSymbolProvenanceV0_3;
  unit?: string;
  span?: Readonly<{ start: number; end: number }>;
  voice?: SevenVoiceKey;
  position?: number;
  inputSymbolId?: string;
  operatorCandidateId?: string;
  voiceEventId?: string;
}>;

type RelationV0_3 = Readonly<{
  relationId: string;
  leftSymbolId: string;
  rightSymbolId: string;
  relationText: string;
  rendered: string;
  claimLayer: "USER_PROPOSAL";
  evidenceStatus: "USER_PROPOSED";
  sourceIds: readonly [];
}>;

type TransformationV0_3 = Readonly<{
  label: string;
  text: string;
  producer: string;
  relationIds: readonly string[];
  symbolIds: readonly string[];
  voiceOperatorOutputIds: readonly string[];
}>;

type ProposedExpressionV0_3 = Readonly<{
  id: string;
  text: string;
  claimLayer: "EXPLORATORY_HYPOTHESIS";
  evidenceStatus: "USER_PROPOSED";
  sourceIds: readonly [];
  userProposedParaphrase: Readonly<{
    text: string;
    claimLayer: "USER_PROPOSED_PARAPHRASE";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
  }> | null;
}>;

export type SymbolicFunctionalCompositionSuccessV0_3 = Readonly<{
  ok: true;
  schemaVersion: typeof SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_3;
  target: Readonly<{
    exactSpelling: string;
    language: string;
    variety: string;
    codePoints: readonly Readonly<{ character: string; position: number }> [];
    writtenVoices: readonly Readonly<{ voice: SevenVowel; position: number }> [];
    representationAuthority: "ORTHOGRAPHIC";
    pronunciationAuthority: "NOT_ESTABLISHED";
  }>;
  spectrumOccurrences: readonly SpectrumOccurrenceV0_3[];
  unmatchedLetterSpans: readonly Readonly<{ exactText: string; span: Readonly<{ start: number; end: number }>; reason: "NO_SPECTRUM_UNIT_MATCH" }> [];
  voiceEvents: readonly VoiceEventV0_3[];
  symbols: readonly SymbolNodeV0_3[];
  relations: readonly RelationV0_3[];
  operationTrace: readonly Readonly<{
    operationId: string;
    kind: SymbolicCompositionOperationV0_3["kind"];
    dependsOn: readonly string[];
    status: "COMPUTED" | "PARTIAL_NULL";
    contribution: string | null;
    reasonCodes: readonly string[];
    claimLayer: "EXPLORATORY_HYPOTHESIS";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
    inputSymbolId: string | null;
    outputSymbolId: string | null;
    targetVoiceEventId: string | null;
    operatorCandidateId: string | null;
    operandProvenance: SymbolicSymbolProvenanceV0_3 | null;
    operatorProvenance: Readonly<{
      candidateId: string;
      operatorText: string;
      applicationPattern: string;
      provenanceClass: "OWNER_SUPPLIED_PROVISIONAL_VOICE_OPERATOR_HYPOTHESIS";
      claimLayer: "EXPLORATORY_HYPOTHESIS";
      evidenceStatus: "USER_PROPOSED";
      sourceIds: readonly [];
      citationStatus: "NO_CITATION_ENTERED";
      historicalStatus: "NOT_CLAIMED";
    }> | null;
  }> [];
  symbolicComposition: Readonly<{
    status: "COMPLETE_PROPOSED" | "MULTIPLE_PROPOSED" | "PARTIAL_NULL";
    transformationText: string | null;
    expression: string | null;
    transformationAlternatives: readonly Readonly<{ id: string; text: string }>[];
    proposedExpressions: readonly ProposedExpressionV0_3[];
    userProposedParaphrases: readonly Readonly<{
      expressionId: string;
      text: string;
      claimLayer: "USER_PROPOSED_PARAPHRASE";
      evidenceStatus: "USER_PROPOSED";
      sourceIds: readonly [];
    }>[];
    wholeWordConcept: Readonly<{
      text: string;
      claimLayer: "EXPLORATORY_HYPOTHESIS";
      evidenceStatus: "USER_PROPOSED";
      sourceIds: readonly [];
    }>;
    reasonCodes: readonly string[];
    claimLayer: "EXPLORATORY_HYPOTHESIS";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
  }>;
  sourceFunctionLayer: SymbolicFunctionalContentResultV0_1 | null;
  interpretationSelection: Readonly<{
    mode: "no_single_winner";
    selectedCandidateId: null;
    userDecisionPosture: "user_decides";
  }>;
  sourceAuthorityPromotion: "NONE";
  productionAuthority: "NONE";
  historicalOrigin: "NOT_CLAIMED";
  directPetroZhejiFidelity: "NOT_ESTABLISHED";
}>;

export type SymbolicFunctionalCompositionResultV0_3 =
  | SymbolicFunctionalCompositionFailureV0_3
  | SymbolicFunctionalCompositionSuccessV0_3;

export function spectrumOccurrenceIdV0_3(unit: string, start: number, end: number): string {
  return `spectrum:${unit}@${start}-${end}`;
}

export function voiceEventIdV0_3(voice: SevenVoiceKey, position: number): string {
  return `voice:${voice}@${position}`;
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function readTarget(exactSpelling: string) {
  const codePoints = Array.from(exactSpelling);
  const voiceEvents = codePoints.flatMap((character, position) => {
    const voice = extractSevenVowelsFromString(character)[0];
    return voice && isSevenVoiceKey(voice)
      ? [{ voice, position, character, eventId: voiceEventIdV0_3(voice, position) }]
      : [];
  });
  const voicePositions = new Set(voiceEvents.map(({ position }) => position));
  const units = [
    ...EMBRIOMORPHEME_SPECTRUM_V0_1.map(({ unit }) => unit),
    ...new Set(TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1.map(({ unit }) => unit)),
  ].sort((left, right) => Array.from(right).length - Array.from(left).length || left.localeCompare(right));
  const occurrences: Array<{
    occurrenceId: string;
    unit: string;
    exactText: string;
    span: { start: number; end: number };
    associationCandidates: readonly EmbriomorphemeAssociationV0_1[];
    selectedAssociationIds: string[];
    status: "SELECTED_HYPOTHESIS" | "UNKNOWN_OR_NULL";
  }> = [];
  const unmatchedLetterSpans: Array<{ exactText: string; span: { start: number; end: number }; reason: "NO_SPECTRUM_UNIT_MATCH" }> = [];

  for (let position = 0; position < codePoints.length;) {
    if (voicePositions.has(position) || !/^\p{L}$/u.test(codePoints[position] ?? "")) {
      position += 1;
      continue;
    }
    const unit = units.find((candidate) => {
      const candidatePoints = Array.from(candidate);
      return candidatePoints.every((point, offset) => codePoints[position + offset]?.toUpperCase() === point);
    });
    if (!unit) {
      unmatchedLetterSpans.push({
        exactText: codePoints[position] ?? "",
        span: { start: position, end: position + 1 },
        reason: "NO_SPECTRUM_UNIT_MATCH",
      });
      position += 1;
      continue;
    }
    const end = position + Array.from(unit).length;
    occurrences.push({
      occurrenceId: spectrumOccurrenceIdV0_3(unit, position, end),
      unit,
      exactText: codePoints.slice(position, end).join(""),
      span: { start: position, end },
      associationCandidates: unit === "Ç"
        ? TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1
        : getUnitCandidates(unit),
      selectedAssociationIds: [],
      status: "UNKNOWN_OR_NULL",
    });
    position = end;
  }
  return { codePoints, voiceEvents, occurrences, unmatchedLetterSpans };
}

function getUnitCandidates(unit: string): readonly EmbriomorphemeAssociationV0_1[] {
  return EMBRIOMORPHEME_SPECTRUM_V0_1.find((entry) => entry.unit === unit)?.associations ?? [];
}

function asVoice(value: SevenVowel): SevenVoiceKey {
  return value as Vowel;
}

/** Deterministically evaluates only the user-selected symbolic operations. */
export function buildSymbolicFunctionalCompositionV0_3(
  input: SymbolicFunctionalCompositionInputV0_3,
): SymbolicFunctionalCompositionResultV0_3 {
  const reasons: string[] = [];
  const exactSpelling = input?.target?.exactSpelling;
  if (typeof exactSpelling !== "string" || exactSpelling.length === 0) reasons.push("TARGET_EXACT_SPELLING_REQUIRED");
  if (!input?.target?.language?.trim() || !input?.target?.variety?.trim()) reasons.push("TARGET_LANGUAGE_AND_VARIETY_REQUIRED");
  if (!input?.target?.wholeWordConcept?.trim()) reasons.push("USER_PROPOSED_WHOLE_WORD_CONCEPT_REQUIRED");
  if (input?.sourceFunctionLayer?.ok && input.sourceFunctionLayer.content.target.exactSpelling !== exactSpelling) {
    reasons.push("SOURCE_FUNCTION_LAYER_TARGET_MISMATCH");
  }
  if (reasons.length > 0 || typeof exactSpelling !== "string") {
    return {
      ok: false,
      schemaVersion: SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_3,
      reasonCodes: sortedUnique(reasons),
    };
  }

  const target = readTarget(exactSpelling);
  const occurrenceById = new Map(target.occurrences.map((occurrence) => [occurrence.occurrenceId, occurrence]));
  const voiceById = new Map(target.voiceEvents.map((event) => [event.eventId, event]));
  const operationIds = new Set<string>();
  const symbols = new Map<string, SymbolNodeV0_3>();
  const symbolProducers = new Map<string, string>();
  const selectedAssociationsByOccurrence = new Map<string, string[]>();
  const relations = new Map<string, RelationV0_3>();
  const relationProducers = new Map<string, string>();
  const transformations = new Map<string, TransformationV0_3>();
  const expressions: ProposedExpressionV0_3[] = [];
  const voiceApplications = new Map<string, Array<{ operationId: string; candidate: SymbolicVoiceOperatorCandidateV0_3 }>>();
  const expressionIds = new Set<string>();
  const trace: Array<{
    operationId: string;
    kind: SymbolicCompositionOperationV0_3["kind"];
    dependsOn: readonly string[];
    status: "COMPUTED" | "PARTIAL_NULL";
    contribution: string | null;
    reasonCodes: readonly string[];
    claimLayer: "EXPLORATORY_HYPOTHESIS";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
    inputSymbolId: string | null;
    outputSymbolId: string | null;
    targetVoiceEventId: string | null;
    operatorCandidateId: string | null;
    operandProvenance: SymbolicSymbolProvenanceV0_3 | null;
    operatorProvenance: {
      candidateId: string;
      operatorText: string;
      applicationPattern: string;
      provenanceClass: "OWNER_SUPPLIED_PROVISIONAL_VOICE_OPERATOR_HYPOTHESIS";
      claimLayer: "EXPLORATORY_HYPOTHESIS";
      evidenceStatus: "USER_PROPOSED";
      sourceIds: readonly [];
      citationStatus: "NO_CITATION_ENTERED";
      historicalStatus: "NOT_CLAIMED";
    } | null;
  }> = [];

  type TraceDetails = Partial<Pick<(typeof trace)[number],
    "inputSymbolId" | "outputSymbolId" | "targetVoiceEventId" | "operatorCandidateId" |
    "operandProvenance" | "operatorProvenance"
  >>;

  const addTrace = (
    operation: SymbolicCompositionOperationV0_3,
    contribution: string | null,
    operationReasons: readonly string[] = [],
    details: TraceDetails = {},
  ) => {
    const codes = sortedUnique(operationReasons);
    trace.push({
      operationId: operation.operationId,
      kind: operation.kind,
      dependsOn: [...operation.dependsOn],
      status: codes.length === 0 && contribution !== null ? "COMPUTED" : "PARTIAL_NULL",
      contribution,
      reasonCodes: codes,
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
      inputSymbolId: null,
      outputSymbolId: null,
      targetVoiceEventId: null,
      operatorCandidateId: null,
      operandProvenance: null,
      operatorProvenance: null,
      ...details,
    });
    reasons.push(...codes);
  };

  for (const operation of input.operations ?? []) {
    const operationReasons: string[] = [];
    if (!operation.operationId || operationIds.has(operation.operationId)) {
      operationReasons.push("OPERATION_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    }
    if (!unique(operation.dependsOn)) operationReasons.push(`DEPENDENCIES_MUST_BE_UNIQUE:${operation.operationId}`);
    for (const dependency of operation.dependsOn) {
      if (!operationIds.has(dependency)) operationReasons.push(`DEPENDENCY_MUST_PRECEDE_OPERATION:${operation.operationId}:${dependency}`);
    }
    if (operation.operationId) operationIds.add(operation.operationId);
    if (operationReasons.length > 0) {
      addTrace(operation, null, operationReasons);
      continue;
    }

    switch (operation.kind) {
      case "SELECT_SPECTRUM_CANDIDATE": {
        const occurrence = occurrenceById.get(operation.occurrenceId);
        const candidate = getEmbriomorphemeAssociationV0_1(operation.associationCandidateId);
        if (!occurrence) operationReasons.push(`SPECTRUM_OCCURRENCE_NOT_FOUND:${operation.occurrenceId}`);
        if (!candidate) operationReasons.push(`SPECTRUM_CANDIDATE_NOT_FOUND:${operation.associationCandidateId}`);
        if (occurrence && candidate && occurrence.unit !== candidate.unit) {
          operationReasons.push(`SPECTRUM_CANDIDATE_UNIT_MISMATCH:${candidate.candidateId}`);
        }
        if (occurrence && (selectedAssociationsByOccurrence.get(occurrence.occurrenceId) ?? []).includes(candidate?.candidateId ?? "")) {
          operationReasons.push(`SPECTRUM_CANDIDATE_ALREADY_SELECTED:${candidate?.candidateId ?? ""}`);
        }
        if (!operation.outputSymbolId.trim()) operationReasons.push(`SYMBOL_OUTPUT_ID_REQUIRED:${operation.operationId}`);
        if (symbols.has(operation.outputSymbolId)) operationReasons.push(`SYMBOL_IDS_MUST_BE_UNIQUE:${operation.outputSymbolId}`);
        if (occurrence && candidate && operationReasons.length === 0) {
          selectedAssociationsByOccurrence.set(occurrence.occurrenceId, [
            ...(selectedAssociationsByOccurrence.get(occurrence.occurrenceId) ?? []),
            candidate.candidateId,
          ]);
          const symbol: SymbolNodeV0_3 = {
            symbolId: operation.outputSymbolId,
            symbolKind: "SPECTRUM_ASSOCIATION",
            text: candidate.association,
            provenance: {
              claimLayer: "EXPLORATORY_HYPOTHESIS",
              evidenceStatus: "USER_PROPOSED",
              sourceIds: [],
              spectrumCandidateIds: [candidate.candidateId],
              voiceApplications: [],
            },
            unit: occurrence.unit,
            span: occurrence.span,
          };
          symbols.set(symbol.symbolId, symbol);
          symbolProducers.set(symbol.symbolId, operation.operationId);
          addTrace(operation, `${occurrence.exactText}@${occurrence.span.start}-${occurrence.span.end} selects “${candidate.association}”.`);
        } else {
          addTrace(operation, null, operationReasons);
        }
        break;
      }
      case "APPLY_VOICE_OPERATOR": {
        const event = voiceById.get(operation.voiceEventId);
        const candidate = SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_3.find(({ candidateId }) => candidateId === operation.operatorCandidateId);
        const operand = symbols.get(operation.inputSymbolId);
        const operandProducer = symbolProducers.get(operation.inputSymbolId);
        if (!event || asVoice(event.voice) !== operation.voice || event.position !== operation.position) {
          operationReasons.push(`VOICE_OPERATOR_NOT_BOUND_TO_TARGET_EVENT:${operation.voice}@${operation.position}:${operation.voiceEventId}`);
        }
        if (!candidate) operationReasons.push(`VOICE_OPERATOR_CANDIDATE_NOT_FOUND:${operation.operatorCandidateId}`);
        if (candidate && candidate.voice !== operation.voice) operationReasons.push(`VOICE_OPERATOR_CANDIDATE_MISMATCH:${operation.operatorCandidateId}`);
        if (!operand) operationReasons.push(`VOICE_OPERATOR_INPUT_SYMBOL_UNAVAILABLE:${operation.inputSymbolId}`);
        if (operandProducer && !operation.dependsOn.includes(operandProducer)) {
          operationReasons.push(`SYMBOL_PRODUCER_DEPENDENCY_REQUIRED:${operation.operationId}:${operandProducer}`);
        }
        if (!operation.outputSymbolId.trim()) operationReasons.push(`SYMBOL_OUTPUT_ID_REQUIRED:${operation.operationId}`);
        if (symbols.has(operation.outputSymbolId)) operationReasons.push(`SYMBOL_IDS_MUST_BE_UNIQUE:${operation.outputSymbolId}`);
        if (event && candidate && operand && operationReasons.length === 0) {
          const transformedText = candidate.applicationPattern.replaceAll("{operand}", operand.text);
          const voiceApplication = {
            operatorCandidateId: candidate.candidateId,
            voiceEventId: event.eventId,
            inputSymbolId: operand.symbolId,
            inputText: operand.text,
            operatorText: candidate.operatorText,
            applicationPattern: candidate.applicationPattern,
            provenanceClass: candidate.provenanceClass,
            claimLayer: candidate.claimLayer,
            evidenceStatus: candidate.evidenceStatus,
            sourceIds: candidate.sourceIds,
            citationStatus: candidate.citationStatus,
            historicalStatus: candidate.historicalStatus,
          };
          const symbol: SymbolNodeV0_3 = {
            symbolId: operation.outputSymbolId,
            symbolKind: "VOICE_TRANSFORM",
            text: transformedText,
            provenance: {
              claimLayer: "EXPLORATORY_HYPOTHESIS",
              evidenceStatus: "USER_PROPOSED",
              sourceIds: [...operand.provenance.sourceIds],
              spectrumCandidateIds: [...operand.provenance.spectrumCandidateIds],
              voiceApplications: [...operand.provenance.voiceApplications, voiceApplication],
            },
            voice: operation.voice,
            position: operation.position,
            inputSymbolId: operand.symbolId,
            operatorCandidateId: candidate.candidateId,
            voiceEventId: event.eventId,
          };
          symbols.set(symbol.symbolId, symbol);
          symbolProducers.set(symbol.symbolId, operation.operationId);
          voiceApplications.set(event.eventId, [
            ...(voiceApplications.get(event.eventId) ?? []),
            { operationId: operation.operationId, candidate },
          ]);
          addTrace(
            operation,
            `${candidate.operatorText}(${operand.text}) → ${transformedText}`,
            [],
            {
              inputSymbolId: operand.symbolId,
              outputSymbolId: symbol.symbolId,
              targetVoiceEventId: event.eventId,
              operatorCandidateId: candidate.candidateId,
              operandProvenance: operand.provenance,
              operatorProvenance: {
                candidateId: candidate.candidateId,
                operatorText: candidate.operatorText,
                applicationPattern: candidate.applicationPattern,
                provenanceClass: candidate.provenanceClass,
                claimLayer: candidate.claimLayer,
                evidenceStatus: candidate.evidenceStatus,
                sourceIds: candidate.sourceIds,
                citationStatus: candidate.citationStatus,
                historicalStatus: candidate.historicalStatus,
              },
            },
          );
        } else {
          addTrace(operation, null, operationReasons, {
            inputSymbolId: operation.inputSymbolId,
            outputSymbolId: operation.outputSymbolId,
            targetVoiceEventId: operation.voiceEventId,
            operatorCandidateId: operation.operatorCandidateId,
            operandProvenance: operand?.provenance ?? null,
            operatorProvenance: candidate ? {
              candidateId: candidate.candidateId,
              operatorText: candidate.operatorText,
              applicationPattern: candidate.applicationPattern,
              provenanceClass: candidate.provenanceClass,
              claimLayer: candidate.claimLayer,
              evidenceStatus: candidate.evidenceStatus,
              sourceIds: candidate.sourceIds,
              citationStatus: candidate.citationStatus,
              historicalStatus: candidate.historicalStatus,
            } : null,
          });
        }
        break;
      }
      case "CONNECT_SYMBOLS": {
        const left = symbols.get(operation.leftSymbolId);
        const right = symbols.get(operation.rightSymbolId);
        const requiredProducers = [symbolProducers.get(operation.leftSymbolId), symbolProducers.get(operation.rightSymbolId)].filter(Boolean) as string[];
        if (!left || !right) operationReasons.push(`CONNECT_SYMBOL_INPUT_UNAVAILABLE:${operation.leftSymbolId}:${operation.rightSymbolId}`);
        for (const producer of requiredProducers) {
          if (!operation.dependsOn.includes(producer)) operationReasons.push(`SYMBOL_PRODUCER_DEPENDENCY_REQUIRED:${operation.operationId}:${producer}`);
        }
        if (!operation.relationText.trim()) operationReasons.push(`RELATION_TEXT_REQUIRED:${operation.operationId}`);
        if (!operation.outputRelationId.trim()) operationReasons.push(`RELATION_OUTPUT_ID_REQUIRED:${operation.operationId}`);
        if (relations.has(operation.outputRelationId)) operationReasons.push(`RELATION_IDS_MUST_BE_UNIQUE:${operation.outputRelationId}`);
        if (left && right && operationReasons.length === 0) {
          const relation: RelationV0_3 = {
            relationId: operation.outputRelationId,
            leftSymbolId: left.symbolId,
            rightSymbolId: right.symbolId,
            relationText: operation.relationText,
            rendered: `${left.text} ${operation.relationText} ${right.text}`,
            claimLayer: "USER_PROPOSAL",
            evidenceStatus: "USER_PROPOSED",
            sourceIds: [],
          };
          relations.set(relation.relationId, relation);
          relationProducers.set(relation.relationId, operation.operationId);
          addTrace(operation, relation.rendered);
        } else {
          addTrace(operation, null, operationReasons);
        }
        break;
      }
      case "REPRESENT_SYMBOLIC_TRANSFORMATION": {
        const selectedRelations = operation.relationIds.map((relationId) => relations.get(relationId));
        const availableRelations = selectedRelations.filter((relation): relation is RelationV0_3 => Boolean(relation));
        if (operation.relationIds.length === 0) operationReasons.push(`TRANSFORMATION_REQUIRES_RELATIONS:${operation.operationId}`);
        if (!unique(operation.relationIds)) operationReasons.push(`TRANSFORMATION_RELATIONS_MUST_BE_UNIQUE:${operation.operationId}`);
        if (selectedRelations.some((relation) => !relation)) operationReasons.push(`TRANSFORMATION_RELATION_UNAVAILABLE:${operation.operationId}`);
        if (!operation.transformationLabel.trim()) operationReasons.push(`TRANSFORMATION_LABEL_REQUIRED:${operation.operationId}`);
        if (!operation.outputTransformationId.trim()) operationReasons.push(`TRANSFORMATION_OUTPUT_ID_REQUIRED:${operation.operationId}`);
        for (const relationId of operation.relationIds) {
          const producer = relationProducers.get(relationId);
          if (producer && !operation.dependsOn.includes(producer)) operationReasons.push(`RELATION_PRODUCER_DEPENDENCY_REQUIRED:${operation.operationId}:${producer}`);
        }
        for (let index = 1; index < availableRelations.length; index += 1) {
          if (availableRelations[index - 1]?.rightSymbolId !== availableRelations[index]?.leftSymbolId) {
            operationReasons.push(`TRANSFORMATION_GRAPH_DISCONNECTED:${operation.operationId}:${index}`);
          }
        }
        const graphSymbolIds = [...new Set(availableRelations.flatMap(({ leftSymbolId, rightSymbolId }) => [leftSymbolId, rightSymbolId]))];
        const graphSymbols = graphSymbolIds.map((symbolId) => symbols.get(symbolId)).filter((symbol): symbol is SymbolNodeV0_3 => Boolean(symbol));
        const appliedVoiceOutputs = graphSymbols.filter(({ symbolKind }) => symbolKind === "VOICE_TRANSFORM");
        if (appliedVoiceOutputs.length === 0) operationReasons.push(`TRANSFORMATION_REQUIRES_APPLIED_VOICE_RESULT:${operation.operationId}`);
        for (const symbol of symbols.values()) {
          if ((symbol.symbolKind === "SPECTRUM_ASSOCIATION" || symbol.symbolKind === "VOICE_TRANSFORM") && !graphSymbolIds.includes(symbol.symbolId)) {
            operationReasons.push(`TRANSFORMATION_GRAPH_SYMBOL_DISCONNECTED:${operation.operationId}:${symbol.symbolId}`);
          }
        }
        if (transformations.has(operation.outputTransformationId)) operationReasons.push(`TRANSFORMATION_IDS_MUST_BE_UNIQUE:${operation.outputTransformationId}`);
        if (selectedRelations.every(Boolean) && operationReasons.length === 0) {
          const text = availableRelations.map(({ rendered }) => rendered).join(" → ");
          const transformation: TransformationV0_3 = {
            label: operation.transformationLabel,
            text,
            producer: operation.operationId,
            relationIds: [...operation.relationIds],
            symbolIds: graphSymbolIds,
            voiceOperatorOutputIds: appliedVoiceOutputs.map(({ symbolId }) => symbolId),
          };
          transformations.set(operation.outputTransformationId, transformation);
          addTrace(operation, text);
        } else {
          addTrace(operation, null, operationReasons);
        }
        break;
      }
      case "EXPRESS_RESULT": {
        const transformation = transformations.get(operation.transformationId);
        if (!transformation) operationReasons.push(`RESULT_TRANSFORMATION_UNAVAILABLE:${operation.transformationId}`);
        else if (!operation.dependsOn.includes(transformation.producer)) {
          operationReasons.push(`TRANSFORMATION_PRODUCER_DEPENDENCY_REQUIRED:${operation.operationId}:${transformation.producer}`);
        }
        if (transformation && transformation.voiceOperatorOutputIds.length === 0) {
          operationReasons.push(`RESULT_REQUIRES_APPLIED_VOICE_TRANSFORMATION:${operation.transformationId}`);
        }
        if (!operation.outputExpressionId.trim()) operationReasons.push(`EXPRESSION_OUTPUT_ID_REQUIRED:${operation.operationId}`);
        if (expressionIds.has(operation.outputExpressionId)) operationReasons.push(`EXPRESSION_IDS_MUST_BE_UNIQUE:${operation.outputExpressionId}`);
        if (operationReasons.length > 0 || !transformation) {
          addTrace(operation, null, operationReasons);
        } else {
          const expression = `${transformation.text}; proposed target concept: “${input.target.wholeWordConcept}”.`;
          const paraphrase = operation.userProposedParaphrase?.trim();
          expressions.push({
            id: operation.outputExpressionId,
            text: expression,
            claimLayer: "EXPLORATORY_HYPOTHESIS",
            evidenceStatus: "USER_PROPOSED",
            sourceIds: [],
            userProposedParaphrase: paraphrase ? {
              text: paraphrase,
              claimLayer: "USER_PROPOSED_PARAPHRASE",
              evidenceStatus: "USER_PROPOSED",
              sourceIds: [],
            } : null,
          });
          expressionIds.add(operation.outputExpressionId);
          addTrace(operation, expression, [], { outputSymbolId: operation.outputExpressionId });
        }
        break;
      }
    }
  }

  for (const occurrence of target.occurrences) {
    if ((selectedAssociationsByOccurrence.get(occurrence.occurrenceId) ?? []).length === 0) {
      reasons.push(`SPECTRUM_ASSOCIATION_MISSING:${occurrence.occurrenceId}`);
    }
  }
  for (const event of target.voiceEvents) {
    const applied = (voiceApplications.get(event.eventId) ?? []).length > 0;
    if (!applied) reasons.push(`VOICE_OPERATOR_MISSING:${event.voice}@${event.position}`);
  }
  for (const span of target.unmatchedLetterSpans) reasons.push(`UNMATCHED_SPECTRUM_UNIT:${span.exactText}@${span.span.start}`);
  if (expressions.length === 0) reasons.push("PROPOSED_RESULT_EXPRESSION_UNAVAILABLE");

  const finalReasons = sortedUnique(reasons);
  const transformationAlternatives = [...transformations.entries()].map(([id, value]) => ({ id, text: value.text }));
  const userProposedParaphrases = (input.operations ?? []).flatMap((operation) => {
    if (operation.kind !== "EXPRESS_RESULT") return [];
    const text = operation.userProposedParaphrase?.trim();
    return text ? [{
      expressionId: operation.outputExpressionId,
      text,
      claimLayer: "USER_PROPOSED_PARAPHRASE" as const,
      evidenceStatus: "USER_PROPOSED" as const,
      sourceIds: [] as const,
    }] : [];
  });
  const transformationText = transformationAlternatives.length === 1 ? transformationAlternatives[0]?.text ?? null : null;
  const hasPartialResult = finalReasons.length > 0 || expressions.length === 0;
  const compositionStatus = hasPartialResult
    ? "PARTIAL_NULL" as const
    : expressions.length > 1
      ? "MULTIPLE_PROPOSED" as const
      : "COMPLETE_PROPOSED" as const;
  const selectedVoiceEvents = new Map<string, SymbolicVoiceOperatorCandidateV0_3>();
  for (const [eventId, applications] of voiceApplications) {
    const candidateIds = sortedUnique(applications.map(({ candidate }) => candidate.candidateId));
    if (candidateIds.length === 1) selectedVoiceEvents.set(eventId, applications[0]!.candidate);
  }
  const spectrumOccurrences: SpectrumOccurrenceV0_3[] = target.occurrences.map((occurrence) => ({
    ...occurrence,
    selectedAssociationIds: selectedAssociationsByOccurrence.get(occurrence.occurrenceId) ?? [],
    status: (selectedAssociationsByOccurrence.get(occurrence.occurrenceId) ?? []).length > 0
      ? "SELECTED_HYPOTHESIS"
      : "UNKNOWN_OR_NULL",
  }));
  const voiceEvents: VoiceEventV0_3[] = target.voiceEvents.map(({ voice, position, character, eventId }) => ({
    eventId,
    voice,
    position,
    character,
    canonicalIdentity: asVoice(voice),
    existingTraitTableLabel: manifestTrait(asVoice(voice)).zhejiFunctionalRole,
    operatorCandidates: SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_3.filter((candidate) => candidate.voice === voice),
    selectedOperator: selectedVoiceEvents.get(eventId) ?? null,
    appliedOperationIds: (voiceApplications.get(eventId) ?? []).map(({ operationId }) => operationId),
    status: (voiceApplications.get(eventId) ?? []).length > 0 ? "SELECTED_HYPOTHESIS" : "UNKNOWN_OR_NULL",
  }));

  return {
    ok: true,
    schemaVersion: SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_3,
    target: {
      exactSpelling,
      language: input.target.language,
      variety: input.target.variety,
      codePoints: target.codePoints.map((character, position) => ({ character, position })),
      writtenVoices: target.voiceEvents.map(({ voice, position }) => ({ voice, position })),
      representationAuthority: "ORTHOGRAPHIC",
      pronunciationAuthority: "NOT_ESTABLISHED",
    },
    spectrumOccurrences,
    unmatchedLetterSpans: target.unmatchedLetterSpans,
    voiceEvents,
    symbols: [...symbols.values()],
    relations: [...relations.values()],
    operationTrace: trace,
    symbolicComposition: {
      status: compositionStatus,
      transformationText,
      expression: compositionStatus === "COMPLETE_PROPOSED" ? expressions[0]?.text ?? null : null,
      transformationAlternatives,
      proposedExpressions: expressions,
      userProposedParaphrases,
      wholeWordConcept: {
        text: input.target.wholeWordConcept,
        claimLayer: "EXPLORATORY_HYPOTHESIS",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      },
      reasonCodes: finalReasons,
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
    },
    sourceFunctionLayer: input.sourceFunctionLayer ?? null,
    interpretationSelection: {
      mode: "no_single_winner",
      selectedCandidateId: null,
      userDecisionPosture: "user_decides",
    },
    sourceAuthorityPromotion: "NONE",
    productionAuthority: "NONE",
    historicalOrigin: "NOT_CLAIMED",
    directPetroZhejiFidelity: "NOT_ESTABLISHED",
  };
}
