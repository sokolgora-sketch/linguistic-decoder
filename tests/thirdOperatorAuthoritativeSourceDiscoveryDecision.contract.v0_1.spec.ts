import { readFileSync } from "node:fs";

describe(
  "third-operator authoritative-source discovery decision v0.1",
  () => {
    const report = readFileSync(
      "docs/open-instrument/reports/third-operator-authoritative-source-discovery-decision-v0.1.md",
      "utf8",
    );

    const registrySource = readFileSync(
      "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
      "utf8",
    );

    const authorizationSource = readFileSync(
      "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts",
      "utf8",
    );

    const operationPolicySource = readFileSync(
      "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
      "utf8",
    );

    const profileSource = readFileSync(
      "src/shared/canonicalOperatorProfile.v0_1.ts",
      "utf8",
    );

    const admissionSource = readFileSync(
      "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts",
      "utf8",
    );

    function parseNamedStringSet(
      source: string,
      owner: string,
    ): string[] {
      const pattern = new RegExp(
        `${owner}[\\s\\S]*?new Set<string>\\(\\[([\\s\\S]*?)\\]\\)`,
      );

      const match = source.match(pattern);

      expect(match).not.toBeNull();

      return [
        ...(match?.[1].matchAll(/"([^"]+)"/g) ?? []),
      ]
        .map((item) => item[1])
        .sort();
    }

    it("records the null third-operator decision", () => {
      expect(report).toContain(
        "Status: DECISION_ONLY.",
      );
      expect(report).toContain(
        "`NO_CURRENT_REVIEWED_THIRD_OPERATOR`",
      );
      expect(report).toContain(
        "`AUTHORITATIVE_THIRD_OPERATOR_SOURCE_DISCOVERY`",
      );
      expect(report).toContain(
        "No third operator is selected by this decision.",
      );
      expect(report).toContain(
        "This is a valid null result.",
      );
    });

    it("keeps DA and DI as the only canonical profiles", () => {
      const operatorIds = [
        ...profileSource.matchAll(
          /operatorId:\s*"([^"]+)"/g,
        ),
      ].map((match) => match[1]);

      expect(operatorIds).toEqual(["DA", "DI"]);

      const canonLockedMatches =
        profileSource.match(
          /canonLifecycleStatus:\s*"canon_locked"/g,
        ) ?? [];

      expect(canonLockedMatches).toHaveLength(2);
      expect(profileSource).not.toContain(
        'canonLifecycleStatus: "runtime_verified"',
      );
    });

    it("keeps exactly two reviewed production source rows", () => {
      const sourceIds = [
        ...registrySource.matchAll(
          /sourceId:\s*"(reviewed\.external\.[^"]+\.candidate\.v0_1)"/g,
        ),
      ]
        .map((match) => match[1])
        .sort();

      expect(sourceIds).toEqual([
        "reviewed.external.di.knowledge.candidate.v0_1",
        "reviewed.external.gheg-da.damage.candidate.v0_1",
      ]);

      expect(new Set(sourceIds).size).toBe(2);
    });

    it("keeps machine authorization limited to DA and DI source rows", () => {
      expect(
        parseNamedStringSet(
          authorizationSource,
          "FUNCTIONAL_RUNTIME_AUTHORIZED_SOURCE_IDS_V0_1",
        ),
      ).toEqual([
        "reviewed.external.di.knowledge.candidate.v0_1",
        "reviewed.external.gheg-da.damage.candidate.v0_1",
      ]);
    });

    it("keeps operation and carrier policies limited to DA and DI", () => {
      const policySourceIds = [
        ...operationPolicySource.matchAll(
          /sourceId:\s*"(reviewed\.external\.[^"]+\.candidate\.v0_1)"/g,
        ),
      ]
        .map((match) => match[1])
        .sort();

      expect(policySourceIds).toEqual([
        "reviewed.external.di.knowledge.candidate.v0_1",
        "reviewed.external.gheg-da.damage.candidate.v0_1",
      ]);

      expect(operationPolicySource).toContain(
        'allowedEvidenceCarrierForms: ["di"]',
      );
      expect(operationPolicySource).toContain(
        'allowedEvidenceCarrierForms: ["da"]',
      );
    });

    it("keeps canon-lock admission limited to DA and DI", () => {
      expect(
        parseNamedStringSet(
          admissionSource,
          "CANON_LOCK_ADMITTED_OPERATOR_IDS_V0_1",
        ),
      ).toEqual(["DA", "DI"]);
    });

    it("preserves all source-row claim boundaries", () => {
      for (const field of [
        "originClaim",
        "historicalTransmissionClaim",
        "winnerClaim",
        "languageSuperiorityClaim",
        "candidateTruthClaim",
        "publicationEvidenceClaim",
        "scientificEvidenceClaim",
      ]) {
        const matches =
          registrySource.match(
            new RegExp(`${field}: false`, "g"),
          ) ?? [];

        expect(matches).toHaveLength(2);
      }

      const userDecidesMatches =
        registrySource.match(
          /userDecisionPosture: "user_decides"/g,
        ) ?? [];

      expect(userDecidesMatches).toHaveLength(2);
    });

    it("rejects repository occurrence counts as selection evidence", () => {
      for (const marker of [
        "TER",
        "AT",
        "ND",
        "PO",
        "JO",
        "LIG",
        "LIGJ",
        "MSHEF",
        "MAGE",
        "SHTU",
      ]) {
        expect(report).toMatch(new RegExp(`- ${marker}[.;]`));
      }

      expect(report).toContain(
        "Repository occurrences do not establish reviewed evidence.",
      );
      expect(report).toContain(
        "A proto-root, token, doctrine statement, fixture, test, or internal gloss is not",
      );
    });

    it("locks the required authoritative-source and architecture boundaries", () => {
      for (const marker of [
        "isolated standalone form",
        "bounded standalone gloss",
        "exact URL, archive reference, DOI, page, example, or entry locator",
        "attested form",
        "attested gloss",
        "semantic bridge",
        "cross-operator negative controls",
        "carrier-isolation controls",
        "complete citation-leak controls",
        "partial citation-leak controls",
        "a bespoke RootMap branch",
        "a bespoke API branch",
        "a bespoke UI branch",
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("keeps the lane decision-only and non-runtime", () => {
      expect(report).toContain(
        "It does not modify:",
      );
      expect(report).toContain(
        "No candidate is selected, promoted, or implemented.",
      );

      expect(report).not.toContain(
        "READY_FOR_PRODUCTION",
      );
      expect(report).not.toContain(
        "SELECTED_THIRD_OPERATOR",
      );
    });
  },
);
