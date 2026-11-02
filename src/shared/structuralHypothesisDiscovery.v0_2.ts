import {
  extractSevenVowelsFromString,
  type SevenVowel,
} from "./math7.core";
import {
  discoverStructuralHypothesesV0_1,
  type StructuralHypothesisV0_1,
  type StructuralReductionOperationIdV0_1,
} from "./structuralHypothesisDiscovery.v0_1";

// v0.1 remains the hash-bound structural contract used by frozen research.
// This additive successor preserves its candidate results and attaches a
// source-positioned, lossless component ledger to every emitted hypothesis.

export type StructuralVoiceEventV0_2 = {
  eventId: string;
  order: number;
  voice: SevenVowel;
  basisPosition: number;
  sourceCharacter: string;
  sourcePosition: number;
  sourcePositionUnit: "unicode_code_point_in_nfc_input";
  sourceSpan: { start: number; end: number };
  provenance: "caller_supplied_orthography";
  mappingSource: "math7.core.extractSevenVowelsFromString";
  representationAuthority: "orthographic";
  pronunciationAuthority: "not_established";
};

export type AlbanianOrthographicGraphemeV0_2 = {
  graphemeId: string;
  grapheme: string;
  graphemeKind: "single_letter" | "digraph";
  basisSpan: { start: number; end: number };
  sourceSpan: { start: number; end: number };
  sourcePositions: number[];
  sourcePositionUnit: "unicode_code_point_in_nfc_input";
};

export type StructuralComponentV0_2 = {
  componentId: string;
  parentComponentId: string | null;
  childComponentIds: string[];
  componentKind: "whole_input" | "retained_component" | "extracted_component";
  operationId: StructuralReductionOperationIdV0_1 | null;
  form: string;
  basisSpan: { start: number; end: number };
  sourceSpan: { start: number; end: number };
  sourcePositions: number[];
  sourceCharacters: string[];
  sourcePositionUnit: "unicode_code_point_in_nfc_input";
  graphemeIds: string[];
  frameStatus: "contains_voice_event" | "consonantal_frame";
  voiceEvents: StructuralVoiceEventV0_2[];
  claimBoundary: "structural_component_only";
  lexicalAttestation: "not_evaluated";
  meaning: null;
};

export type StructuralDecompositionV0_2 = {
  decompositionVersion: "z-zero.structural-decomposition.v0_2";
  inputForm: string;
  normalizedBasis: string;
  basisPositionUnit: "unicode_code_point_in_normalized_basis";
  sourcePositionUnit: "unicode_code_point_in_nfc_input";
  inputVoiceEvents: StructuralVoiceEventV0_2[];
  inputGraphemes: AlbanianOrthographicGraphemeV0_2[];
  components: StructuralComponentV0_2[];
  terminalComponentIds: string[];
  reconstructedBasis: string;
  conservation: {
    status: "complete";
    inputEventIds: string[];
    terminalEventIds: string[];
    inputGraphemeIds: string[];
    terminalGraphemeIds: string[];
    eventOrderPreserved: true;
    graphemeOrderPreserved: true;
    noDigraphSplit: true;
    noEventsAdded: true;
    noEventsDropped: true;
    normalizedBasisReconstructed: true;
  };
  pronunciationAuthority: "not_established";
  historicalOriginClaim: "not_claimed";
};

export type StructuralHypothesisWithConservationV0_2 =
  StructuralHypothesisV0_1 & {
    losslessDecomposition: StructuralDecompositionV0_2;
  };

export type StructuralInputAnalysisV0_2 = {
  analysisVersion: "z-zero.structural-input-analysis.v0_2";
  inputForm: string;
  normalizedBasis: string;
  analysisStatus:
    | "analyzed"
    | "empty_or_unsupported_input"
    | "structural_form_too_long"
    | "conservation_validation_failed";
  inputVoiceEvents: StructuralVoiceEventV0_2[];
  inputGraphemes: AlbanianOrthographicGraphemeV0_2[];
  excludedHypotheses: Array<{
    hypothesisId: string;
    reasonCode: "albanian_digraph_boundary_split";
    digraph: string;
    splitBasisPosition: number;
    splitSourcePosition: number;
  }>;
  inputVoiceEventCount: number | null;
  basisPositionUnit: "unicode_code_point_in_normalized_basis";
  sourcePositionUnit: "unicode_code_point_in_nfc_input";
  inputVoiceSequenceStatus:
    | "complete"
    | "not_emitted_form_limit"
    | "unavailable_unsupported_input"
    | "unavailable_validation_failure";
  pronunciationAuthority: "not_established";
  hypotheses: StructuralHypothesisWithConservationV0_2[];
};

type NormalizedInputV0_2 = {
  inputForm: string;
  basis: string;
  sourcePositions: number[];
  sourceCharacters: string[];
  graphemes: AlbanianOrthographicGraphemeV0_2[];
};

const MAX_STRUCTURAL_FORM_LENGTH_V0_2 = 80;
const ALBANIAN_DIGRAPHS_V0_2 = new Set([
  "dh",
  "gj",
  "ll",
  "nj",
  "rr",
  "sh",
  "th",
  "xh",
  "zh",
]);

function segmentAlbanianGraphemesV0_2(
  basis: string,
  sourcePositions: readonly number[],
): AlbanianOrthographicGraphemeV0_2[] {
  const characters = Array.from(basis);
  const graphemes: AlbanianOrthographicGraphemeV0_2[] = [];

  for (let index = 0; index < characters.length;) {
    const firstPosition = sourcePositions[index];
    if (firstPosition === undefined) return [];

    const pair = `${characters[index] ?? ""}${characters[index + 1] ?? ""}`;
    const secondPosition = sourcePositions[index + 1];
    const isDigraph =
      ALBANIAN_DIGRAPHS_V0_2.has(pair) &&
      secondPosition === firstPosition + 1;
    const end = index + (isDigraph ? 2 : 1);
    const positions = sourcePositions.slice(index, end);
    const lastPosition = positions.at(-1);
    if (lastPosition === undefined) return [];

    graphemes.push({
      graphemeId: `grapheme-${graphemes.length + 1}`,
      grapheme: characters.slice(index, end).join(""),
      graphemeKind: isDigraph ? "digraph" : "single_letter",
      basisSpan: { start: index, end },
      sourceSpan: { start: firstPosition, end: lastPosition + 1 },
      sourcePositions: [...positions],
      sourcePositionUnit: "unicode_code_point_in_nfc_input",
    });
    index = end;
  }

  return graphemes;
}

function normalizeInputV0_2(value: unknown): NormalizedInputV0_2 {
  const inputForm = String(value ?? "").normalize("NFC");
  const trimmedForm = inputForm.trim();
  const raw = trimmedForm.toLocaleLowerCase("en-US");
  const hasUnsupportedUnicodeLetter = Array.from(raw).some(
    (symbol) =>
      /[\p{L}\p{M}]/u.test(symbol) &&
      !/[a-zçë]/u.test(symbol),
  );

  if (hasUnsupportedUnicodeLetter) {
    return {
      inputForm,
      basis: "",
      sourcePositions: [],
      sourceCharacters: [],
      graphemes: [],
    };
  }

  const leadingTrimLength = inputForm.length - inputForm.trimStart().length;
  const sourceOffset = Array.from(inputForm.slice(0, leadingTrimLength)).length;
  const basis: string[] = [];
  const sourcePositions: number[] = [];
  const sourceCharacters: string[] = [];

  Array.from(trimmedForm).forEach((sourceCharacter, index) => {
    const normalizedCharacter = sourceCharacter.toLocaleLowerCase("en-US");
    if (!/^[a-zçë]$/u.test(normalizedCharacter)) return;
    basis.push(normalizedCharacter);
    sourcePositions.push(sourceOffset + index);
    sourceCharacters.push(sourceCharacter);
  });

  const normalizedBasis = basis.join("");
  return {
    inputForm,
    basis: normalizedBasis,
    sourcePositions,
    sourceCharacters,
    graphemes: segmentAlbanianGraphemesV0_2(normalizedBasis, sourcePositions),
  };
}

function voiceEventsV0_2(
  normalized: NormalizedInputV0_2,
): StructuralVoiceEventV0_2[] | null {
  const events: StructuralVoiceEventV0_2[] = [];

  for (const [basisPosition, character] of Array.from(normalized.basis).entries()) {
    const voice = extractSevenVowelsFromString(character)[0];
    if (!voice) continue;

    const sourcePosition = normalized.sourcePositions[basisPosition];
    const sourceCharacter = normalized.sourceCharacters[basisPosition];
    if (sourcePosition === undefined || sourceCharacter === undefined) return null;

    events.push({
      eventId: `voice-event-${events.length + 1}`,
      order: events.length + 1,
      voice,
      basisPosition,
      sourceCharacter,
      sourcePosition,
      sourcePositionUnit: "unicode_code_point_in_nfc_input",
      sourceSpan: { start: sourcePosition, end: sourcePosition + 1 },
      provenance: "caller_supplied_orthography",
      mappingSource: "math7.core.extractSevenVowelsFromString",
      representationAuthority: "orthographic",
      pronunciationAuthority: "not_established",
    });
  }

  const expectedVoicePath = extractSevenVowelsFromString(normalized.basis);
  return JSON.stringify(events.map((event) => event.voice)) ===
    JSON.stringify(expectedVoicePath)
    ? events
    : null;
}

function decompositionV0_2(
  normalized: NormalizedInputV0_2,
  inputVoiceEvents: readonly StructuralVoiceEventV0_2[],
  hypothesis: StructuralHypothesisV0_1,
): StructuralDecompositionV0_2 | null {
  const basisCharacters = Array.from(normalized.basis);
  const componentSource = (start: number, end: number) => {
    const validBoundaries = new Set([0, basisCharacters.length]);
    for (const grapheme of normalized.graphemes) {
      validBoundaries.add(grapheme.basisSpan.start);
      validBoundaries.add(grapheme.basisSpan.end);
    }
    if (!validBoundaries.has(start) || !validBoundaries.has(end)) return null;

    const sourcePositions = normalized.sourcePositions.slice(start, end);
    const sourceCharacters = normalized.sourceCharacters.slice(start, end);
    const first = sourcePositions[0];
    const last = sourcePositions.at(-1);
    if (first === undefined || last === undefined) return null;
    return {
      sourceSpan: { start: first, end: last + 1 },
      sourcePositions,
      sourceCharacters,
    };
  };

  const makeComponent = (
    componentId: string,
    parentComponentId: string | null,
    componentKind: StructuralComponentV0_2["componentKind"],
    operationId: StructuralReductionOperationIdV0_1 | null,
    start: number,
    end: number,
  ): StructuralComponentV0_2 | null => {
    const source = componentSource(start, end);
    if (!source) return null;
    const voiceEvents = inputVoiceEvents.filter(
      (event) => event.basisPosition >= start && event.basisPosition < end,
    );
    const graphemes = normalized.graphemes.filter(
      (grapheme) =>
        grapheme.basisSpan.start >= start && grapheme.basisSpan.end <= end,
    );
    return {
      componentId,
      parentComponentId,
      childComponentIds: [],
      componentKind,
      operationId,
      form: basisCharacters.slice(start, end).join("").toLocaleUpperCase("en-US"),
      basisSpan: { start, end },
      ...source,
      sourcePositionUnit: "unicode_code_point_in_nfc_input",
      graphemeIds: graphemes.map((grapheme) => grapheme.graphemeId),
      frameStatus: voiceEvents.length > 0 ? "contains_voice_event" : "consonantal_frame",
      voiceEvents,
      claimBoundary: "structural_component_only",
      lexicalAttestation: "not_evaluated",
      meaning: null,
    };
  };

  const root = makeComponent("component-0", null, "whole_input", null, 0, basisCharacters.length);
  if (!root) return null;

  const components: StructuralComponentV0_2[] = [root];
  let activeComponentId = root.componentId;
  let nextComponentNumber = 1;

  for (const step of hypothesis.reductionSteps) {
    const parent = components.find((component) => component.componentId === activeComponentId);
    if (!parent) return null;

    const relativeStart = step.fromSpan.start;
    const relativeEnd = step.fromSpan.end;
    const parentStart = parent.basisSpan.start;
    const parentEnd = parent.basisSpan.end;
    const isRightPeel = step.operationId === "peel_right_vowel_led_expansion" ||
      step.operationId === "peel_right_consonant_led_expansion";
    const extractedStart = parentStart + relativeStart;
    const extractedEnd = parentStart + relativeEnd;
    const retainedStart = isRightPeel ? parentStart : extractedEnd;
    const retainedEnd = isRightPeel ? extractedStart : parentEnd;
    const display = (start: number, end: number) =>
      basisCharacters.slice(start, end).join("").toLocaleUpperCase("en-US");

    if (
      extractedStart < parentStart ||
      extractedEnd > parentEnd ||
      extractedStart >= extractedEnd ||
      retainedStart >= retainedEnd ||
      display(parentStart, parentEnd) !== step.from ||
      display(extractedStart, extractedEnd) !== step.removedOrChanged ||
      display(retainedStart, retainedEnd) !== step.to
    ) {
      return null;
    }

    const extracted = makeComponent(
      `component-${nextComponentNumber++}`,
      parent.componentId,
      "extracted_component",
      step.operationId,
      extractedStart,
      extractedEnd,
    );
    const retained = makeComponent(
      `component-${nextComponentNumber++}`,
      parent.componentId,
      "retained_component",
      step.operationId,
      retainedStart,
      retainedEnd,
    );
    if (!extracted || !retained) return null;

    components.push(extracted, retained);
    parent.childComponentIds = [extracted, retained]
      .sort((left, right) => left.basisSpan.start - right.basisSpan.start)
      .map((component) => component.componentId);
    activeComponentId = retained.componentId;
  }

  const terminals = components
    .filter((component) =>
      component.componentId !== root.componentId &&
      component.childComponentIds.length === 0,
    )
    .sort((left, right) => left.basisSpan.start - right.basisSpan.start);
  const reconstructedBasis = terminals
    .map((component) => component.form.toLocaleLowerCase("en-US"))
    .join("");
  const terminalEvents = terminals
    .flatMap((component) => component.voiceEvents)
    .sort((left, right) => left.basisPosition - right.basisPosition);
  const inputEventIds = inputVoiceEvents.map((event) => event.eventId);
  const terminalEventIds = terminalEvents.map((event) => event.eventId);
  const inputGraphemeIds = normalized.graphemes.map((grapheme) => grapheme.graphemeId);
  const terminalGraphemeIds = terminals
    .flatMap((component) => component.graphemeIds)
    .sort((left, right) =>
      Number(left.slice("grapheme-".length)) - Number(right.slice("grapheme-".length)),
    );

  if (
    reconstructedBasis !== normalized.basis ||
    JSON.stringify(terminalEventIds) !== JSON.stringify(inputEventIds) ||
    JSON.stringify(terminalGraphemeIds) !== JSON.stringify(inputGraphemeIds)
  ) {
    return null;
  }

  return {
    decompositionVersion: "z-zero.structural-decomposition.v0_2",
    inputForm: normalized.inputForm,
    normalizedBasis: normalized.basis,
    basisPositionUnit: "unicode_code_point_in_normalized_basis",
    sourcePositionUnit: "unicode_code_point_in_nfc_input",
    inputVoiceEvents: [...inputVoiceEvents],
    inputGraphemes: [...normalized.graphemes],
    components,
    terminalComponentIds: terminals.map((component) => component.componentId),
    reconstructedBasis,
    conservation: {
      status: "complete",
      inputEventIds,
      terminalEventIds,
      inputGraphemeIds,
      terminalGraphemeIds,
      eventOrderPreserved: true,
      graphemeOrderPreserved: true,
      noDigraphSplit: true,
      noEventsAdded: true,
      noEventsDropped: true,
      normalizedBasisReconstructed: true,
    },
    pronunciationAuthority: "not_established",
    historicalOriginClaim: "not_claimed",
  };
}

export function analyzeStructuralInputV0_2(input: string): StructuralInputAnalysisV0_2 {
  const normalized = normalizeInputV0_2(input);
  const base = {
    analysisVersion: "z-zero.structural-input-analysis.v0_2" as const,
    inputForm: normalized.inputForm,
    normalizedBasis: normalized.basis,
    inputVoiceEvents: [] as StructuralVoiceEventV0_2[],
    inputGraphemes: normalized.graphemes,
    excludedHypotheses: [] as StructuralInputAnalysisV0_2["excludedHypotheses"],
    inputVoiceEventCount: null as number | null,
    basisPositionUnit: "unicode_code_point_in_normalized_basis" as const,
    sourcePositionUnit: "unicode_code_point_in_nfc_input" as const,
    pronunciationAuthority: "not_established" as const,
    hypotheses: [] as StructuralHypothesisWithConservationV0_2[],
  };

  if (!normalized.basis) {
    return {
      ...base,
      analysisStatus: "empty_or_unsupported_input",
      inputVoiceSequenceStatus: "unavailable_unsupported_input",
    };
  }
  if (Array.from(normalized.basis).length > MAX_STRUCTURAL_FORM_LENGTH_V0_2) {
    return {
      ...base,
      analysisStatus: "structural_form_too_long",
      inputVoiceSequenceStatus: "not_emitted_form_limit",
    };
  }

  const inputVoiceEvents = voiceEventsV0_2(normalized);
  if (!inputVoiceEvents) {
    return {
      ...base,
      analysisStatus: "conservation_validation_failed",
      inputVoiceSequenceStatus: "unavailable_validation_failure",
    };
  }

  const hypotheses: StructuralHypothesisWithConservationV0_2[] = [];
  const excludedHypotheses: StructuralInputAnalysisV0_2["excludedHypotheses"] = [];
  let conservationFailure = false;

  for (const hypothesis of discoverStructuralHypothesesV0_1(input)) {
    if (hypothesis.basis !== normalized.basis) {
      conservationFailure = true;
      continue;
    }

    const graphemeBoundaries = new Set([0, normalized.sourcePositions.length]);
    for (const grapheme of normalized.graphemes) {
      graphemeBoundaries.add(grapheme.basisSpan.start);
      graphemeBoundaries.add(grapheme.basisSpan.end);
    }
    let parentStart = 0;
    let parentEnd = normalized.sourcePositions.length;
    let firstSplit: { grapheme: AlbanianOrthographicGraphemeV0_2; position: number } | null = null;

    for (const step of hypothesis.reductionSteps) {
      const extractedStart = parentStart + step.fromSpan.start;
      const extractedEnd = parentStart + step.fromSpan.end;
      const isRightPeel =
        step.operationId === "peel_right_vowel_led_expansion" ||
        step.operationId === "peel_right_consonant_led_expansion";
      const retainedStart = isRightPeel ? parentStart : extractedEnd;
      const retainedEnd = isRightPeel ? extractedStart : parentEnd;
      const boundaries = [extractedStart, extractedEnd, retainedStart, retainedEnd];
      const splitAt = boundaries.find((position) => !graphemeBoundaries.has(position));

      if (splitAt !== undefined) {
        const grapheme = normalized.graphemes.find(
          (item) => item.graphemeKind === "digraph" &&
            item.basisSpan.start < splitAt && item.basisSpan.end > splitAt,
        );
        if (grapheme) firstSplit = { grapheme, position: splitAt };
        break;
      }

      parentStart = retainedStart;
      parentEnd = retainedEnd;
    }

    if (firstSplit) {
      const sourcePosition = normalized.sourcePositions[firstSplit.position];
      if (sourcePosition === undefined) {
        conservationFailure = true;
        continue;
      }
      excludedHypotheses.push({
        hypothesisId: hypothesis.hypothesisId,
        reasonCode: "albanian_digraph_boundary_split",
        digraph: firstSplit.grapheme.grapheme.toLocaleUpperCase("en-US"),
        splitBasisPosition: firstSplit.position,
        splitSourcePosition: sourcePosition,
      });
      continue;
    }

    const losslessDecomposition = decompositionV0_2(
      normalized,
      inputVoiceEvents,
      hypothesis,
    );
    if (!losslessDecomposition) {
      conservationFailure = true;
      continue;
    }
    hypotheses.push({ ...hypothesis, losslessDecomposition });
  }

  if (conservationFailure) {
    return {
      ...base,
      analysisStatus: "conservation_validation_failed",
      inputVoiceEvents,
      inputGraphemes: normalized.graphemes,
      excludedHypotheses,
      inputVoiceEventCount: inputVoiceEvents.length,
      inputVoiceSequenceStatus: "complete",
    };
  }

  return {
    ...base,
    analysisStatus: "analyzed",
    inputVoiceEvents,
    inputGraphemes: normalized.graphemes,
    excludedHypotheses,
    inputVoiceEventCount: inputVoiceEvents.length,
    inputVoiceSequenceStatus: "complete",
    hypotheses,
  };
}

export function discoverStructuralHypothesesV0_2(
  input: string,
): StructuralHypothesisWithConservationV0_2[] {
  return analyzeStructuralInputV0_2(input).hypotheses;
}
