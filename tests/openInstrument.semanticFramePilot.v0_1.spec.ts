import packetFixture from "../docs/open-instrument/fixtures/semantic-frame-pilot/semantic-frame-pilot.v0.1.json";
import {
  buildSemanticFramePilotNullControlV0_1,
  buildSemanticFramePilotUserPayloadV0_1,
  fingerprintSemanticFramePilotExecutionV0_1,
  parseSemanticFramePilotProposalV0_1,
  runSemanticFramePilotV0_1,
  validateSemanticFramePilotPacketV0_1,
  type SemanticFramePilotAuthorizationV0_1,
  type SemanticFramePilotExecutionPlanV0_1,
  type SemanticFramePilotPacketV0_1,
  type SemanticFramePilotTargetV0_1,
} from "@/scripts/openInstrumentSemanticFramePilot.v0.1";

const packet = packetFixture as unknown as SemanticFramePilotPacketV0_1;
let authorizationSequence = 0;

function targetFor(word: string): SemanticFramePilotTargetV0_1 {
  const target = packet.targets.find((candidate) => candidate.word === word);
  if (!target) throw new Error(`missing test target ${word}`);
  return target;
}

function planFor(
  packetUnderTest: SemanticFramePilotPacketV0_1 = packet,
  endpointUrl = "http://127.0.0.1:11434",
): SemanticFramePilotExecutionPlanV0_1 {
  return {
    providerId: "openai_compat",
    modelId: "qwen3:8b",
    endpointUrl,
    localOnly: true,
    maximumCallCount: packetUnderTest.targets.length,
    timeoutMs: 8000,
    maximumOutputTokens: 512,
    maximumRetryCount: 0,
    truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion",
  };
}

function authorizationFor(
  packetUnderTest: SemanticFramePilotPacketV0_1,
  plan: SemanticFramePilotExecutionPlanV0_1,
  state: SemanticFramePilotAuthorizationV0_1["state"] = "granted_one_shot_local_only",
): SemanticFramePilotAuthorizationV0_1 {
  authorizationSequence += 1;
  return {
    schemaVersion: "open-instrument.semantic-frame-pilot.authorization.v0_1",
    authorizationId: `semantic-frame-pilot-test-${authorizationSequence}`,
    state,
    packetFingerprint: fingerprintSemanticFramePilotExecutionV0_1(packetUnderTest, plan),
    providerId: plan.providerId,
    modelId: plan.modelId,
    endpointUrl: plan.endpointUrl,
    maximumCallCount: plan.maximumCallCount,
    timeoutMs: plan.timeoutMs,
    maximumOutputTokens: plan.maximumOutputTokens,
    maximumRetryCount: 0,
    localOnly: true,
    truthBoundary: plan.truthBoundary,
  };
}

function claim(text: string | null, evidenceRefs: string[] = []): Record<string, unknown> {
  return { text, evidenceRefs };
}

function proposalFor(target: SemanticFramePilotTargetV0_1): string {
  const sourceId = target.targetSourceId;
  return JSON.stringify({
    word: target.word,
    targetSenseId: target.targetSenseId,
    embryo: null,
    action: claim("A proposed release action", [sourceId]),
    patient: claim("A person affected by that action", [sourceId]),
    resultState: claim("The person is no longer confined", [sourceId]),
    wholeWordFunction: claim("A proposed freedom-related function", [sourceId]),
    causalExplanation: claim("Release changes the person's confinement state", [sourceId]),
    unresolvedOperations: [],
    alternatives: [],
    selection: { mode: "no_single_winner", selectedCandidateId: null },
  });
}

const runtimeReady = {
  providerId: "openai_compat",
  modelId: "qwen3:8b",
  endpointUrl: "http://127.0.0.1:11434",
  endpointReachable: true,
  modelVisible: true,
  residencyObservationSupported: true,
  modelResident: true,
  expiresAt: null,
  readinessStatus: "runtime_residency_ready" as const,
  reasonCodes: ["LOCAL_PROVIDER_RUNTIME_RESIDENCY_READY"],
};

describe("source-bound semantic frame pilot", () => {
  test("accepts exact source/sense identities and bounded candidate targets", () => {
    expect(validateSemanticFramePilotPacketV0_1(packet)).toEqual([]);
    expect(packet.targets.map(({ word }) => word)).toEqual(["NDARJE", "DIJE", "LIRI"]);
    expect(packet.targets).toHaveLength(3);
    expect(packet.nullControl).toMatchObject({ word: "xyz", status: "UNKNOWN_OR_NULL", providerCalls: 0 });

    const expectedEntries = [
      ["fjalor-shqip-ndarje-sense-1", "https://fjale.al/ndarje", "NDARJE f., sense 1"],
      ["fjalor-shqip-ndaj-sense-5", "https://fjale.al/ndaj", "NDAJ kal., sense 5"],
      ["fjalor-shqip-dije-sense-1", "https://fjale.al/dije", "DIJE f., sense 1"],
      ["fjalor-shqip-di-sense-1", "https://fjale.al/di", "DI kal., sense 1"],
      ["fjalor-shqip-liri-I-sense-2", "https://fjale.al/liri", "LIRI I f., sense 2; distinct from LIRI II"],
      ["fjalor-shqip-liroj-sense-2", "https://fjale.al/liroj", "LIROJ kal., sense 2"],
    ];
    for (const [sourceId, sourceUrl, entryLocator] of expectedEntries) {
      const source = packet.sources.find((candidate) => candidate.sourceId === sourceId);
      expect(source).toMatchObject({
        sourceUrl,
        entryLocator,
        language: "Albanian",
        citationStatus: "CITATION_ENTERED_UNVERIFIED",
        licensingStatus: "NOT_ASSESSED",
        reusePermission: "NOT_STATED_ON_ACCESSED_ENTRY",
      });
      expect(source?.rightsNote).toMatch(/permission was not stated/);
    }

    const wrongSense = {
      ...packet,
      targets: packet.targets.map((target) => target.word === "DIJE"
        ? { ...target, targetSenseId: "fjalor-shqip:di:sense-1" }
        : target),
    };
    expect(validateSemanticFramePilotPacketV0_1(wrongSense)).toContain("TARGET_SOURCE_OR_SENSE_BINDING_INVALID");
  });

  test("keeps LIRI I sense 2 distinct from LIRI II and LIROJ", () => {
    const target = targetFor("LIRI");
    const targetSource = packet.sources.find((source) => source.sourceId === target.targetSourceId);
    expect(target.targetSenseId).toBe("fjalor-shqip:liri-I:sense-2");
    expect(targetSource?.entryLocator).toMatch(/LIRI I f\., sense 2; distinct from LIRI II/);
    expect(target.sourceFactIds).toEqual(["liri-I-sense-2-report", "liroj-sense-2-operation"]);
    expect(target.carrierRelationBoundary).toMatch(/no source-reported word-family or derivational relation/);
  });

  test("does not leak reviewed DI evidence into DIJE payload or accepted claims", () => {
    const target = targetFor("DIJE");
    const payload = buildSemanticFramePilotUserPayloadV0_1(packet, target);
    const serializedPayload = JSON.stringify(payload);
    expect(target.excludedSourceIds).toContain("reviewed.external.di.knowledge.candidate.v0_1");
    expect(target.carrierRelationBoundary).toMatch(/not a source-reported DI-DIJE morphological relation/);
    expect(serializedPayload).not.toContain("reviewed.external.di.knowledge.candidate.v0_1");

    const forbiddenReviewLeak = JSON.parse(proposalFor(target)) as Record<string, unknown>;
    forbiddenReviewLeak.action = claim("Reviewed DI proves this carrier", ["reviewed.external.di.knowledge.candidate.v0_1"]);
    const parsed = parseSemanticFramePilotProposalV0_1(JSON.stringify(forbiddenReviewLeak), packet, target);
    expect(parsed).toMatchObject({ ok: false });
    if (!parsed.ok) expect(parsed.reasonCodes).toContain("MODEL_CLAIM_EVIDENCE_OR_TEXT_INVALID:action");
  });

  test("labels generated claims as hypotheses and preserves source facts and written Voices", () => {
    const target = targetFor("NDARJE");
    const generated = JSON.parse(proposalFor(target)) as Record<string, unknown>;
    generated.embryo = {
      form: "DA",
      function: claim("split/cut/divide", ["reviewed.external.gheg-da.damage.candidate.v0_1"]),
      evidenceRefs: ["reviewed.external.gheg-da.damage.candidate.v0_1"],
    };
    const parsed = parseSemanticFramePilotProposalV0_1(JSON.stringify(generated), packet, target);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.frame.sourceFacts.every((fact) => fact.claimStatus === "SOURCE_REPORTED")).toBe(true);
    expect(parsed.frame.explanationPattern.action.status).toBe("HYPOTHESIS");
    expect(parsed.frame.explanationPattern.patient.status).toBe("HYPOTHESIS");
    expect(parsed.frame.explanationPattern.result.status).toBe("HYPOTHESIS");
    expect(parsed.frame.explanationPattern.wholeWordFunction.status).toBe("HYPOTHESIS");
    expect(parsed.frame.embryo?.claimStatus).toBe("HYPOTHESIS");
    expect(parsed.frame.embryo?.exactSubstringSpans).toEqual([{ start: 1, end: 3 }]);
    expect(parsed.frame.writtenStructure.writtenVoiceEvents).toEqual([
      { voice: "A", position: 2 },
      { voice: "E", position: 5 },
    ]);
    expect(parsed.frame.selection).toEqual({
      mode: "no_single_winner",
      selectedCandidateId: null,
      userDecisionPosture: "user_decides",
    });
    expect(parsed.frame.historicalOrigin).toBe("NOT_CLAIMED");
    expect(parsed.frame.sourceAuthorityPromotion).toBe("NONE");
  });

  test("accounts for the exact written Voice path deterministically for every target", () => {
    const expected = new Map([
      ["NDARJE", [{ voice: "A", position: 2 }, { voice: "E", position: 5 }]],
      ["DIJE", [{ voice: "I", position: 1 }, { voice: "E", position: 3 }]],
      ["LIRI", [{ voice: "I", position: 1 }, { voice: "I", position: 3 }]],
    ]);
    for (const target of packet.targets) {
      const first = parseSemanticFramePilotProposalV0_1(proposalFor(target), packet, target);
      const second = parseSemanticFramePilotProposalV0_1(proposalFor(target), packet, target);
      expect(first.ok).toBe(true);
      expect(second).toEqual(first);
      if (first.ok) {
        expect(first.frame.writtenStructure.writtenVoiceEvents).toEqual(expected.get(target.word));
        expect(first.frame.writtenStructure.exactSpelling).toBe(target.word);
        expect(first.frame.writtenStructure.pronunciationAuthority).toBe("UNKNOWN_OR_NULL");
        expect(first.frame.writtenStructure.morphologyEstablished).toBe(false);
      }
    }
  });

  test("rejects malformed output, target mismatch, authority injection, and unsupported citations", () => {
    const target = targetFor("DIJE");
    expect(parseSemanticFramePilotProposalV0_1("{bad json", packet, target)).toMatchObject({
      ok: false,
      reasonCodes: ["MODEL_OUTPUT_MALFORMED_JSON"],
    });
    const wrongTarget = JSON.parse(proposalFor(target)) as Record<string, unknown>;
    wrongTarget.targetSenseId = "wrong-sense";
    expect(parseSemanticFramePilotProposalV0_1(JSON.stringify(wrongTarget), packet, target)).toMatchObject({
      ok: false,
      reasonCodes: ["MODEL_TARGET_IDENTITY_MISMATCH"],
    });
    const authorityClaim = JSON.parse(proposalFor(target)) as Record<string, unknown>;
    authorityClaim.action = { text: "promoted", evidenceRefs: [target.targetSourceId], status: "SOURCE_REPORTED" };
    const authorityResult = parseSemanticFramePilotProposalV0_1(JSON.stringify(authorityClaim), packet, target);
    expect(authorityResult).toMatchObject({ ok: false });
    if (!authorityResult.ok) expect(authorityResult.reasonCodes).toContain("MODEL_AUTHORITY_FIELD_FORBIDDEN:action");
    const unsupportedCitation = JSON.parse(proposalFor(target)) as Record<string, unknown>;
    unsupportedCitation.resultState = claim("unsupported", ["invented-source"]);
    const unsupportedResult = parseSemanticFramePilotProposalV0_1(JSON.stringify(unsupportedCitation), packet, target);
    expect(unsupportedResult).toMatchObject({ ok: false });
    if (!unsupportedResult.ok) expect(unsupportedResult.reasonCodes).toContain("MODEL_CLAIM_EVIDENCE_OR_TEXT_INVALID:resultState");
  });

  test("keeps xyz a deterministic Null control without a model target", () => {
    expect(packet.targets.some(({ word }) => word === "xyz")).toBe(false);
    expect(buildSemanticFramePilotNullControlV0_1(packet)).toMatchObject({
      word: "xyz",
      status: "UNKNOWN_OR_NULL",
      providerCalls: 0,
      frame: null,
    });
  });

  test("rejects unauthorized execution before preflight or provider calls", async () => {
    const plan = planFor();
    const authorization = authorizationFor(packet, plan, "authorization_not_granted");
    const preflight = jest.fn(async () => runtimeReady);
    const execute = jest.fn(async () => ({ provider: "openai_compat" as const, rawText: "{}" }));

    const result = await runSemanticFramePilotV0_1(packet, plan, authorization, {
      runtimePreflight: preflight,
      execute,
    });
    expect(result.status).toBe("blocked");
    expect(result.attemptedCalls).toBe(0);
    expect(preflight).not.toHaveBeenCalled();
    expect(execute).not.toHaveBeenCalled();
  });

  test("rejects non-loopback endpoints before injected execution", async () => {
    const plan = planFor(packet, "https://provider.example/v1");
    const authorization = authorizationFor(packet, plan);
    const preflight = jest.fn(async () => runtimeReady);
    const execute = jest.fn(async () => ({ provider: "openai_compat" as const, rawText: "{}" }));
    const result = await runSemanticFramePilotV0_1(packet, plan, authorization, {
      runtimePreflight: preflight,
      execute,
    });
    expect(result.status).toBe("blocked");
    expect(result.reasonCodes).toContain("LOCAL_LOOPBACK_PROVIDER_REQUIRED");
    expect(preflight).not.toHaveBeenCalled();
    expect(execute).not.toHaveBeenCalled();
  });

  test("consumes one authorization once and calls no more than three injected targets", async () => {
    const plan = planFor();
    const authorization = authorizationFor(packet, plan);
    const preflight = jest.fn(async () => runtimeReady);
    const execute = jest.fn(async (request: { word: string }) => ({
      provider: "openai_compat" as const,
      rawText: proposalFor(targetFor(request.word)),
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    }));

    const first = await runSemanticFramePilotV0_1(packet, plan, authorization, {
      runtimePreflight: preflight,
      execute,
    });
    expect(first.status).toBe("completed");
    expect(first.authorizationState).toBe("consumed");
    expect(first.attemptedCalls).toBe(3);
    expect(first.rows).toHaveLength(3);
    expect(first.rows.every((row) => row.status === "proposed" && row.frame !== null)).toBe(true);
    expect(execute).toHaveBeenCalledTimes(3);

    const second = await runSemanticFramePilotV0_1(packet, plan, authorization, {
      runtimePreflight: preflight,
      execute,
    });
    expect(second.status).toBe("blocked");
    expect(second.reasonCodes).toContain("AUTHORIZATION_CONSUMED");
    expect(execute).toHaveBeenCalledTimes(3);
    expect(preflight).toHaveBeenCalledTimes(1);
  });
});
