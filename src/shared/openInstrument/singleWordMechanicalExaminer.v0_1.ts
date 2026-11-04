export const SINGLE_WORD_MECHANICAL_EXAMINER_SCHEMA_V0_1 =
  "open-instrument.single-word-mechanical-examiner.v0_1" as const;

export type MechanicalEditKindV0_1 = "INSERT" | "OMIT" | "SUBSTITUTE";

export type MechanicalEditInputV0_1 = Readonly<{
  kind: MechanicalEditKindV0_1;
  position: number;
  expectedText: string;
  replacementText: string;
}>;

export type SingleWordMechanicalExaminerInputV0_1 = Readonly<{
  submitted: boolean;
  targetWord: string;
  componentSpellings: readonly string[];
  operations: readonly MechanicalEditInputV0_1[];
}>;

export type MechanicalEditResultV0_1 = Readonly<{
  kind: string;
  position: number | null;
  expectedText: string;
  replacementText: string;
  status: "APPLIED" | "REJECTED" | "NOT_RUN";
  reasonCodes: readonly string[];
  intermediateBefore: string | null;
  intermediateAfter: string | null;
}>;

export type MechanicalWarningV0_1 = Readonly<{
  code:
    | "DIGRAPH_CROSSES_COMPONENT_BOUNDARY"
    | "DIGRAPH_REMOVED"
    | "DIGRAPH_CREATED"
    | "COMPONENT_BOUNDARY_AFFECTED"
    | "UNSUPPORTED_ORTHOGRAPHIC_CHARACTER";
  message: string;
  digraph: string | null;
  position: number | null;
  operationIndex: number | null;
}>;

export type SingleWordMechanicalExaminerResultV0_1 = Readonly<{
  schemaVersion: typeof SINGLE_WORD_MECHANICAL_EXAMINER_SCHEMA_V0_1;
  status: "NOT_SUBMITTED" | "EXAMINED" | "REJECTED";
  targetWord: string;
  componentSpellings: readonly string[];
  rawConcatenation: string;
  operationResults: readonly MechanicalEditResultV0_1[];
  lastValidIntermediate: string;
  finalMechanicalSpelling: string | null;
  exactComparison: "MATCH" | "MISMATCH" | "NOT_COMPUTED";
  nfcEquivalent: boolean | null;
  warnings: readonly MechanicalWarningV0_1[];
  reasonCodes: readonly string[];
  authority: "USER_DECLARED_UNVERIFIED";
  linguisticValidity: "NOT_ASSESSED";
}>;

const ALBANIAN_DIGRAPHS_V0_1 = new Set([
  "dh", "gj", "ll", "nj", "rr", "sh", "th", "xh", "zh",
]);
const ALBANIAN_LETTERS_V0_1 = new Set(Array.from("abcdefghijklmnopqrstuvwxyzçë"));
const ROOT_KEYS_V0_1 = new Set(["submitted", "targetWord", "componentSpellings", "operations"]);
const OPERATION_KEYS_V0_1 = new Set(["kind", "position", "expectedText", "replacementText"]);

type Boundary = number | null;
type DigraphOccurrence = Readonly<{ value: string; position: number }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function unknownKeys(value: Record<string, unknown>, allowed: ReadonlySet<string>): boolean {
  return Object.keys(value).some((key) => !allowed.has(key));
}

function codePoints(value: string): string[] {
  return Array.from(value);
}

function isSingleToken(value: string): boolean {
  return value.length > 0 && value.trim() === value && !/\s/u.test(value);
}

function graphemeSafeBoundary(characters: readonly string[], position: number): boolean {
  return position <= 0 || position >= characters.length || !/^\p{M}$/u.test(characters[position] ?? "");
}

function digraphsNear(
  characters: readonly string[],
  start: number,
  consumedLength: number,
): DigraphOccurrence[] {
  const low = Math.max(0, start - 1);
  const high = Math.min(characters.length - 1, Math.max(start, start + consumedLength - 1) + 1);
  const found: DigraphOccurrence[] = [];
  for (let position = low; position < high; position += 1) {
    const value = `${characters[position] ?? ""}${characters[position + 1] ?? ""}`.toLocaleLowerCase("en-US");
    if (ALBANIAN_DIGRAPHS_V0_1.has(value)) found.push({ value: value.toLocaleUpperCase("en-US"), position });
  }
  return found;
}

function componentBoundaries(components: readonly string[]): Boundary[] {
  const boundaries: Boundary[] = [];
  let position = 0;
  for (const [index, component] of components.entries()) {
    position += codePoints(component).length;
    if (index < components.length - 1) boundaries.push(position);
  }
  return boundaries;
}

function warning(
  code: MechanicalWarningV0_1["code"],
  message: string,
  details: Pick<MechanicalWarningV0_1, "digraph" | "position" | "operationIndex"> = {
    digraph: null,
    position: null,
    operationIndex: null,
  },
): MechanicalWarningV0_1 {
  return { code, message, ...details };
}

function deduplicateWarnings(warnings: readonly MechanicalWarningV0_1[]): MechanicalWarningV0_1[] {
  const seen = new Set<string>();
  return warnings.filter((item) => {
    const key = `${item.code}:${item.digraph}:${item.position}:${item.operationIndex}:${item.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function orthographicWarnings(
  targetWord: string,
  rawConcatenation: string,
  operations: readonly MechanicalEditInputV0_1[],
): MechanicalWarningV0_1[] {
  const warnings: MechanicalWarningV0_1[] = [];
  const inspect = (form: string, label: string) => {
    for (const [position, character] of codePoints(form).entries()) {
      const normalized = character.toLocaleLowerCase("en-US");
      if (/^\p{L}$/u.test(character) && !ALBANIAN_LETTERS_V0_1.has(normalized)) {
        warnings.push(warning(
          "UNSUPPORTED_ORTHOGRAPHIC_CHARACTER",
          `${label} contains ${JSON.stringify(character)} (U+${character.codePointAt(0)?.toString(16).toUpperCase()}) outside the Albanian letter set; spelling is retained and linguistic validity is not assessed.`,
          { digraph: null, position, operationIndex: null },
        ));
      } else if (!/^\p{L}$/u.test(character) && !/^\p{M}$/u.test(character)) {
        warnings.push(warning(
          "UNSUPPORTED_ORTHOGRAPHIC_CHARACTER",
          `${label} contains non-letter code point ${JSON.stringify(character)} (U+${character.codePointAt(0)?.toString(16).toUpperCase()}); spelling is retained and linguistic validity is not assessed.`,
          { digraph: null, position, operationIndex: null },
        ));
      }
    }
  };
  inspect(targetWord, "Target");
  inspect(rawConcatenation, "Component concatenation");
  for (const [operationIndex, operation] of operations.entries()) {
    inspect(operation.expectedText, `Operation ${operationIndex + 1} expected text`);
    inspect(operation.replacementText, `Operation ${operationIndex + 1} replacement`);
  }
  return warnings;
}

function buildResult(args: {
  status: SingleWordMechanicalExaminerResultV0_1["status"];
  targetWord: string;
  components: readonly string[];
  raw: string;
  operationResults?: readonly MechanicalEditResultV0_1[];
  lastValid?: string;
  final?: string | null;
  exact?: SingleWordMechanicalExaminerResultV0_1["exactComparison"];
  nfc?: boolean | null;
  warnings?: readonly MechanicalWarningV0_1[];
  reasons?: readonly string[];
}): SingleWordMechanicalExaminerResultV0_1 {
  return {
    schemaVersion: SINGLE_WORD_MECHANICAL_EXAMINER_SCHEMA_V0_1,
    status: args.status,
    targetWord: args.targetWord,
    componentSpellings: [...args.components],
    rawConcatenation: args.raw,
    operationResults: [...(args.operationResults ?? [])],
    lastValidIntermediate: args.lastValid ?? args.raw,
    finalMechanicalSpelling: args.final ?? null,
    exactComparison: args.exact ?? "NOT_COMPUTED",
    nfcEquivalent: args.nfc ?? null,
    warnings: deduplicateWarnings(args.warnings ?? []),
    reasonCodes: [...new Set(args.reasons ?? [])],
    authority: "USER_DECLARED_UNVERIFIED",
    linguisticValidity: "NOT_ASSESSED",
  };
}

function rejectedInput(targetWord: string, components: readonly string[], reasonCode: string) {
  const safeComponents = components.filter((component): component is string => typeof component === "string");
  const raw = safeComponents.join("");
  return buildResult({
    status: "REJECTED",
    targetWord,
    components: safeComponents,
    raw,
    lastValid: raw,
    reasons: [reasonCode],
    warnings: orthographicWarnings(targetWord, raw, []),
  });
}

/** Replays only explicit user-positioned edits. It does not evaluate linguistic validity. */
export function examineSingleWordMechanicalInterpretationV0_1(
  input: SingleWordMechanicalExaminerInputV0_1,
): SingleWordMechanicalExaminerResultV0_1 {
  if (!isRecord(input)) return rejectedInput("", [], "MALFORMED_INPUT");
  const targetWord = typeof input.targetWord === "string" ? input.targetWord : "";
  const components = Array.isArray(input.componentSpellings)
    ? input.componentSpellings.filter((component): component is string => typeof component === "string")
    : [];
  const raw = components.join("");

  if (unknownKeys(input, ROOT_KEYS_V0_1)) return rejectedInput(targetWord, components, "UNRECOGNIZED_INPUT_FIELD");
  if (typeof input.submitted !== "boolean") return rejectedInput(targetWord, components, "SUBMISSION_FLAG_REQUIRED");
  if (!Array.isArray(input.componentSpellings) || input.componentSpellings.some((component) => typeof component !== "string")) {
    return rejectedInput(targetWord, components, "COMPONENTS_MUST_BE_STRINGS");
  }
  if (!Array.isArray(input.operations)) return rejectedInput(targetWord, components, "OPERATIONS_MUST_BE_AN_ARRAY");
  if (input.submitted === false) {
    return buildResult({
      status: "NOT_SUBMITTED",
      targetWord,
      components,
      raw,
      warnings: orthographicWarnings(targetWord, raw, []),
    });
  }

  const rootReasons: string[] = [];
  if (!isSingleToken(targetWord) || codePoints(targetWord).length > 80) rootReasons.push("TARGET_MUST_BE_ONE_EXACT_TOKEN_UP_TO_80_CODE_POINTS");
  if (components.length < 2 || components.length > 12) rootReasons.push("TWO_TO_TWELVE_ORDERED_COMPONENTS_REQUIRED");
  if (components.some((component) => !isSingleToken(component) || codePoints(component).length > 80)) {
    rootReasons.push("EACH_COMPONENT_MUST_BE_ONE_EXACT_TOKEN_UP_TO_80_CODE_POINTS");
  }
  if (input.operations.length > 8) rootReasons.push("AT_MOST_EIGHT_EXPLICIT_OPERATIONS_ALLOWED");
  if (rootReasons.length) return rejectedInput(targetWord, components, rootReasons[0]!);

  const operations: MechanicalEditInputV0_1[] = [];
  for (const operation of input.operations) {
    if (!isRecord(operation) || unknownKeys(operation, OPERATION_KEYS_V0_1)) {
      return rejectedInput(targetWord, components, "MALFORMED_OR_UNRECOGNIZED_OPERATION_FIELDS");
    }
    if (typeof operation.kind !== "string" || typeof operation.position !== "number" ||
      typeof operation.expectedText !== "string" || typeof operation.replacementText !== "string") {
      return rejectedInput(targetWord, components, "MALFORMED_OPERATION_FIELDS");
    }
    operations.push({
      kind: operation.kind as MechanicalEditKindV0_1,
      position: operation.position,
      expectedText: operation.expectedText,
      replacementText: operation.replacementText,
    });
  }

  const warnings = orthographicWarnings(targetWord, raw, operations);
  const initialCharacters = codePoints(raw);
  const boundaries = componentBoundaries(components);
  for (const boundary of boundaries) {
    if (boundary === null) continue;
    const pair = `${initialCharacters[boundary - 1] ?? ""}${initialCharacters[boundary] ?? ""}`.toLocaleLowerCase("en-US");
    if (ALBANIAN_DIGRAPHS_V0_1.has(pair)) {
      warnings.push(warning(
        "DIGRAPH_CROSSES_COMPONENT_BOUNDARY",
        `The component seam at code-point position ${boundary} forms Albanian digraph ${pair.toLocaleUpperCase("en-US")}; this is a structural warning only.`,
        { digraph: pair.toLocaleUpperCase("en-US"), position: boundary, operationIndex: null },
      ));
    }
  }

  let intermediate = raw;
  const operationResults: MechanicalEditResultV0_1[] = [];
  let failed = false;

  for (const [operationIndex, operation] of operations.entries()) {
    if (failed) {
      operationResults.push({
        ...operation,
        status: "NOT_RUN",
        reasonCodes: ["PREVIOUS_OPERATION_REJECTED"],
        intermediateBefore: null,
        intermediateAfter: null,
      });
      continue;
    }

    const before = intermediate;
    const characters = codePoints(before);
    const expected = codePoints(operation.expectedText);
    const replacement = codePoints(operation.replacementText);
    const reasonCodes: string[] = [];
    if (!(operation.kind === "INSERT" || operation.kind === "OMIT" || operation.kind === "SUBSTITUTE")) {
      reasonCodes.push("OPERATION_KIND_UNSUPPORTED");
    }
    if (!Number.isInteger(operation.position) || operation.position < 0 || operation.position > characters.length) {
      reasonCodes.push("POSITION_OUT_OF_RANGE_OR_NOT_AN_INTEGER");
    }
    if (expected.length > 80 || replacement.length > 80) reasonCodes.push("OPERATION_TEXT_EXCEEDS_80_CODE_POINTS");
    if (operation.kind === "INSERT" && expected.length !== 0) reasonCodes.push("INSERT_EXPECTED_TEXT_MUST_BE_EMPTY");
    if (operation.kind === "INSERT" && replacement.length === 0) reasonCodes.push("INSERT_REPLACEMENT_REQUIRED");
    if (operation.kind === "OMIT" && (expected.length === 0 || replacement.length !== 0)) {
      reasonCodes.push("OMIT_REQUIRES_EXPECTED_TEXT_AND_EMPTY_REPLACEMENT");
    }
    if (operation.kind === "SUBSTITUTE" && (expected.length === 0 || replacement.length === 0)) {
      reasonCodes.push("SUBSTITUTE_REQUIRES_EXPECTED_AND_REPLACEMENT_TEXT");
    }

    const position = operation.position;
    const end = position + expected.length;
    if (Number.isInteger(position) && position >= 0 && position <= characters.length) {
      if (!graphemeSafeBoundary(characters, position) ||
        (operation.kind !== "INSERT" && !graphemeSafeBoundary(characters, end))) {
        reasonCodes.push("UNSAFE_UNICODE_COMBINING_SEQUENCE_BOUNDARY");
      }
      if (operation.kind !== "INSERT" && characters.slice(position, end).join("") !== operation.expectedText) {
        reasonCodes.push("EXPECTED_TEXT_MISMATCH");
      }
    }

    if (reasonCodes.length) {
      failed = true;
      operationResults.push({
        ...operation,
        status: "REJECTED",
        reasonCodes: [...new Set(reasonCodes)],
        intermediateBefore: before,
        intermediateAfter: null,
      });
      continue;
    }

    const beforeDigraphs = digraphsNear(characters, position, expected.length);
    const afterCharacters = [
      ...characters.slice(0, position),
      ...replacement,
      ...characters.slice(end),
    ];
    const after = afterCharacters.join("");
    const afterDigraphs = digraphsNear(afterCharacters, position, replacement.length);
    const beforeCounts = new Map<string, number>();
    const afterCounts = new Map<string, number>();
    beforeDigraphs.forEach(({ value }) => beforeCounts.set(value, (beforeCounts.get(value) ?? 0) + 1));
    afterDigraphs.forEach(({ value }) => afterCounts.set(value, (afterCounts.get(value) ?? 0) + 1));
    for (const [digraph, count] of beforeCounts) {
      if (count > (afterCounts.get(digraph) ?? 0)) {
        warnings.push(warning(
          "DIGRAPH_REMOVED",
          `Operation ${operationIndex + 1} changes or removes Albanian digraph ${digraph} at code-point position ${position}.`,
          { digraph, position, operationIndex },
        ));
      }
    }
    for (const [digraph, count] of afterCounts) {
      if (count > (beforeCounts.get(digraph) ?? 0)) {
        warnings.push(warning(
          "DIGRAPH_CREATED",
          `Operation ${operationIndex + 1} creates Albanian digraph ${digraph} at code-point position ${position}.`,
          { digraph, position, operationIndex },
        ));
      }
    }
    for (let boundaryIndex = 0; boundaryIndex < boundaries.length; boundaryIndex += 1) {
      const boundary = boundaries[boundaryIndex];
      if (boundary === null) continue;
      if (
        (position === end && position === boundary) ||
        (position === boundary && expected.length > 0) ||
        (position < boundary && end > boundary)
      ) {
        warnings.push(warning(
          "COMPONENT_BOUNDARY_AFFECTED",
          `Operation ${operationIndex + 1} touches component seam ${boundaryIndex + 1}; component alignment after this edit is not inferred.`,
          { digraph: null, position: boundary, operationIndex },
        ));
        boundaries[boundaryIndex] = null;
      } else if (position < boundary && end <= boundary) {
        boundaries[boundaryIndex] = boundary + replacement.length - expected.length;
      }
    }
    for (const boundary of boundaries) {
      if (boundary === null || boundary <= 0 || boundary >= afterCharacters.length) continue;
      const pair = `${afterCharacters[boundary - 1] ?? ""}${afterCharacters[boundary] ?? ""}`.toLocaleLowerCase("en-US");
      if (ALBANIAN_DIGRAPHS_V0_1.has(pair)) {
        warnings.push(warning(
          "DIGRAPH_CROSSES_COMPONENT_BOUNDARY",
          `An Albanian digraph ${pair.toLocaleUpperCase("en-US")} crosses a retained component seam at code-point position ${boundary}.`,
          { digraph: pair.toLocaleUpperCase("en-US"), position: boundary, operationIndex },
        ));
      }
    }

    intermediate = after;
    operationResults.push({
      ...operation,
      status: "APPLIED",
      reasonCodes: [],
      intermediateBefore: before,
      intermediateAfter: after,
    });
  }

  if (failed) {
    return buildResult({
      status: "REJECTED",
      targetWord,
      components,
      raw,
      operationResults,
      lastValid: intermediate,
      warnings,
      reasons: ["ONE_OR_MORE_OPERATIONS_REJECTED; LATER_OPERATIONS_NOT_APPLIED"],
    });
  }

  return buildResult({
    status: "EXAMINED",
    targetWord,
    components,
    raw,
    operationResults,
    lastValid: intermediate,
    final: intermediate,
    exact: intermediate === targetWord ? "MATCH" : "MISMATCH",
    nfc: intermediate.normalize("NFC") === targetWord.normalize("NFC"),
    warnings,
  });
}

export function notSubmittedMechanicalInterpretationV0_1(
  targetWord: string,
  componentSpellings: readonly string[] = [],
): SingleWordMechanicalExaminerResultV0_1 {
  return examineSingleWordMechanicalInterpretationV0_1({
    submitted: false,
    targetWord,
    componentSpellings,
    operations: [],
  });
}
