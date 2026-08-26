import { readFileSync } from "node:fs";

import {
  orderEmbryoFirstCandidatesForAnalyzeV1,
  projectEmbryoFirstCandidateForAnalyzeV1,
} from "@/shared/analysisAdapter";

import {
  buildAnalysisStatusV0_1,
} from "@/shared/analysisStatus.v0_1";

const STRUCTURAL_SOURCE_KIND =
  "logic_derived_structural_hypothesis";

function structuralErCandidate() {
  return {
    id: "logic-structural:sterile:er",
    candidateId:
      "logic-structural:sterile:er",
    form: "ER",
    displayForm: "ER",
    candidateLanguage: "unknown",
    sourceKind:
      STRUCTURAL_SOURCE_KIND,
    claimType:
      "structuralHypothesis",
    originClaim:
      "not_claimed",
    historicalRelation:
      "not_evaluated",
    embryo: "ER",
    embryoSize: 2,
    embryoLanguage: null,
    isolatedStandaloneForm: null,
    plainStandaloneGloss: null,
    sourceNote: null,
    semanticBridge: null,
    expansionChain: [
      "ER",
      "TER",
      "STER",
      "STERILE",
    ],
    validationOutcome:
      "not_evaluated",
    validationReasons: [
      "structural_reduction_applied",
      "minimum_defensible_embryo_reached",
      "independent_meaning_unknown",
      "lexical_attestation_not_required_for_discovery",
      "historical_origin_not_claimed",
      "candidate_truth_not_claimed",
      "production_promotion_not_claimed",
    ],
    rankGroup:
      "structuralHypothesis",
    rankScore: 40,
    rankReason:
      "deterministic structural hypothesis only",
    claimBoundary:
      "structural hypothesis only; independent meaning unknown; not reviewed evidence or historical origin",
    userDecisionPosture:
      "user_decides",
  };
}

describe(
  "ZË-RO structural hypothesis contract v0.1",
  () => {
    it(
      "preserves a deterministic structural hypothesis as its own claim type without inventing lexical meaning",
      () => {
        const projected =
          projectEmbryoFirstCandidateForAnalyzeV1(
            structuralErCandidate(),
            {
              word: "sterile",
            },
          );

        expect(
          projected.sourceKind,
        ).toBe(
          STRUCTURAL_SOURCE_KIND,
        );

        expect(
          projected.claimType,
        ).toBe(
          "structuralHypothesis",
        );

        expect(
          projected.embryo,
        ).toBe("ER");

        expect(
          projected.embryoSize,
        ).toBe(2);

        expect(
          projected.embryoLanguage,
        ).toBeNull();

        expect(
          projected.isolatedStandaloneForm,
        ).toBeNull();

        expect(
          projected.plainStandaloneGloss,
        ).toBeNull();

        expect(
          projected.sourceNote,
        ).toBeNull();

        expect(
          projected.semanticBridge,
        ).toBeNull();

        expect(
          projected.validationOutcome,
        ).toBe(
          "not_evaluated",
        );

        expect(
          projected.rankGroup,
        ).toBe(
          "structuralHypothesis",
        );

        expect(
          projected.originClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          projected.userDecisionPosture,
        ).toBe(
          "user_decides",
        );

        expect(
          projected.validationReasons,
        ).toEqual(
          expect.arrayContaining([
            "independent_meaning_unknown",
            "lexical_attestation_not_required_for_discovery",
            "candidate_truth_not_claimed",
          ]),
        );

        expect(
          projected.validationReasons,
        ).not.toEqual(
          expect.arrayContaining([
            "missing_isolatedStandaloneForm",
            "missing_plainStandaloneGloss",
            "missing_sourceNote",
            "missing_semanticBridge",
            "embryo_first_full_functional_validation_not_claimed",
          ]),
        );
      },
    );

    it(
      "ranks partial functional evidence above structural hypothesis and structural hypothesis above surface-only candidates",
      () => {
        const partialFunctional =
          projectEmbryoFirstCandidateForAnalyzeV1(
            {
              id:
                "partial-functional",
              candidateId:
                "partial-functional",
              form: "DA",
              language: "sq",
              embryo: "DA",
              isolatedStandaloneForm:
                "da",
              plainStandaloneGloss:
                "split / divide",
              sourceNote:
                "reviewed functional fixture",
              semanticBridge:
                "functional bridge",
              claimType:
                "functionalMotivation",
              validationOutcome:
                "partial",
              rankGroup:
                "partialFunctionalMotivation",
              originClaim:
                "not_claimed",
              userDecisionPosture:
                "user_decides",
            },
            {
              word: "control",
            },
          );

        const structural =
          projectEmbryoFirstCandidateForAnalyzeV1(
            structuralErCandidate(),
            {
              word: "sterile",
            },
          );

        const surface =
          projectEmbryoFirstCandidateForAnalyzeV1(
            {
              id:
                "surface-only",
              candidateId:
                "surface-only",
              form: "ER",
              language: "unknown",
              sourceKind: "SEED",
              claimType:
                "surfaceResonance",
              validationOutcome:
                "partial",
              rankGroup:
                "surfaceOrSeedOnly",
              originClaim:
                "not_claimed",
              userDecisionPosture:
                "user_decides",
            },
            {
              word: "control",
            },
          );

        const ordered =
          orderEmbryoFirstCandidatesForAnalyzeV1(
            [
              surface,
              structural,
              partialFunctional,
            ],
          );

        expect(
          ordered.map(
            (candidate) =>
              candidate.candidateId,
          ),
        ).toEqual([
          "partial-functional",
          "logic-structural:sterile:er",
          "surface-only",
        ]);
      },
    );

    it(
      "maps a deterministic structural hypothesis to structural_unreviewed instead of Null",
      () => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "structural-control",
            rootMap: {
              tokens: [],
              keys: [],
            },
            candidates: [
              structuralErCandidate(),
            ],
          });

        expect(
          status.status,
        ).toBe(
          "structural_unreviewed",
        );

        expect(
          status.claimBoundary
            .candidateTruthClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          status.claimBoundary
            .nullIsValid,
        ).toBe(true);
      },
    );

    it(
      "does not use proto-root canonical or reviewed-source registration as an ER visibility shortcut",
      () => {
        const protoRoots =
          readFileSync(
            "src/shared/protoRoots.v1.ts",
            "utf8",
          );

        const canonicalProfiles =
          readFileSync(
            "src/shared/canonicalOperatorProfile.v0_1.ts",
            "utf8",
          );

        const reviewedRegistry =
          readFileSync(
            "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
            "utf8",
          );

        expect(
          protoRoots,
        ).not.toMatch(
          /\bid:\s*["']ER["']/,
        );

        expect(
          canonicalProfiles,
        ).not.toMatch(
          /\boperatorId:\s*["']ER["']/,
        );

        expect(
          reviewedRegistry,
        ).not.toMatch(
          /\bembryo:\s*["']ER["']/,
        );

        expect(
          reviewedRegistry,
        ).not.toMatch(
          /reviewed\.external\.er(?:\.|["'])/i,
        );
      },
    );

    it(
      "does not permit a hard-coded sterile-specific discovery branch",
      () => {
        const adapter =
          readFileSync(
            "src/shared/analysisAdapter.ts",
            "utf8",
          );

        const minRoots =
          readFileSync(
            "src/shared/deepRoot.minRoots.v1.ts",
            "utf8",
          );

        expect(
          adapter,
        ).not.toMatch(
          /\bword\s*===?\s*["']sterile["']/i,
        );

        expect(
          minRoots,
        ).not.toMatch(
          /\b(?:basis|word)\s*===?\s*["']sterile["']/i,
        );
      },
    );

    it(
      "preserves the existing reviewed functional candidate contract",
      () => {
        const projected =
          projectEmbryoFirstCandidateForAnalyzeV1(
            {
              id:
                "reviewed-da-control",
              candidateId:
                "reviewed-da-control",
              form: "DA",
              candidateLanguage:
                "sq",
              sourceKind:
                "reviewed_dictionary_source",
              claimType:
                "functionalMotivation",
              originClaim:
                "not_claimed",
              historicalRelation:
                "not_evaluated",
              embryo: "DA",
              isolatedStandaloneForm:
                "da",
              plainStandaloneGloss:
                "split / divide",
              sourceNote:
                "reviewed bounded source",
              semanticBridge:
                "split or divide can motivate damage",
              validationOutcome:
                "validated",
              rankGroup:
                "validatedFunctionalMotivation",
              userDecisionPosture:
                "user_decides",
            },
            {
              word: "damage",
            },
          );

        expect(
          projected.claimType,
        ).toBe(
          "functionalMotivation",
        );

        expect(
          projected.validationOutcome,
        ).toBe(
          "validated",
        );

        expect(
          projected.rankGroup,
        ).toBe(
          "validatedFunctionalMotivation",
        );
      },
    );
  },
);
