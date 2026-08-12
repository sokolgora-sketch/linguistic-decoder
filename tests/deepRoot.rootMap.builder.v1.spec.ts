import {
  buildFunctionalCandidateCompositionsFromRootMapV0_1,
  buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1,
  buildRootMapV1 as buildRootMapV1Runtime,
} from "@/shared/deepRoot.rootMap.builder.v1";
import type { MinRootHypothesis } from "@/shared/deepRoot.minRoots.v1";

// Minimal proto roots used by builder are read via getProtoRootV1.
// These tests focus on hypothesis selection behavior, not protoRoots content.
// If a protoRootId is unknown, tokens still emit, but gloss may be "unknown".
//
// Legacy test fixtures in this file predate the required hypothesis.basis
// contract. Scope those fixtures to the basis declared by each test.
// Explicit missing/mismatched-basis regressions call the runtime builder
// directly so the production fail-closed behavior remains exercised.
function buildRootMapV1(
  params: Parameters<typeof buildRootMapV1Runtime>[0],
) {
  const minRoots =
    Array.isArray(params.minRoots)
      ? params.minRoots.map(
          (hypothesis: any) => {
            if (
              !hypothesis ||
              typeof hypothesis !== "object"
            ) {
              return hypothesis;
            }

            if (
              typeof hypothesis.basis === "string" &&
              hypothesis.basis.trim()
            ) {
              return hypothesis;
            }

            return {
              ...hypothesis,
              basis: params.basis,
            };
          },
        )
      : params.minRoots;

  return buildRootMapV1Runtime({
    ...params,
    minRoots,
  });
}

describe("buildRootMapV1 (RootMap selection)", () => {

  it("returns null when the RootMap basis is empty", () => {
    expect(
      buildRootMapV1({
        basis: "",
        minRoots: [],
      }),
    ).toBeNull();
  });

  it("returns an empty RootMap note when minRoots are unavailable", () => {
    expect(
      buildRootMapV1({
        basis: "test",
        minRoots: [],
      }),
    ).toEqual({
      tokens: [],
      keys: [],
      composedMeaning: "",
      notes: [
        "No minRoots hypotheses available; RootMap not emitted.",
      ],
    });
  });

  it("rejects explicit cross-basis hypotheses and keeps missing-basis legacy hypotheses untrusted", () => {
    const mismatchedRootMap =
      buildRootMapV1Runtime({
        basis: "study",
        minRoots: [
          {
            id: "di:DI:0",
            basis: "di",
            segments: ["di"],
            protoRoots: ["DI"],
            carriers: [
              {
                protoRootId: "DI",
                segment: "di",
                carrierForm: "di",
                lang: "sq",
                ops: [],
              },
            ],
            decomposition: {
              function: "DI",
            },
            checks: {
              opsWithinLimits: true,
              skeletonExplained: true,
            },
            opsCount: 0,
          },
        ],
        heartPrimaryPath: ["U", "Y"],
      });

    expect(mismatchedRootMap).toBeTruthy();

    expect(
      mismatchedRootMap?.tokens,
    ).toEqual([]);

    expect(
      mismatchedRootMap?.keys,
    ).toEqual([]);

    expect(
      buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap: mismatchedRootMap,
        },
      ),
    ).toEqual([]);

    expect(
      buildFunctionalCandidateCompositionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap: mismatchedRootMap,
        },
      ),
    ).toEqual([]);

    const unscopedLegacyRootMap =
      buildRootMapV1Runtime({
        basis: "study",
        minRoots: [
          {
            protoRoots: ["DI"],
            carriers: [
              {
                protoRootId: "DI",
                segment: "dy",
                carrierForm: "di",
                lang: "sq",
                ops: ["y_to_i"],
              },
            ],
            decomposition: {
              function: "DI",
            },
            checks: {
              opsWithinLimits: true,
              skeletonExplained: true,
            },
            opsCount: 1,
          } as any,
        ],
        heartPrimaryPath: ["U", "Y"],
      });

    expect(unscopedLegacyRootMap).toBeTruthy();

    expect(
      unscopedLegacyRootMap?.tokens.map(
        (token) => token.token,
      ),
    ).toEqual(["DI"]);

    expect(
      unscopedLegacyRootMap?.keys
        .find(
          (key) => key.token === "DI",
        )
        ?.evidence.join("\n") ?? "",
    ).not.toContain(
      "reviewed functional free-operator evidence",
    );

    expect(
      buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap: unscopedLegacyRootMap,
        },
      ),
    ).toEqual([]);

    expect(
      buildFunctionalCandidateCompositionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap: unscopedLegacyRootMap,
        },
      ),
    ).toEqual([]);
  });

  it("emits deterministic study tokens and carrier fields from one hypothesis", () => {
    const hypothesis: MinRootHypothesis = {
      id: "study:stub:0",
      basis: "study",
      segments: ["stu", "di"],
      protoRoots: ["SHTU", "DI"],
      carriers: [
        {
          protoRootId: "SHTU",
          segment: "stu",
          carrierForm: "stu",
          lang: "en",
          ops: ["s↔sh"],
        },
        {
          protoRootId: "DI",
          segment: "di",
          carrierForm: "di",
          lang: "sq",
          ops: [],
        },
      ],
      decomposition: {
        action: "SHTU",
        function: "DI",
      },
      checks: {
        opsWithinLimits: true,
        skeletonExplained: true,
      },
      opsCount: 1,
    };

    const rootMap = buildRootMapV1({
      basis: "study",
      minRoots: [hypothesis],
    });

    expect(
      rootMap?.tokens.map((token) => token.token),
    ).toEqual(["SHTU", "DI"]);

    expect(rootMap?.keys).toHaveLength(2);

    expect(rootMap?.keys[0]).toMatchObject({
      token: "SHTU",
      language: "en",
      ops: ["s↔sh"],
    });

    expect(
      rootMap?.keys[0].evidence,
    ).toContain("ops: s↔sh");

    expect(rootMap?.keys[1]).toMatchObject({
      token: "DI",
      language: "sq",
    });

    expect(rootMap?.keys[1].ops).toBeUndefined();
  });

  it("prefers Heart-aligned terminal vowel (study: DI not DA)", () => {
    const H_DI = {
      protoRoots: ["SHTU", "DI"],
      carriers: [
        { protoRootId: "SHTU", segment: "stu", carrierForm: "stu", lang: "en", ops: ["s↔sh"] },
        { protoRootId: "DI", segment: "di", carrierForm: "di", lang: "sq", ops: [] },
      ],
      decomposition: { action: "SHTU", function: "DI" },
      checks: { opsWithinLimits: true, skeletonExplained: true },
      opsCount: 1,
    };

    const H_DA = {
      protoRoots: ["SHTU", "DA"],
      carriers: [
        { protoRootId: "SHTU", segment: "stu", carrierForm: "stu", lang: "en", ops: ["s↔sh"] },
        { protoRootId: "DA", segment: "dy", carrierForm: "da", lang: "sq", ops: ["vowel_swap"] },
      ],
      decomposition: { action: "SHTU", function: "DA" },
      checks: { opsWithinLimits: true, skeletonExplained: true },
      opsCount: 2,
    };

    // Heart terminal vowel = I → should pick DI hypothesis even if DA is first
    const rm = buildRootMapV1({
      basis: "study",
      minRoots: [H_DA as any, H_DI as any],
      heartPrimaryPath: ["U", "I"],
    });

    expect(rm?.tokens.map((t) => t.token)).toEqual(["SHTU", "DI"]);
  });

  it("uses reviewed terminal-operation admission when canonical Heart Y has no exact hypothesis", () => {
    const H_DI = {
      protoRoots: ["SHTU", "DI"],
      carriers: [
        {
          protoRootId: "SHTU",
          segment: "stu",
          carrierForm: "shtu",
          lang: "sq",
          ops: ["s_to_sh"],
        },
        {
          protoRootId: "DI",
          segment: "dy",
          carrierForm: "di",
          lang: "sq",
          ops: ["y_to_i"],
        },
      ],
      decomposition: {
        action: "SHTU",
        function: "DI",
      },
      checks: {
        opsWithinLimits: true,
        skeletonExplained: true,
      },
      opsCount: 2,
    };

    const H_DA = {
      protoRoots: ["SHTU", "DA"],
      carriers: [
        {
          protoRootId: "SHTU",
          segment: "stu",
          carrierForm: "shtu",
          lang: "sq",
          ops: ["s_to_sh"],
        },
        {
          protoRootId: "DA",
          segment: "dy",
          carrierForm: "da",
          lang: "sq",
          ops: ["vowel_swap"],
        },
      ],
      decomposition: {
        action: "SHTU",
      },
      checks: {
        opsWithinLimits: true,
        skeletonExplained: true,
      },
      opsCount: 2,
    };

    const rm = buildRootMapV1({
      basis: "study",
      minRoots: [H_DA as any, H_DI as any],
      heartPrimaryPath: ["U", "Y"],
    });

    expect(
      rm?.tokens.map((token) => token.token),
    ).toEqual(["SHTU", "DI"]);

    expect(
      rm?.keys.find((key) => key.token === "DI")?.ops,
    ).toEqual(["y_to_i"]);

    expect(
      rm?.keys
        .find((key) => key.token === "DI")
        ?.evidence.join("\n"),
    ).toContain(
      "reviewed functional free-operator evidence",
    );

    expect(
      rm?.tokens.map((token) => token.token),
    ).not.toContain("DA");
  });

  it("does not authorize reviewed DI evidence when carrier language mismatches the production source", () => {
    const rootMap = buildRootMapV1({
      basis: "study",
      minRoots: [
        {
          protoRoots: ["SHTU", "DI"],
          carriers: [
            {
              protoRootId: "SHTU",
              segment: "stu",
              carrierForm: "shtu",
              lang: "sq",
              ops: ["s_to_sh"],
            },
            {
              protoRootId: "DI",
              segment: "dy",
              carrierForm: "di",
              lang: "en",
              ops: ["y_to_i"],
            },
          ],
          decomposition: {
            action: "SHTU",
            function: "DI",
          },
          checks: {
            opsWithinLimits: true,
            skeletonExplained: true,
          },
          opsCount: 2,
        } as any,
      ],
      heartPrimaryPath: ["U", "Y"],
    });

    expect(rootMap).toBeTruthy();

    const di =
      rootMap?.keys.find(
        (key) => key.token === "DI",
      );

    expect(di?.language).toBe("en");

    expect(di?.status).toBe(
      "candidate_only",
    );

    expect(
      di?.evidence.join("\n"),
    ).not.toContain(
      "reviewed functional free-operator evidence",
    );

    expect(
      buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap,
        },
      ),
    ).toEqual([]);

    expect(
      buildFunctionalCandidateCompositionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap,
        },
      ),
    ).toEqual([]);
  });

  it("deep-freezes a trusted builder RootMap so public semantic state cannot be mutated", () => {
    const rootMap = buildRootMapV1({
      basis: "study",
      minRoots: [
        {
          protoRoots: ["SHTU", "DI"],
          carriers: [
            {
              protoRootId: "SHTU",
              segment: "stu",
              carrierForm: "shtu",
              lang: "sq",
              ops: ["s_to_sh"],
            },
            {
              protoRootId: "DI",
              segment: "dy",
              carrierForm: "di",
              lang: "sq",
              ops: ["y_to_i"],
            },
          ],
          decomposition: {
            action: "SHTU",
            function: "DI",
          },
          checks: {
            opsWithinLimits: true,
            skeletonExplained: true,
          },
          opsCount: 2,
        } as any,
      ],
      heartPrimaryPath: ["U", "Y"],
    });

    expect(rootMap).toBeTruthy();

    if (!rootMap) {
      throw new Error(
        "expected trusted study RootMap",
      );
    }

    const di =
      rootMap.keys.find(
        (key) => key.token === "DI",
      );

    if (!di) {
      throw new Error(
        "expected trusted DI key",
      );
    }

    expect(Object.isFrozen(rootMap)).toBe(true);
    expect(Object.isFrozen(rootMap.tokens)).toBe(true);
    expect(Object.isFrozen(rootMap.keys)).toBe(true);
    expect(Object.isFrozen(di)).toBe(true);
    expect(Object.isFrozen(di.evidence)).toBe(true);

    if (di.ops) {
      expect(Object.isFrozen(di.ops)).toBe(true);
    }

    const originalGloss =
      di.gloss;

    const originalOps =
      di.ops ? [...di.ops] : undefined;

    const originalComposedMeaning =
      rootMap.composedMeaning;

    expect(
      Reflect.set(
        di,
        "gloss",
        "caller-mutated arbitrary meaning",
      ),
    ).toBe(false);

    expect(
      Reflect.set(
        di,
        "ops",
        ["final_swap"],
      ),
    ).toBe(false);

    expect(
      Reflect.set(
        rootMap,
        "composedMeaning",
        "caller-mutated arbitrary composition meaning",
      ),
    ).toBe(false);

    expect(
      Reflect.defineProperty(
        rootMap,
        "toJSON",
        {
          value: () => ({
            composedMeaning:
              "forged serialization",
          }),
        },
      ),
    ).toBe(false);

    expect(di.gloss).toBe(
      originalGloss,
    );

    expect(di.ops).toEqual(
      originalOps,
    );

    expect(
      rootMap.composedMeaning,
    ).toBe(
      originalComposedMeaning,
    );

    expect(
      Object.prototype.hasOwnProperty.call(
        rootMap,
        "toJSON",
      ),
    ).toBe(false);

    expect(
      buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap,
        },
      ),
    ).toHaveLength(1);

    expect(
      buildFunctionalCandidateCompositionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap,
        },
      ),
    ).toHaveLength(1);
  });

  it("binds a trusted builder RootMap to the original target basis", () => {
    const rootMap = buildRootMapV1({
      basis: "study",
      minRoots: [
        {
          protoRoots: ["SHTU", "DI"],
          carriers: [
            {
              protoRootId: "SHTU",
              segment: "stu",
              carrierForm: "shtu",
              lang: "sq",
              ops: ["s_to_sh"],
            },
            {
              protoRootId: "DI",
              segment: "dy",
              carrierForm: "di",
              lang: "sq",
              ops: ["y_to_i"],
            },
          ],
          decomposition: {
            action: "SHTU",
            function: "DI",
          },
          checks: {
            opsWithinLimits: true,
            skeletonExplained: true,
          },
          opsCount: 2,
        } as any,
      ],
      heartPrimaryPath: ["U", "Y"],
    });

    expect(rootMap).toBeTruthy();

    expect(
      buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1(
        {
          targetWord: "di",
          rootMap,
        },
      ),
    ).toEqual([]);

    expect(
      buildFunctionalCandidateCompositionsFromRootMapV0_1(
        {
          targetWord: "di",
          rootMap,
        },
      ),
    ).toEqual([]);

    expect(
      buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap,
        },
      ),
    ).toHaveLength(1);

    expect(
      buildFunctionalCandidateCompositionsFromRootMapV0_1(
        {
          targetWord: "study",
          rootMap,
        },
      ),
    ).toHaveLength(1);
  });

  it("marks exact production-reviewed Gheg DA split as supported reviewed evidence", () => {
    const rm = buildRootMapV1({
      basis: "da",
      minRoots: [
        {
          protoRoots: ["DA"],
          carriers: [
            { protoRootId: "DA", segment: "da", carrierForm: "da", lang: "sq", ops: [] },
          ],
          decomposition: { action: "DA" },
          checks: { opsWithinLimits: true, skeletonExplained: true },
          opsCount: 0,
        } as any,
      ],
      heartPrimaryPath: ["A"],
    });

    const da = rm?.keys.find((key) => key.token === "DA");
    const evidence = da?.evidence.join("\n") ?? "";

    expect(da?.status).toBe("supported");
    expect(evidence).toContain("reviewed Gheg free-operator evidence");
    expect(evidence).toContain("Dedvukaj & Ndoci 2023 PLSA");
    expect(evidence).toContain("10.3765/plsa.v8i1.5501");
    expect(evidence).not.toContain("gave (aorist/part)");
  });

  it("does not extend reviewed DA or DI evidence to an unapproved target composition", () => {
    const rootMap = buildRootMapV1({
      basis: "dadi",
      minRoots: [
        {
          id: "dadi:reviewed-live:0",
          basis: "dadi",
          segments: ["da", "di"],
          protoRoots: ["DA", "DI"],
          carriers: [
            {
              protoRootId: "DA",
              segment: "da",
              carrierForm: "da",
              lang: "sq",
              ops: [],
            },
            {
              protoRootId: "DI",
              segment: "di",
              carrierForm: "di",
              lang: "sq",
              ops: [],
            },
          ],
          decomposition: {
            action: "DA",
            function: "DI",
          },
          checks: {
            opsWithinLimits: true,
            skeletonExplained: true,
          },
          opsCount: 0,
        } as any,
      ],
      heartPrimaryPath: ["A", "I"],
    });

    expect(rootMap).toBeTruthy();

    const da = rootMap?.keys.find(
      (key) => key.token === "DA",
    );

    const di = rootMap?.keys.find(
      (key) => key.token === "DI",
    );

    expect(da?.status).toBe(
      "dialect_attested_pending_review",
    );

    expect(di?.status).toBe(
      "candidate_only",
    );

    expect(
      da?.evidence.join("\n"),
    ).not.toContain(
      "reviewed functional free-operator evidence",
    );

    expect(
      di?.evidence.join("\n"),
    ).not.toContain(
      "reviewed functional free-operator evidence",
    );

    expect(
      da?.evidence.join("\n"),
    ).not.toContain(
      "10.3765/plsa.v8i1.5501",
    );

    const compositions =
      buildFunctionalCandidateCompositionsFromRootMapV0_1(
        {
          targetWord: "dadi",
          rootMap,
        },
      );

    expect(compositions).toEqual([]);
  });

});
