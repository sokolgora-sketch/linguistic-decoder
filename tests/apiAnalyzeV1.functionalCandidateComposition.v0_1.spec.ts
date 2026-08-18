import { GET } from "../app/api/analyze-v1/route";
import {
  buildFunctionalCandidateCompositionsFromRootMapV0_1,
  buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1,
} from "../src/shared/deepRoot.rootMap.builder.v1";
import {
  enginePayloadToAnalysisResult,
  projectEmbryoFirstCandidateForAnalyzeV1,
} from "../src/shared/analysisAdapter";
import {
  runAnalysisDeterministic,
} from "../src/lib/runAnalysisDeterministic";

async function analyzeV1(word: string): Promise<any> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function compositionCandidates(body: any): any[] {
  return Array.isArray(body?.candidates)
    ? body.candidates.filter(
        (candidate: any) =>
          candidate?.sourceKind ===
          "rootmap_functional_composition",
      )
    : [];
}

describe(
  "Open Instrument functional candidate composition v0.1",
  () => {
    it("emits study SHTU + DI as a first-class Partial functional candidate", async () => {
      const body = await analyzeV1("study");

      expect(Array.isArray(body?.candidates)).toBe(true);

      const composition =
        compositionCandidates(body).find(
          (candidate: any) =>
            candidate?.displayForm === "SHTU + DI",
        );

      expect(composition).toBeTruthy();

      expect(composition.candidateId).toBe(
        "rootmap-composition:sq:shtu+di",
      );

      expect(composition.language).toBe("sq");
      expect(composition.candidateLanguage).toBe("sq");

      expect(composition.form).toBe("SHTU + DI");
      expect(composition.displayForm).toBe(
        "SHTU + DI",
      );

      expect(composition.claimType).toBe(
        "functionalMotivation",
      );

      expect(composition.validationOutcome).toBe(
        "partial",
      );

      expect(composition.rankGroup).toBe(
        "partialFunctionalMotivation",
      );

      expect(composition.originClaim).toBe(
        "not_claimed",
      );

      expect(composition.historicalRelation).toBe(
        "not_evaluated",
      );

      expect(composition.userDecisionPosture).toBe(
        "user_decides",
      );

      expect(composition.embryo).toBeNull();
      expect(
        composition.isolatedStandaloneForm,
      ).toBeNull();

      expect(
        composition.plainStandaloneGloss,
      ).toBeNull();

      expect(composition.segmentation).toEqual({
        kind: "functionalComposition",
        components: [
          {
            embryo: "SHTU",
            language: "sq",
            plainMeaning:
              "add / increase / put-on",
            evidenceState: "structural",
          },
          {
            embryo: "DI",
            language: "sq",
            plainMeaning:
              "know / knowledge",
            evidenceState: "reviewed",
          },
        ],
      });

      expect(composition.expansionChain).toEqual([
        "SHTU",
        "DI",
        "STUDY",
      ]);

      expect(
        composition.functionalStatement,
      ).toBe(
        "Adding or increasing knowledge; making knowledge yours through learning.",
      );

      expect(
        composition.semanticBridge,
      ).toBe(
        "Adding or increasing knowledge; making knowledge yours through learning.",
      );

      expect(
        composition.gloss,
      ).toBe(
        "add / increase / put-on + know / knowledge",
      );

      expect(
        composition.vowelPath,
      ).toBe(
        "U-I",
      );

      const reviewedDiIndex =
        body.candidates.findIndex(
          (candidate: any) =>
            candidate?.candidateId ===
            "albanian-di-know-functional",
        );

      const compositionIndex =
        body.candidates.findIndex(
          (candidate: any) =>
            candidate?.candidateId ===
            "rootmap-composition:sq:shtu+di",
        );

      expect(reviewedDiIndex).toBe(0);
      expect(compositionIndex).toBeGreaterThan(
        reviewedDiIndex,
      );

      const firstSurfaceSeed =
        body.candidates.findIndex(
          (candidate: any) =>
            candidate?.rankGroup ===
            "surfaceOrSeedOnly",
        );

      expect(firstSurfaceSeed).toBeGreaterThan(
        compositionIndex,
      );
    });

    it("uses the normalized RootMap basis for reviewed projections when raw input contains stripped punctuation", async () => {
      const body = await analyzeV1("study!");

      expect(body?.word).toBe("study!");

      // Public DeepRoot basis remains the raw/back-compatible
      // reporting value. Internal RootMap authorization uses the
      // normalized authority captured before DeepRoot construction.
      expect(
        body?.deepRoot?.basis,
      ).toBe("study!");

      expect(
        body?.analysisStatusV0_1?.status,
      ).toBe(
        "reviewed_functional_evidence",
      );

      expect(
        body?.analysisStatusV0_1?.reviewedOperators,
      ).toContain("DI");

      expect(
        body?.analysisStatusV0_1?.candidateOnlyOperators,
      ).not.toContain("DI");

      const reviewedDi =
        body?.candidates?.find(
          (candidate: any) =>
            candidate?.candidateId ===
            "albanian-di-know-functional",
        );

      const composition =
        body?.candidates?.find(
          (candidate: any) =>
            candidate?.candidateId ===
            "rootmap-composition:sq:shtu+di",
        );

      expect(reviewedDi).toBeTruthy();
      expect(composition).toBeTruthy();

      expect(
        composition?.validationOutcome,
      ).toBe("partial");

      expect(
        composition?.displayForm,
      ).toBe("SHTU + DI");

      expect(
        composition?.expansionChain,
      ).toEqual([
        "SHTU",
        "DI",
        "STUDY",
      ]);

      expect(
        composition?.segmentation?.components,
      ).toEqual([
        {
          embryo: "SHTU",
          language: "sq",
          plainMeaning:
            "add / increase / put-on",
          evidenceState: "structural",
        },
        {
          embryo: "DI",
          language: "sq",
          plainMeaning:
            "know / knowledge",
          evidenceState: "reviewed",
        },
      ]);
    });

    it("retains one normalized DeepRoot and RootMap authority when legacy normalized fields differ from raw word", async () => {
      const payload: any =
        await runAnalysisDeterministic(
          "study",
          {
            mode: "strict",
          },
        );

      payload.word =
        "legacy-study";

      payload.sanitized =
        "study";

      const body: any =
        enginePayloadToAnalysisResult(
          payload,
        );

      expect(body?.word).toBe(
        "legacy-study",
      );

      expect(body?.sanitized).toBe(
        "study",
      );

      expect(
        body?.deepRoot?.basis,
      ).toBe(
        "legacy-study",
      );

      expect(
        body?.analysisStatusV0_1?.status,
      ).toBe(
        "reviewed_functional_evidence",
      );

      expect(
        body?.analysisStatusV0_1
          ?.reviewedOperators,
      ).toContain("DI");

      expect(
        body?.candidates?.some(
          (candidate: any) =>
            candidate?.candidateId ===
            "albanian-di-know-functional",
        ),
      ).toBe(true);

      expect(
        body?.candidates?.some(
          (candidate: any) =>
            candidate?.candidateId ===
            "rootmap-composition:sq:shtu+di",
        ),
      ).toBe(true);
    });

    it("rejects marker-shaped reviewed component evidence without production runtime provenance", () => {
      const candidates =
        buildFunctionalCandidateCompositionsFromRootMapV0_1(
          {
            targetWord: "fixture",
            rootMap: {
              tokens: [
                {
                  token: "DA",
                  role: "action",
                  vowel_path: "A",
                },
                {
                  token: "DI",
                  role: "instrument",
                  vowel_path: "I",
                },
              ],
              keys: [
                {
                  token: "DA",
                  language: "sq",
                  gloss: "split / divide",
                  status: "supported",
                  evidence: [
                    "reviewed functional free-operator evidence: fixture DA; historicalOriginClaim=not_claimed; winnerClaim=not_claimed; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides",
                  ],
                },
                {
                  token: "DI",
                  language: "sq",
                  gloss: "know / knowledge",
                  status: "supported",
                  evidence: [
                    "reviewed functional free-operator evidence: fixture DI; historicalOriginClaim=not_claimed; winnerClaim=not_claimed; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides",
                  ],
                },
              ],
              composedMeaning:
                "split / divide + know / knowledge",
            },
          },
        );

      expect(candidates).toEqual([]);
    });

    it("rejects marker-shaped reviewed evidence from the reviewed single-embryo projection path", () => {
      const candidates =
        buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1(
          {
            targetWord: "damage",
            rootMap: {
              tokens: [
                {
                  token: "DA",
                  role: "action",
                  vowel_path: "A",
                },
              ],
              keys: [
                {
                  token: "DA",
                  language: "sq",
                  gloss:
                    "split / divide / cut / separate",
                  status: "supported",
                  evidence: [
                    "reviewed functional free-operator evidence: counterfeit DA; historicalOriginClaim=not_claimed; winnerClaim=not_claimed; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides",
                  ],
                },
              ],
              composedMeaning:
                "split / divide / cut / separate",
            },
          },
        );

      expect(candidates).toEqual([]);
    });

    it("does not reauthenticate a JSON-copied live RootMap from copied public evidence", async () => {
      const live = await analyzeV1("study");

      const copiedRootMap =
        JSON.parse(
          JSON.stringify(
            live.rootMap,
          ),
        );

      const copiedDi =
        copiedRootMap?.keys?.find(
          (key: any) =>
            key?.token === "DI",
        );

      expect(copiedDi?.status).toBe(
        "supported",
      );

      expect(
        copiedDi?.evidence?.join("\n"),
      ).toContain(
        "reviewed functional free-operator evidence",
      );

      expect(
        buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1(
          {
            targetWord: "study",
            rootMap: copiedRootMap,
          },
        ),
      ).toEqual([]);

      expect(
        buildFunctionalCandidateCompositionsFromRootMapV0_1(
          {
            targetWord: "study",
            rootMap: copiedRootMap,
          },
        ),
      ).toEqual([]);
    });

    it("does not trust caller-supplied reviewed component labels or standalone isolation fields as authenticated composition provenance", () => {
      const projected =
        projectEmbryoFirstCandidateForAnalyzeV1(
          {
            id:
              "caller-supplied-composition",
            candidateId:
              "caller-supplied-composition",
            form: "AA + BB",
            displayForm: "AA + BB",
            language: "sq",
            candidateLanguage: "sq",
            sourceKind:
              "rootmap_functional_composition",
            claimType:
              "functionalMotivation",
            validationOutcome:
              "validated",
            rankGroup:
              "validatedFunctionalMotivation",
            semanticBridge:
              "caller supplied composition bridge",
            isolatedStandaloneForm:
              "AA + BB",
            plainStandaloneGloss:
              "caller supplied standalone gloss",
            sourceNote:
              "caller supplied source note",
            rankScore: 100,
            segmentation: {
              kind:
                "functionalComposition",
              components: [
                {
                  embryo: "AA",
                  language: "sq",
                  plainMeaning:
                    "fixture a",
                  evidenceState:
                    "reviewed",
                },
                {
                  embryo: "BB",
                  language: "sq",
                  plainMeaning:
                    "fixture b",
                  evidenceState:
                    "reviewed",
                },
              ],
            },
            originClaim:
              "not_claimed",
            userDecisionPosture:
              "user_decides",
          },
          {
            word: "fixture",
          },
        );

      expect(
        projected.claimType,
      ).toBe("surfaceResonance");

      expect(
        projected.validationOutcome,
      ).toBe("blocked");

      expect(
        projected.rankGroup,
      ).toBe("surfaceOrSeedOnly");

      expect(
        projected.rankReason,
      ).toBe(
        "functional composition evidence provenance is not authenticated",
      );

      expect(
        projected.claimBoundary,
      ).toBe(
        "unauthenticated composition evidence is not functional candidate truth",
      );

      expect(
        projected.rankScore,
      ).toBe(25);

      expect(
        projected.validationReasons,
      ).toEqual(
        expect.arrayContaining([
          "functional_composition_provenance_not_authenticated",
        ]),
      );

      expect(
        projected.validationReasons,
      ).not.toEqual(
        expect.arrayContaining([
          "reviewed_production_source_row",
          "all_components_reviewed_functional_evidence",
        ]),
      );
    });

    it("fails closed when a declared functional composition is malformed even if standalone isolation fields are supplied", () => {
      const projected =
        projectEmbryoFirstCandidateForAnalyzeV1(
          {
            id:
              "malformed-caller-composition",
            candidateId:
              "malformed-caller-composition",
            form: "AA + BB",
            displayForm: "AA + BB",
            language: "sq",
            candidateLanguage: "sq",
            sourceKind:
              "rootmap_functional_composition",
            claimType:
              "functionalMotivation",
            validationOutcome:
              "validated",
            rankGroup:
              "validatedFunctionalMotivation",
            rankScore: 100,
            isolatedStandaloneForm:
              "AA + BB",
            plainStandaloneGloss:
              "caller supplied standalone gloss",
            sourceNote:
              "caller supplied source note",
            semanticBridge:
              "caller supplied semantic bridge",
            segmentation: {
              kind:
                "functionalComposition",
              components: [
                {
                  embryo: "AA",
                  language: "sq",
                  plainMeaning:
                    "fixture a",
                  evidenceState:
                    "reviewed",
                },
                {
                  embryo: "BB",
                  plainMeaning:
                    "fixture b",
                  evidenceState:
                    "reviewed",
                },
              ],
            },
            originClaim:
              "not_claimed",
            userDecisionPosture:
              "user_decides",
          },
          {
            word: "fixture",
          },
        );

      expect(
        projected.claimType,
      ).toBe("surfaceResonance");

      expect(
        projected.validationOutcome,
      ).toBe("blocked");

      expect(
        projected.rankGroup,
      ).toBe("surfaceOrSeedOnly");

      expect(
        projected.rankScore,
      ).toBe(25);

      expect(
        projected.rankReason,
      ).toBe(
        "functional composition evidence provenance is not authenticated",
      );

      expect(
        projected.claimBoundary,
      ).toBe(
        "unauthenticated composition evidence is not functional candidate truth",
      );

      expect(
        projected.validationReasons,
      ).toEqual(
        expect.arrayContaining([
          "malformed_functional_composition",
          "functional_composition_provenance_not_authenticated",
        ]),
      );
    });

    it("does not promote unsupported RootMap key statuses into a Partial functional composition", () => {
      const unsupportedStatuses = [
        "speculative",
        "candidate_only",
        "carrier_only",
        "dialect_attested_pending_review",
      ] as const;

      for (const unsupportedStatus of unsupportedStatuses) {
        const candidates =
          buildFunctionalCandidateCompositionsFromRootMapV0_1(
            {
              targetWord: "fixture",
              rootMap: {
                tokens: [
                  {
                    token: "AA",
                    role: "action",
                  },
                  {
                    token: "BB",
                    role: "instrument",
                  },
                ],
                keys: [
                  {
                    token: "AA",
                    language: "sq",
                    gloss: "fixture reviewed operator",
                    status: "supported",
                    evidence: [
                      "reviewed functional free-operator evidence: fixture AA; historicalOriginClaim=not_claimed; winnerClaim=not_claimed; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides",
                    ],
                  },
                  {
                    token: "BB",
                    language: "sq",
                    gloss: "unsupported fixture gloss",
                    status: unsupportedStatus,
                    evidence: [
                      "structural only",
                    ],
                  },
                ],
                composedMeaning:
                  "fixture reviewed operator + unsupported fixture gloss",
              },
            },
          );

        expect(candidates).toEqual([]);
      }
    });

    it("does not treat a phrase-only reviewed-evidence marker as authorized reviewed evidence", () => {
      expect(
        buildFunctionalCandidateCompositionsFromRootMapV0_1(
          {
            targetWord: "fixture",
            rootMap: {
              tokens: [
                {
                  token: "AA",
                  role: "action",
                },
                {
                  token: "BB",
                  role: "instrument",
                },
              ],
              keys: [
                {
                  token: "AA",
                  language: "sq",
                  gloss: "fixture a",
                  status: "supported",
                  evidence: [
                    "reviewed functional free-operator evidence fixture",
                  ],
                },
                {
                  token: "BB",
                  language: "sq",
                  gloss: "fixture b",
                  status: "supported",
                  evidence: [
                    "structural only",
                  ],
                },
              ],
              composedMeaning:
                "fixture a + fixture b",
            },
          },
        ),
      ).toEqual([]);
    });

    it("does not emit a functional composition when no component has reviewed functional evidence", () => {
      expect(
        buildFunctionalCandidateCompositionsFromRootMapV0_1(
          {
            targetWord: "fixture",
            rootMap: {
              tokens: [
                {
                  token: "AA",
                  role: "action",
                },
                {
                  token: "BB",
                  role: "instrument",
                },
              ],
              keys: [
                {
                  token: "AA",
                  language: "sq",
                  gloss: "fixture a",
                  status: "supported",
                  evidence: ["structural only"],
                },
                {
                  token: "BB",
                  language: "sq",
                  gloss: "fixture b",
                  status: "supported",
                  evidence: ["structural only"],
                },
              ],
              composedMeaning:
                "fixture a + fixture b",
            },
          },
        ),
      ).toEqual([]);
    });

    it("does not invent a first-class reviewed/partial RootMap composition for father", async () => {
      const body = await analyzeV1("father");

      expect(
        compositionCandidates(body),
      ).toEqual([]);
    });
  },
);
