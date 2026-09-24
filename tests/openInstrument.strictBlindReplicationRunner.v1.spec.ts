import {
  InMemoryStrictBlindDurabilityStoreV1,
  buildStrictBlindReadinessReportV1,
  defaultStrictBlindArtifactPathsV1,
  runStrictBlindSyntheticCaseV1,
  verifyStrictBlindFrozenArtifactsV1,
  type StrictBlindCorrespondenceEvaluationV1,
  type StrictBlindPreRevealContextV1,
} from "../src/shared/openInstrument/strictBlindReplicationRunner.v1";

const paths = defaultStrictBlindArtifactPathsV1(process.cwd());

function makeInput(
  overrides: Partial<Parameters<typeof runStrictBlindSyntheticCaseV1>[0]> = {},
) {
  return {
    mode: "synthetic" as const,
    caseOpaqueId: "synthetic.case.v1",
    replicationSlot: "SBR-01",
    frozenArtifacts: paths,
    structuralInput: { embryo: "IR", voicePath: ["I"] },
    durabilityStore: new InMemoryStrictBlindDurabilityStoreV1(),
    worker(context: StrictBlindPreRevealContextV1) {
      for (const sourceTraditionId of context.authorizedSourceTraditionIds) {
        context.recordSourceQuery({
          sourceTraditionId,
          stage: context.authorizedSearchStages[0],
          queryForm: context.structuralInput.embryo,
          formOrigin: "structural_embryo_or_authorized_transform",
        });
      }
      context.recordSourceObservation({
        sourceTraditionId: context.authorizedSourceTraditionIds[0],
        sourceRecordId: "synthetic.source.v1",
        sourceForm: "IR",
        gloss: "synthetic source fact",
        locator: "synthetic://source",
        attestationTruth: "fact",
      });
      context.freezeFunction({
        mechanismType: "operation_process",
        statement: "synthetic operation beyond gloss",
        evidenceBeyondGloss: true,
      });
    },
    target: {
      targetWord: "synthetic-target",
      targetSenseId: "synthetic-sense",
      targetSenseLabel: "synthetic target",
    },
    evaluateAfterReveal(): StrictBlindCorrespondenceEvaluationV1 {
      return {
        classification: "FUNCTIONAL_CORRESPONDENCE",
        reasonCode: "SYNTHETIC_ONLY",
        targetBinding: "MATCHED",
        functionalMechanism: "synthetic operation",
        evidenceBeyondGloss: true,
        structuralRelationStatus: "SEPARATE",
      };
    },
    ...overrides,
  };
}

describe("strict blind replication runner v1", () => {
  test("verifies all frozen preregistration and payload identities", () => {
    const first = verifyStrictBlindFrozenArtifactsV1(paths, "SBR-01");
    const second = verifyStrictBlindFrozenArtifactsV1(paths, "SBR-02");
    const third = verifyStrictBlindFrozenArtifactsV1(paths, "SBR-03");
    expect(first.sourceTraditionIds).toHaveLength(3);
    expect(first.searchStages).toHaveLength(5);
    expect(first.preregistrationSha256).toBe(second.preregistrationSha256);
    expect(second.preregistrationSha256).toBe(third.preregistrationSha256);
    expect(first.payloadSha256["SBR-01"]).toMatch(/^[a-f0-9]{64}$/);
  });

  test("runs a synthetic positive only after pre-reveal freeze and durability", () => {
    const result = runStrictBlindSyntheticCaseV1(makeInput());
    expect(result.preRevealArtifact.artifactType).toBe(
      "strict_blind_pre_reveal_canonical",
    );
    expect(result.preRevealArtifact.replicationExperimentId).toBe(
      "open-instrument-strict-blind-embryo-first-replication-series-v1",
    );
    expect(result.preRevealArtifact.targetRevealStatus).toBe(
      "NOT_REQUESTED_AND_NOT_PERFORMED",
    );
    expect(result.preRevealArtifact.revealGateStatus).toBe(
      "FORBIDDEN_UNTIL_DURABILITY_GATE",
    );
    expect(result.preRevealArtifact.noSingleWinner).toBe(true);
    expect(result.preRevealArtifact.userDecides).toBe(true);
    expect(result.preRevealArtifact.frozenDecision.kind).toBe("FUNCTION");
    expect(result.durability.passed).toBe(true);
    expect(result.reveal).toEqual({ allowed: true, targetRevealed: true });
    expect(result.postRevealEvaluation?.classification).toBe(
      "FUNCTIONAL_CORRESPONDENCE",
    );
    expect(result.productionMutationState).toBe("NONE");
  });

  test("runs synthetic Null and insufficient outcomes without promotion", () => {
    const nullResult = runStrictBlindSyntheticCaseV1(
      makeInput({
        worker(context) {
          for (const sourceTraditionId of context.authorizedSourceTraditionIds) {
            context.recordSourceUnavailable({
              sourceTraditionId,
              reasonCode: "SOURCE_UNAVAILABLE",
              detail: "synthetic unavailable source",
            });
          }
          context.freezeNull({
            reasonCode: "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE",
          });
        },
        evaluateAfterReveal() {
          return {
            classification: "NULL",
            reasonCode: "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE",
            targetBinding: "MATCHED",
            functionalMechanism: null,
            evidenceBeyondGloss: false,
            structuralRelationStatus: "NONE",
          };
        },
      }),
    );
    const insufficientResult = runStrictBlindSyntheticCaseV1(
      makeInput({
        evaluateAfterReveal() {
          return {
            classification: "INSUFFICIENT_CORRESPONDENCE",
            reasonCode: "LEXICAL_EQUIVALENCE_ONLY",
            targetBinding: "MATCHED",
            functionalMechanism: null,
            evidenceBeyondGloss: false,
            structuralRelationStatus: "SEPARATE",
          };
        },
      }),
    );
    expect(nullResult.postRevealEvaluation?.classification).toBe("NULL");
    expect(insufficientResult.postRevealEvaluation?.classification).toBe(
      "INSUFFICIENT_CORRESPONDENCE",
    );
    expect(nullResult.productionMutationState).toBe("NONE");
    expect(insufficientResult.productionMutationState).toBe("NONE");
  });

  test("rejects lexical equivalence as functional correspondence", () => {
    expect(() =>
      runStrictBlindSyntheticCaseV1(
        makeInput({
          evaluateAfterReveal() {
            return {
              classification: "FUNCTIONAL_CORRESPONDENCE",
              reasonCode: "LEXICAL_EQUIVALENCE_ONLY",
              targetBinding: "MATCHED",
              functionalMechanism: null,
              evidenceBeyondGloss: false,
              structuralRelationStatus: "SEPARATE",
            };
          },
        }),
      ),
    ).toThrow("FUNCTIONAL_CORRESPONDENCE_GATE_FAILED");
  });

  test("records contamination and denies reveal without production mutation", () => {
    const result = runStrictBlindSyntheticCaseV1(
      makeInput({
        worker(context) {
          for (const sourceTraditionId of context.authorizedSourceTraditionIds) {
            context.recordSourceQuery({
              sourceTraditionId,
              stage: context.authorizedSearchStages[0],
              queryForm: context.structuralInput.embryo,
              formOrigin: "structural_embryo_or_authorized_transform",
            });
          }
          context.markContaminated("CROSS_CASE_CONTEXT");
          context.freezeNull({ reasonCode: "INSUFFICIENT_AUTHORITY" });
        },
      }),
    );
    expect(result.contamination).toEqual({
      contaminated: true,
      reasonCode: "CROSS_CASE_CONTEXT",
    });
    expect(result.reveal).toEqual({ allowed: false, targetRevealed: false });
    expect(result.postRevealEvaluation).toBeNull();
    expect(result.productionMutationState).toBe("NONE");
  });

  test("denies target access before reveal", () => {
    expect(() =>
      runStrictBlindSyntheticCaseV1(
        makeInput({
          worker(context) {
            context.readTarget();
          },
        }),
      ),
    ).toThrow("TARGET_REVEAL_NOT_ALLOWED_PRE_REVEAL");
  });

  test("rejects target fields in pre-reveal source observations", () => {
    expect(() =>
      runStrictBlindSyntheticCaseV1(
        makeInput({
          worker(context) {
            context.recordSourceObservation({
              sourceTraditionId: context.authorizedSourceTraditionIds[0],
              sourceRecordId: "synthetic.source.v1",
              sourceForm: "SYN",
              gloss: "synthetic",
              locator: "synthetic://source",
              attestationTruth: "fact",
              targetWord: "leak",
            } as never);
          },
        }),
      ),
    ).toThrow("SOURCE_OBSERVATION_OUTSIDE_FROZEN_PROTOCOL");
  });

  test("enforces source universe and search stage", () => {
    expect(() =>
      runStrictBlindSyntheticCaseV1(
        makeInput({
          worker(context) {
            context.recordSourceQuery({
              sourceTraditionId: "unauthorized.source",
              stage: context.authorizedSearchStages[0],
              queryForm: "SYN",
              formOrigin: "structural_embryo_or_authorized_transform",
            });
          },
        }),
      ),
    ).toThrow("SOURCE_QUERY_OUTSIDE_FROZEN_PROTOCOL");
  });

  test("rejects incomplete source-tradition coverage", () => {
    expect(() =>
      runStrictBlindSyntheticCaseV1(
        makeInput({
          worker(context) {
            context.recordSourceQuery({
              sourceTraditionId: context.authorizedSourceTraditionIds[0],
              stage: context.authorizedSearchStages[0],
              queryForm: context.structuralInput.embryo,
              formOrigin: "structural_embryo_or_authorized_transform",
            });
            context.freezeNull({ reasonCode: "INSUFFICIENT_AUTHORITY" });
          },
        }),
      ),
    ).toThrow("SOURCE_COVERAGE_INCOMPLETE");
  });

  test("durability failure blocks reveal", () => {
    const store = new InMemoryStrictBlindDurabilityStoreV1();
    const corruptingStore = {
      write: store.write.bind(store),
      read() {
        const value = store.read();
        return { ...value, primaryBytes: Buffer.from(`${value.primaryBytes}tampered`) };
      },
    };
    expect(() =>
      runStrictBlindSyntheticCaseV1(
        makeInput({ durabilityStore: corruptingStore }),
      ),
    ).toThrow("DURABILITY_GATE_FAILED");
  });

  test("missing durability artifacts block reveal", () => {
    const store = {
      write: () => undefined,
      read: () => {
        throw new Error("DURABILITY_ARTIFACT_MISSING");
      },
    };
    expect(() =>
      runStrictBlindSyntheticCaseV1(
        makeInput({ durabilityStore: store }),
      ),
    ).toThrow("DURABILITY_ARTIFACT_MISSING");
  });

  test("payload and preregistration mutations block execution", () => {
    expect(() =>
      verifyStrictBlindFrozenArtifactsV1(
        { ...paths, expectedPayloadSha256: { ...paths.expectedPayloadSha256, "SBR-01": "bad" } },
        "SBR-01",
      ),
    ).toThrow("PAYLOAD_HASH_MISMATCH");
    expect(() =>
      verifyStrictBlindFrozenArtifactsV1(
        { ...paths, expectedPreregistrationSha256: "bad" },
        "SBR-01",
      ),
    ).toThrow("PREREGISTRATION_HASH_MISMATCH");
  });

  test("rejects structural input that does not match the frozen payload", () => {
    expect(() =>
      runStrictBlindSyntheticCaseV1(
        makeInput({ structuralInput: { embryo: "OTHER", voicePath: ["I"] } }),
      ),
    ).toThrow("STRUCTURAL_INPUT_PAYLOAD_MISMATCH");
  });

  test("isolates cases and preserves embryo-first order", () => {
    const first = runStrictBlindSyntheticCaseV1(makeInput());
    const second = runStrictBlindSyntheticCaseV1(
      makeInput({
        caseOpaqueId: "synthetic.case.two.v1",
        replicationSlot: "SBR-02",
        structuralInput: { embryo: "YNE", voicePath: ["Y", "E"] },
      }),
    );
    expect(first.caseOpaqueId).not.toBe(second.caseOpaqueId);
    expect(first.preRevealArtifact.embryoOrder).toEqual(["IR"]);
    expect(second.preRevealArtifact.embryoOrder).toEqual(["YNE"]);
    expect(first.preRevealArtifact.sourceQueries).not.toBe(
      second.preRevealArtifact.sourceQueries,
    );
  });

  test("real execution remains explicitly locked", () => {
    expect(() =>
      runStrictBlindSyntheticCaseV1({ ...makeInput(), mode: "real" } as never),
    ).toThrow("REAL_SBR_EXECUTION_LOCKED");
  });

  test("freezes the pre-reveal decision against post-reveal rewrite", () => {
    const result = runStrictBlindSyntheticCaseV1(makeInput());
    expect(() => {
      (result.preRevealArtifact as any).frozenDecision = {
        kind: "NULL",
        reasonCode: "INSUFFICIENT_AUTHORITY",
      };
    }).toThrow();
    expect(result.preRevealArtifact.frozenDecision.kind).toBe("FUNCTION");
  });

  test("readiness verifier reports all synthetic/integrity checks", () => {
    const report = buildStrictBlindReadinessReportV1({
      preregistrationHashMatch: true,
      payloadHashesMatch: true,
      workerEnvelopeValid: true,
      sourceUniverseFrozen: true,
      runnerTestsPass: true,
      realExecutionLockActive: true,
      productionFirewallActive: true,
      durabilityGateActive: true,
      revealGateActive: true,
      baselineUnchanged: true,
    });
    expect(report.status).toBe("READY_FOR_CONTROLLED_STRICT_BLIND_EXECUTION");
  });
});
