import { GET } from "../app/api/analyze-v1/route";
import { projectEmbryoFirstCandidateForAnalyzeV1 } from "../src/shared/analysisAdapter";
import {
  selectEvidencePackageFunctionalPathV0_1,
} from "../src/shared/evidencePackageFunctionalPath.v0_1";

const REQUIRED_FIELDS = [
  "candidateId",
  "displayForm",
  "candidateLanguage",
  "claimType",
  "originClaim",
  "historicalRelation",
  "embryo",
  "embryoSize",
  "embryoLanguage",
  "isolatedStandaloneForm",
  "plainStandaloneGloss",
  "sourceNote",
  "segmentation",
  "semanticBridge",
  "expansionChain",
  "validationOutcome",
  "validationReasons",
  "rankGroup",
  "rankScore",
  "rankReason",
  "claimBoundary",
  "userDecisionPosture",
] as const;

const CLAIM_TYPES = [
  "functionalMotivation",
  "structuralHypothesis",
  "historicalTransmission",
  "surfaceResonance",
  "seedPairing",
  "unresolved",
  "notEvaluated",
];

const HISTORICAL_RELATIONS = [
  "not_evaluated",
  "context_only",
  "possible_loan_relation",
  "attested_loan_relation",
  "possible_cognate_relation",
  "unknown",
  "not_applicable",
];

const VALIDATION_OUTCOMES = [
  "validated",
  "partial",
  "failed",
  "not_evaluated",
  "blocked",
];

const RANK_GROUPS = [
  "validatedFunctionalMotivation",
  "partialFunctionalMotivation",
  "structuralHypothesis",
  "surfaceOrSeedOnly",
  "historicalContextOnly",
  "unresolved",
];

async function analyzeV1(
  word: string,
  ipa?: string,
): Promise<unknown> {
  const params =
    new URLSearchParams({
      word,
    });

  if (ipa) {
    params.set(
      "ipa",
      ipa,
    );
  }

  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?${params.toString()}`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function record(value: unknown): Record<string, unknown> {
  expect(value).toBeTruthy();
  expect(typeof value).toBe("object");
  expect(Array.isArray(value)).toBe(false);
  return value as Record<string, unknown>;
}

function functionalCompositionComponents(
  candidate: Record<string, unknown>,
): Record<string, unknown>[] | null {
  const segmentation =
    candidate.segmentation;

  if (
    !segmentation ||
    typeof segmentation !== "object" ||
    Array.isArray(segmentation)
  ) {
    return null;
  }

  const record =
    segmentation as Record<
      string,
      unknown
    >;

  if (
    record.kind !==
    "functionalComposition"
  ) {
    return null;
  }

  if (
    !Array.isArray(
      record.components,
    ) ||
    record.components.length < 2
  ) {
    return null;
  }

  return record.components as Record<
    string,
    unknown
  >[];
}

function candidatesFrom(payload: unknown): Record<string, unknown>[] {
  const body = record(payload);
  const candidates =
    body.candidates ??
    record(body.analysis ?? {}).candidates ??
    record(body.result ?? {}).candidates ??
    record(body.data ?? {}).candidates;

  expect(Array.isArray(candidates)).toBe(true);
  return candidates as Record<string, unknown>[];
}

describe("analyze-v1 embryo-first candidate contract v0.1", () => {
  it.each(["study", "damage"])(
    "exposes additive embryo-first fields for %s live candidates",
    async (word) => {
      const candidates = candidatesFrom(await analyzeV1(word));

      expect(candidates.length).toBeGreaterThan(0);

      for (const candidate of candidates) {
        for (const field of REQUIRED_FIELDS) {
          expect(candidate).toHaveProperty(field);
        }

        expect(typeof candidate.candidateId).toBe("string");
        expect(typeof candidate.displayForm).toBe("string");
        expect(typeof candidate.candidateLanguage).toBe("string");

        expect(CLAIM_TYPES).toContain(candidate.claimType);
        expect(candidate.originClaim).toBe("not_claimed");
        expect(HISTORICAL_RELATIONS).toContain(candidate.historicalRelation);
        expect(VALIDATION_OUTCOMES).toContain(candidate.validationOutcome);
        expect(RANK_GROUPS).toContain(candidate.rankGroup);
        expect(candidate.userDecisionPosture).toBe("user_decides");

        expect(Array.isArray(candidate.validationReasons)).toBe(true);
        expect(typeof candidate.rankReason).toBe("string");
        expect(typeof candidate.claimBoundary).toBe("string");

        if (
          candidate.validationOutcome === "validated" ||
          candidate.claimType === "functionalMotivation" ||
          candidate.rankGroup === "validatedFunctionalMotivation"
        ) {
          const compositionComponents =
            functionalCompositionComponents(
              candidate,
            );

          if (compositionComponents) {
            expect(
              candidate.claimType,
            ).toBe(
              "functionalMotivation",
            );

            expect([
              "validated",
              "partial",
            ]).toContain(
              candidate.validationOutcome,
            );

            expect([
              "validatedFunctionalMotivation",
              "partialFunctionalMotivation",
            ]).toContain(
              candidate.rankGroup,
            );

            for (
              const component of
              compositionComponents
            ) {
              expect(
                typeof component.embryo,
              ).toBe("string");

              expect(
                typeof component.language,
              ).toBe("string");

              expect(
                typeof component.plainMeaning,
              ).toBe("string");

              expect([
                "reviewed",
                "structural",
              ]).toContain(
                component.evidenceState,
              );
            }
          } else {
            expect(
              candidate.isolatedStandaloneForm,
            ).toBeTruthy();

            expect(
              candidate.plainStandaloneGloss,
            ).toBeTruthy();

            expect(
              candidate.sourceNote,
            ).toBeTruthy();
          }
        }
      }
    },
  );

  it("keeps emitted functional evidence ahead of detected fallback when DeepRoot is absent", () => {
    expect(
      selectEvidencePackageFunctionalPathV0_1({
        deepRootPath: null,
        emittedFunctionalPath: [
          "U",
          "I",
        ],
        detectedPath: [
          "U",
          "Y",
        ],
      }),
    ).toEqual([
      "U",
      "I",
    ]);
  });

  it("keeps DeepRoot functional path ahead of emitted functional evidence", () => {
    expect(
      selectEvidencePackageFunctionalPathV0_1({
        deepRootPath: "U→I",
        emittedFunctionalPath: [
          "U",
          "Y",
        ],
        detectedPath: [
          "U",
          "Y",
        ],
      }),
    ).toEqual([
      "U",
      "I",
    ]);
  });

  it("keeps the study evidence package aligned with DeepRoot functional truth", async () => {
    const payload = record(
      await analyzeV1("study"),
    );

    const deepRoot = record(
      payload.deepRoot,
    );

    const functionalRoots =
      deepRoot.functionalRoots;

    expect(
      Array.isArray(functionalRoots),
    ).toBe(true);

    const functionalRoot =
      record(
        (
          functionalRoots as unknown[]
        )[0],
      );

    expect(
      functionalRoot.vowelPath,
    ).toBe("U→I");

    const evidencePackage =
      record(
        payload.evidencePackage,
      );

    const summary =
      record(
        evidencePackage.summary,
      );

    expect(
      summary.voicePath,
    ).toBe("U → Y");

    expect(
      summary.voicePathSurface,
    ).toBe("U → Y");

    expect(
      summary.voicePathFunctional,
    ).toBe("U → I");

    expect(
      summary.voicePathDelta,
    ).toBe("DIVERGE");

    const spectrum =
      record(
        evidencePackage
          .sevenPrinciplesSpectrum,
      );

    const surface =
      record(
        spectrum.surface,
      );

    const functional =
      record(
        spectrum.functional,
      );

    const delta =
      record(
        spectrum.delta,
      );

    expect(
      surface.indices1,
    ).toEqual([5, 6]);

    expect(
      functional.indices1,
    ).toEqual([5, 3]);

    expect(
      delta.surfaceIndices1,
    ).toEqual([5, 6]);

    expect(
      delta.functionalIndices1,
    ).toEqual([5, 3]);
  });

  it("keeps functional delta and IPA carrier delta separate for study", async () => {
    const payload =
      record(
        await analyzeV1(
          "study",
          "/ʊʏ/",
        ),
      );

    const evidencePackage =
      record(
        payload.evidencePackage,
      );

    const summary =
      record(
        evidencePackage.summary,
      );

    expect(
      summary.voicePath,
    ).toBe("U → Y");

    expect(
      summary.voicePathSurface,
    ).toBe("U → Y");

    expect(
      summary.voicePathFunctional,
    ).toBe("U → I");

    expect(
      summary.voicePathDelta,
    ).toBe("DIVERGE");

    expect(
      summary.voicePathCarrier,
    ).toBe("U → Y");

    expect(
      summary.voicePathCarrierDelta,
    ).toBe("MATCH");

    const spectrum =
      record(
        evidencePackage
          .sevenPrinciplesSpectrum,
      );

    const functional =
      record(
        spectrum.functional,
      );

    expect(
      functional.indices1,
    ).toEqual([5, 3]);
  });

  it("does not let sourceKind SEED imply validation", () => {
    const candidate = projectEmbryoFirstCandidateForAnalyzeV1(
      {
        id: "seed-da",
        language: "Albanian",
        form: "da",
        sourceKind: "SEED",
      },
      { word: "damage" },
    );

    expect(candidate.sourceKind).toBe("SEED");
    expect(candidate.claimType).toBe("seedPairing");
    expect(candidate.validationOutcome).not.toBe("validated");
    expect(candidate.rankGroup).toBe("surfaceOrSeedOnly");
    expect(candidate.originClaim).toBe("not_claimed");
    expect(candidate.userDecisionPosture).toBe("user_decides");
    expect(candidate.validationReasons).toEqual(
      expect.arrayContaining([
        "sourceKind_seed_not_validation",
        "missing_isolatedStandaloneForm",
        "missing_sourceNote",
      ]),
    );
  });

  it("blocks full functional validation when isolation proof and source note are missing", () => {
    const candidate = projectEmbryoFirstCandidateForAnalyzeV1(
      {
        id: "overclaim-da",
        language: "Albanian",
        form: "da",
        claimType: "functionalMotivation",
        validationOutcome: "validated",
      },
      { word: "damage" },
    );

    expect(candidate.claimType).toBe("surfaceResonance");
    expect(candidate.validationOutcome).toBe("blocked");
    expect(candidate.rankGroup).not.toBe("validatedFunctionalMotivation");
    expect(candidate.validationReasons).toEqual(
      expect.arrayContaining([
        "missing_isolatedStandaloneForm",
        "missing_plainStandaloneGloss",
        "missing_sourceNote",
      ]),
    );
    expect(candidate.claimBoundary).toContain("not historical origin");
  });
});
