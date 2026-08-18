import { readFileSync } from "node:fs";

describe(
  "third-operator authoritative-source discovery historical decision v0.1",
  () => {
    const historical =
      readFileSync(
        "docs/open-instrument/reports/third-operator-authoritative-source-discovery-decision-v0.1.md",
        "utf8",
      );

    const successor =
      readFileSync(
        "docs/open-instrument/reports/third-operator-at-authoritative-source-admission-v0.1.md",
        "utf8",
      );

    it("preserves the original null decision as historical evidence", () => {
      expect(historical).toContain(
        "Status: DECISION_ONLY.",
      );

      expect(historical).toContain(
        "`NO_CURRENT_REVIEWED_THIRD_OPERATOR`",
      );

      expect(historical).toContain(
        "This is a valid null result.",
      );

      expect(historical).toContain(
        "Historical status note — 2026-08-16",
      );
    });

    it("records that authoritative AT evidence supersedes the old live-state null", () => {
      expect(historical).toContain(
        "third-operator-at-authoritative-source-admission-v0.1.md",
      );

      expect(successor).toContain(
        "Status: RUNTIME_VERIFIED_NOT_CANON_LOCKED.",
      );

      expect(successor).toContain(
        "The Albanian inherited lexicon",
      );

      expect(successor).toContain(
        "at [m] (tg) {2} 'father'",
      );

      expect(successor).toContain(
        "AT does **not** enter `canon_locked`",
      );
    });

    it("keeps the original reusable-owner requirement intact", () => {
      expect(historical).toContain(
        "reviewed source-row registry",
      );

      expect(historical).toContain(
        "machine authorization",
      );

      expect(historical).toContain(
        "canonical profile",
      );

      expect(historical).toContain(
        "canon-lock admission",
      );

      expect(successor).toContain(
        "No bespoke:",
      );

      expect(successor).toContain(
        "Father API branch",
      );
    });
  },
);
