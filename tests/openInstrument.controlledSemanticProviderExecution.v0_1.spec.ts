import {
  fingerprintControlledSemanticExecutionPacketV0_1,
  runControlledSemanticProviderExecutionV0_1,
  type ControlledSemanticExecutionAuthorizationV0_1,
  type ControlledSemanticExecutionPacketV0_1,
} from "@/shared/openInstrument/controlledSemanticProviderExecution.v0_1";
import type { SemanticAlignmentProposalResultV0_1 } from "@/shared/orchestrator/semanticAlignmentProposal.v0_1";

const structuralIds = [
  "logic-structural:candle:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:bistro:is:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:contra:on:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:mantra:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
];
const words = ["candle", "bistro", "contra", "mantra"];
const targets = words.flatMap((word, index) => ["plausible", "unrelated"].map((sense) => ({
  word, targetSenseId: `${word}_${sense}`, targetSenseLabel: sense === "plausible" ? `${word} functional sense` : "unrelated sense", structuralHypothesisId: structuralIds[index],
})));
const packet: ControlledSemanticExecutionPacketV0_1 = {
  schemaVersion: "open-instrument.controlled-semantic-provider-runner.v0_1",
  packetId: "fixture.controlled-semantic-provider-run.v0.1",
  milestoneId: "OPEN_INSTRUMENT_FIRST_CONTROLLED_SEMANTIC_PROVIDER_EXECUTION_AUTHORIZATION_AND_BOUNDED_RUNNER_V1",
  providerId: "openai_compat", modelId: "fixture-model", endpointUrl: "http://127.0.0.1:11434/v1", localOnly: true,
  targets, maximumCallCount: 8, timeoutMs: 8000, maximumRetryCount: 0,
  purpose: "controlled_semantic_alignment_research", truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion",
};
let authorizationCount = 0;
function authorization(state: ControlledSemanticExecutionAuthorizationV0_1["state"] = "granted_one_shot_local_only"): ControlledSemanticExecutionAuthorizationV0_1 {
  authorizationCount += 1;
  return { schemaVersion: packet.schemaVersion, authorizationId: `auth-${authorizationCount}`, state, milestoneId: packet.milestoneId, providerId: packet.providerId, modelId: packet.modelId, packetFingerprint: fingerprintControlledSemanticExecutionPacketV0_1(packet), maximumCallCount: 8, timeoutMs: 8000, maximumRetryCount: 0, localOnly: true, purpose: packet.purpose, truthBoundary: packet.truthBoundary };
}
function proposal(status: "proposed" | "unknown" | "rejected", error: SemanticAlignmentProposalResultV0_1["error"] = null): SemanticAlignmentProposalResultV0_1 {
  return { attempted: true, status, provider: "openai_compat", providerReady: true, realProvider: true, mockProvider: false, reasonCodes: [], timeoutMs: 8000, assessment: { schemaVersion: "open-instrument.semantic-alignment.v0_1", targetWord: "fixture", targetSenseId: "fixture", targetSenseLabel: "fixture", structuralHypothesisId: "fixture", alignmentStatus: status, alignmentSource: "provider_proposed_hypothesis", semanticBridge: status === "proposed" ? "A bounded reviewable functional relation remains a hypothesis." : null, doctrineRoles: [] }, error };
}

describe("controlled semantic provider execution v0.1", () => {
  test("rejects absent, consumed, and mismatched authorization without calls", async () => {
    const execute = jest.fn(async () => proposal("proposed"));
    expect((await runControlledSemanticProviderExecutionV0_1(packet, authorization("authorization_not_granted"), { execute })).status).toBe("blocked");
    expect((await runControlledSemanticProviderExecutionV0_1(packet, authorization("consumed"), { execute })).status).toBe("blocked");
    expect((await runControlledSemanticProviderExecutionV0_1({ ...packet, maximumCallCount: 7 }, authorization(), { execute })).status).toBe("blocked");
    expect(execute).not.toHaveBeenCalled();
  });
  test("executes exactly the frozen calls and consumes authorization", async () => {
    const execute = jest.fn(async () => proposal("unknown"));
    const auth = authorization();
    const result = await runControlledSemanticProviderExecutionV0_1(packet, auth, { execute });
    expect(result.status).toBe("completed"); expect(result.plannedCalls).toBe(8); expect(result.attemptedCalls).toBe(8); expect(result.counts.unknown).toBe(8); expect(execute).toHaveBeenCalledTimes(8);
    expect((await runControlledSemanticProviderExecutionV0_1(packet, auth, { execute })).reasonCodes).toContain("AUTHORIZATION_CONSUMED");
  });
  test("enforces local-only, sense, retry, and call bounds", async () => {
    const execute = jest.fn(async () => proposal("proposed"));
    expect((await runControlledSemanticProviderExecutionV0_1({ ...packet, endpointUrl: "https://api.example.test/v1" }, authorization(), { execute })).reasonCodes).toContain("LOCAL_ONLY_ENDPOINT_REQUIRED");
    expect((await runControlledSemanticProviderExecutionV0_1({ ...packet, maximumRetryCount: 1 as 0 }, authorization(), { execute })).reasonCodes).toContain("RETRY_BOUND_INVALID");
    expect((await runControlledSemanticProviderExecutionV0_1({ ...packet, targets: packet.targets.slice(0, 7), maximumCallCount: 7 }, authorization(), { execute })).reasonCodes).toContain("SENSE_BOUND_INVALID");
    expect(execute).not.toHaveBeenCalled();
  });
  test("requires provider readiness before the default executor", async () => {
    const result = await runControlledSemanticProviderExecutionV0_1(packet, authorization());
    expect(result.status).toBe("blocked");
    expect(result.reasonCodes).toContain("SEMANTIC_ALIGNMENT_DISABLED");
    expect(result.attemptedCalls).toBe(0);
  });
  test("counts timeout/provider error once and never emits a candidate or evidence", async () => {
    let call = 0;
    const execute = jest.fn(async () => {
      call += 1;
      return call === 1 ? proposal("unknown", "timeout") : call === 2 ? proposal("unknown", "provider_error") : proposal("unknown");
    });
    const result = await runControlledSemanticProviderExecutionV0_1(packet, authorization(), { execute });
    expect(result.counts.timeout).toBe(1); expect(result.counts.providerError).toBe(1);
    expect(result.rows.every((row) => row.logicCandidateEmitted === false && row.truthBoundary === "hypothesis_only_user_decides_no_evidence_promotion")).toBe(true);
  });
});
