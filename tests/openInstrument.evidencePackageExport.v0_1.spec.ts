import {
  EVIDENCE_PACKAGE_EXPORT_FORBIDDEN_KEYS_V0_1,
  EVIDENCE_PACKAGE_EXPORT_SCHEMA_VERSION_V0_1,
  buildEvidencePackageExportV0_1,
  serializeEvidencePackageExportV0_1,
  validateEvidencePackageExportV0_1,
} from "@/shared/openInstrument/evidencePackageExport.v0_1";
import type { EvidenceLedgerModel } from "@/ui/ledger/ledgerModel";
import type { TelemetryViewModel } from "@/ui/telemetry/types";

function present<T>(value: T) {
  return { kind: "present" as const, value };
}

function missing(missingState: "none" | "not_emitted" | "malformed" | "unknown" = "not_emitted") {
  return { kind: "missing" as const, missing: missingState };
}

function makeVm(status = "reviewed_functional_evidence" as const): TelemetryViewModel {
  return {
    readout: {
      word: "study",
      normalizedWord: present("study"),
      mode: present("strict"),
      strictInput: present(true),
      engineVersion: present("engine-test"),
      alphabet: present("A E I O U Y Ë"),
      createdAt: missing(),
      principlesPath: present(["A", "E"]),
      phoneticIpaV0_1: present({ ipa: "/ˈstʌdi/", voices: ["U", "I"], unmapped: [] }),
      voicePath: present(["U", "I"]),
      voicePathSurface: present(["U", "Y"]),
      voicePathFunctional: present(["U", "I"]),
      voicePathDelta: "DIVERGE",
      status: "detected",
      counts: {
        candidates: 2,
        ops: present(3),
        notes: present(1),
        signals: present(4),
        rejections: present(0),
      },
    },
    evidence: {
      normalizationSteps: present(["lowercase"]),
      ops: present(["map-vowels"]),
      notes: present(["deterministic"]),
      signals: present(["signal-1"]),
    },
    candidates: [
      {
        index: 0,
        id: "candidate-1",
        language: present("English"),
        form: present("study"),
        status: present("pass"),
        confidenceTag: present("solid"),
        fitTag: present("functional"),
        sourceKind: present("reviewed_lexicon"),
        targetWord: present("study"),
        targetSenseId: present("study.v1"),
        targetSenseLabel: present("learn"),
        sourceId: present("reviewed-source-1"),
        sourceStatus: present("reviewed_candidate"),
        discoveryStatus: present("reviewed"),
        evidenceRefs: present(["reviewed-source-1:citation-1"]),
        candidateTruthClaim: present("not_claimed"),
        claimBoundary: present("candidate evidence only"),
        userDecisionPosture: present("user_decides"),
        embryo: present("learn"),
        plainStandaloneGloss: present("learn"),
        functionalStatement: present("learn"),
        vowelPath: present(["U", "I"]),
        deepRootHeartGate: missing(),
        decomposition: missing(),
        ops: missing(),
        notes: missing(),
        signals: missing(),
        raw: { raw: "must not pass through" },
      },
      {
        index: 1,
        id: "candidate-2",
        language: present("Research"),
        form: present("study"),
        status: present("unknown"),
        sourceKind: present("research_candidate"),
        sourceStatus: present("research_candidate"),
        evidenceRefs: present(["research-citation-2"]),
        candidateTruthClaim: present("not_claimed"),
        userDecisionPosture: present("user_decides"),
        functionalStatement: missing(),
        vowelPath: missing(),
        deepRootHeartGate: missing(),
        decomposition: missing(),
        ops: missing(),
        notes: missing(),
        signals: missing(),
        raw: { providerResponse: "must not pass through" },
      },
    ],
    math: missing(),
    rejections: { items: missing() },
    originClaimGates: {
      active: false,
      flag: "ocg",
      candidateCount: 2,
      reasonCounts: {},
    },
    originClaim: missing(),
    rootMap: missing(),
    soundRoots: missing(),
    resonanceProfileV1: missing(),
    raw: { debug: "must not pass through" },
    analysisStatusV0_1: present({
      schemaVersion: "open-instrument.analysis-status.v0_1",
      status,
      summary: status === "null_no_supported_candidate" ? "No supported functional conclusion is available at this boundary." : "Reviewed evidence is present.",
      reviewedOperators: status === "reviewed_functional_evidence" ? ["reviewed"] : [],
      candidateOnlyOperators: [],
      researchHypothesisEmbryos: [],
      structuralTokens: status === "structural_unreviewed" ? ["structural-token"] : [],
      claimBoundary: {
        historicalOriginClaim: "not_claimed",
        historicalTransmissionClaim: "not_claimed",
        winnerClaim: "not_claimed",
        languageSuperiorityClaim: "not_claimed",
        linguisticOwnershipClaim: "not_claimed",
        candidateTruthClaim: "not_claimed",
        structuralOutputIsCandidateTruth: false,
        nullIsValid: true,
      },
      userDecisionPosture: "user_decides",
    }),
  } as TelemetryViewModel;
}

const ledgerModel: EvidenceLedgerModel = {
  sections: [
    {
      key: "normalization",
      title: "Normalization",
      state: "present",
      items: ["lowercase"],
      source: "vm.evidence.normalizationSteps",
    },
    {
      key: "ops",
      title: "Ops / Transforms",
      state: "none",
      items: [],
      source: "vm.evidence.ops",
    },
  ],
};

describe("Open Instrument evidence package export contract v0.1", () => {
  it("projects an explicit typed export without raw VM fields", () => {
    const result = buildEvidencePackageExportV0_1(makeVm(), ledgerModel);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.schemaVersion).toBe(EVIDENCE_PACKAGE_EXPORT_SCHEMA_VERSION_V0_1);
    expect(result.value.input.word).toBe("study");
    expect(result.value.analysisStatusV0_1?.status).toBe("reviewed_functional_evidence");
    expect(result.value.candidates.map((candidate) => candidate.id)).toEqual([
      "candidate-1",
      "candidate-2",
    ]);
    expect(result.value.candidates[0]?.evidenceRefs).toEqual(["reviewed-source-1:citation-1"]);
    expect(result.value.candidates[1]?.sourceStatus).toBe("research_candidate");
    expect(JSON.stringify(result.value)).not.toContain("raw");
    expect(JSON.stringify(result.value)).not.toContain("providerResponse");
    expect(JSON.stringify(result.value)).not.toContain("debug");
  });

  it("preserves Null and structural statuses without inferring either one", () => {
    const nullResult = buildEvidencePackageExportV0_1(makeVm("null_no_supported_candidate"));
    const structuralResult = buildEvidencePackageExportV0_1(makeVm("structural_unreviewed"));

    expect(nullResult.ok && nullResult.value.analysisStatusV0_1?.status).toBe("null_no_supported_candidate");
    expect(structuralResult.ok && structuralResult.value.analysisStatusV0_1?.status).toBe("structural_unreviewed");

    const missingStatusVm = makeVm();
    missingStatusVm.analysisStatusV0_1 = missing();
    const missingStatusResult = buildEvidencePackageExportV0_1(missingStatusVm);

    expect(missingStatusResult.ok).toBe(true);
    if (missingStatusResult.ok) {
      expect(missingStatusResult.value.analysisStatusV0_1).toBeUndefined();
    }
  });

  it("serializes the same export byte-identically", () => {
    const first = buildEvidencePackageExportV0_1(makeVm(), ledgerModel);
    const second = buildEvidencePackageExportV0_1(makeVm(), ledgerModel);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (!first.ok || !second.ok) return;

    const firstJson = serializeEvidencePackageExportV0_1(first.value);
    const secondJson = serializeEvidencePackageExportV0_1(second.value);

    expect(firstJson).toEqual(secondJson);
  });

  it("fails closed on nested forbidden data", () => {
    const result = buildEvidencePackageExportV0_1(makeVm(), ledgerModel);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const malicious = {
      ...result.value,
      candidates: result.value.candidates.map((candidate) => ({
        ...candidate,
        metadata: { providerRequest: "secret" },
      })),
    };

    const validation = validateEvidencePackageExportV0_1(malicious);
    expect(validation.ok).toBe(false);
  });

  it("rejects an invalid candidate status instead of reclassifying it", () => {
    const result = buildEvidencePackageExportV0_1(makeVm(), ledgerModel);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const malformed = {
      ...result.value,
      candidates: result.value.candidates.map((candidate, index) =>
        index === 0 ? { ...candidate, status: "experimental" } : candidate,
      ),
    };

    expect(validateEvidencePackageExportV0_1(malformed).ok).toBe(false);
  });

  it("preserves claim boundaries without exporting opaque origin data", () => {
    const result = buildEvidencePackageExportV0_1(makeVm(), ledgerModel);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.analysisStatusV0_1?.claimBoundary).toEqual({
      historicalOriginClaim: "not_claimed",
      historicalTransmissionClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      linguisticOwnershipClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      structuralOutputIsCandidateTruth: false,
      nullIsValid: true,
    });
    expect(result.value.analysisStatusV0_1?.userDecisionPosture).toBe("user_decides");
    expect("originClaim" in result.value).toBe(false);
    expect("rootMap" in result.value).toBe(false);
  });

  it("omits missing optional fields without inventing metadata", () => {
    const vm = makeVm();
    vm.readout.normalizedWord = missing();
    vm.readout.mode = missing();
    vm.readout.engineVersion = missing();
    vm.readout.voicePathSurface = missing();
    vm.readout.voicePathFunctional = missing();
    vm.readout.phoneticIpaV0_1 = missing();
    vm.readout.counts.ops = missing();
    vm.readout.counts.notes = missing();
    vm.readout.counts.signals = missing();
    vm.readout.counts.rejections = missing();

    const result = buildEvidencePackageExportV0_1(vm);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.input).toEqual({ word: "study" });
    expect(result.value.summary).toEqual({ voicePath: ["U", "I"], voicePathDelta: "DIVERGE" });
    expect(result.value.counts).toEqual({ candidates: 2 });
    expect(result.value.ledger).toBeUndefined();
  });

  it("rejects every forbidden field name at the export boundary", () => {
    const result = buildEvidencePackageExportV0_1(makeVm(), ledgerModel);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    for (const key of EVIDENCE_PACKAGE_EXPORT_FORBIDDEN_KEYS_V0_1) {
      const malformed = {
        ...result.value,
        input: { ...result.value.input, metadata: { [key]: "blocked" } },
      };
      expect(validateEvidencePackageExportV0_1(malformed).ok).toBe(false);
    }
  });

  it("rejects unknown contract fields and unsupported values", () => {
    const result = buildEvidencePackageExportV0_1(makeVm(), ledgerModel);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(validateEvidencePackageExportV0_1({ ...result.value, createdAt: "now" }).ok).toBe(false);
    expect(validateEvidencePackageExportV0_1({ ...result.value, input: { ...result.value.input, createdAt: new Date() } }).ok).toBe(false);
  });
});
