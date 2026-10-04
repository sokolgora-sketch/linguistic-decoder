import type {
  PresentOrMissing,
  SpokenPronunciationProvenanceV0_1VM,
  SpokenPronunciationVariantV0_1VM,
  TelemetryViewModel,
  Vowel,
} from "@/ui/telemetry/types";

export const WORD_TO_WORD_COMPARISON_SCHEMA_VERSION_V0_1 =
  "open-instrument.word-to-word-structural-authority-comparison.v0_1" as const;

export type ComparisonStateV0_1 =
  | "VALUE"
  | "NULL"
  | "MISSING"
  | "EMPTY_VALID"
  | "UNSUPPORTED"
  | "NOT_APPLICABLE";

export type ComparisonRelationV0_1 =
  | "EQUAL"
  | "DIFFERENT"
  | "LEFT_ONLY"
  | "RIGHT_ONLY"
  | "BOTH_NULL";

export type ComparisonSideV0_1 = Readonly<{
  state: ComparisonStateV0_1;
  value?: unknown;
  reason?: string | null;
}>;

export type ComparisonRowV0_1 = Readonly<{
  id: string;
  label: string;
  left: ComparisonSideV0_1;
  relation: ComparisonRelationV0_1;
  right: ComparisonSideV0_1;
}>;

export type ComparisonProjectionV0_1 = Readonly<{
  schemaVersion: typeof WORD_TO_WORD_COMPARISON_SCHEMA_VERSION_V0_1;
  left: Readonly<{ word: string }>;
  right: Readonly<{ word: string }>;
  rows: readonly ComparisonRowV0_1[];
  claimBoundary: "structural_authority_comparison_only";
}>;

export function comparisonValueV0_1(value: unknown): ComparisonSideV0_1 {
  return { state: "VALUE", value };
}

export function comparisonEmptyValidV0_1(
  value: readonly unknown[] = [],
): ComparisonSideV0_1 {
  return { state: "EMPTY_VALID", value: [...value] };
}

export function comparisonNullV0_1(
  reason: string | null = null,
): ComparisonSideV0_1 {
  return { state: "NULL", reason };
}

export function comparisonMissingV0_1(): ComparisonSideV0_1 {
  return { state: "MISSING" };
}

export function comparisonUnsupportedV0_1(): ComparisonSideV0_1 {
  return { state: "UNSUPPORTED" };
}

export function comparisonNotApplicableV0_1(): ComparisonSideV0_1 {
  return { state: "NOT_APPLICABLE" };
}

function isComparableState(state: ComparisonStateV0_1): boolean {
  return state === "VALUE" || state === "EMPTY_VALID";
}

function exactEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((value, index) => exactEqual(value, right[index]))
    );
  }
  if (
    left !== null &&
    right !== null &&
    typeof left === "object" &&
    typeof right === "object"
  ) {
    const leftRecord = left as Record<string, unknown>;
    const rightRecord = right as Record<string, unknown>;
    const leftKeys = Object.keys(leftRecord).sort();
    const rightKeys = Object.keys(rightRecord).sort();
    return (
      leftKeys.length === rightKeys.length &&
      leftKeys.every(
        (key, index) =>
          key === rightKeys[index] &&
          exactEqual(leftRecord[key], rightRecord[key]),
      )
    );
  }
  return false;
}

export function deriveComparisonRelationV0_1(
  left: ComparisonSideV0_1,
  right: ComparisonSideV0_1,
): ComparisonRelationV0_1 {
  const leftComparable = isComparableState(left.state);
  const rightComparable = isComparableState(right.state);

  if (leftComparable && rightComparable) {
    return exactEqual(left.value, right.value) ? "EQUAL" : "DIFFERENT";
  }
  if (leftComparable) return "LEFT_ONLY";
  if (rightComparable) return "RIGHT_ONLY";
  return "BOTH_NULL";
}

function sideFromPresentOrMissingV0_1<T>(
  value: PresentOrMissing<T>,
): ComparisonSideV0_1 {
  if (value.kind === "missing") return comparisonMissingV0_1();
  if (Array.isArray(value.value) && value.value.length === 0) {
    return comparisonEmptyValidV0_1(value.value);
  }
  return comparisonValueV0_1(value.value);
}

function row(
  id: string,
  label: string,
  left: ComparisonSideV0_1,
  right: ComparisonSideV0_1,
): ComparisonRowV0_1 {
  return { id, label, left, relation: deriveComparisonRelationV0_1(left, right), right };
}

function pronunciationValue(
  vm: TelemetryViewModel,
): ComparisonSideV0_1 {
  const pronunciation = vm.readout.spokenPronunciation;
  if (pronunciation.kind === "missing") return comparisonMissingV0_1();
  if (pronunciation.value.status === "null") {
    return comparisonNullV0_1(pronunciation.value.reasonCode);
  }
  return comparisonValueV0_1("defined");
}

function pronunciationOrMissing(
  vm: TelemetryViewModel,
): PresentOrMissing<SpokenPronunciationProvenanceV0_1VM> {
  return vm.readout.spokenPronunciation;
}

function fieldFromPronunciation(
  vm: TelemetryViewModel,
  field: "sourceProfileId" | "sourceNotation" | "sourceRevision",
): ComparisonSideV0_1 {
  const pronunciation = pronunciationOrMissing(vm);
  if (pronunciation.kind === "missing") return comparisonMissingV0_1();
  return comparisonValueV0_1(pronunciation.value[field]);
}

function variantList(
  vm: TelemetryViewModel,
): readonly SpokenPronunciationVariantV0_1VM[] | null {
  const pronunciation = pronunciationOrMissing(vm);
  if (pronunciation.kind === "missing" || pronunciation.value.status === "null") {
    return null;
  }
  return pronunciation.value.variants;
}

function variantById(
  vm: TelemetryViewModel,
  variantId: string,
): SpokenPronunciationVariantV0_1VM | null {
  return variantList(vm)?.find((variant) => variant.variantId === variantId) ?? null;
}

function variantUnavailableState(
  vm: TelemetryViewModel,
): ComparisonSideV0_1 {
  const pronunciation = pronunciationOrMissing(vm);
  if (pronunciation.kind === "missing") return comparisonMissingV0_1();
  if (pronunciation.value.status === "null") {
    return comparisonNullV0_1(pronunciation.value.reasonCode);
  }
  return comparisonMissingV0_1();
}

function variantField(
  vm: TelemetryViewModel,
  variantId: string,
  field: "sourceForm" | "sourcePronunciation" | "variantOrder" | "canonicalVoicePath" | "gamma",
): ComparisonSideV0_1 {
  const variant = variantById(vm, variantId);
  if (!variant) return variantUnavailableState(vm);

  if (field === "sourceForm") return comparisonValueV0_1(variant.sourceForm);
  if (field === "sourcePronunciation") {
    return comparisonValueV0_1(variant.sourcePronunciation);
  }
  if (field === "variantOrder") return comparisonValueV0_1(variant.variantOrder);
  if (field === "canonicalVoicePath") {
    return variant.canonicalVoicePath === null
      ? comparisonNullV0_1(variant.reasonCode)
      : variant.canonicalVoicePath.length === 0
        ? comparisonEmptyValidV0_1(variant.canonicalVoicePath)
        : comparisonValueV0_1(variant.canonicalVoicePath);
  }

  const pronunciation = pronunciationOrMissing(vm);
  if (pronunciation.kind === "present" && pronunciation.value.status === "null") {
    return comparisonNullV0_1(pronunciation.value.reasonCode);
  }
  const gamma = variant.segments.flatMap((segment) => segment.sourceUnits);
  return gamma.length === 0
    ? comparisonEmptyValidV0_1(gamma)
    : comparisonValueV0_1(gamma);
}

type ZeroConsonantalField = "p" | "i" | "s" | "d" | "a" | "r";

function zeroConsonantalField(
  vm: TelemetryViewModel,
  variantId: string,
  field: ZeroConsonantalField,
): ComparisonSideV0_1 {
  const variant = variantById(vm, variantId);
  if (!variant) return variantUnavailableState(vm);
  const zc = variant.zeroConsonantalStructuralComposition;
  if (!zc) return comparisonNullV0_1(variant.reasonCode);
  const value = zc[field];
  if (Array.isArray(value) && value.length === 0) {
    return comparisonEmptyValidV0_1(value);
  }
  return comparisonValueV0_1(value);
}

function variantIds(vm: TelemetryViewModel): readonly string[] {
  return (variantList(vm) ?? [])
    .slice()
    .sort((left, right) =>
      left.variantOrder - right.variantOrder || left.variantId.localeCompare(right.variantId),
    )
    .map((variant) => variant.variantId);
}

function functionalStatus(vm: TelemetryViewModel): ComparisonSideV0_1 {
  const depth = vm.wordSpecificFunctionalDepth;
  if (!depth || depth.kind === "missing") return comparisonMissingV0_1();
  if (depth.value === null) return comparisonNullV0_1();
  if (depth.value.status === null) return comparisonNullV0_1(depth.value.nullReason);
  return comparisonValueV0_1(depth.value.status);
}

function functionalEvidenceRefs(vm: TelemetryViewModel): ComparisonSideV0_1 {
  const depth = vm.wordSpecificFunctionalDepth;
  if (!depth || depth.kind === "missing") return comparisonMissingV0_1();
  if (depth.value === null) return comparisonNullV0_1();
  return depth.value.evidenceRefs.length === 0
    ? comparisonEmptyValidV0_1(depth.value.evidenceRefs)
    : comparisonValueV0_1(depth.value.evidenceRefs);
}

function addVariantRows(
  rows: ComparisonRowV0_1[],
  left: TelemetryViewModel,
  right: TelemetryViewModel,
): void {
  const ids = new Set([...variantIds(left), ...variantIds(right)]);
  const orderedIds = [...ids].sort((leftId, rightId) => leftId.localeCompare(rightId));
  for (const variantId of orderedIds) {
    const prefix = `variant:${variantId}`;
    rows.push(
      row(`${prefix}:sourceForm`, `Variant ${variantId} source form`, variantField(left, variantId, "sourceForm"), variantField(right, variantId, "sourceForm")),
      row(`${prefix}:sourcePronunciation`, `Variant ${variantId} pronunciation`, variantField(left, variantId, "sourcePronunciation"), variantField(right, variantId, "sourcePronunciation")),
      row(`${prefix}:variantOrder`, `Variant ${variantId} order`, variantField(left, variantId, "variantOrder"), variantField(right, variantId, "variantOrder")),
      row(`${prefix}:voicePath`, `Variant ${variantId} canonical Voice path`, variantField(left, variantId, "canonicalVoicePath"), variantField(right, variantId, "canonicalVoicePath")),
      row(`${prefix}:gamma`, `Variant ${variantId} Γ`, variantField(left, variantId, "gamma"), variantField(right, variantId, "gamma")),
    );
    for (const field of ["p", "i", "s", "d", "a", "r"] as const) {
      rows.push(
        row(
          `${prefix}:zc:${field}`,
          `Variant ${variantId} ZC.${field.toUpperCase()}`,
          zeroConsonantalField(left, variantId, field),
          zeroConsonantalField(right, variantId, field),
        ),
      );
    }
  }
}

export function compareTelemetryViewModelsV0_1(
  left: TelemetryViewModel,
  right: TelemetryViewModel,
): ComparisonProjectionV0_1 {
  const rows: ComparisonRowV0_1[] = [
    row("word", "Word", comparisonValueV0_1(left.readout.word), comparisonValueV0_1(right.readout.word)),
    row("normalizedWord", "Normalized word", sideFromPresentOrMissingV0_1(left.readout.normalizedWord), sideFromPresentOrMissingV0_1(right.readout.normalizedWord)),
    row("mode", "Analysis mode", sideFromPresentOrMissingV0_1(left.readout.mode), sideFromPresentOrMissingV0_1(right.readout.mode)),
    row("alphabet", "Alphabet profile", sideFromPresentOrMissingV0_1(left.readout.alphabet), sideFromPresentOrMissingV0_1(right.readout.alphabet)),
    row("spokenPronunciation", "Spoken pronunciation authority", pronunciationValue(left), pronunciationValue(right)),
    row("sourceProfile", "Pronunciation source profile", fieldFromPronunciation(left, "sourceProfileId"), fieldFromPronunciation(right, "sourceProfileId")),
    row("sourceNotation", "Pronunciation notation", fieldFromPronunciation(left, "sourceNotation"), fieldFromPronunciation(right, "sourceNotation")),
    row("sourceRevision", "Pronunciation source revision", fieldFromPronunciation(left, "sourceRevision"), fieldFromPronunciation(right, "sourceRevision")),
    row("voicePath", "Canonical spoken Voice path", sideFromPresentOrMissingV0_1(left.readout.voicePath), sideFromPresentOrMissingV0_1(right.readout.voicePath)),
    row("analysisStatus", "Analysis status", left.analysisStatusV0_1?.kind === "present" ? comparisonValueV0_1(left.analysisStatusV0_1.value.status) : comparisonMissingV0_1(), right.analysisStatusV0_1?.kind === "present" ? comparisonValueV0_1(right.analysisStatusV0_1.value.status) : comparisonMissingV0_1()),
    row("functionalStatus", "Word-specific functional evidence status", functionalStatus(left), functionalStatus(right)),
    row("functionalEvidenceRefs", "Word-specific evidence references", functionalEvidenceRefs(left), functionalEvidenceRefs(right)),
  ];

  const leftVariants = variantList(left);
  const rightVariants = variantList(right);
  const leftVariantIds = leftVariants === null ? pronunciationValue(left) : leftVariants.length === 0 ? comparisonEmptyValidV0_1([]) : comparisonValueV0_1(variantIds(left));
  const rightVariantIds = rightVariants === null ? pronunciationValue(right) : rightVariants.length === 0 ? comparisonEmptyValidV0_1([]) : comparisonValueV0_1(variantIds(right));
  rows.push(row("variantIds", "Pronunciation variants", leftVariantIds, rightVariantIds));
  addVariantRows(rows, left, right);

  return {
    schemaVersion: WORD_TO_WORD_COMPARISON_SCHEMA_VERSION_V0_1,
    left: { word: left.readout.word },
    right: { word: right.readout.word },
    rows,
    claimBoundary: "structural_authority_comparison_only",
  };
}
