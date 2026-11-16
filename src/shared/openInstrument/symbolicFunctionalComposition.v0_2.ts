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

export const SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_2 =
  "open-instrument.symbolic-functional-composition.v0_2" as const;

export type SymbolicVoiceOperatorCandidateV0_1 = Readonly<{
  candidateId: string;
  voice: SevenVoiceKey;
  operatorText: string;
  provenanceClass: "OWNER_SUPPLIED_PROVISIONAL_VOICE_OPERATOR_HYPOTHESIS";
  claimLayer: "EXPLORATORY_HYPOTHESIS";
  evidenceStatus: "USER_PROPOSED";
  sourceIds: readonly [];
  citationStatus: "NO_CITATION_ENTERED";
  historicalStatus: "NOT_CLAIMED";
}>;

function voiceOperator(voice: SevenVoiceKey, operatorText: string): SymbolicVoiceOperatorCandidateV0_1 {
  return Object.freeze({
    candidateId: `voice-${voice.toLowerCase()}:${operatorText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    voice,
    operatorText,
    provenanceClass: "OWNER_SUPPLIED_PROVISIONAL_VOICE_OPERATOR_HYPOTHESIS",
    claimLayer: "EXPLORATORY_HYPOTHESIS",
    evidenceStatus: "USER_PROPOSED",
    sourceIds: [] as const,
    citationStatus: "NO_CITATION_ENTERED",
    historicalStatus: "NOT_CLAIMED",
  });
}

/** Separate research hypotheses; canonical Voice identity and trait data remain intact. */
export const SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_1: readonly SymbolicVoiceOperatorCandidateV0_1[] =
  Object.freeze([
    voiceOperator("A", "INITIATE / GROUND"),
    voiceOperator("E", "EXPAND / OUTWARD"),
    voiceOperator("I", "SPECIFY / FOCUS"),
    voiceOperator("O", "CONTAIN / ENCLOSE"),
    voiceOperator("U", "DEEPEN / NOURISH"),
    voiceOperator("Y", "PROBE / REFLECT"),
    voiceOperator("Ë", "CLOSE / NEUTRALIZE"),
  ]);

export type SymbolicCompositionTemplatePartV0_2 =
  | Readonly<{ kind: "literal"; text: string }>
  | Readonly<{ kind: "symbol"; symbolId: string }>
  | Readonly<{ kind: "target_concept" }>;

type SymbolicOperationBaseV0_2 = Readonly<{
  operationId: string;
  dependsOn: readonly string[];
}>;

export type SymbolicCompositionOperationV0_2 =
  | (SymbolicOperationBaseV0_2 & Readonly<{
      kind: "SELECT_SPECTRUM_CANDIDATE";
      occurrenceId: string;
      associationCandidateId: string;
      outputSymbolId: string;
    }>)
  | (SymbolicOperationBaseV0_2 & Readonly<{
      kind: "APPLY_VOICE_OPERATOR";
      voice: SevenVoiceKey;
      position: number;
      operatorCandidateId: string;
      outputSymbolId: string;
    }>)
  | (SymbolicOperationBaseV0_2 & Readonly<{
      kind: "CONNECT_SYMBOLS";
      leftSymbolId: string;
      rightSymbolId: string;
      relationText: string;
      outputRelationId: string;
    }>)
  | (SymbolicOperationBaseV0_2 & Readonly<{
      kind: "REPRESENT_SYMBOLIC_TRANSFORMATION";
      relationIds: readonly string[];
      transformationLabel: string;
      outputTransformationId: string;
    }>)
  | (SymbolicOperationBaseV0_2 & Readonly<{
      kind: "EXPRESS_RESULT";
      transformationId: string;
      template: readonly SymbolicCompositionTemplatePartV0_2[];
      outputExpressionId: string;
    }>);

export type SymbolicFunctionalCompositionInputV0_2 = Readonly<{
  target: Readonly<{
    exactSpelling: string;
    language: string;
    variety: string;
    wholeWordConcept: string;
  }>;
  operations: readonly SymbolicCompositionOperationV0_2[];
  /** Kept as a separate source-aware layer; it is never used as operator evidence. */
  sourceFunctionLayer?: SymbolicFunctionalContentResultV0_1;
}>;

export type SymbolicFunctionalCompositionFailureV0_2 = Readonly<{
  ok: false;
  schemaVersion: typeof SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_2;
  reasonCodes: readonly string[];
}>;

type SpectrumOccurrenceV0_2 = Readonly<{
  occurrenceId: string;
  unit: string;
  exactText: string;
  span: Readonly<{ start: number; end: number }>;
  associationCandidates: readonly EmbriomorphemeAssociationV0_1[];
  selectedAssociationIds: readonly string[];
  status: "SELECTED_HYPOTHESIS" | "UNKNOWN_OR_NULL";
}>;

type VoiceEventV0_2 = Readonly<{
  voice: SevenVowel;
  position: number;
  character: string;
  canonicalIdentity: SevenVoiceKey;
  existingTraitTableLabel: string;
  operatorCandidates: readonly SymbolicVoiceOperatorCandidateV0_1[];
  selectedOperator: SymbolicVoiceOperatorCandidateV0_1 | null;
  status: "SELECTED_HYPOTHESIS" | "UNKNOWN_OR_NULL";
}>;

type SymbolNodeV0_2 = Readonly<{
  symbolId: string;
  symbolKind: "SPECTRUM_ASSOCIATION" | "VOICE_OPERATOR";
  text: string;
  unit?: string;
  span?: Readonly<{ start: number; end: number }>;
  voice?: SevenVoiceKey;
  position?: number;
}>;

type RelationV0_2 = Readonly<{
  relationId: string;
  leftSymbolId: string;
  rightSymbolId: string;
  relationText: string;
  rendered: string;
}>;

export type SymbolicFunctionalCompositionSuccessV0_2 = Readonly<{
  ok: true;
  schemaVersion: typeof SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_2;
  target: Readonly<{
    exactSpelling: string;
    language: string;
    variety: string;
    codePoints: readonly Readonly<{ character: string; position: number }> [];
    writtenVoices: readonly Readonly<{ voice: SevenVowel; position: number }> [];
    representationAuthority: "ORTHOGRAPHIC";
    pronunciationAuthority: "NOT_ESTABLISHED";
  }>;
  spectrumOccurrences: readonly SpectrumOccurrenceV0_2[];
  unmatchedLetterSpans: readonly Readonly<{ exactText: string; span: Readonly<{ start: number; end: number }>; reason: "NO_SPECTRUM_UNIT_MATCH" }> [];
  voiceEvents: readonly VoiceEventV0_2[];
  operationTrace: readonly Readonly<{
    operationId: string;
    kind: SymbolicCompositionOperationV0_2["kind"];
    dependsOn: readonly string[];
    status: "COMPUTED" | "PARTIAL_NULL";
    contribution: string | null;
    reasonCodes: readonly string[];
    claimLayer: "EXPLORATORY_HYPOTHESIS";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
  }> [];
  symbolicComposition: Readonly<{
    status: "COMPLETE_PROPOSED" | "MULTIPLE_PROPOSED" | "PARTIAL_NULL";
    transformationText: string | null;
    expression: string | null;
    transformationAlternatives: readonly Readonly<{ id: string; text: string }>[];
    proposedExpressions: readonly Readonly<{ id: string; text: string }>[];
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

export type SymbolicFunctionalCompositionResultV0_2 =
  | SymbolicFunctionalCompositionFailureV0_2
  | SymbolicFunctionalCompositionSuccessV0_2;

export function spectrumOccurrenceIdV0_2(unit: string, start: number, end: number): string {
  return `spectrum:${unit}@${start}-${end}`;
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
    return voice && isSevenVoiceKey(voice) ? [{ voice, position, character }] : [];
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
      occurrenceId: spectrumOccurrenceIdV0_2(unit, position, end),
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
export function buildSymbolicFunctionalCompositionV0_2(
  input: SymbolicFunctionalCompositionInputV0_2,
): SymbolicFunctionalCompositionResultV0_2 {
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
      schemaVersion: SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_2,
      reasonCodes: sortedUnique(reasons),
    };
  }

  const target = readTarget(exactSpelling);
  const occurrenceById = new Map(target.occurrences.map((occurrence) => [occurrence.occurrenceId, occurrence]));
  const voiceByPosition = new Map(target.voiceEvents.map((event) => [event.position, event]));
  const operationIds = new Set<string>();
  const symbols = new Map<string, SymbolNodeV0_2>();
  const symbolProducers = new Map<string, string>();
  const selectedAssociationsByOccurrence = new Map<string, string[]>();
  const relations = new Map<string, RelationV0_2>();
  const relationProducers = new Map<string, string>();
  const transformations = new Map<string, { text: string; producer: string }>();
  const expressions: Array<{ id: string; text: string }> = [];
  const expressionIds = new Set<string>();
  const trace: Array<{
    operationId: string;
    kind: SymbolicCompositionOperationV0_2["kind"];
    dependsOn: readonly string[];
    status: "COMPUTED" | "PARTIAL_NULL";
    contribution: string | null;
    reasonCodes: readonly string[];
    claimLayer: "EXPLORATORY_HYPOTHESIS";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
  }> = [];

  const addTrace = (
    operation: SymbolicCompositionOperationV0_2,
    contribution: string | null,
    operationReasons: readonly string[] = [],
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
          const symbol: SymbolNodeV0_2 = {
            symbolId: operation.outputSymbolId,
            symbolKind: "SPECTRUM_ASSOCIATION",
            text: candidate.association,
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
        const event = voiceByPosition.get(operation.position);
        const candidate = SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_1.find(({ candidateId }) => candidateId === operation.operatorCandidateId);
        if (!event || asVoice(event.voice) !== operation.voice) {
          operationReasons.push(`VOICE_OPERATOR_NOT_BOUND_TO_TARGET_EVENT:${operation.voice}@${operation.position}`);
        }
        if (!candidate) operationReasons.push(`VOICE_OPERATOR_CANDIDATE_NOT_FOUND:${operation.operatorCandidateId}`);
        if (candidate && candidate.voice !== operation.voice) operationReasons.push(`VOICE_OPERATOR_CANDIDATE_MISMATCH:${operation.operatorCandidateId}`);
        if (!operation.outputSymbolId.trim()) operationReasons.push(`SYMBOL_OUTPUT_ID_REQUIRED:${operation.operationId}`);
        if (symbols.has(operation.outputSymbolId)) operationReasons.push(`SYMBOL_IDS_MUST_BE_UNIQUE:${operation.outputSymbolId}`);
        if (event && candidate && operationReasons.length === 0) {
          const symbol: SymbolNodeV0_2 = {
            symbolId: operation.outputSymbolId,
            symbolKind: "VOICE_OPERATOR",
            text: candidate.operatorText,
            voice: operation.voice,
            position: operation.position,
          };
          symbols.set(symbol.symbolId, symbol);
          symbolProducers.set(symbol.symbolId, operation.operationId);
          addTrace(operation, `${event.voice}@${event.position} applies proposed operator “${candidate.operatorText}” (trait table: ${manifestTrait(operation.voice).zhejiFunctionalRole}).`);
        } else {
          addTrace(operation, null, operationReasons);
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
          const relation: RelationV0_2 = {
            relationId: operation.outputRelationId,
            leftSymbolId: left.symbolId,
            rightSymbolId: right.symbolId,
            relationText: operation.relationText,
            rendered: `${left.text} ${operation.relationText} ${right.text}`,
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
        if (operation.relationIds.length === 0) operationReasons.push(`TRANSFORMATION_REQUIRES_RELATIONS:${operation.operationId}`);
        if (!unique(operation.relationIds)) operationReasons.push(`TRANSFORMATION_RELATIONS_MUST_BE_UNIQUE:${operation.operationId}`);
        if (selectedRelations.some((relation) => !relation)) operationReasons.push(`TRANSFORMATION_RELATION_UNAVAILABLE:${operation.operationId}`);
        if (!operation.transformationLabel.trim()) operationReasons.push(`TRANSFORMATION_LABEL_REQUIRED:${operation.operationId}`);
        if (!operation.outputTransformationId.trim()) operationReasons.push(`TRANSFORMATION_OUTPUT_ID_REQUIRED:${operation.operationId}`);
        for (const relationId of operation.relationIds) {
          const producer = relationProducers.get(relationId);
          if (producer && !operation.dependsOn.includes(producer)) operationReasons.push(`RELATION_PRODUCER_DEPENDENCY_REQUIRED:${operation.operationId}:${producer}`);
        }
        if (transformations.has(operation.outputTransformationId)) operationReasons.push(`TRANSFORMATION_IDS_MUST_BE_UNIQUE:${operation.outputTransformationId}`);
        if (selectedRelations.every(Boolean) && operationReasons.length === 0) {
          const text = `${operation.transformationLabel}: ${(selectedRelations as RelationV0_2[]).map(({ rendered }) => rendered).join(" → ")}`;
          transformations.set(operation.outputTransformationId, { text, producer: operation.operationId });
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
        const renderedParts = operation.template.map((part) => {
          if (part.kind === "literal") return part.text;
          if (part.kind === "target_concept") return input.target.wholeWordConcept;
          const symbol = symbols.get(part.symbolId);
          if (!symbol) {
            operationReasons.push(`EXPRESSION_SYMBOL_UNAVAILABLE:${part.symbolId}`);
            return null;
          }
          const producer = symbolProducers.get(part.symbolId);
          if (producer && !operation.dependsOn.includes(producer)) {
            operationReasons.push(`EXPRESSION_SYMBOL_DEPENDENCY_REQUIRED:${operation.operationId}:${producer}`);
          }
          return symbol.text;
        });
        if (!operation.outputExpressionId.trim()) operationReasons.push(`EXPRESSION_OUTPUT_ID_REQUIRED:${operation.operationId}`);
        if (expressionIds.has(operation.outputExpressionId)) operationReasons.push(`EXPRESSION_IDS_MUST_BE_UNIQUE:${operation.outputExpressionId}`);
        if (renderedParts.some((part) => part === null) || operationReasons.length > 0) {
          addTrace(operation, null, operationReasons);
        } else {
          const expression = renderedParts.join("");
          expressions.push({ id: operation.outputExpressionId, text: expression });
          expressionIds.add(operation.outputExpressionId);
          addTrace(operation, expression);
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
    const applied = symbolsHasVoiceEvent(symbols, event.position, asVoice(event.voice));
    if (!applied) reasons.push(`VOICE_OPERATOR_MISSING:${event.voice}@${event.position}`);
  }
  for (const span of target.unmatchedLetterSpans) reasons.push(`UNMATCHED_SPECTRUM_UNIT:${span.exactText}@${span.span.start}`);
  if (expressions.length === 0) reasons.push("PROPOSED_RESULT_EXPRESSION_UNAVAILABLE");

  const finalReasons = sortedUnique(reasons);
  const transformationAlternatives = [...transformations.entries()].map(([id, value]) => ({ id, text: value.text }));
  const transformationText = transformationAlternatives.length === 1 ? transformationAlternatives[0]?.text ?? null : null;
  const hasPartialResult = finalReasons.length > 0 || expressions.length === 0;
  const compositionStatus = hasPartialResult
    ? "PARTIAL_NULL" as const
    : expressions.length > 1
      ? "MULTIPLE_PROPOSED" as const
      : "COMPLETE_PROPOSED" as const;
  const selectedVoiceEvents = new Map<number, SymbolicVoiceOperatorCandidateV0_1>();
  for (const symbol of symbols.values()) {
    if (symbol.symbolKind === "VOICE_OPERATOR" && symbol.position !== undefined && symbol.voice) {
      const operator = SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_1.find(({ voice, operatorText }) =>
        voice === symbol.voice && operatorText === symbol.text,
      );
      if (operator) selectedVoiceEvents.set(symbol.position, operator);
    }
  }
  const spectrumOccurrences: SpectrumOccurrenceV0_2[] = target.occurrences.map((occurrence) => ({
    ...occurrence,
    selectedAssociationIds: selectedAssociationsByOccurrence.get(occurrence.occurrenceId) ?? [],
    status: (selectedAssociationsByOccurrence.get(occurrence.occurrenceId) ?? []).length > 0
      ? "SELECTED_HYPOTHESIS"
      : "UNKNOWN_OR_NULL",
  }));
  const voiceEvents: VoiceEventV0_2[] = target.voiceEvents.map(({ voice, position, character }) => ({
    voice,
    position,
    character,
    canonicalIdentity: asVoice(voice),
    existingTraitTableLabel: manifestTrait(asVoice(voice)).zhejiFunctionalRole,
    operatorCandidates: SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_1.filter((candidate) => candidate.voice === voice),
    selectedOperator: selectedVoiceEvents.get(position) ?? null,
    status: selectedVoiceEvents.has(position) ? "SELECTED_HYPOTHESIS" : "UNKNOWN_OR_NULL",
  }));

  return {
    ok: true,
    schemaVersion: SYMBOLIC_FUNCTIONAL_COMPOSITION_SCHEMA_V0_2,
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
    operationTrace: trace,
    symbolicComposition: {
      status: compositionStatus,
      transformationText,
      expression: compositionStatus === "COMPLETE_PROPOSED" ? expressions[0]?.text ?? null : null,
      transformationAlternatives,
      proposedExpressions: expressions,
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

function symbolsHasVoiceEvent(
  symbols: ReadonlyMap<string, SymbolNodeV0_2>,
  position: number,
  voice: SevenVoiceKey,
): boolean {
  return [...symbols.values()].some((symbol) => symbol.symbolKind === "VOICE_OPERATOR" &&
    symbol.position === position && symbol.voice === voice);
}
