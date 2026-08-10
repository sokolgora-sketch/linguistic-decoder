import React from "react";
import { render, screen } from "@testing-library/react";

import {
  adaptAnalysisToTelemetryVM,
} from "../src/ui/instrument/contractAdapter";

import {
  EmbryoExpansionContextCardV0_1,
} from "../src/ui/instrument/sections/EmbryoExpansionContextCard.v0_1";

import {
  DeepRootHeartGateSummaryCard,
} from "../src/ui/instrument/DeepRootHeartGateSummaryCard";

import {
  buildCandidateRowsFromVM,
} from "../src/ui/candidates/candidateModel";

function realStudyShape(): any {
  return {
    word: "study",
    sanitized: "study",
    engineVersion: "0.2.0-symbolic",
    mode: "strict",
    alphabet: "auto",

    primaryPath: {
      voicePath: ["U", "Y"],
    },

    heartPrimaryPath: ["U", "Y"],

    evidence: {
      surfaceVowels: ["U", "Y"],
      surfaceVowelsRaw: ["U", "Y"],
      vowelPath: ["U", "Y"],
      normalizationSteps: [],
      ops: [],
      notes: [],
      signals: [],
    },

    deepRoot: {
      functionalRoots: [
        {
          id: "sq.shtu+di.v1",
          language: "sq",
          roots: ["shtu", "di"],
          gloss:
            "Functional reading: shtu + di → making knowledge yours through learning.",
          opsUsed: ["s_to_sh", "y_to_i"],
          vowelPath: "U→I",
        },
      ],
    },

    candidates: [
      {
        id: "albanian-di-know-functional",
        language: "sq",
        form: "di",
        sourceKind: "reviewed_dictionary_source",
        embryo: "DI",
        claimType: "functionalMotivation",
        validationOutcome: "validated",
        rankGroup: "validatedFunctionalMotivation",
        plainStandaloneGloss: "know / knowledge",
        claimBoundary:
          "functional motivation evidence only; not historical origin",
        userDecisionPosture: "user_decides",
      },
      {
        id: "latin-studium",
        language: "Latin",
        form: "studium",
        sourceKind: "SEED",
        vowelPath: "U-I",
      },
      {
        id: "albanian-studim",
        language: "Albanian",
        form: "studim",
        sourceKind: "SEED",
        vowelPath: "U-I",
      },
    ],

    rootMap: {
      tokens: [
        {
          token: "SHTU",
          role: "action",
          vowel_path: "U",
        },
        {
          token: "DI",
          role: "instrument",
          vowel_path: "I",
        },
      ],
      keys: [
        {
          token: "SHTU",
          language: "sq",
          gloss: "add / increase / put-on",
          evidence: [
            "sq: shtu",
            "ops: s_to_sh",
          ],
          status: "supported",
          ops: ["s_to_sh"],
        },
        {
          token: "DI",
          language: "sq",
          gloss: "know / knowledge",
          evidence: [
            "sq: di",
            "ops: y_to_i",
            "reviewed functional free-operator evidence",
          ],
          status: "supported",
          ops: ["y_to_i"],
        },
      ],
      carriers: [],
      spans: [],
      composedMeaning:
        "add / increase / put-on + know / knowledge",
    },

    analysisStatusV0_1: {
      schemaVersion:
        "open-instrument.analysis-status.v0_1",
      status: "reviewed_functional_evidence",
      summary:
        "Bounded reviewed functional evidence is available for DI.",
      reviewedOperators: ["DI"],
      candidateOnlyOperators: [],
      structuralTokens: ["SHTU", "DI"],
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
    },
  };
}

describe(
  "Open Instrument embryo-first truth reconciliation v0.1",
  () => {
    it("separates surface U-Y from DeepRoot functional U-I", () => {
      const vm =
        adaptAnalysisToTelemetryVM(
          realStudyShape(),
        );

      expect(vm.readout.voicePathSurface).toEqual({
        kind: "present",
        value: ["U", "Y"],
      });

      expect(vm.readout.voicePathFunctional).toEqual({
        kind: "present",
        value: ["U", "I"],
      });

      expect(
        vm.readout.voicePathDelta,
      ).toBe("DIVERGE");
    });

    it("does not borrow a global DeepRoot path for reviewed DI when DI emits no candidate vowel path", () => {
      const vm =
        adaptAnalysisToTelemetryVM(
          realStudyShape(),
        );

      const di = vm.candidates[0];

      expect(di.id).toBe(
        "albanian-di-know-functional",
      );

      expect(
        di.vowelPath.kind,
      ).toBe("missing");

      expect(
        di.deepRootHeartGate.kind,
      ).toBe("present");

      if (
        di.deepRootHeartGate.kind !==
        "present"
      ) {
        throw new Error(
          "DI gate missing",
        );
      }

      expect(
        di.deepRootHeartGate.value.status,
      ).toBe("insufficient_data");

      expect(
        di.deepRootHeartGate.value.evidenceRefs,
      ).not.toContain(
        "deepRoot.functionalRoots[0].vowelPath",
      );
    });

    it("counts insufficient_data as Insufficient rather than Missing", () => {
      const vm =
        adaptAnalysisToTelemetryVM(
          realStudyShape(),
        );

      const rows =
        buildCandidateRowsFromVM(vm);

      render(
        <DeepRootHeartGateSummaryCard
          rows={rows}
        />,
      );

      expect(
        screen.getByText("Gate rows: 3"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Aligned: 0"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Misaligned: 2"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Insufficient: 1"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Missing: 0"),
      ).toBeInTheDocument();
    });

    it("keeps candidate fallback behind emitted functional evidence when DeepRoot functional path is absent", () => {
      const payload =
        realStudyShape();

      delete payload.deepRoot;

      payload.evidence.surfaceVowels = [
        "U",
        "Y",
      ];

      payload.evidence.vowelPath = [
        "U",
        "Y",
      ];

      payload.candidates[0].vowelPath =
        "U-I";

      const vm =
        adaptAnalysisToTelemetryVM(
          payload,
        );

      expect(
        vm.readout.voicePathSurface,
      ).toEqual({
        kind: "present",
        value: ["U", "Y"],
      });

      expect(
        vm.readout.voicePathFunctional,
      ).toEqual({
        kind: "present",
        value: ["U", "Y"],
      });

      expect(
        vm.readout.voicePathDelta,
      ).toBe("MATCH");
    });

    it("uses candidate functional path only as the final fallback", () => {
      const payload =
        realStudyShape();

      delete payload.deepRoot;
      delete payload.evidence.surfaceVowels;
      delete payload.evidence.vowelPath;

      payload.evidence.surfaceVowelsRaw = [
        "U",
        "Y",
      ];

      payload.candidates[0].vowelPath =
        "U-I";

      const vm =
        adaptAnalysisToTelemetryVM(
          payload,
        );

      expect(
        vm.readout.voicePathSurface,
      ).toEqual({
        kind: "present",
        value: ["U", "Y"],
      });

      expect(
        vm.readout.voicePathFunctional,
      ).toEqual({
        kind: "present",
        value: ["U", "I"],
      });

      expect(
        vm.readout.voicePathDelta,
      ).toBe("DIVERGE");
    });

    it("keeps legacy rows judged from their own U-I paths", () => {
      const vm =
        adaptAnalysisToTelemetryVM(
          realStudyShape(),
        );

      expect(
        vm.candidates[1]
          .deepRootHeartGate.kind,
      ).toBe("present");

      expect(
        vm.candidates[2]
          .deepRootHeartGate.kind,
      ).toBe("present");

      if (
        vm.candidates[1]
          .deepRootHeartGate.kind !==
          "present" ||
        vm.candidates[2]
          .deepRootHeartGate.kind !==
          "present"
      ) {
        throw new Error(
          "legacy candidate gates missing",
        );
      }

      expect(
        vm.candidates[1]
          .deepRootHeartGate.value.status,
      ).toBe("misaligned");

      expect(
        vm.candidates[2]
          .deepRootHeartGate.value.status,
      ).toBe("misaligned");
    });

    it("does not promote an explicitly historical embryo into Functional motivation when RootMap is absent", () => {
      const payload =
        realStudyShape();

      delete payload.rootMap;
      delete payload.deepRoot;

      payload.candidates = [
        {
          id: "historical-context-fixture",
          candidateId:
            "historical-context-fixture",
          language: "fixture",
          candidateLanguage: "fixture",
          form: "h",
          embryo: "H",
          plainStandaloneGloss:
            "historical context fixture",
          functionalStatement:
            "historical context only",
          claimType:
            "historicalTransmission",
          validationOutcome:
            "validated",
          rankGroup:
            "historicalContextOnly",
          claimBoundary:
            "historical context only; not functional motivation",
          userDecisionPosture:
            "user_decides",
        },
      ];

      const vm =
        adaptAnalysisToTelemetryVM(
          payload,
        );

      render(
        <EmbryoExpansionContextCardV0_1
          vm={vm}
        />,
      );

      expect(
        screen.getByText(
          "Functional motivation",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "No supported functional candidate yet.",
        ),
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          "Evidence: Reviewed",
        ),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          "historical context fixture",
        ),
      ).not.toBeInTheDocument();
    });

    it("keeps embryo-only legacy fallback when claimType is genuinely missing", () => {
      const payload =
        realStudyShape();

      delete payload.rootMap;
      delete payload.deepRoot;

      const legacy =
        {
          ...payload.candidates[0],
        };

      delete legacy.claimType;

      legacy.functionalStatement =
        "legacy functional embryo remains usable when claimType was not emitted";

      payload.candidates = [
        legacy,
      ];

      const vm =
        adaptAnalysisToTelemetryVM(
          payload,
        );

      render(
        <EmbryoExpansionContextCardV0_1
          vm={vm}
        />,
      );

      expect(
        screen.getByText(
          "Albanian",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Evidence: Reviewed",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "legacy functional embryo remains usable when claimType was not emitted",
        ),
      ).toBeInTheDocument();
    });

    it("keeps an emitted functional candidate visible when RootMap is absent", () => {
      const payload =
        realStudyShape();

      delete payload.rootMap;
      delete payload.deepRoot;

      payload.candidates = [
        {
          ...payload.candidates[0],
          functionalStatement:
            "knowledge can motivate study and learning",
        },
      ];

      const vm =
        adaptAnalysisToTelemetryVM(
          payload,
        );

      render(
        <EmbryoExpansionContextCardV0_1
          vm={vm}
        />,
      );

      expect(
        screen.getByText(
          "Functional motivation",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Albanian",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getAllByText(
          "DI",
        ).length,
      ).toBeGreaterThanOrEqual(2);

      expect(
        screen.getByText(
          "know / knowledge",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Evidence: Reviewed",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "DI · reviewed",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "knowledge can motivate study and learning",
        ),
      ).toBeInTheDocument();
    });

    it("shows a simple no-supported-candidate state when neither RootMap nor a functional candidate is available", () => {
      const payload =
        realStudyShape();

      delete payload.rootMap;
      delete payload.deepRoot;

      payload.candidates = [
        payload.candidates[1],
        payload.candidates[2],
      ];

      const vm =
        adaptAnalysisToTelemetryVM(
          payload,
        );

      render(
        <EmbryoExpansionContextCardV0_1
          vm={vm}
        />,
      );

      expect(
        screen.getByText(
          "Functional motivation",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "No supported functional candidate yet.",
        ),
      ).toBeInTheDocument();
    });

    it("shows Albanian SHTU + DI as the clear functional-motivation result with partial evidence", () => {
      const vm =
        adaptAnalysisToTelemetryVM(
          realStudyShape(),
        );

      render(
        <EmbryoExpansionContextCardV0_1
          vm={vm}
        />,
      );

      expect(
        screen.getByText(
          "Functional motivation",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Albanian",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "SHTU + DI",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "add / increase / put-on",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "know / knowledge",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'How it can motivate "study"',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "add / increase / put-on + know / knowledge",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Evidence: Partial",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "SHTU · structural",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "DI · reviewed",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Functional path: U → I",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Functional motivation, not historical etymology.",
        ),
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          "Embryo-first expansion context",
        ),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          /not a validated candidate until every required operator is separately reviewed and runtime-authorized/i,
        ),
      ).not.toBeInTheDocument();
    });
  },
);
