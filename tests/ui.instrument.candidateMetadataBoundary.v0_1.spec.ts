import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import { buildCandidateRowsFromVM } from "../src/ui/candidates/candidateModel";

function candidate(overrides: Record<string, unknown> = {}) {
  return {
    id: "candidate-1",
    language: "sq",
    form: "da",
    ...overrides,
  };
}

describe("Open Instrument candidate metadata boundary v0.1", () => {
  test.each(["pass", "fail", "unknown"] as const)(
    "preserves supported status %s through the VM and UI model",
    (status) => {
      const vm = adaptAnalysisToTelemetryVM({
        word: "damage",
        candidates: [candidate({ status })],
      });

      expect(vm.candidates[0].status).toEqual({ kind: "present", value: status });
      expect(buildCandidateRowsFromVM(vm)[0].status).toBe(status);
    },
  );

  test("preserves confidence and fit tags without changing truth metadata", () => {
    const vm = adaptAnalysisToTelemetryVM({
      word: "damage",
      candidates: [
        candidate({
          status: "pass",
          confidenceTag: "speculative",
          fitTag: "weak",
          evidenceRefs: ["candidate:candidate-1"],
          claimBoundary: "candidate-only; not historical origin",
          historicalOriginClaim: "not_claimed",
          candidateTruthClaim: "not_claimed",
          userDecisionPosture: "user_decides",
        }),
      ],
    });

    expect(vm.candidates[0].confidenceTag).toEqual({ kind: "present", value: "speculative" });
    expect(vm.candidates[0].fitTag).toEqual({ kind: "present", value: "weak" });

    const row = buildCandidateRowsFromVM(vm)[0];
    expect(row).toMatchObject({
      status: "pass",
      confidenceTag: "speculative",
      fitTag: "weak",
      evidenceRefs: ["candidate:candidate-1"],
      claimBoundary: "candidate-only; not historical origin",
      historicalOriginClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
  });

  test("keeps absent optional metadata absent/null", () => {
    const vm = adaptAnalysisToTelemetryVM({
      word: "damage",
      candidates: [candidate()],
    });

    expect(vm.candidates[0]).not.toHaveProperty("status");
    expect(vm.candidates[0]).not.toHaveProperty("confidenceTag");
    expect(vm.candidates[0]).not.toHaveProperty("fitTag");

    expect(buildCandidateRowsFromVM(vm)[0]).toMatchObject({
      status: null,
      confidenceTag: null,
      fitTag: null,
    });
  });

  test("fails malformed metadata closed without inventing values", () => {
    const vm = adaptAnalysisToTelemetryVM({
      word: "damage",
      candidates: [
        candidate({
          status: "verified",
          confidenceTag: { value: "high" },
          fitTag: 1,
        }),
      ],
    });

    expect(vm.candidates[0].status).toEqual({
      kind: "missing",
      missing: "malformed",
      note: "candidate.status expected pass | fail | unknown",
    });
    expect(vm.candidates[0].confidenceTag).toEqual({
      kind: "missing",
      missing: "malformed",
      note: "candidate.confidenceTag expected non-empty string",
    });
    expect(vm.candidates[0].fitTag).toEqual({
      kind: "missing",
      missing: "malformed",
      note: "candidate.fitTag expected non-empty string",
    });

    expect(buildCandidateRowsFromVM(vm)[0]).toMatchObject({
      status: null,
      confidenceTag: null,
      fitTag: null,
    });
  });
});
