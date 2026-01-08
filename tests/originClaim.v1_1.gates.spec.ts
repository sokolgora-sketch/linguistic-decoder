import {
  gateOriginClaimCandidateV1_1,
  compareOriginClaimCandidatesV1_1,
} from "../src/shared/originClaim.gates.v1_1";

describe("originClaim v1.1 — gates", () => {
  const cfg = { minPositives: 1, maxNegatives: 0 };

  test("excludes missing decomposition", () => {
    const v = gateOriginClaimCandidateV1_1(
      {
        language: "en",
        form: "study",
        decomposition: [],
        vowelPath: ["U", "Y"],
        support: { positives: 2, negatives: 0 },
      },
      cfg,
    );

    expect(v.include).toBe(false);
    expect(v.reasons.map((r) => r.code)).toContain("exclude_missing_decomposition");
  });

  test("excludes missing vowel path", () => {
    const v = gateOriginClaimCandidateV1_1(
      {
        language: "en",
        form: "study",
        decomposition: ["stu", "dy"],
        vowelPath: [],
        support: { positives: 2, negatives: 0 },
      },
      cfg,
    );

    expect(v.include).toBe(false);
    expect(v.reasons.map((r) => r.code)).toContain("exclude_missing_vowel_path");
  });

  test("excludes low support", () => {
    const v = gateOriginClaimCandidateV1_1(
      {
        language: "en",
        form: "study",
        decomposition: ["stu", "dy"],
        vowelPath: ["U", "Y"],
        support: { positives: 0, negatives: 0 },
      },
      cfg,
    );

    expect(v.include).toBe(false);
    expect(v.reasons.map((r) => r.code)).toContain("exclude_low_support");
  });

  test("includes when passes", () => {
    const v = gateOriginClaimCandidateV1_1(
      {
        language: "en",
        form: "study",
        decomposition: ["stu", "dy"],
        vowelPath: ["U", "Y"],
        support: { positives: 1, negatives: 0 },
      },
      cfg,
    );

    expect(v.include).toBe(true);
    expect(v.reasons.map((r) => r.code)).toContain("include_passes_min_support");
  });

  test("stable ordering: language then form", () => {
    const a = { language: "la", form: "beta" };
    const b = { language: "en", form: "alpha" };
    const c = { language: "en", form: "zeta" };

    expect([a, b, c].sort(compareOriginClaimCandidatesV1_1).map((x) => `${x.language}:${x.form}`))
      .toEqual(["en:alpha", "en:zeta", "la:beta"]);
  });
});
