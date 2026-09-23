import { readFileSync } from "node:fs";
import path from "node:path";

import {
  SEVEN_VOICE_DOCTRINE_PROFILES_V0_1,
} from "@/shared/openInstrument/doctrineFunctionalProfile.v0_1";
import {
  projectLevel3DoctrineReadingV0_1,
} from "@/shared/openInstrument/doctrineLevel3ProofPair.v0_1";
import {
  buildDoctrineLevel3PairReviewArtifactV0_1,
  candidatePairReadingV0_1,
  DOCTRINE_LEVEL3_PAIR_CANDIDATE_REVIEW_STATUS_V0_1,
  DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1,
  DOCTRINE_LEVEL3_PAIR_PRODUCTION_STATUS_V0_1,
  DOCTRINE_LEVEL3_PAIR_SELF_PAIR_STATUS_V0_1,
  DOCTRINE_LEVEL3_PAIR_CANDIDATE_TEMPLATE_ID_V0_1,
  generateDoctrineLevel3PairReviewMatrixV0_1,
  getDoctrineLevel3AtomProposalsV0_1,
} from "@/shared/openInstrument/doctrineLevel3PairCandidateGenerator.v0_1";
import { SEVEN_PRINCIPLES } from "@/shared/sevenPrinciples.v1";
import { symbolicMathOrder } from "@/shared/sevenVoiceOrderedViews.v0.1";

const REVIEW_ARTIFACT_PATH = path.resolve(
  process.cwd(),
  "docs/open-instrument/doctrine-level3-pair-candidate-review-matrix-v0.1.json",
);

function readReviewArtifact(): unknown {
  return JSON.parse(readFileSync(REVIEW_ARTIFACT_PATH, "utf8"));
}

describe("Open Instrument Level-3 pair candidate generator v0.1", () => {
  it("contains exactly seven review atoms grounded in canonical roles and properties", () => {
    const atoms = getDoctrineLevel3AtomProposalsV0_1();

    expect(atoms.map((atom) => atom.voice)).toEqual(symbolicMathOrder);
    expect(atoms).toHaveLength(7);

    for (const atom of atoms) {
      const profile = SEVEN_VOICE_DOCTRINE_PROFILES_V0_1[atom.voice];

      expect(atom.canonicalRole).toBe(SEVEN_PRINCIPLES[atom.voice].role);
      expect(atom.canonicalProperties).toEqual(
        profile.functionalProperties.map((property) => property.id),
      );
      expect(atom.newSemanticContent).toBe("NO");
      expect(atom.status).toBe(DOCTRINE_LEVEL3_PAIR_CANDIDATE_REVIEW_STATUS_V0_1);
      expect(atom.tokensUsed.join(" ")).toBe(atom.proposedCompactExpression);

      for (const trace of atom.traceToCanon) {
        expect(
          trace.sourceKind === "canonical_role"
            ? trace.sourceValue === atom.canonicalRole
            : atom.canonicalProperties.includes(trace.sourceValue as never),
        ).toBe(true);
      }
    }
  });

  it("keeps the exact U/Y anchors and records them as production anchors only", () => {
    const atoms = getDoctrineLevel3AtomProposalsV0_1();
    const u = atoms.find((atom) => atom.voice === "U");
    const y = atoms.find((atom) => atom.voice === "Y");

    expect(u?.proposedCompactExpression).toBe("grounded depth");
    expect(y?.proposedCompactExpression).toBe("reflective exploration");
    expect(u?.productionAnchor).toBe(DOCTRINE_LEVEL3_PAIR_PRODUCTION_STATUS_V0_1);
    expect(y?.productionAnchor).toBe(DOCTRINE_LEVEL3_PAIR_PRODUCTION_STATUS_V0_1);
    expect(JSON.stringify(atoms)).not.toMatch(
      /study|damage|father|sterile|blood|water|targetSense|provider|model/i,
    );
  });

  it("uses the fixed review template without transition semantics", () => {
    const first = candidatePairReadingV0_1("U", "Y");
    const repeated = candidatePairReadingV0_1("U", "Y");
    const forward = candidatePairReadingV0_1("A", "E");
    const reverse = candidatePairReadingV0_1("E", "A");
    const selfPair = candidatePairReadingV0_1("U", "U");

    expect(first.candidateReading).toBe(
      "grounded depth with reflective exploration",
    );
    expect(forward.candidateReading).toBe(
      "initiating beginning with expanding growth",
    );
    expect(reverse.candidateReading).toBe(
      "expanding growth with initiating beginning",
    );
    expect(forward.status).toBe(DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1);
    expect(reverse.status).toBe(DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1);
    expect(selfPair.status).toBe(DOCTRINE_LEVEL3_PAIR_SELF_PAIR_STATUS_V0_1);
    expect(candidatePairReadingV0_1("I", "O").status).toBe(
      DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1,
    );
    expect(candidatePairReadingV0_1("I", "U").status).toBe(
      DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1,
    );
    expect(first).toEqual(repeated);
    expect(forward.candidateReading).not.toBe(reverse.candidateReading);
    expect(selfPair.firstAtom).toBe(selfPair.secondAtom);
    expect(selfPair.pair).toBe("U→U");
    expect(first.templateId).toBe(DOCTRINE_LEVEL3_PAIR_CANDIDATE_TEMPLATE_ID_V0_1);
    expect(first.causality).toBe("NOT_AUTHORIZED");
    expect(first.temporality).toBe("NOT_AUTHORIZED");
    expect(first.transformation).toBe("NOT_AUTHORIZED");
    expect(first.dominance).toBe("NOT_AUTHORIZED");
    expect(first.level4TransitionSemantics).toBe("NOT_AUTHORIZED");
    expect(first).not.toHaveProperty("targetSense");
    expect(first).not.toHaveProperty("evidence");
    expect(first).not.toHaveProperty("language");
  });

  it("generates the complete ordered 7x7 matrix with 42 generic production rows", () => {
    const matrix = generateDoctrineLevel3PairReviewMatrixV0_1();
    const pairs = matrix.map((candidate) => candidate.pair);

    expect(matrix).toHaveLength(49);
    expect(new Set(pairs).size).toBe(49);
    expect(
      matrix.filter(
        (candidate) => candidate.status === DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1,
      ),
    ).toHaveLength(42);
    expect(
      matrix.filter(
        (candidate) => candidate.status === DOCTRINE_LEVEL3_PAIR_CANDIDATE_REVIEW_STATUS_V0_1,
      ),
    ).toHaveLength(0);
    expect(
      matrix.filter(
        (candidate) => candidate.status === DOCTRINE_LEVEL3_PAIR_SELF_PAIR_STATUS_V0_1,
      ),
    ).toHaveLength(7);
    expect(
      matrix.filter((candidate) => candidate.firstVoice === candidate.secondVoice),
    ).toHaveLength(7);
  });

  it("reproduces the review artifact deterministically", () => {
    expect(readReviewArtifact()).toEqual(buildDoctrineLevel3PairReviewArtifactV0_1());
  });

  it("authorizes every exact two-distinct-Voice path and rejects self/longer paths", () => {
    for (const firstVoice of symbolicMathOrder) {
      for (const secondVoice of symbolicMathOrder) {
        const candidate = candidatePairReadingV0_1(firstVoice, secondVoice);
        const reading = projectLevel3DoctrineReadingV0_1([
          firstVoice,
          secondVoice,
        ]);

        if (firstVoice === secondVoice) {
          expect(candidate.status).toBe(DOCTRINE_LEVEL3_PAIR_SELF_PAIR_STATUS_V0_1);
          expect(reading).toBeNull();
        } else {
          expect(candidate.status).toBe(
            DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1,
          );
          expect(reading?.reading).toBe(candidate.candidateReading);
        }
      }
    }

    expect(projectLevel3DoctrineReadingV0_1(["A", "E", "I"])).toBeNull();
    expect(projectLevel3DoctrineReadingV0_1(["E", "A", "E"])).toBeNull();
    expect(projectLevel3DoctrineReadingV0_1([])).toBeNull();

    expect(readReviewArtifact()).toMatchObject({
      authorizationLaw:
        "OPEN_INSTRUMENT_GENERIC_DISTINCT_PAIR_LEVEL3_COMPOSITION_LAW_V1",
      historicalExplicitProofPairs: ["U→Y", "A→E", "E→A", "I→O"],
    });
  });

  it("freezes the identity-only selection before candidate wording review", () => {
    const selection = JSON.parse(
      readFileSync(
        path.resolve(
          process.cwd(),
          "docs/open-instrument/level3-independent-family-generalization-proof-v0.1-selection.json",
        ),
        "utf8",
      ),
    ) as Record<string, any>;

    expect(selection.selectedPairKey).toBe("I→O");
    expect(selection.selectionFrozenBeforePhraseReview).toBe(true);
    expect(selection.eligiblePairKeys).toEqual([
      "I→O",
      "I→U",
      "I→Y",
      "I→Ë",
      "O→I",
      "O→U",
      "O→Y",
      "O→Ë",
      "U→I",
      "U→O",
      "U→Ë",
      "Y→I",
      "Y→O",
      "Y→U",
      "Y→Ë",
      "Ë→I",
      "Ë→O",
      "Ë→U",
      "Ë→Y",
    ]);
    expect(selection).not.toHaveProperty("candidateReading");
    expect(selection).not.toHaveProperty("firstAtom");
    expect(selection).not.toHaveProperty("secondAtom");

    const selectedCandidate = readReviewArtifact() as any;
    const selectedRow = selectedCandidate.orderedPairCandidates.find(
      (candidate: any) => candidate.pair === selection.selectedPairKey,
    );
    expect(selectedRow).toMatchObject({
      pair: "I→O",
      templateId: DOCTRINE_LEVEL3_PAIR_CANDIDATE_TEMPLATE_ID_V0_1,
      status: DOCTRINE_LEVEL3_PAIR_GENERIC_PRODUCTION_STATUS_V0_1,
    });
    expect(selectedRow.candidateReading).toBe(
      candidatePairReadingV0_1("I", "O").candidateReading,
    );
  });
});
