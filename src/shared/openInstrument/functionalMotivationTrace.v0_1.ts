import { extractSevenVowelsFromString, type SevenVowel } from "@/shared/math7.core";
import {
  buildCrossLanguageOperationLedgerV0_2,
  type CrossLanguageOperationLedgerV0_2,
  type CrossLanguageOperationLedgerInputV0_2,
} from "@/shared/openInstrument/crossLanguageOperationLedger.v0_2";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
} from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";
import type { FunctionalMotivationResearchClaimLayerV0_2 } from "@/shared/openInstrument/functionalMotivationResearchReference.v0_2";

export const FUNCTIONAL_MOTIVATION_TRACE_SCHEMA_V0_1 =
  "open-instrument.functional-motivation-trace.v0_1" as const;

export type FunctionalMotivationTraceSourceV0_1 = Readonly<{
  sourceId: string;
  label: string;
  url: string;
  locator: string;
  citationStatus: "CITATION_ENTERED_UNVERIFIED";
  licensingStatus: "NOT_ASSESSED";
}>;

export type FunctionalMotivationTraceSourceStatusV0_1 = Readonly<{
  exactSpelling: string;
  language: string;
  variety: string;
  grammaticalCategory: string;
  selectedSense: string;
  evidenceStatus: "CITATION_ENTERED_UNVERIFIED";
  sourceIds: readonly string[];
  expectedCodePoints?: readonly Readonly<{ character: string; position: number }>[];
  expectedWrittenVoices?: readonly Readonly<{ voice: SevenVowel; position: number }>[];
}>;

export type FunctionalMotivationTraceTermV0_1 = Readonly<{
  id: string;
  spelling: string;
  functionText: string;
  claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
  status: string;
  sourceIds: readonly string[];
  roleNote: string;
  freeOperatorClassification?: string | null;
}>;

export type FunctionalMotivationTraceComponentV0_1 = Readonly<{
  spelling: string;
  functionText: string;
  claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
  status: string;
  unresolved?: boolean;
}>;

export type FunctionalMotivationTraceStepInputV0_1 = Readonly<{
  id: string;
  title: string;
  from: string;
  relationshipType: string;
  to: string;
  claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
  status: string;
  sourceIds: readonly string[];
  evidenceNote: string;
  supportBoundary: string;
  operationLedgerId?: string;
  exactStructure?: string;
  reconstructsSurface?: boolean;
}>;

export type FunctionalMotivationTraceClaimV0_1 = Readonly<{
  text: string;
  claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
  status: string;
  sourceIds: readonly string[];
}>;

export type FunctionalMotivationTraceSourceFidelityV0_1 = Readonly<{
  classification:
    | "PETRO_ZHEJI_SOURCE_REPORTED"
    | "PETRO_ZHEJI_INSPIRED_RECONSTRUCTION"
    | "ZERO_ORIGINAL_DOCTRINE"
    | "OPEN_INSTRUMENT_ENGINEERING"
    | "UNKNOWN";
  statement: string;
}>;

export type FunctionalMotivationTraceInputV0_1 = Readonly<{
  target: FunctionalMotivationTraceSourceStatusV0_1;
  sources: readonly FunctionalMotivationTraceSourceV0_1[];
  terms: readonly FunctionalMotivationTraceTermV0_1[];
  equation: Readonly<{
    contributorTermIds: readonly string[];
    resultText: string;
    targetDescription: string;
    claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
    status: string;
    sourceIds: readonly string[];
  }>;
  functionalReading: FunctionalMotivationTraceClaimV0_1;
  surfaceReconstruction: Readonly<{
    components: readonly FunctionalMotivationTraceComponentV0_1[];
    expectedStatus: "EXACT_MATCH" | "MISMATCH";
    note: string;
    sourceIds: readonly string[];
  }>;
  operations: readonly Readonly<{
    id: string;
    input: CrossLanguageOperationLedgerInputV0_2;
  }>[];
  alternatives: readonly FunctionalMotivationTraceClaimV0_1[];
  contrasts: readonly FunctionalMotivationTraceClaimV0_1[];
  unresolved: readonly FunctionalMotivationTraceClaimV0_1[];
  notes: readonly string[];
  reasoningSteps: readonly FunctionalMotivationTraceStepInputV0_1[];
  sourceFidelity?: readonly FunctionalMotivationTraceSourceFidelityV0_1[];
}>;

export type FunctionalMotivationTraceOperationV0_1 = Readonly<{
  id: string;
  before: string;
  after: string;
  operationId: string;
  kind: string;
  operationCount: number;
  cost: number;
  position: number | null;
  positionUnit: string;
  removedText: string | null;
  removedSpan: Readonly<{ start: number; end: number }> | null;
  voicesBefore: readonly string[];
  voicesAfter: readonly string[];
  omittedVoices: readonly string[];
  inverseStatus: string;
  inverseForm: string | null;
  mechanicalStatus: string;
  authority: string;
  evidenceStatus: string;
  linguisticApplicability: string;
  exactLedger: string;
  ledger: CrossLanguageOperationLedgerV0_2;
}>;

export type FunctionalMotivationTraceStepV0_1 = Readonly<{
  id: string;
  title: string;
  from: string;
  relationshipType: string;
  to: string;
  claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
  status: string;
  sources: readonly FunctionalMotivationTraceSourceV0_1[];
  evidenceNote: string;
  supportBoundary: string;
  exactOperation: string | null;
}>;

export type FunctionalMotivationTraceProjectionV0_1 = Readonly<{
  schemaVersion: typeof FUNCTIONAL_MOTIVATION_TRACE_SCHEMA_V0_1;
  target: FunctionalMotivationTraceSourceStatusV0_1 & Readonly<{
    codePoints: readonly string[];
    writtenVoices: readonly string[];
  }>;
  motivationEquation: Readonly<{
    equation: string;
    roles: readonly string[];
    claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
    status: string;
    sourceAuthorityPromotion: "NONE";
  }>;
  components: readonly Readonly<{
    spelling: string;
    span: Readonly<{ start: number; end: number }>;
    function: string;
    claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
    status: string;
  }>[];
  functionalReading: Readonly<{
    text: string;
    claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
    status: string;
  }>;
  reconstruction: Readonly<{ text: string; status: "EXACT_MATCH" | "MISMATCH"; note: string }>;
  operations: readonly FunctionalMotivationTraceOperationV0_1[];
  alternatives: readonly FunctionalMotivationTraceClaimV0_1[];
  contrasts: readonly FunctionalMotivationTraceClaimV0_1[];
  unresolved: readonly FunctionalMotivationTraceClaimV0_1[];
  notes: readonly string[];
  sources: readonly FunctionalMotivationTraceSourceV0_1[];
  reasoningTrace: readonly FunctionalMotivationTraceStepV0_1[];
  sourceFidelity: readonly FunctionalMotivationTraceSourceFidelityV0_1[];
  selection: Readonly<{
    mode: "no_single_winner";
    selectedCandidateId: null;
    userDecisionPosture: "user_decides";
  }>;
  interpretationDecisionPolicy: typeof INTERPRETATION_DECISION_POLICY_V0_1;
  sourceAuthorityPromotion: "NONE";
  productionAuthority: "NONE";
  historicalOrigin: "NOT_CLAIMED";
}>;

export type ProjectFunctionalMotivationTraceResultV0_1 =
  | Readonly<{ status: "READY"; projection: FunctionalMotivationTraceProjectionV0_1 }>
  | Readonly<{ status: "REJECTED"; reasonCodes: readonly string[] }>;

function formatVoiceEvents(events: readonly Readonly<{ voice: string; position: number }>[]): string[] {
  return events.map(({ voice, position }) => `${voice}@${position}`);
}

function sourceEvents(
  sourceIds: readonly string[],
  sourceMap: ReadonlyMap<string, FunctionalMotivationTraceSourceV0_1>,
): FunctionalMotivationTraceSourceV0_1[] {
  return sourceIds.map((sourceId) => sourceMap.get(sourceId)!).filter(Boolean);
}

function operationProjection(
  id: string,
  input: CrossLanguageOperationLedgerInputV0_2,
): FunctionalMotivationTraceOperationV0_1 | null {
  const result = buildCrossLanguageOperationLedgerV0_2(input);
  if (result.status !== "READY") return null;

  const { ledger } = result;
  const application = ledger.operations.at(-1);
  if (!application || application.status !== "APPLIED" || application.after === null) return null;

  const exactLedger = ledger.operations.map((item) => {
    const removedText = item.removedText === null ? "" : ` ${item.removedText}`;
    const removedSpan = item.removedSpan ? ` · removed span [${item.removedSpan.start},${item.removedSpan.end})` : "";
    const positions = item.positions.length
      ? ` at zero-based code-point position${item.positions.length === 1 ? "" : "s"} ${item.positions.join(", ")}`
      : " with no position";
    return `${item.before} → ${item.after ?? "UNKNOWN_OR_NULL"} · ${item.kind}${removedText}${positions}${removedSpan} · cost ${item.cost}`;
  }).join("; ");

  return {
    id,
    before: application.before,
    after: application.after,
    operationId: application.operationId,
    kind: application.kind,
    operationCount: ledger.operationCount,
    cost: ledger.totalCost,
    position: application.positions[0] ?? null,
    positionUnit: ledger.positionUnit,
    removedText: application.removedText,
    removedSpan: application.removedSpan,
    voicesBefore: formatVoiceEvents(ledger.initialWrittenVoices.events),
    voicesAfter: formatVoiceEvents(ledger.finalWrittenVoices.events),
    omittedVoices: ledger.omittedVoiceEvents.map(({ voice, position }) => `${voice}@${position}`),
    inverseStatus: ledger.inverseReplay.status,
    inverseForm: ledger.inverseReplay.reconstructedInitialForm,
    mechanicalStatus: ledger.mechanicalReconstructionStatus,
    authority: ledger.relationship.authority,
    evidenceStatus: ledger.relationship.evidenceStatus,
    linguisticApplicability: ledger.relationship.linguisticApplicabilityStatus,
    exactLedger,
    ledger,
  };
}

function reject(reasonCodes: readonly string[]): ProjectFunctionalMotivationTraceResultV0_1 {
  return { status: "REJECTED", reasonCodes: [...new Set(reasonCodes)] };
}

export function projectFunctionalMotivationTraceV0_1(
  input: FunctionalMotivationTraceInputV0_1,
): ProjectFunctionalMotivationTraceResultV0_1 {
  const reasons: string[] = [];
  const sourceMap = new Map<string, FunctionalMotivationTraceSourceV0_1>();
  const termMap = new Map<string, FunctionalMotivationTraceTermV0_1>();
  const operationMap = new Map<string, FunctionalMotivationTraceOperationV0_1>();

  for (const source of input.sources) {
    if (!source.sourceId || sourceMap.has(source.sourceId)) reasons.push("SOURCE_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    else sourceMap.set(source.sourceId, source);
  }
  for (const term of input.terms) {
    if (!term.id || termMap.has(term.id)) reasons.push("TERM_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    else termMap.set(term.id, term);
  }
  for (const [field, ids] of [
    ["target", input.target.sourceIds],
    ["equation", input.equation.sourceIds],
    ["surfaceReconstruction", input.surfaceReconstruction.sourceIds],
    ...input.terms.map((term) => [`term:${term.id}`, term.sourceIds] as const),
    ...input.alternatives.map((claim, index) => [`alternative:${index}`, claim.sourceIds] as const),
    ...input.contrasts.map((claim, index) => [`contrast:${index}`, claim.sourceIds] as const),
    ...input.unresolved.map((claim, index) => [`unresolved:${index}`, claim.sourceIds] as const),
    ...input.reasoningSteps.map((step) => [`step:${step.id}`, step.sourceIds] as const),
  ] as const) {
    for (const id of ids) if (!sourceMap.has(id)) reasons.push(`UNKNOWN_SOURCE_REFERENCE:${field}:${id}`);
  }
  for (const id of input.equation.contributorTermIds) {
    if (!termMap.has(id)) reasons.push(`UNKNOWN_EQUATION_TERM:${id}`);
  }
  if (input.equation.contributorTermIds.length === 0) reasons.push("FUNCTIONAL_EQUATION_REQUIRES_AT_LEAST_ONE_TERM");
  if (new Set(input.equation.contributorTermIds).size !== input.equation.contributorTermIds.length) {
    reasons.push("FUNCTIONAL_EQUATION_TERM_IDS_MUST_BE_UNIQUE");
  }

  const operationIds = new Set<string>();
  for (const item of input.operations) {
    if (!item.id || operationIds.has(item.id)) {
      reasons.push("OPERATION_LEDGER_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
      continue;
    }
    operationIds.add(item.id);
    const projection = operationProjection(item.id, item.input);
    if (!projection) reasons.push(`OPERATION_LEDGER_NOT_READY:${item.id}`);
    else operationMap.set(item.id, projection);
  }
  for (const step of input.reasoningSteps) {
    if (step.operationLedgerId && !operationIds.has(step.operationLedgerId)) {
      reasons.push(`UNKNOWN_STEP_OPERATION_LEDGER:${step.id}:${step.operationLedgerId}`);
    }
  }

  const characters = Array.from(input.target.exactSpelling);
  const computedCodePoints = characters.map((character, position) => ({ character, position }));
  const computedWrittenVoices = characters.flatMap((character, position) => {
    const voice = extractSevenVowelsFromString(character)[0];
    return voice ? [{ voice, position }] : [];
  });
  if (input.target.expectedCodePoints && JSON.stringify(input.target.expectedCodePoints) !== JSON.stringify(computedCodePoints)) {
    reasons.push("TARGET_CODE_POINT_LEDGER_DOES_NOT_MATCH_EXACT_SPELLING");
  }
  if (input.target.expectedWrittenVoices && JSON.stringify(input.target.expectedWrittenVoices) !== JSON.stringify(computedWrittenVoices)) {
    reasons.push("TARGET_WRITTEN_VOICE_LEDGER_DOES_NOT_MATCH_EXACT_SPELLING");
  }

  const rawConcatenation = input.surfaceReconstruction.components.map(({ spelling }) => spelling).join("");
  const reconstructionStatus = rawConcatenation === input.target.exactSpelling ? "EXACT_MATCH" : "MISMATCH";
  if (reconstructionStatus !== input.surfaceReconstruction.expectedStatus) {
    reasons.push("RECONSTRUCTION_EXPECTATION_CONFLICTS_WITH_EXACT_STRINGS");
  }
  if (reasons.length > 0) return reject(reasons);

  let componentStart = 0;
  const components = input.surfaceReconstruction.components.map((component) => {
    const start = componentStart;
    const end = start + Array.from(component.spelling).length;
    componentStart = end;
    return {
      spelling: component.spelling,
      span: { start, end },
      function: component.functionText,
      claimLayer: component.claimLayer,
      status: component.unresolved ? "UNKNOWN_OR_NULL" : component.status,
    };
  });

  const contributors = input.equation.contributorTermIds.map((id) => termMap.get(id)!);
  const equationLeft = contributors.map((term) => `${term.spelling} (${term.functionText})`).join(" + ");
  const equation = `${equationLeft} → ${input.equation.resultText} → ${input.target.exactSpelling} (${input.equation.targetDescription})`;
  const functionalReading = `${contributors.map((term) => `${term.spelling} (${term.functionText})`).join(" + ")} → ${input.equation.resultText}`;
  const roles = input.terms.map((term) => {
    const classification = term.freeOperatorClassification
      ? `; free-operator classification ${term.freeOperatorClassification}`
      : "";
    const citations = sourceEvents(term.sourceIds, sourceMap)
      .map((source) => `${source.label} (${source.citationStatus})`);
    const sourceContext = citations.length ? ` Sources: ${citations.join("; ")}.` : "";
    return `${term.spelling}: ${term.roleNote}${classification} · ${term.claimLayer} · ${term.status}.${sourceContext}`;
  });

  const operations = [...operationMap.values()];
  const operationById = operationMap;
  const reasoningTrace: FunctionalMotivationTraceStepV0_1[] = input.reasoningSteps.map((step) => {
    const operation = step.operationLedgerId ? operationById.get(step.operationLedgerId) : undefined;
    const exactOperation = operation
      ? `${operation.before} → ${operation.after}; ${operation.exactLedger}; inverse ${operation.inverseForm ?? "UNKNOWN_OR_NULL"} (${operation.inverseStatus}); linguistic applicability ${operation.linguisticApplicability}.`
      : step.reconstructsSurface
        ? `${input.surfaceReconstruction.components.map(({ spelling }) => spelling).join(" + ")} = ${rawConcatenation} · target ${input.target.exactSpelling} · ${reconstructionStatus}. ${input.surfaceReconstruction.note}`
        : step.exactStructure ?? null;
    return {
      id: step.id,
      title: step.title,
      from: step.from,
      relationshipType: step.relationshipType,
      to: step.to,
      claimLayer: step.claimLayer,
      status: step.status,
      sources: sourceEvents(step.sourceIds, sourceMap),
      evidenceNote: step.evidenceNote,
      supportBoundary: step.supportBoundary,
      exactOperation,
    };
  });

  return {
    status: "READY",
    projection: {
      schemaVersion: FUNCTIONAL_MOTIVATION_TRACE_SCHEMA_V0_1,
      target: {
        ...input.target,
        codePoints: computedCodePoints.map(({ character, position }) => `${character}@${position}`),
        writtenVoices: formatVoiceEvents(computedWrittenVoices),
      },
      motivationEquation: {
        equation,
        roles,
        claimLayer: input.equation.claimLayer,
        status: input.equation.status,
        sourceAuthorityPromotion: "NONE",
      },
      components,
      functionalReading: {
        text: input.functionalReading.text || functionalReading,
        claimLayer: input.functionalReading.claimLayer,
        status: input.functionalReading.status,
      },
      reconstruction: {
        text: `${input.surfaceReconstruction.components.map(({ spelling }) => spelling).join(" + ")} = ${rawConcatenation} · target ${input.target.exactSpelling}`,
        status: reconstructionStatus,
        note: input.surfaceReconstruction.note,
      },
      operations,
      alternatives: input.alternatives,
      contrasts: input.contrasts,
      unresolved: input.unresolved,
      notes: input.notes,
      sources: input.sources,
      reasoningTrace,
      sourceFidelity: input.sourceFidelity ?? [],
      selection: {
        mode: "no_single_winner",
        selectedCandidateId: null,
        userDecisionPosture: "user_decides",
      },
      interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
      sourceAuthorityPromotion: "NONE",
      productionAuthority: "NONE",
      historicalOrigin: "NOT_CLAIMED",
    },
  };
}
