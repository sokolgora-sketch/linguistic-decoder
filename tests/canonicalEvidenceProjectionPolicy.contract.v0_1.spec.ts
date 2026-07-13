import { readFileSync } from "node:fs";

const policy = readFileSync(
  "docs/open-instrument/canonical-evidence-projection-policy-v0.1.md",
  "utf8",
);

const review = readFileSync(
  "docs/open-instrument/reports/canonical-evidence-operation-boundary-review-v0.1.md",
  "utf8",
);

const profileSource = readFileSync(
  "src/shared/canonicalOperatorProfile.v0_1.ts",
  "utf8",
);

describe("canonical evidence projection policy contract v0.1", () => {
  it("separates token discovery from reviewed evidence projection", () => {
    expect(policy).toContain(
      "Token discovery is not reviewed-evidence authorization.",
    );
    expect(policy).toContain(
      "A RootMap token may remain visible even when reviewed evidence projection is",
    );
    expect(policy).toContain(
      "token present does not automatically mean reviewed evidence projected",
    );
  });

  it("requires source-driven machine-readable operation ownership", () => {
    expect(policy).toContain(
      "The evidence-operation policy must be owned by reviewed source truth",
    );
    expect(policy).toContain("`allowedEvidenceOps`");
    expect(policy).toContain(
      "The RootMap builder must not contain DA-specific, DI-specific, or future",
    );
    expect(policy).toContain(
      "An unknown operation must not inherit reviewed evidence by default.",
    );
  });

  it("locks the DA transformed-operation boundary", () => {
    for (const operation of ["`final_swap`", "`vowel_swap`"]) {
      expect(policy).toContain(operation);
    }

    for (const word of ["`mode`", "`made`", "`dome`"]) {
      expect(policy).toContain(word);
      expect(review).toContain(word);
    }

    expect(review).toContain(
      "DA token may be present;",
    );
    expect(review).toContain(
      "reviewed DA evidence must be absent",
    );
  });

  it("requires explicit damage and DI operation classification", () => {
    expect(policy).toContain(
      "The implementation lane must determine the exact carrier-operation",
    );
    expect(policy).toContain("`damage`");
    expect(policy).toContain(
      "If `y_to_i` remains evidence-bearing for DI",
    );
    expect(review).toContain(
      "the DI `study` path classification",
    );
  });

  it("documents intentional supersession of the stale mode contract", () => {
    expect(policy).toContain(
      "tests/apiAnalyzeV1.reviewedDaRuntimeProjection.wiring.v0_1.spec.ts",
    );
    expect(policy).toContain(
      "uses:",
    );
    expect(policy).toContain(
      "The later implementation PR must intentionally supersede that assertion.",
    );
    expect(review).toContain(
      "It is a historical runtime contract that must be deliberately superseded.",
    );
  });

  it("keeps RootMap, evidence, and lifecycle as separate dimensions", () => {
    for (const heading of [
      "### RootMap token status",
      "### Reviewed evidence status",
      "### Canon lifecycle status",
    ]) {
      expect(policy).toContain(heading);
    }

    expect(policy).toContain(
      "A canon-locked operator may still have reviewed evidence withheld",
    );
  });

  it("preserves claim boundaries", () => {
    for (const boundary of [
      "historical origin not claimed",
      "historical transmission not claimed",
      "linguistic ownership not claimed",
      "winner status not claimed",
      "language superiority not claimed",
      "candidate truth not claimed",
      "`user_decides`",
    ]) {
      expect(policy).toContain(boundary);
    }
  });

  it("keeps this lane policy-only", () => {
    expect(policy).toContain(
      "This document does not implement the runtime policy.",
    );
    expect(review).toContain(
      "No runtime mutation is authorized by this review.",
    );

    for (const boundary of [
      "reviewed source rows",
      "RootMap construction",
      "carrier matching",
      "runtime projection",
      "canonical profiles",
      "lifecycle values",
      "API output",
      "UI behavior",
      "live-smoke execution",
    ]) {
      expect(policy).toContain(boundary);
    }
  });

  it("preserves DA and DI lifecycle values", () => {
    const canonLockedMatches =
      profileSource.match(
        /canonLifecycleStatus: "canon_locked"/g,
      ) ?? [];

    const runtimeVerifiedMatches =
      profileSource.match(
        /canonLifecycleStatus: "runtime_verified"/g,
      ) ?? [];

    expect(canonLockedMatches).toHaveLength(1);
    expect(runtimeVerifiedMatches).toHaveLength(1);

    expect(profileSource).toMatch(
      /operatorId: "DA"[\s\S]*?canonLifecycleStatus: "canon_locked"/,
    );

    expect(profileSource).toMatch(
      /operatorId: "DI"[\s\S]*?canonLifecycleStatus: "runtime_verified"/,
    );
  });
});
