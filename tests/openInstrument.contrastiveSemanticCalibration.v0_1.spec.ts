import {
  buildContrastiveSemanticContextV0_1,
  CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_1,
  parseContrastiveSemanticProposalV0_1,
  type ContrastiveSemanticPairV0_1,
} from "../src/shared/openInstrument/contrastiveSemanticCalibration.v0_1";
import { contrastiveSemanticContextForPromptV0_1 } from "../src/shared/llm/prompts/semanticAlignmentProposer.v0.1";
import {
  CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_1,
  fingerprintControlledSemanticContrastiveExecutionPacketV0_1,
  runControlledSemanticContrastiveProviderExecutionV0_1,
  validateControlledSemanticContrastiveExecutionPacketV0_1,
  type ControlledSemanticContrastiveAuthorizationV0_1,
  type ControlledSemanticContrastiveExecutionPacketV0_1,
} from "../src/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_1";
import { discoverStructuralHypothesesV0_1 } from "../src/shared/structuralHypothesisDiscovery.v0_1";
import type { ContrastiveSemanticProposalResultV0_1 } from "../src/shared/orchestrator/contrastiveSemanticCalibrationProposal.v0_1";

const structuralIds = [
  "logic-structural:candle:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:bistro:is:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:contra:on:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:mantra:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
];
const words = ["candle", "bistro", "contra", "mantra"];

function pair(word: string, structuralHypothesisId: string, firstId: string, secondId: string): ContrastiveSemanticPairV0_1 {
  return {
    word,
    structuralHypothesisId,
    senseA: {
      targetSenseId: firstId,
      targetSenseLabel: "light-producing object sense",
      targetSenseDefinition: "A portable object that produces light by sustaining a controlled flame.",
    },
    senseB: {
      targetSenseId: secondId,
      targetSenseLabel: "metal fastener sense",
      targetSenseDefinition: "A compact metal fastener used to join two rigid components.",
    },
  };
}

const pairs = words.map((word, index) => pair(word, structuralIds[index], `${word}_a`, `${word}_b`));
const packet: ControlledSemanticContrastiveExecutionPacketV0_1 = {
  schemaVersion: "open-instrument.controlled-semantic-contrastive-runner.v0_1",
  controlledExecutionVersion: CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_1,
  packetId: "fixture.controlled-semantic-contrastive-run.v0.1",
  milestoneId: "OPEN_INSTRUMENT_CONTRASTIVE_SEMANTIC_CALIBRATION_V1",
  providerId: "openai_compat",
  modelId: "fixture-model",
  endpointUrl: "http://127.0.0.1:11434/v1",
  localOnly: true,
  contrastiveDecisionContractVersion: CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_1,
  pairs,
  maximumCallCount: 4,
  timeoutMs: 8000,
  maximumRetryCount: 0,
  purpose: "controlled_semantic_alignment_research",
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion",
};
let authorizationCount = 0;

function authorization(state: ControlledSemanticContrastiveAuthorizationV0_1["state"] = "granted_one_shot_local_only"): ControlledSemanticContrastiveAuthorizationV0_1 {
  authorizationCount += 1;
  return {
    schemaVersion: packet.schemaVersion,
    controlledExecutionVersion: packet.controlledExecutionVersion,
    authorizationId: `contrastive-auth-${authorizationCount}`,
    state,
    milestoneId: packet.milestoneId,
    providerId: packet.providerId,
    modelId: packet.modelId,
    packetFingerprint: fingerprintControlledSemanticContrastiveExecutionPacketV0_1(packet),
    maximumCallCount: 4,
    timeoutMs: 8000,
    maximumRetryCount: 0,
    localOnly: true,
    contrastiveDecisionContractVersion: packet.contrastiveDecisionContractVersion,
    purpose: packet.purpose,
    truthBoundary: packet.truthBoundary,
  };
}

function proposedResult(context: Parameters<NonNullable<Parameters<typeof runControlledSemanticContrastiveProviderExecutionV0_1>[2]>["execute"]>[0]): ContrastiveSemanticProposalResultV0_1 {
  const role = context.doctrineProjection.projections[0].doctrineRole;
  return {
    attempted: true,
    status: "proposed",
    provider: "mock",
    providerReady: true,
    realProvider: false,
    mockProvider: true,
    reasonCodes: ["CONTRASTIVE_RELATION_STRUCTURE_SPECIFIC"],
    timeoutMs: 8000,
    assessment: {
      schemaVersion: "open-instrument.semantic-alignment.v0_1",
      targetWord: context.targetWord,
      structuralHypothesisId: context.structuralHypothesisId,
      preferredSense: "sense_a",
      alignmentStatus: "proposed",
      semanticBridge: "The first option has a bounded function that can be compared with the supplied structural path.",
      doctrineRoles: [role],
      supportTrace: { structuralElements: [context.structuralHypothesisId], doctrineRoles: [role] },
      reasonCodes: ["CONTRASTIVE_RELATION_STRUCTURE_SPECIFIC"],
      providerId: "mock",
      modelId: "mock_contrastive",
    },
    error: null,
  };
}

describe("Open Instrument contrastive semantic calibration v0.1", () => {
  test("builds exactly four pairs with two senses sharing structure", () => {
    expect(packet.pairs).toHaveLength(4);
    expect(packet.pairs.every((item) => item.senseA.targetSenseId !== item.senseB.targetSenseId)).toBe(true);
    expect(packet.pairs.map((item) => item.structuralHypothesisId)).toEqual(structuralIds);
    expect(validateControlledSemanticContrastiveExecutionPacketV0_1(packet)).toEqual([]);
  });

  test("serializes anonymous slots without internal IDs or answer labels", () => {
    const structural = discoverStructuralHypothesesV0_1("candle")[0];
    if (!structural) throw new Error("missing candle structural fixture");
    const result = buildContrastiveSemanticContextV0_1(pairs[0], structural);
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    const serialized = JSON.stringify(contrastiveSemanticContextForPromptV0_1(result.context));
    expect(serialized).toContain("sense_a");
    expect(serialized).toContain("sense_b");
    expect(serialized).toContain("light-producing object sense");
    expect(serialized).toContain("metal fastener sense");
    expect(serialized).not.toContain("candle_a");
    expect(serialized).not.toContain("candle_b");
    expect(serialized).not.toMatch(/_plausible|_unrelated|positive|negative|expected (?:answer|winner)|selected slot/i);
    expect(serialized).toContain("structuralHypothesisId");
    expect(serialized).toContain("doctrineProjection");
  });

  test("accepts a selected sense with bounded support trace", () => {
    const structural = discoverStructuralHypothesesV0_1("candle")[0];
    if (!structural) throw new Error("missing candle structural fixture");
    const contextResult = buildContrastiveSemanticContextV0_1(pairs[0], structural);
    if (!contextResult.ok) throw new Error(contextResult.reasonCodes.join(","));
    const role = contextResult.context.doctrineProjection.projections[0].doctrineRole;
    expect(parseContrastiveSemanticProposalV0_1({
      contrastiveDecision: { preferredSense: "sense_a" },
      semanticBridge: "The first option has a bounded function that can be compared with the supplied structural path.",
      doctrineRoles: [role],
      supportTrace: { structuralElements: [contextResult.context.structuralHypothesisId], doctrineRoles: [role] },
      reasonCodes: ["CONTRASTIVE_RELATION_STRUCTURE_SPECIFIC"],
    }, contextResult.context, { providerId: "fixture" })).toMatchObject({ ok: true, assessment: { preferredSense: "sense_a", alignmentStatus: "proposed" } });
  });

  test.each(["neither", "both_or_unclear"] as const)("accepts %s as uncertainty without a bridge", (preferredSense) => {
    const structural = discoverStructuralHypothesesV0_1("candle")[0];
    if (!structural) throw new Error("missing candle structural fixture");
    const contextResult = buildContrastiveSemanticContextV0_1(pairs[0], structural);
    if (!contextResult.ok) throw new Error(contextResult.reasonCodes.join(","));
    expect(parseContrastiveSemanticProposalV0_1({
      contrastiveDecision: { preferredSense },
      semanticBridge: null,
      doctrineRoles: [],
      supportTrace: null,
      reasonCodes: [preferredSense === "neither" ? "CONTRASTIVE_RELATION_NEITHER" : "CONTRASTIVE_RELATION_BOTH_OR_UNCLEAR"],
    }, contextResult.context, {})).toMatchObject({ ok: true, assessment: { alignmentStatus: "unknown", semanticBridge: null } });
  });

  test.each([
    ["missing selected bridge", { contrastiveDecision: { preferredSense: "sense_a" }, semanticBridge: null, doctrineRoles: [], supportTrace: null, reasonCodes: ["CONTRASTIVE_RELATION_STRUCTURE_SPECIFIC"] }],
    ["invented structural trace", { contrastiveDecision: { preferredSense: "sense_a" }, semanticBridge: "The first option has a bounded function that can be compared with the supplied structural path.", doctrineRoles: ["Initiation/Source"], supportTrace: { structuralElements: ["invented"], doctrineRoles: ["Initiation/Source"] }, reasonCodes: ["CONTRASTIVE_RELATION_STRUCTURE_SPECIFIC"] }],
    ["forbidden truth claim", { contrastiveDecision: { preferredSense: "sense_a" }, semanticBridge: "This is the proven historical origin and true meaning of the first option.", doctrineRoles: ["Initiation/Source"], supportTrace: { structuralElements: [structuralIds[0]], doctrineRoles: ["Initiation/Source"] }, reasonCodes: ["CONTRASTIVE_RELATION_STRUCTURE_SPECIFIC"] }],
  ])("rejects %s", (_name, value) => {
    const structural = discoverStructuralHypothesesV0_1("candle")[0];
    if (!structural) throw new Error("missing candle structural fixture");
    const contextResult = buildContrastiveSemanticContextV0_1(pairs[0], structural);
    if (!contextResult.ok) throw new Error(contextResult.reasonCodes.join(","));
    expect(parseContrastiveSemanticProposalV0_1(value, contextResult.context, { providerId: "fixture" })).toMatchObject({ ok: false });
  });

  test.each([
    ["reasonCodes", undefined, "CONTRASTIVE_REASON_CODES_FIELD_MISSING"],
    ["reasonCodes", "not-an-array", "CONTRASTIVE_REASON_CODES_FIELD_WRONG_TYPE"],
    ["reasonCodes", ["ok", 7], "CONTRASTIVE_REASON_CODES_NON_STRING_MEMBER"],
    ["reasonCodes", ["   "], "CONTRASTIVE_REASON_CODES_EMPTY_MEMBER"],
    ["doctrineRoles", undefined, "CONTRASTIVE_DOCTRINE_ROLES_FIELD_MISSING"],
    ["doctrineRoles", "not-an-array", "CONTRASTIVE_DOCTRINE_ROLES_FIELD_WRONG_TYPE"],
    ["doctrineRoles", ["Initiation/Source", 7], "CONTRASTIVE_DOCTRINE_ROLES_NON_STRING_MEMBER"],
    ["doctrineRoles", ["   "], "CONTRASTIVE_DOCTRINE_ROLES_EMPTY_MEMBER"],
  ] as const)("reports bounded diagnostics for invalid %s", (field, invalidValue, expectedCode) => {
    const structural = discoverStructuralHypothesesV0_1("candle")[0];
    if (!structural) throw new Error("missing candle structural fixture");
    const contextResult = buildContrastiveSemanticContextV0_1(pairs[0], structural);
    if (!contextResult.ok) throw new Error(contextResult.reasonCodes.join(","));
    const role = contextResult.context.doctrineProjection.projections[0].doctrineRole;
    const output: Record<string, unknown> = {
      contrastiveDecision: { preferredSense: "neither" },
      semanticBridge: null,
      doctrineRoles: [role],
      supportTrace: null,
      reasonCodes: ["CONTRASTIVE_RELATION_NEITHER"],
    };
    output[field] = invalidValue;
    const parsed = parseContrastiveSemanticProposalV0_1(output, contextResult.context, { providerId: "fixture" });
    expect(parsed).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["CONTRASTIVE_OUTPUT_FIELDS_INVALID", expectedCode]),
      diagnostics: {
        parseStage: "field_shape",
        objectExtracted: true,
        fieldIssues: expect.arrayContaining([{ field, issue: expect.any(String) }]),
      },
    });
  });

  test("binds pair order, contract version, four calls, retries, timeout, and loopback", async () => {
    const execute = jest.fn(async (context: Parameters<NonNullable<Parameters<typeof runControlledSemanticContrastiveProviderExecutionV0_1>[2]>["execute"]>[0]) => proposedResult(context));
    const result = await runControlledSemanticContrastiveProviderExecutionV0_1(packet, authorization(), { execute });
    expect(result).toMatchObject({ status: "completed", authorizationState: "consumed", plannedCalls: 4, attemptedCalls: 4, completedCalls: 4, counts: { proposed: 4 } });
    expect(execute).toHaveBeenCalledTimes(4);
    const swapped = { ...packet, pairs: [packet.pairs[0], packet.pairs[1], packet.pairs[3], packet.pairs[2]] };
    expect(fingerprintControlledSemanticContrastiveExecutionPacketV0_1(swapped)).not.toBe(fingerprintControlledSemanticContrastiveExecutionPacketV0_1(packet));
    expect(fingerprintControlledSemanticContrastiveExecutionPacketV0_1({ ...packet, contrastiveDecisionContractVersion: "open-instrument.semantic-contrastive-decision-contract.v9" as typeof packet.contrastiveDecisionContractVersion })).not.toBe(fingerprintControlledSemanticContrastiveExecutionPacketV0_1(packet));
    expect(fingerprintControlledSemanticContrastiveExecutionPacketV0_1({ ...packet, controlledExecutionVersion: "open-instrument.controlled-semantic-contrastive-execution.v9" as typeof packet.controlledExecutionVersion })).not.toBe(fingerprintControlledSemanticContrastiveExecutionPacketV0_1(packet));
    expect((await runControlledSemanticContrastiveProviderExecutionV0_1({ ...packet, maximumCallCount: 3 as 4 }, authorization(), { execute })).status).toBe("blocked");
    expect((await runControlledSemanticContrastiveProviderExecutionV0_1({ ...packet, endpointUrl: "https://example.test/v1" }, authorization(), { execute })).status).toBe("blocked");
  });

  test("keeps execution provenance distinct from the semantic decision contract", () => {
    expect(CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_1).not.toBe(CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_1);
    expect(packet.controlledExecutionVersion).toBe(CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_1);
  });

  test("authorization mismatch blocks before any pair execution", async () => {
    const execute = jest.fn(async (context: Parameters<NonNullable<Parameters<typeof runControlledSemanticContrastiveProviderExecutionV0_1>[2]>["execute"]>[0]) => proposedResult(context));
    const result = await runControlledSemanticContrastiveProviderExecutionV0_1(packet, { ...authorization(), packetFingerprint: "wrong" }, { execute });
    expect(result.status).toBe("blocked");
    expect(execute).not.toHaveBeenCalled();
  });

  test("execution-version mismatch blocks before any provider call", async () => {
    const execute = jest.fn(async (context: Parameters<NonNullable<Parameters<typeof runControlledSemanticContrastiveProviderExecutionV0_1>[2]>["execute"]>[0]) => proposedResult(context));
    const result = await runControlledSemanticContrastiveProviderExecutionV0_1(
      packet,
      { ...authorization(), controlledExecutionVersion: "open-instrument.controlled-semantic-contrastive-execution.v9" as typeof packet.controlledExecutionVersion },
      { execute },
    );
    expect(result).toMatchObject({ status: "blocked", controlledExecutionVersion: CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_1, reasonCodes: expect.arrayContaining(["CONTRASTIVE_EXECUTION_VERSION_MISMATCH"]) });
    expect(execute).not.toHaveBeenCalled();
  });

  test("keeps neutral outcomes candidate-free and truth-bounded", async () => {
    const execute = jest.fn(async (): Promise<ContrastiveSemanticProposalResultV0_1> => ({
      attempted: true,
      status: "unknown",
      provider: "mock",
      providerReady: true,
      realProvider: false,
      mockProvider: true,
      reasonCodes: ["CONTRASTIVE_RELATION_BOTH_OR_UNCLEAR"],
      timeoutMs: 8000,
      assessment: { schemaVersion: "open-instrument.semantic-alignment.v0_1", targetWord: "fixture", structuralHypothesisId: "fixture", preferredSense: "both_or_unclear", alignmentStatus: "unknown", semanticBridge: null, doctrineRoles: [], supportTrace: null, reasonCodes: ["CONTRASTIVE_RELATION_BOTH_OR_UNCLEAR"] },
      error: null,
    }));
    const result = await runControlledSemanticContrastiveProviderExecutionV0_1(packet, authorization(), { execute });
    expect(result.rows.every((row) => row.logicCandidateEmitted === false && row.aggregateStatus === "unknown" && row.truthBoundary === "hypothesis_only_user_decides_no_evidence_promotion")).toBe(true);
  });

  test("keeps controlled diagnostics sanitized and preserves bound model and elapsed time", async () => {
    let call = 0;
    const execute = jest.fn(async (): Promise<ContrastiveSemanticProposalResultV0_1> => {
      call += 1;
      const timeout = call === 1;
      return {
        attempted: true,
        status: timeout ? "provider_error" : "malformed_output",
        provider: "mock",
        providerReady: true,
        realProvider: false,
        mockProvider: true,
        reasonCodes: [timeout ? "CONTRASTIVE_PROVIDER_TIMEOUT" : "CONTRASTIVE_OUTPUT_FIELDS_INVALID"],
        timeoutMs: 8000,
        assessment: null,
        diagnostics: {
          parseStage: timeout ? "provider_timeout" : "field_shape",
          jsonParsed: !timeout,
          topLevelType: timeout ? "unavailable" : "object",
          objectExtracted: !timeout,
          fieldIssues: timeout ? [] : [{ field: "reasonCodes", issue: "missing" }],
        },
        error: timeout ? "timeout" : null,
      };
    });
    const result = await runControlledSemanticContrastiveProviderExecutionV0_1(packet, authorization(), { execute });
    expect(result).toMatchObject({ controlledExecutionVersion: CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_1 });
    expect(result.rows).toHaveLength(4);
    expect(result.rows.every((row) => row.modelId === "fixture-model")).toBe(true);
    expect(result.rows.every((row) => Number.isInteger(row.elapsedMs) && row.elapsedMs >= 0)).toBe(true);
    expect(result.rows[0]).toMatchObject({ timeout: true, diagnostics: { parseStage: "provider_timeout" } });
    expect(result.rows[1]).toMatchObject({ malformed: true, diagnostics: { fieldIssues: [{ field: "reasonCodes", issue: "missing" }] } });
    expect(JSON.stringify(result)).not.toContain("rawText");
  });
});
