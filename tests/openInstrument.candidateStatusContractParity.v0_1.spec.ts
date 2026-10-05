import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { adaptAnalyzeV1ToUI } from "@/shared/analyzeV1Adapter";
import type { EnginePayload } from "@/shared/engineShape";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { buildCandidateRowsFromVM } from "@/ui/candidates/candidateModel";

const studyPayload: EnginePayload = {
  word: "study",
  engineVersion: "candidate-status-contract-test-v0.1",
  mode: "strict",
  alphabet: "auto",
  primaryPath: {
    voicePath: ["U", "I"],
    ringPath: [1, 1],
    levelPath: [1, 1],
    ops: [],
    checksums: { V: 55, E: 0, C: 2 },
    kept: 2,
  },
  frontierPaths: [],
  windows: ["st", "d"],
  windowClasses: ["SibilantFricative", "Plosive"],
  signals: [],
  languageFamilies: [],
  edgeWindows: ["prefix st"],
};

describe("Open Instrument candidate status contract parity v0.1", () => {
  it("preserves experimental from the deterministic engine through the active UI model", () => {
    const analysis = enginePayloadToAnalysisResult(studyPayload);
    const engineCandidate = analysis.candidates.find(
      (candidate) => candidate.id === "latin-studium",
    );

    expect(engineCandidate?.status).toBe("experimental");

    const ui = adaptAnalyzeV1ToUI(analysis);
    const uiCandidate = ui.candidates.find(
      (candidate) => candidate.id === "latin-studium",
    );

    expect(uiCandidate?.status).toBe("experimental");

    const vm = adaptAnalysisToTelemetryVM(ui);
    const vmCandidate = vm.candidates.find(
      (candidate) =>
        candidate.id === "latin-studium" && candidate.status?.kind === "present",
    );

    expect(vmCandidate?.status).toEqual({
      kind: "present",
      value: "experimental",
    });

    const row = buildCandidateRowsFromVM(vm).find(
      (candidate) => candidate.id === "latin-studium",
    );

    expect(row?.status).toBe("experimental");
  });
});
