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

const acceptanceReport = fs.readFileSync(
  path.join(
    root,
    "docs/open-instrument/reports/synthetic-da-di-collision-null-design-package-acceptance-review-v0.1.md",
  ),
  "utf8",
);

const designReport = fs.readFileSync(
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

type ProbeGroup =
  | "embeddedCandidateOnly"
  | "embeddedNull"
  | "operationNull"
  | "broadNull";

type ParsedProbe = {
  group: ProbeGroup;
  word: string;
  expectedOperatorIds: string[];
};

function parseExpectedOperators(
  rawValue: string,
): string[] {
  const normalized = rawValue
    .replace(/`/g, "")
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .trim();

  if (!normalized) {
    return [];
  }

  return normalized
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .sort();
}

function parseSelectedProbes(): ParsedProbe[] {
  const headingToGroup =
    new Map<string, ProbeGroup>([
      [
        "## Embedded candidate-only probes",
        "embeddedCandidateOnly",
      ],
      [
        "## Embedded exact-surface Null probes",
        "embeddedNull",
      ],
      [
        "## One-edit operation Null probes",
        "operationNull",
      ],
      [
        "## Broad synthetic Null probes",
        "broadNull",
      ],
    ]);

  const probes: ParsedProbe[] = [];
  let currentGroup: ProbeGroup | null = null;

  for (const rawLine of designReport.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (headingToGroup.has(line)) {
      currentGroup =
        headingToGroup.get(line) ?? null;
      continue;
    }

    if (
      currentGroup === null ||
      !line.startsWith("| `") ||
      line.includes("`none selected`")
    ) {
      continue;
    }

    const columns = line
      .split("|")
      .slice(1, -1)
      .map((column) => column.trim());

    if (columns.length !== 6) {
      continue;
    }

    probes.push({
      group: currentGroup,
      word: columns[0]
        .replace(/^`|`$/g, "")
        .trim(),
      expectedOperatorIds:
        parseExpectedOperators(columns[4]),
    });
  }

  return probes;
}

function operatorIdsFor(
  word: string,
): string[] {
  return Array.from(
    new Set(
      discoverCanonicalOperatorCandidatesV0_1(
        word,
      ).map(
        (candidate) => candidate.operatorId,
      ),
    ),
  ).sort();
}

function reviewedOperatorIdsFor(
  word: string,
): string[] {
  return Array.from(
    new Set(
      discoverCanonicalOperatorCandidatesV0_1(
        word,
      )
        .filter(
          (candidate) =>
            candidate.reviewedEvidenceEligible ===
            true,
        )
        .map(
          (candidate) =>
            candidate.operatorId,
        ),
    ),
  ).sort();
}

function discoverySignature(
  word: string,
): string {
  return JSON.stringify(
    discoverCanonicalOperatorCandidatesV0_1(
      word,
    ),
  );
}

const selectedProbes = parseSelectedProbes();

describe(
  "synthetic DA/DI collision and Null design-package acceptance review v0.1",
  () => {
    it("records a decision-only acceptance posture", () => {
      expect(acceptanceReport).toContain(
        "Status: `ACCEPTANCE_REVIEW_DECISION_ONLY`",
      );

      expect(acceptanceReport).toContain(
        "`SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_ACCEPTED_FOR_IMPLEMENTATION_PROPOSAL`",
      );

      expect(acceptanceReport).toContain(
        "`DESIGN_SYNTHETIC_DA_DI_COLLISION_NULL_IMPLEMENTATION_PROPOSAL_V0_1`",
      );

      expect(acceptanceReport).toContain(
        "`SYNTHETIC_DA_DI_COLLISION_NULL_RUNTIME_OR_BASELINE_IMPLEMENTATION`",
      );
    });

    it("preserves the exact merged package identity", () => {
      expect(acceptanceReport).toContain(
        "`322592099d609512f5b62a5352fc80f228cfec7c`",
      );

      expect(acceptanceReport).toContain(
        "`docs/open-instrument/reports/synthetic-da-di-collision-null-design-package-v0.1.md`",
      );

      expect(acceptanceReport).toContain(
        "`tests/syntheticDaDiCollisionNullDesignPackage.contract.v0_1.spec.ts`",
      );
    });

    it("accepts the exact inspected metrics", () => {
      for (const marker of [
        "parsed probes: `24`",
        "unique probes: `24`",
        "embedded candidate-only probes: `8`",
        "embedded exact-surface Null probes: `0`",
        "one-edit operation Null probes: `8`",
        "broad synthetic Null probes: `8`",
        "accepted candidate-only probes: `8`",
        "accepted Null probes: `16`",
        "reviewed-evidence leaks: `0`",
        "canonical-profile ownership collisions: `0`",
        "reuse-matrix ownership collisions: `0`",
        "determinism failures: `0`",
        "expectation mismatches: `0`",
        "acceptance failures: `0`",
      ]) {
        expect(acceptanceReport).toContain(
          marker,
        );
      }
    });

    it("parses exactly 24 unique selected probes", () => {
      expect(selectedProbes).toHaveLength(24);

      expect(
        new Set(
          selectedProbes.map(
            (probe) => probe.word,
          ),
        ).size,
      ).toBe(24);

      expect(
        selectedProbes.filter(
          (probe) =>
            probe.group ===
            "embeddedCandidateOnly",
        ),
      ).toHaveLength(8);

      expect(
        selectedProbes.filter(
          (probe) =>
            probe.group ===
            "embeddedNull",
        ),
      ).toHaveLength(0);

      expect(
        selectedProbes.filter(
          (probe) =>
            probe.group ===
            "operationNull",
        ),
      ).toHaveLength(8);

      expect(
        selectedProbes.filter(
          (probe) =>
            probe.group ===
            "broadNull",
        ),
      ).toHaveLength(8);
    });

    it("accepts all candidate-only expectations without reviewed evidence", () => {
      const candidateOnly =
        selectedProbes.filter(
          (probe) =>
            probe.group ===
            "embeddedCandidateOnly",
        );

      for (const probe of candidateOnly) {
        expect(
          operatorIdsFor(probe.word),
        ).toEqual(
          probe.expectedOperatorIds,
        );

        expect(
          reviewedOperatorIdsFor(
            probe.word,
          ),
        ).toEqual([]);
      }
    });

    it("accepts all selected Null expectations", () => {
      const nullProbes =
        selectedProbes.filter(
          (probe) =>
            probe.group !==
            "embeddedCandidateOnly",
        );

      expect(nullProbes).toHaveLength(16);

      for (const probe of nullProbes) {
        expect(
          operatorIdsFor(probe.word),
        ).toEqual([]);

        expect(
          reviewedOperatorIdsFor(
            probe.word,
          ),
        ).toEqual([]);
      }
    });

    it("keeps every selected probe outside profile and matrix ownership", () => {
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

      for (const probe of selectedProbes) {
        expect(
          profileWords.has(probe.word),
        ).toBe(false);

        expect(
          matrixInputs.has(probe.word),
        ).toBe(false);
      }
    });

    it("requires deterministic repeated discovery", () => {
      for (const probe of selectedProbes) {
        expect(
          discoverySignature(probe.word),
        ).toBe(
          discoverySignature(probe.word),
        );
      }
    });

    it("preserves the immutable DA/DI machine baseline while allowing later operators", () => {
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

      expect(
        canonicalOperatorReuseMatrixV0_1,
      ).toHaveLength(19);

      expect(
        REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1,
      ).toHaveLength(12);
    });

    it("keeps Y canonical and forbids consonantal-Y reinterpretation", () => {
      expect(acceptanceReport).toContain(
        "`Y_IS_A_CANONICAL_VOWEL`",
      );

      expect(acceptanceReport).toContain(
        "`NO_CONSONANTAL_Y_MODE`",
      );

      expect(acceptanceReport).toContain(
        "- `Y`",
      );

      expect(acceptanceReport).toContain(
        "- `Ë`",
      );
    });

    it("requires a separate design-only implementation proposal", () => {
      for (const marker of [
        "a separate synthetic-probe corpus owner",
        "immutable probe identity and generation metadata",
        "fail-closed evaluation",
        "machine-readable metrics",
        "separation from the live 19-case reuse matrix",
        "separation from canonical profile proof and control words",
        "exact focused tests",
        "exact full-gate requirements",
        "rollback behavior",
      ]) {
        expect(acceptanceReport).toContain(
          marker,
        );
      }

      expect(acceptanceReport).toContain(
        "The proposal must not perform those changes.",
      );
    });

    it("introduces no implementation into protected owners", () => {
      for (const source of [
        profileSource,
        discoverySource,
        matrixSource,
      ]) {
        expect(source).not.toContain(
          "SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_ACCEPTED_FOR_IMPLEMENTATION_PROPOSAL",
        );

        expect(source).not.toContain(
          "synthetic-da-di-collision-null-design-package-acceptance-review-v0.1.md",
        );
      }

      expect(acceptanceReport).toContain(
        "This acceptance-review lane does not modify:",
      );
    });

    it("preserves all claim boundaries and user decision", () => {
      for (const marker of [
        "`NO_LEXICAL_CLAIM`",
        "`NO_SEMANTIC_CLAIM`",
        "`NO_FUNCTIONAL_EMBRYO_CLAIM`",
        "`NO_HISTORICAL_ORIGIN_CLAIM`",
        "`NO_HISTORICAL_TRANSMISSION_CLAIM`",
        "`NO_BORROWING_DIRECTION_CLAIM`",
        "`NO_WINNER_CLAIM`",
        "`NO_LANGUAGE_SUPERIORITY_CLAIM`",
        "`NO_LINGUISTIC_OWNERSHIP_CLAIM`",
        "`NO_CANDIDATE_TRUTH_CLAIM`",
        "`USER_DECIDES`",
      ]) {
        expect(acceptanceReport).toContain(
          marker,
        );
      }

      expect(acceptanceReport).toContain(
        "Null remains valid.",
      );

      expect(acceptanceReport).toContain(
        "The user remains the decision-maker.",
      );
    });
  },
);
