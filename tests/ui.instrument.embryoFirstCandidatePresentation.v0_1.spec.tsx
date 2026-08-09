import fs from "node:fs";
import path from "node:path";
import React from "react";
import { render, screen } from "@testing-library/react";

import {
  adaptAnalysisToTelemetryVM,
} from "../src/ui/instrument/contractAdapter";

import {
  buildCandidateRowsFromVM,
} from "../src/ui/candidates/candidateModel";

import {
  CandidatesAccordion,
} from "../src/ui/candidates/CandidatesAccordion";

function reviewedDamagePayload(): any {
  return {
    word: "damage",
    sanitized: "damage",
    engineVersion: "test-v1",
    mode: "strict",
    alphabet: "auto",

    primaryPath: {
      voicePath: ["A", "E"],
      levelPath: ["high", "high"],
      ringPath: [3, 2],
    },

    candidates: [
      {
        id: "albanian-da-dam-damage-functional",
        candidateId:
          "albanian-da-dam-damage-functional",

        language: "sq",
        candidateLanguage: "sq",
        form: "da",
        sourceKind: "reviewed_dictionary_source",

        functionalStatement:
          "what is split or divided can motivate damage/harm",

        embryo: "DA",
        embryoSize: 2,
        embryoLanguage: "sq",

        isolatedStandaloneForm: "da",
        plainStandaloneGloss: "split / divide",

        claimType: "functionalMotivation",
        validationOutcome: "validated",
        rankGroup: "validatedFunctionalMotivation",

        claimBoundary:
          "functional motivation evidence only; not historical origin",

        userDecisionPosture: "user_decides",
      },
    ],
  };
}

describe(
  "Open Instrument embryo-first candidate presentation v0.1",
  () => {
    it("lifts emitted embryo-first fields through the VM boundary", () => {
      const vm =
        adaptAnalysisToTelemetryVM(
          reviewedDamagePayload(),
        );

      expect(vm.candidates).toHaveLength(1);

      const candidate = vm.candidates[0] as any;

      expect(candidate.embryo).toEqual({
        kind: "present",
        value: "DA",
      });

      expect(candidate.plainStandaloneGloss).toEqual({
        kind: "present",
        value: "split / divide",
      });

      expect(candidate.claimType).toEqual({
        kind: "present",
        value: "functionalMotivation",
      });

      expect(candidate.validationOutcome).toEqual({
        kind: "present",
        value: "validated",
      });

      expect(candidate.rankGroup).toEqual({
        kind: "present",
        value: "validatedFunctionalMotivation",
      });

      expect(candidate.claimBoundary).toEqual({
        kind: "present",
        value:
          "functional motivation evidence only; not historical origin",
      });

      expect(candidate.userDecisionPosture).toEqual({
        kind: "present",
        value: "user_decides",
      });
    });

    it("renders reviewed embryo-first meaning from VM fields without reading raw candidate fields", () => {
      const vm =
        adaptAnalysisToTelemetryVM(
          reviewedDamagePayload(),
        );

      const rows = buildCandidateRowsFromVM(vm);

      expect(rows).toHaveLength(1);

      expect(rows[0]).toMatchObject({
        embryo: "DA",
        plainStandaloneGloss: "split / divide",
        claimType: "functionalMotivation",
        validationOutcome: "validated",
        rankGroup: "validatedFunctionalMotivation",
        claimBoundary:
          "functional motivation evidence only; not historical origin",
        userDecisionPosture: "user_decides",
      });

      rows[0].raw = new Proxy(
        {},
        {
          get(_target, property) {
            throw new Error(
              `REGRESSION: candidate raw field read by presentation: ${String(property)}`,
            );
          },
        },
      );

      render(
        <CandidatesAccordion rows={rows} />,
      );

      expect(
        screen.getByText("Embryo: DA"),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Functional evidence: validated",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Functional motivation"),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Embryo gloss: split / divide",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /Boundary: functional motivation evidence only; not historical origin/i,
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Decision: user decides",
        ),
      ).toBeInTheDocument();
    });

    it("keeps validated historical context distinct from functional evidence", () => {
      const vm =
        adaptAnalysisToTelemetryVM({
          word: "history-fixture",
          sanitized: "history-fixture",
          engineVersion: "test-v1",
          mode: "strict",
          alphabet: "auto",

          primaryPath: {
            voicePath: ["A"],
            levelPath: ["high"],
            ringPath: [3],
          },

          candidates: [
            {
              id: "historical-context-fixture",
              language: "fixture",
              form: "h",
              embryo: "H",
              plainStandaloneGloss:
                "historical context fixture",
              claimType: "historicalTransmission",
              validationOutcome: "validated",
              rankGroup: "historicalContextOnly",
              claimBoundary:
                "historical context only; not functional motivation",
              userDecisionPosture: "user_decides",
            },
          ],
        });

      const rows = buildCandidateRowsFromVM(vm);

      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        embryo: "H",
        claimType: "historicalTransmission",
        validationOutcome: "validated",
        rankGroup: "historicalContextOnly",
      });

      render(
        <CandidatesAccordion rows={rows} />,
      );

      expect(
        screen.getByText("Embryo: H"),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Historical context: validated",
        ),
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          "Functional evidence: validated",
        ),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          "Functional motivation",
        ),
      ).not.toBeInTheDocument();
    });

    it("does not invent embryo-first presentation for an ordinary candidate", () => {
      const vm =
        adaptAnalysisToTelemetryVM({
          word: "father",
          sanitized: "father",
          engineVersion: "test-v1",
          mode: "strict",
          alphabet: "auto",
          primaryPath: {
            voicePath: ["A", "E"],
            levelPath: ["high", "high"],
            ringPath: [3, 2],
          },
          candidates: [
            {
              id: "latin-pater",
              language: "Latin",
              form: "pater",
            },
          ],
        });

      render(
        <CandidatesAccordion
          rows={buildCandidateRowsFromVM(vm)}
        />,
      );

      expect(
        screen.queryByText(/^Embryo:/i),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          /^Functional evidence:/i,
        ),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          /^Decision: user decides$/i,
        ),
      ).not.toBeInTheDocument();
    });

    it("keeps embryo-first presentation off c.raw property access", () => {
      const source = fs.readFileSync(
        path.join(
          process.cwd(),
          "src/ui/candidates/CandidatesAccordion.tsx",
        ),
        "utf8",
      );

      expect(source).not.toMatch(
        /c\.raw\.(?:embryo|plainStandaloneGloss|claimType|validationOutcome|rankGroup|claimBoundary|userDecisionPosture)/,
      );
    });
  },
);
