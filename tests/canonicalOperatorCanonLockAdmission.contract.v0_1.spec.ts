import { readFileSync } from "node:fs";

describe("canonical operator canon-lock admission contract v0.1", () => {
  const contract = readFileSync(
    "docs/open-instrument/canonical-operator-canon-lock-admission-contract-v0.1.md",
    "utf8",
  );

  const review = readFileSync(
    "docs/open-instrument/reports/da-di-canon-lock-readiness-review-v0.1.md",
    "utf8",
  );

  const profileSource = readFileSync(
    "src/shared/canonicalOperatorProfile.v0_1.ts",
    "utf8",
  );

  it("distinguishes runtime_verified from canon_locked", () => {
    expect(contract).toContain(
      "`runtime_verified` and `canon_locked` are different governance states.",
    );
    expect(contract).toContain(
      "Satisfying these requirements proves:",
    );
    expect(contract).toContain("- `runtime_verified`.");
    expect(contract).toContain(
      "It does not automatically prove:",
    );
    expect(contract).toContain("- `canon_locked`.");
  });

  it("requires an explicit bounded admitted scope", () => {
    expect(contract).toContain(
      "Every canon-lock decision must state the exact admitted scope.",
    );
    expect(contract).toContain(
      "`bounded_functional_lexical_projection`",
    );
    expect(contract).toContain(
      "No operator may be canon locked without an explicit admitted scope.",
    );
  });

  it("locks the additional canon admission requirements", () => {
    for (const heading of [
      "Stable functional identity",
      "Boundary stability",
      "Source authority appropriate to scope",
      "Runtime stability",
      "Coverage sufficiency",
      "Reusable-process proof",
      "Revision policy",
      "Supersession policy",
      "Revocation and deprecation policy",
      "Transition authority",
    ]) {
      expect(contract).toContain(heading);
    }
  });

  it("preserves claim boundaries and user decision posture", () => {
    expect(contract).toContain(
      "`historicalOriginClaim = not_claimed`",
    );
    expect(contract).toContain(
      "`winnerClaim = not_claimed`",
    );
    expect(contract).toContain(
      "`languageSuperiorityClaim = not_claimed`",
    );
    expect(contract).toContain(
      "candidate truth not claimed",
    );
    expect(contract).toContain(
      "`userDecisionPosture = user_decides`",
    );
  });

  it("keeps the admission rule fail closed", () => {
    expect(contract).toContain("Fail-closed admission rule");

    for (const requirement of [
      "admitted scope",
      "runtime-verified prerequisites",
      "stable functional identity",
      "boundary stability",
      "source authority appropriate to scope",
      "runtime stability",
      "coverage justification",
      "reusable-process proof",
      "revision policy",
      "supersession policy",
      "revocation/deprecation policy",
      "lifecycle-transition authority",
      "claim-boundary preservation",
    ]) {
      expect(contract).toContain(requirement);
    }
  });

  it("records DA as eligible only for a later transition", () => {
    expect(review).toContain(
      "DA satisfies the substantive evidence, boundary, runtime, coverage, and",
    );
    expect(review).toContain(
      "reusable-process requirements for a later scope-specific canon-lock decision.",
    );
    expect(review).toContain(
      "A separate lifecycle-transition PR is required",
    );
    expect(review).toContain(
      "DA remains:",
    );
    expect(review).toContain("- `runtime_verified`.");
  });

  it("keeps DI runtime_verified with explicit remaining limits", () => {
    expect(review).toContain(
      "DI is not yet recommended for a lifecycle mutation to `canon_locked`.",
    );
    expect(review).toContain(
      "unresolved direct DPEWA/FGJSH authority",
    );
    expect(review).toContain(
      "positive-proof coverage justification or expansion",
    );
    expect(review).toContain(
      "DI remains correctly:",
    );
    expect(review).toContain("- `runtime_verified`.");
  });

  it("records DA, DI, and AT canon locks while historical readiness records remain historical", () => {
    expect(profileSource).toContain(
      'operatorId: "DA"',
    );
    expect(profileSource).toContain(
      'operatorId: "DI"',
    );

    const runtimeVerifiedMatches =
      profileSource.match(
        /canonLifecycleStatus: "runtime_verified"/g,
      ) ?? [];

    const canonLockedMatches =
      profileSource.match(
        /canonLifecycleStatus: "canon_locked"/g,
      ) ?? [];

    expect(runtimeVerifiedMatches).toHaveLength(0);
    expect(canonLockedMatches).toHaveLength(3);

    expect(profileSource).toMatch(
      /operatorId: "AT"[\s\S]*?canonLifecycleStatus: "canon_locked"/,
    );
  });

  it("keeps the lane docs-and-contract only", () => {
    expect(review).toContain(
      "No lifecycle mutation is authorized by this review.",
    );

    for (const boundary of [
      "canonical profiles",
      "lifecycle values",
      "source rows",
      "citations",
      "readiness",
      "authorization",
      "production membership",
      "runtime projection",
      "RootMap",
      "API",
      "UI",
      "analysis behavior",
      "proof words",
      "negative controls",
      "live-smoke behavior",
    ]) {
      expect(review).toContain(boundary);
    }
  });
});
