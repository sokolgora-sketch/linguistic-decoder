import { readFileSync } from "node:fs";

import {
  getResolvedCanonicalOperatorProfilesV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";

import {
  evaluateCanonicalOperatorCanonLockAdmissionV0_1,
} from "@/shared/canonicalOperatorCanonLockAdmission.v0_1";

describe("DI canon-lock readiness reassessment v0.1", () => {
  const report = readFileSync(
    "docs/open-instrument/reports/di-canon-lock-readiness-reassessment-v0.1.md",
    "utf8",
  );

  const transition = readFileSync(
    "docs/open-instrument/di-canon-lock-lifecycle-transition-v0.1.md",
    "utf8",
  );

  const resolvedDi =
    getResolvedCanonicalOperatorProfilesV0_1().find(
      (resolved) => resolved.profile.operatorId === "DI",
    );

  it("records readiness for a later dedicated bounded transition", () => {
    expect(report).toContain(
      "Decision: READY_FOR_DEDICATED_TRANSITION.",
    );

    expect(report).toContain(
      "`bounded_functional_lexical_projection`",
    );

    expect(report).toContain(
      "A separate dedicated lifecycle-transition PR remains required.",
    );
  });

  it("preserves the historical pre-transition record after admission", () => {
    expect(report).toContain(
      "The current admission result remains fail closed with:",
    );
    expect(report).toContain(
      "- `operator_not_explicitly_admitted`.",
    );
    expect(transition).toContain(
      "The readiness reassessment remains a historical pre-transition record.",
    );

    expect(resolvedDi).toBeDefined();

    expect(
      resolvedDi?.profile.canonLifecycleStatus,
    ).toBe("canon_locked");

    const admission =
      evaluateCanonicalOperatorCanonLockAdmissionV0_1(
        resolvedDi!,
      );

    expect(admission).toMatchObject({
      admitted: true,
      admittedScope:
        "bounded_functional_lexical_projection",
      rollbackLifecycleStatus: "runtime_verified",
      reasons: [],
    });
  });

  it("records sufficient direct, exact and y_to_i proof coverage", () => {
    expect(
      resolvedDi?.profile.positiveProofWords,
    ).toEqual(["di", "study", "studim"]);

    for (const marker of [
      "| `di` | `di` | `exact` | present |",
      "| `studim` | `di` | `exact` | present |",
      "| `study` | `di` | `y_to_i` | present |",
      "direct isolated use",
      "bounded exact use",
      "explicitly admitted transformed use",
    ]) {
      expect(report).toContain(marker);
    }
  });

  it("records carrier, cross-operator and unrelated isolation", () => {
    expect(
      resolvedDi?.profile.negativeControlWords,
    ).toEqual([
      "da",
      "dam",
      "damage",
      "mode",
      "xyz",
      "dij",
      "dije",
      "dit",
    ]);

    for (const marker of [
      "| `dij` | `dij` | `exact` | absent |",
      "| `dije` | `dije` | `exact` | absent |",
      "| `dit` | `dit` | `exact` | absent |",
      "`carrier_only`",
      "semantic-drift warning",
      "`do not over-claim` warning",
      "cross-operator isolation",
      "unrelated-input isolation",
    ]) {
      expect(report).toContain(marker);
    }
  });

  it("limits unresolved stronger authority to stronger claims", () => {
    expect(report).toContain(
      "Unresolved direct DPEWA/FGJSH locator or archive work remains documented.",
    );

    expect(report).toContain(
      "It does not block the narrow bounded functional canon-lock scope.",
    );

    expect(report).toContain(
      "This decision does not upgrade the source into historical-origin evidence.",
    );
  });

  it("requires explicit admission and a separate lifecycle mutation", () => {
    for (const marker of [
      "add DI to the explicit machine-readable canon-lock admission owner",
      "change only DI lifecycle",
      "`runtime_verified`",
      "`canon_locked`",
      "retain rollback lifecycle",
      "operator-specific DI transition contract",
      "production live smoke",
      "full gate",
      "DF_BRAIN synchronization",
    ]) {
      expect(report).toContain(marker);
    }
  });

  it("preserves claim boundaries and user decision posture", () => {
    for (const marker of [
      "historical origin",
      "historical transmission",
      "borrowing direction",
      "linguistic ownership",
      "candidate truth",
      "winner status",
      "language superiority",
      "`user_decides`",
    ]) {
      expect(report).toContain(marker);
    }
  });

  it("keeps this lane reassessment-only", () => {
    expect(report).toContain(
      "Status: READINESS_REASSESSMENT_ONLY.",
    );

    for (const boundary of [
      "canonical lifecycle values",
      "canon-lock admission membership",
      "reviewed source rows",
      "citation metadata",
      "functional readiness",
      "runtime authorization",
      "production membership",
      "runtime projection",
      "operation authorization",
      "carrier authorization",
      "RootMap",
      "API behavior",
      "UI behavior",
      "proof words",
      "negative controls",
      "live-smoke behavior",
    ]) {
      expect(report).toContain(boundary);
    }

    expect(report).toContain(
      "DI remains:",
    );

    expect(report).toContain(
      "- `runtime_verified`.",
    );
  });
});
