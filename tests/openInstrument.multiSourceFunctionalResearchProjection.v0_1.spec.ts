import {
  discoverMultiSourceFunctionalWitnessesV0_1,
} from "@/shared/multiSourceFunctionalDiscovery.v0_1";

import {
  buildMultiSourceFunctionalResearchInputsV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";

import {
  multiSourceFunctionalResearchEvidenceRowsErV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRows.er.v0_1";

import {
  projectMultiSourceFunctionalResearchWitnessesV0_1,
  RESEARCH_FUNCTIONAL_HYPOTHESIS_STATUS_V0_1,
} from "@/shared/multiSourceFunctionalResearchProjection.v0_1";

function realErWitnesses() {
  const inputs =
    buildMultiSourceFunctionalResearchInputsV0_1({
      targetWord:
        "sterile",

      embryo:
        "ER",

      rows:
        multiSourceFunctionalResearchEvidenceRowsErV0_1,
    });

  return discoverMultiSourceFunctionalWitnessesV0_1({
    targetWord:
      "sterile",

    embryo:
      "ER",

    structuralExpansionChain: [
      "ER",
      "TER",
      "STER",
      "STERILE",
    ],

    sources:
      inputs,
  });
}

describe(
  "Open Instrument research functional hypothesis projection v0.1",
  () => {
    it(
      "uses a distinct research-functional status rather than overloading candidate_only",
      () => {
        expect(
          RESEARCH_FUNCTIONAL_HYPOTHESIS_STATUS_V0_1,
        ).toBe(
          "research_functional_hypothesis",
        );

        expect(
          RESEARCH_FUNCTIONAL_HYPOTHESIS_STATUS_V0_1,
        ).not.toBe(
          "candidate_only",
        );
      },
    );

    it(
      "projects all currently admissible real ER witnesses without stopping at the first source",
      () => {
        const witnesses =
          realErWitnesses();

        expect(witnesses).toHaveLength(2);

        const projected =
          projectMultiSourceFunctionalResearchWitnessesV0_1(
            witnesses,
          );

        expect(projected).toHaveLength(2);

        expect(
          projected.map(
            (item) => item.sourceId,
          ),
        ).toEqual([
          "research.external.pokorny-er5-loose-crumbly.v0_1",
          "research.external.greek-eremos-empty-devoid.v0_1",
        ]);
      },
    );

    it(
      "projects research witnesses as functionalMotivation but leaves validation unresolved and not evaluated",
      () => {
        const projected =
          projectMultiSourceFunctionalResearchWitnessesV0_1(
            realErWitnesses(),
          );

        for (const item of projected) {
          expect(
            item.sourceKind,
          ).toBe(
            "multi_source_research_witness",
          );

          expect(
            item.claimType,
          ).toBe(
            "functionalMotivation",
          );

          expect(
            item.validationOutcome,
          ).toBe(
            "not_evaluated",
          );

          expect(
            item.rankGroup,
          ).toBe(
            "unresolved",
          );

          expect(
            item.sourceStatus,
          ).toBe(
            "research_candidate",
          );
        }
      },
    );

    it(
      "preserves source form, lexical gloss, semantic bridge, and citations",
      () => {
        const projected =
          projectMultiSourceFunctionalResearchWitnessesV0_1(
            realErWitnesses(),
          );

        const greek =
          projected.find(
            (item) =>
              item.sourceId ===
              "research.external.greek-eremos-empty-devoid.v0_1",
          );

        expect(greek).toBeTruthy();

        expect(
          greek?.form,
        ).toBe(
          "ἐρῆμος",
        );

        expect(
          greek?.displayForm,
        ).toBe(
          "ἐρῆμος",
        );

        expect(
          greek?.plainStandaloneGloss,
        ).toContain(
          "empty",
        );

        expect(
          greek?.semanticBridge,
        ).toContain(
          "productive or reproductive capacity",
        );

        expect(
          greek?.evidenceRefs,
        ).toEqual([
          "research.external.logeion-eremos.citation.v0_1",
          "research.external.pokorny-er5-greek-reflex.citation.v0_1",
        ]);
      },
    );

    it(
      "preserves attestation truth separately from functional-bridge truth",
      () => {
        const projected =
          projectMultiSourceFunctionalResearchWitnessesV0_1(
            realErWitnesses(),
          );

        const pokorny =
          projected.find(
            (item) =>
              item.sourceId ===
              "research.external.pokorny-er5-loose-crumbly.v0_1",
          );

        const greek =
          projected.find(
            (item) =>
              item.sourceId ===
              "research.external.greek-eremos-empty-devoid.v0_1",
          );

        expect(
          pokorny?.attestationTruth,
        ).toBe(
          "inference",
        );

        expect(
          pokorny?.functionalBridgeTruth,
        ).toBe(
          "hypothesis",
        );

        expect(
          greek?.attestationTruth,
        ).toBe(
          "fact",
        );

        expect(
          greek?.functionalBridgeTruth,
        ).toBe(
          "hypothesis",
        );
      },
    );

    it(
      "never turns a research projection into reviewed evidence, historical origin, winner, or candidate truth",
      () => {
        const projected =
          projectMultiSourceFunctionalResearchWitnessesV0_1(
            realErWitnesses(),
          );

        expect(
          projected.length,
        ).toBeGreaterThan(0);

        for (const item of projected) {
          expect(
            item.claimBoundary,
          ).toBe(
            "research_functional_hypothesis_only",
          );

          expect(
            item.historicalOriginClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            item.historicalTransmissionClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            item.winnerClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            item.languageSuperiorityClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            item.candidateTruthClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            item.userDecisionPosture,
          ).toBe(
            "user_decides",
          );
        }
      },
    );

    it(
      "preserves explicit target-word binding from research witness into projection",
      () => {
        const projected =
          projectMultiSourceFunctionalResearchWitnessesV0_1(
            realErWitnesses(),
          );

        expect(projected).toHaveLength(2);

        for (const item of projected) {
          expect(
            (item as any).targetWord,
          ).toBe(
            "sterile",
          );
        }
      },
    );

    it(
      "does not resurrect unresolved Albanian erë observations as projected ER candidates",
      () => {
        const projected =
          projectMultiSourceFunctionalResearchWitnessesV0_1(
            realErWitnesses(),
          );

        expect(
          projected.some(
            (item) =>
              item.language ===
              "Albanian",
          ),
        ).toBe(false);
      },
    );
  },
);
