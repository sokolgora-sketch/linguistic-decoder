import { readFileSync } from "node:fs";

describe("reviewed evidence carrier-scope policy v0.1", () => {
  const contract = readFileSync(
    "docs/open-instrument/reviewed-evidence-carrier-scope-policy-v0.1.md",
    "utf8",
  );

  const review = readFileSync(
    "docs/open-instrument/reports/di-reviewed-evidence-carrier-scope-review-v0.1.md",
    "utf8",
  );

  const policySource = readFileSync(
    "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
    "utf8",
  );

  const profileSource = readFileSync(
    "src/shared/canonicalOperatorProfile.v0_1.ts",
    "utf8",
  );

  const builderSource = readFileSync(
    "src/shared/deepRoot.rootMap.builder.v1.ts",
    "utf8",
  );

  it("requires operation and carrier-form authorization", () => {
    expect(contract).toContain(
      "the matcher operation is explicitly admitted",
    );
    expect(contract).toContain(
      "the selected carrier form is explicitly covered",
    );
    expect(policySource).toContain(
      "allowedEvidenceCarrierForms",
    );
    expect(policySource).toContain(
      '"carrier_form_missing"',
    );
    expect(policySource).toContain(
      '"carrier_form_not_allowed"',
    );
  });

  it("limits current reviewed DI evidence to carrier di", () => {
    expect(policySource).toContain(
      'allowedEvidenceCarrierForms: ["di"]',
    );
    expect(contract).toContain("- `dij`;");
    expect(contract).toContain("- `dije`;");
    expect(contract).toContain("- `dit`.");
    expect(review).toContain(
      "`dit` received the reviewed `di` citation",
    );
  });

  it("expands bounded DI proof coverage without changing lifecycle", () => {
    expect(profileSource).toContain(
      'positiveProofWords: ["di", "study", "studim"]',
    );
    expect(profileSource).toMatch(
      /operatorId: "DI",[\s\S]*?negativeControlWords:\s*\[\s*"da",\s*"dam",\s*"damage",\s*"mode",\s*"xyz",\s*"dij",\s*"dije",\s*"dit",\s*\]/,
    );
    expect(contract).toContain(
      "DI remains:",
    );
    expect(contract).toContain(
      "- `runtime_verified`.",
    );
    expect(contract).toContain(
      "DA remains:",
    );
    expect(contract).toContain(
      "- `canon_locked`.",
    );
  });

  it("keeps RootMap generic", () => {
    expect(builderSource).toContain(
      "evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1",
    );
    expect(builderSource).not.toContain(
      'protoRootId === "DI"',
    );
    expect(builderSource).not.toContain(
      'carrierForm === "dit"',
    );
  });

  it("preserves claim boundaries and user decision posture", () => {
    for (const phrase of [
      "historical origin",
      "historical transmission",
      "linguistic ownership",
      "candidate truth",
      "winner status",
      "language superiority",
      "`user_decides`",
    ]) {
      expect(contract).toContain(phrase);
    }
  });
});
