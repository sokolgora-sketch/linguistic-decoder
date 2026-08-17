import fs from "node:fs";
import path from "node:path";

import {
  discoverCanonicalOperatorCandidatesV0_1,
} from "../src/shared/canonicalOperatorDiscovery.v0_1";

import {
  canonicalOperatorProfilesV0_1,
} from "../src/shared/canonicalOperatorProfile.v0_1";

import {
  REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1,
  canonicalOperatorReuseMatrixV0_1,
} from "../src/shared/canonicalOperatorReuseMatrix.v0_1";

const root = process.cwd();

const report = fs.readFileSync(
  path.join(
    root,
    "docs/open-instrument/reports/synthetic-da-di-collision-null-design-package-v0.1.md",
  ),
  "utf8",
);

const profileSource = fs.readFileSync(
  path.join(
    root,
    "src/shared/canonicalOperatorProfile.v0_1.ts",
  ),
  "utf8",
);

const discoverySource = fs.readFileSync(
  path.join(
    root,
    "src/shared/canonicalOperatorDiscovery.v0_1.ts",
  ),
  "utf8",
);

const matrixSource = fs.readFileSync(
  path.join(
    root,
    "src/shared/canonicalOperatorReuseMatrix.v0_1.ts",
  ),
  "utf8",
);

const selectedProbes = {
  "embeddedCandidateOnly": [
    {
      "word": "ada",
      "probeKind": "embedded_prefix",
      "baseOperatorId": "DA",
      "candidateOperatorIds": [
        "DA"
      ]
    },
    {
      "word": "adi",
      "probeKind": "embedded_prefix",
      "baseOperatorId": "DI",
      "candidateOperatorIds": [
        "DI"
      ]
    },
    {
      "word": "bda",
      "probeKind": "embedded_prefix",
      "baseOperatorId": "DA",
      "candidateOperatorIds": [
        "DA"
      ]
    },
    {
      "word": "bdi",
      "probeKind": "embedded_prefix",
      "baseOperatorId": "DI",
      "candidateOperatorIds": [
        "DI"
      ]
    },
    {
      "word": "cda",
      "probeKind": "embedded_prefix",
      "baseOperatorId": "DA",
      "candidateOperatorIds": [
        "DA"
      ]
    },
    {
      "word": "cdi",
      "probeKind": "embedded_prefix",
      "baseOperatorId": "DI",
      "candidateOperatorIds": [
        "DI"
      ]
    },
    {
      "word": "eda",
      "probeKind": "embedded_prefix",
      "baseOperatorId": "DA",
      "candidateOperatorIds": [
        "DA"
      ]
    },
    {
      "word": "edi",
      "probeKind": "embedded_prefix",
      "baseOperatorId": "DI",
      "candidateOperatorIds": [
        "DI"
      ]
    }
  ],
  "embeddedNull": [],
  "operationNull": [
    {
      "word": "a",
      "probeKind": "one_edit_deletion",
      "baseOperatorId": "DA",
      "candidateOperatorIds": []
    },
    {
      "word": "i",
      "probeKind": "one_edit_deletion",
      "baseOperatorId": "DI",
      "candidateOperatorIds": []
    },
    {
      "word": "d",
      "probeKind": "one_edit_deletion",
      "baseOperatorId": "DA",
      "candidateOperatorIds": []
    },
    {
      "word": "ai",
      "probeKind": "one_edit_substitution",
      "baseOperatorId": "DI",
      "candidateOperatorIds": []
    },
    {
      "word": "aa",
      "probeKind": "one_edit_substitution",
      "baseOperatorId": "DA",
      "candidateOperatorIds": []
    },
    {
      "word": "bi",
      "probeKind": "one_edit_substitution",
      "baseOperatorId": "DI",
      "candidateOperatorIds": []
    },
    {
      "word": "ba",
      "probeKind": "one_edit_substitution",
      "baseOperatorId": "DA",
      "candidateOperatorIds": []
    },
    {
      "word": "ci",
      "probeKind": "one_edit_substitution",
      "baseOperatorId": "DI",
      "candidateOperatorIds": []
    }
  ],
  "broadNull": [
    {
      "word": "be",
      "probeKind": "broad_consonant_vowel",
      "baseOperatorId": null,
      "candidateOperatorIds": []
    },
    {
      "word": "ce",
      "probeKind": "broad_consonant_vowel",
      "baseOperatorId": null,
      "candidateOperatorIds": []
    },
    {
      "word": "fe",
      "probeKind": "broad_consonant_vowel",
      "baseOperatorId": null,
      "candidateOperatorIds": []
    },
    {
      "word": "ge",
      "probeKind": "broad_consonant_vowel",
      "baseOperatorId": null,
      "candidateOperatorIds": []
    },
    {
      "word": "he",
      "probeKind": "broad_consonant_vowel",
      "baseOperatorId": null,
      "candidateOperatorIds": []
    },
    {
      "word": "je",
      "probeKind": "broad_consonant_vowel",
      "baseOperatorId": null,
      "candidateOperatorIds": []
    },
    {
      "word": "ke",
      "probeKind": "broad_consonant_vowel",
      "baseOperatorId": null,
      "candidateOperatorIds": []
    },
    {
      "word": "le",
      "probeKind": "broad_consonant_vowel",
      "baseOperatorId": null,
      "candidateOperatorIds": []
    }
  ]
} as const;

type CanonicalOperatorId = "DA" | "DI";

function operatorIdsFor(
  word: string,
): CanonicalOperatorId[] {
  return Array.from(
    new Set(
      discoverCanonicalOperatorCandidatesV0_1(word)
        .map((candidate) => candidate.operatorId)
        .filter(
          (
            operatorId,
          ): operatorId is CanonicalOperatorId =>
            operatorId === "DA" ||
            operatorId === "DI",
        ),
    ),
  ).sort();
}

function reviewedOperatorIdsFor(
  word: string,
): CanonicalOperatorId[] {
  return Array.from(
    new Set(
      discoverCanonicalOperatorCandidatesV0_1(word)
        .filter(
          (candidate) =>
            candidate.reviewedEvidenceEligible === true,
        )
        .map((candidate) => candidate.operatorId)
        .filter(
          (
            operatorId,
          ): operatorId is CanonicalOperatorId =>
            operatorId === "DA" ||
            operatorId === "DI",
        ),
    ),
  ).sort();
}

function discoverySignature(
  word: string,
): string {
  return JSON.stringify(
    discoverCanonicalOperatorCandidatesV0_1(word),
  );
}

const allSelectedProbes = [
  ...selectedProbes.embeddedCandidateOnly,
  ...selectedProbes.embeddedNull,
  ...selectedProbes.operationNull,
  ...selectedProbes.broadNull,
];

describe(
  "synthetic DA/DI collision and Null design package v0.1",
  () => {
    it("records a design-only package and acceptance-review next step", () => {
      expect(report).toContain(
        "Status: `SYNTHETIC_COLLISION_NULL_DESIGN_ONLY`",
      );

      expect(report).toContain(
        "`SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_CREATED`",
      );

      expect(report).toContain(
        "`SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_ACCEPTANCE_REVIEW`",
      );

      expect(report).toContain(
        "`SYNTHETIC_DA_DI_COLLISION_NULL_RUNTIME_OR_BASELINE_IMPLEMENTATION`",
      );
    });

    it("locks synthetic probes as non-lexical and non-semantic", () => {
      for (const marker of [
        "`NO_LEXICAL_CLAIM`",
        "`NO_SEMANTIC_CLAIM`",
        "`NO_HISTORICAL_ORIGIN_CLAIM`",
        "`NO_HISTORICAL_TRANSMISSION_CLAIM`",
        "`NO_WINNER_CLAIM`",
        "`NO_LANGUAGE_SUPERIORITY_CLAIM`",
        "`NO_OWNERSHIP_CLAIM`",
        "`NO_CANDIDATE_TRUTH_CLAIM`",
        "`USER_DECIDES`",
      ]) {
        expect(report).toContain(marker);
      }

      expect(report).toContain(
        "Accidental resemblance to a real word does not create lexical, historical, functional, or semantic authority.",
      );
    });

    it("keeps Y inside the seven canonical vowels", () => {
      expect(report).toContain(
        "`Y_IS_A_CANONICAL_VOWEL`",
      );

      expect(report).toContain(
        "`NO_CONSONANTAL_Y_MODE`",
      );

      expect(report).toContain("- `Y`");
      expect(report).toContain("- `Ë`");
    });

    it("locks every exact selected probe in the design report", () => {
      expect(allSelectedProbes.length).toBeGreaterThanOrEqual(
        12,
      );

      expect(
        new Set(
          allSelectedProbes.map(
            (probe) => probe.word,
          ),
        ).size,
      ).toBe(allSelectedProbes.length);

      for (const probe of allSelectedProbes) {
        expect(report).toContain(
          `| \`${probe.word}\` |`,
        );

        expect(report).toContain(
          `\`${probe.probeKind}\``,
        );
      }
    });

    it("keeps selected probes outside profile and baseline ownership", () => {
      const profileWords = new Set(
        canonicalOperatorProfilesV0_1.flatMap(
          (profile) => [
            ...profile.positiveProofWords,
            ...profile.negativeControlWords,
          ],
        ),
      );

      const matrixInputs = new Set(
        canonicalOperatorReuseMatrixV0_1.map(
          (matrixCase) =>
            matrixCase.input
              .normalize("NFKC")
              .trim()
              .toLocaleLowerCase("en-US"),
        ),
      );

      for (const probe of allSelectedProbes) {
        expect(profileWords.has(probe.word)).toBe(
          false,
        );

        expect(matrixInputs.has(probe.word)).toBe(
          false,
        );
      }
    });

    it("preserves exact candidate-only expectations without reviewed evidence", () => {
      expect(
        selectedProbes.embeddedCandidateOnly.length,
      ).toBeGreaterThanOrEqual(4);

      for (
        const probe
        of selectedProbes.embeddedCandidateOnly
      ) {
        expect(
          operatorIdsFor(probe.word),
        ).toEqual(
          [...probe.candidateOperatorIds].sort(),
        );

        expect(
          reviewedOperatorIdsFor(probe.word),
        ).toEqual([]);
      }
    });

    it("preserves every selected Null expectation", () => {
      const nullProbes = [
        ...selectedProbes.embeddedNull,
        ...selectedProbes.operationNull,
        ...selectedProbes.broadNull,
      ];

      expect(
        selectedProbes.operationNull.length,
      ).toBeGreaterThanOrEqual(4);

      expect(
        selectedProbes.broadNull.length,
      ).toBeGreaterThanOrEqual(4);

      for (const probe of nullProbes) {
        expect(
          operatorIdsFor(probe.word),
        ).toEqual([]);

        expect(
          reviewedOperatorIdsFor(probe.word),
        ).toEqual([]);
      }
    });

    it("requires deterministic repeated discovery for every selected probe", () => {
      for (const probe of allSelectedProbes) {
        expect(
          discoverySignature(probe.word),
        ).toBe(
          discoverySignature(probe.word),
        );
      }
    });

    it("preserves the immutable DA/DI baseline while allowing later operators", () => {
      expect(
        canonicalOperatorReuseMatrixV0_1,
      ).toHaveLength(19);

      expect(
        REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1,
      ).toHaveLength(12);

      const daDiProfiles =
        canonicalOperatorProfilesV0_1.filter(
          (profile) =>
            profile.operatorId === "DA" ||
            profile.operatorId === "DI",
        );

      expect(
        daDiProfiles.map(
          (profile) => profile.operatorId,
        ),
      ).toEqual(["DA", "DI"]);

      expect(
        daDiProfiles.every(
          (profile) =>
            profile.canonLifecycleStatus ===
            "canon_locked",
        ),
      ).toBe(true);

      expect(
        canonicalOperatorProfilesV0_1.map(
          (profile) => profile.operatorId,
        ),
      ).toContain("AT");
    });

    it("introduces no runtime, profile, discovery, API, or UI implementation", () => {
      for (const source of [
        profileSource,
        discoverySource,
        matrixSource,
      ]) {
        expect(source).not.toContain(
          "SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_CREATED",
        );

        expect(source).not.toContain(
          "synthetic-da-di-collision-null-design-package-v0.1.md",
        );
      }

      expect(report).toContain(
        "This design package does not modify:",
      );

      expect(report).toContain(
        "reuse baseline: 19 cases and 12 categories",
      );

      expect(report).toContain(
        "JO: frozen",
      );

      expect(report).toContain(
        "PO: frozen",
      );
    });
  },
);
