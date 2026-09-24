import { readFileSync } from "node:fs";
import {
  InMemoryStrictBlindDurabilityStoreV1,
  defaultStrictBlindArtifactPathsV1,
  runStrictBlindAuthorizedCaseV1,
  verifyStrictBlindExecutionAuthorizationV1,
  type StrictBlindExecutionAuthorizationV1,
  type StrictBlindPreRevealContextV1,
} from "../src/shared/openInstrument/strictBlindReplicationRunner.v1";

const paths = defaultStrictBlindArtifactPathsV1(process.cwd());
const authorization = JSON.parse(
  readFileSync(
    "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/execution-authorization.v1.json",
    "utf8",
  ),
) as StrictBlindExecutionAuthorizationV1;

function completeWorker(context: StrictBlindPreRevealContextV1): void {
  for (const sourceTraditionId of context.authorizedSourceTraditionIds) {
    for (const stage of context.authorizedSearchStages) {
      context.recordSourceQuery({
        sourceTraditionId,
        stage,
        queryForm: context.structuralInput.embryo,
        formOrigin: "structural_embryo_or_authorized_transform",
      });
    }
  }
  context.freezeNull({
    reasonCode: "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE",
  });
}

describe("strict blind replication series execution v1", () => {
  test("accepts only the exact three-case execution authorization", () => {
    expect(
      verifyStrictBlindExecutionAuthorizationV1(
        authorization,
        paths,
        "SBR-01",
      ).authorizedCases,
    ).toEqual(["SBR-01", "SBR-02", "SBR-03"]);
    expect(() =>
      verifyStrictBlindExecutionAuthorizationV1(
        { ...authorization, authorizedCases: ["SBR-01"] } as never,
        paths,
        "SBR-01",
      ),
    ).toThrow("REAL_EXECUTION_AUTHORIZATION_INVALID");
  });

  test("keeps target access behind durability and reveal", () => {
    let workerFinished = false;
    let revealCalled = false;
    const result = runStrictBlindAuthorizedCaseV1({
      mode: "real",
      authorization,
      caseOpaqueId: "test.real.case.v1",
      replicationSlot: "SBR-01",
      frozenArtifacts: paths,
      structuralInput: { embryo: "IR", voicePath: ["I"] },
      durabilityStore: new InMemoryStrictBlindDurabilityStoreV1(),
      worker(context) {
        expect(() => context.readTarget()).toThrow(
          "TARGET_REVEAL_NOT_ALLOWED_PRE_REVEAL",
        );
        completeWorker(context);
        workerFinished = true;
      },
      revealTarget() {
        expect(workerFinished).toBe(true);
        revealCalled = true;
        return {
          targetWord: "synthetic target",
          targetSenseId: "synthetic.sense",
          targetSenseLabel: "synthetic sense",
        };
      },
      evaluateAfterReveal({ preRevealArtifact }) {
        expect(revealCalled).toBe(true);
        expect(preRevealArtifact.frozenDecision.kind).toBe("NULL");
        return {
          classification: "NULL",
          reasonCode: "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE",
          targetBinding: "NOT_EVALUATED",
          functionalMechanism: null,
          evidenceBeyondGloss: false,
          structuralRelationStatus: "NONE",
        };
      },
    });
    expect(result.mode).toBe("real");
    expect(result.durability.passed).toBe(true);
    expect(result.reveal).toEqual({ allowed: true, targetRevealed: true });
    expect(result.productionMutationState).toBe("NONE");
  });

  test("denies reveal for a contaminated authorized case", () => {
    let revealCalled = false;
    const result = runStrictBlindAuthorizedCaseV1({
      mode: "real",
      authorization,
      caseOpaqueId: "test.contaminated.case.v1",
      replicationSlot: "SBR-01",
      frozenArtifacts: paths,
      structuralInput: { embryo: "IR", voicePath: ["I"] },
      durabilityStore: new InMemoryStrictBlindDurabilityStoreV1(),
      worker(context) {
        for (const sourceTraditionId of context.authorizedSourceTraditionIds) {
          context.recordSourceQuery({
            sourceTraditionId,
            stage: context.authorizedSearchStages[0],
            queryForm: context.structuralInput.embryo,
            formOrigin: "structural_embryo_or_authorized_transform",
          });
        }
        context.markContaminated("TEST_CROSS_CASE_CONTEXT");
        context.freezeNull({ reasonCode: "INSUFFICIENT_AUTHORITY" });
      },
      revealTarget() {
        revealCalled = true;
        return {
          targetWord: "synthetic target",
          targetSenseId: "synthetic.sense",
          targetSenseLabel: "synthetic sense",
        };
      },
      evaluateAfterReveal() {
        throw new Error("REVEAL_MUST_NOT_RUN");
      },
    });
    expect(result.durability.passed).toBe(true);
    expect(result.reveal).toEqual({ allowed: false, targetRevealed: false });
    expect(revealCalled).toBe(false);
    expect(result.postRevealEvaluation).toBeNull();
    expect(result.productionMutationState).toBe("NONE");
  });

  test("rejects payload authorization mutation before worker execution", () => {
    expect(() =>
      runStrictBlindAuthorizedCaseV1({
        mode: "real",
        authorization: {
          ...authorization,
          payloadSha256: { ...authorization.payloadSha256, "SBR-01": "bad" },
        },
        caseOpaqueId: "test.mutated.case.v1",
        replicationSlot: "SBR-01",
        frozenArtifacts: paths,
        structuralInput: { embryo: "IR", voicePath: ["I"] },
        durabilityStore: new InMemoryStrictBlindDurabilityStoreV1(),
        worker: completeWorker,
        revealTarget: () => ({
          targetWord: "synthetic target",
          targetSenseId: "synthetic.sense",
          targetSenseLabel: "synthetic sense",
        }),
        evaluateAfterReveal: () => ({
          classification: "NULL",
          reasonCode: "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE",
          targetBinding: "NOT_EVALUATED",
          functionalMechanism: null,
          evidenceBeyondGloss: false,
          structuralRelationStatus: "NONE",
        }),
      }),
    ).toThrow("REAL_EXECUTION_AUTHORIZATION_PAYLOAD_MISMATCH");
  });
});
