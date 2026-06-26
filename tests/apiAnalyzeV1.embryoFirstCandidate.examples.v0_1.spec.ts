import { GET } from "../app/api/analyze-v1/route";
import { projectEmbryoFirstCandidateForAnalyzeV1 } from "../src/shared/analysisAdapter";

const REQUIRED_EXAMPLE_FIELDS = [
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

const RANK_GROUP_ORDER: Record<string, number> = {
  validatedFunctionalMotivation: 1,
  partialFunctionalMotivation: 2,
  surfaceOrSeedOnly: 3,
  historicalContextOnly: 4,
  unresolved: 5,
};

const MISSING_ISOLATION_REASONS = [
  "missing_isolatedStandaloneForm",
  "missing_plainStandaloneGloss",
  "missing_sourceNote",
  "missing_semanticBridge",
  "embryo_first_full_functional_validation_not_claimed",
];

const FUNCTIONAL_EXAMPLES = [
  {
    word: "damage",
    candidateId: "albanian-da-dam-damage-functional",
    candidate: {
      id: "albanian-da-dam-damage-functional",
      candidateId: "albanian-da-dam-damage-functional",
      displayForm: "DA → DAM → DAMAGE",
      candidateLanguage: "Albanian",
      language: "Albanian",
      form: "DA → DAM → DAMAGE",
      claimType: "functionalMotivation",
      originClaim: "not_claimed",
      historicalRelation: "not_evaluated",
      embryo: "DA",
      embryoSize: 2,
      embryoLanguage: "Albanian",
      isolatedStandaloneForm: "da",
      plainStandaloneGloss: "to divide, split, or separate",
      sourceNote:
        "static contract example fixture only; live promotion still requires reviewed isolation/source evidence",
      segmentation: {
        embryo: "DA",
        expansion: ["DA", "DAM", "DAMAGE"],
      },
      semanticBridge: "what is split or broken becomes harmed or damaged",
      expansionChain: ["DA", "DAM", "DAMAGE"],
      validationOutcome: "validated",
      validationReasons: [
        "isolatedStandaloneForm_present",
        "plainStandaloneGloss_present",
        "sourceNote_present",
        "semanticBridge_present",
      ],
      rankGroup: "validatedFunctionalMotivation",
      rankScore: 100,
      rankReason:
        "small isolated embryo plus semantic bridge outranks surface or seed-only context",
      claimBoundary: "functional motivation example only; not historical origin",
      userDecisionPosture: "user_decides",
    },
  },
  {
    word: "study",
    candidateId: "albanian-shtu-di-study-functional",
    candidate: {
      id: "albanian-shtu-di-study-functional",
      candidateId: "albanian-shtu-di-study-functional",
      displayForm: "SHTU + DI → STUDY",
      candidateLanguage: "Albanian",
      language: "Albanian",
      form: "SHTU + DI → STUDY",
      claimType: "functionalMotivation",
      originClaim: "not_claimed",
      historicalRelation: "not_evaluated",
      embryo: "DI",
      embryoSize: 2,
      embryoLanguage: "Albanian",
      isolatedStandaloneForm: "di",
      plainStandaloneGloss: "knowledge or knowing",
      sourceNote:
        "static contract example fixture only; live promotion still requires reviewed isolation/source evidence",
      segmentation: {
        embryo: "DI",
        expansion: ["DI", "SHTU + DI", "STUDY"],
      },
      semanticBridge: "knowledge is made internal through study",
      expansionChain: ["DI", "SHTU + DI", "STUDY"],
      validationOutcome: "validated",
      validationReasons: [
        "isolatedStandaloneForm_present",
        "plainStandaloneGloss_present",
        "sourceNote_present",
        "semanticBridge_present",
      ],
      rankGroup: "validatedFunctionalMotivation",
      rankScore: 100,
      rankReason:
        "small isolated knowledge embryo plus semantic bridge outranks surface or seed-only context",
      claimBoundary: "functional motivation example only; not historical origin",
      userDecisionPosture: "user_decides",
    },
  },
] as const;

const SEED_CONTEXT_EXAMPLES = [
  {
    word: "damage",
    candidateId: "latin-damnum-seed-context",
    candidate: {
      id: "latin-damnum-seed-context",
      candidateId: "latin-damnum-seed-context",
      displayForm: "damnum",
      candidateLanguage: "Latin",
      language: "Latin",
      form: "damnum",
      sourceKind: "SEED",
      claimType: "surfaceResonance",
      originClaim: "not_claimed",
      historicalRelation: "context_only",
      embryo: null,
      embryoSize: null,
      embryoLanguage: null,
      isolatedStandaloneForm: null,
      plainStandaloneGloss: null,
      sourceNote: null,
      segmentation: {
        root: "dam-",
        suffixes: ["-num"],
      },
      semanticBridge: null,
      expansionChain: ["damnum"],
      validationOutcome: "partial",
      validationReasons: ["historical_context_only"],
      rankGroup: "surfaceOrSeedOnly",
      rankScore: 25,
      rankReason:
        "seed context is useful context, but sourceKind SEED is not validation",
      claimBoundary: "seed context only; not historical origin winner or validated functional motivation",
      userDecisionPosture: "user_decides",
    },
  },
  {
    word: "study",
    candidateId: "latin-studium-seed-context",
    candidate: {
      id: "latin-studium-seed-context",
      candidateId: "latin-studium-seed-context",
      displayForm: "studium",
      candidateLanguage: "Latin",
      language: "Latin",
      form: "studium",
      sourceKind: "SEED",
      claimType: "surfaceResonance",
      originClaim: "not_claimed",
      historicalRelation: "context_only",
      embryo: null,
      embryoSize: null,
      embryoLanguage: null,
      isolatedStandaloneForm: null,
      plainStandaloneGloss: null,
      sourceNote: null,
      segmentation: {
        root: "stud-",
        suffixes: ["-ium"],
      },
      semanticBridge: null,
      expansionChain: ["studium"],
      validationOutcome: "partial",
      validationReasons: ["historical_context_only"],
      rankGroup: "surfaceOrSeedOnly",
      rankScore: 25,
      rankReason:
        "seed context is useful context, but sourceKind SEED is not validation",
      claimBoundary: "seed context only; not historical origin winner or validated functional motivation",
      userDecisionPosture: "user_decides",
    },
  },
] as const;

async function analyzeV1(word: string): Promise<unknown> {
  const response = await GET(
    new Request(`http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}`),
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

function projectExample(
  word: string,
  candidate: Record<string, unknown>,
): Record<string, unknown> {
  return projectEmbryoFirstCandidateForAnalyzeV1(candidate, { word }) as Record<
    string,
    unknown
  >;
}

function expectRequiredExampleFields(candidate: Record<string, unknown>): void {
  for (const field of REQUIRED_EXAMPLE_FIELDS) {
    expect(candidate).toHaveProperty(field);
  }
}

function expectNoMissingIsolationReasons(candidate: Record<string, unknown>): void {
  expect(candidate.validationReasons).not.toEqual(
    expect.arrayContaining(MISSING_ISOLATION_REASONS),
  );
}

function rankGroupOrder(value: unknown): number {
  const key = String(value);
  expect(RANK_GROUP_ORDER[key]).toBeDefined();
  return RANK_GROUP_ORDER[key] ?? 999;
}

describe("analyze-v1 embryo-first candidate examples v0.1", () => {
  it.each(FUNCTIONAL_EXAMPLES)(
    "locks a bounded validated functional example for $word",
    ({ word, candidateId, candidate }) => {
      const projected = projectExample(word, candidate);

      expectRequiredExampleFields(projected);

      expect(projected.candidateId).toBe(candidateId);
      expect(projected.displayForm).toBe(candidate.displayForm);
      expect(projected.candidateLanguage).toBe(candidate.candidateLanguage);
      expect(projected.claimType).toBe("functionalMotivation");
      expect(projected.originClaim).toBe("not_claimed");
      expect(projected.historicalRelation).toBe("not_evaluated");
      expect(projected.validationOutcome).toBe("validated");
      expect(projected.rankGroup).toBe("validatedFunctionalMotivation");
      expect(projected.rankScore).toBe(100);
      expect(projected.userDecisionPosture).toBe("user_decides");

      expect(projected.embryo).toBeTruthy();
      expect(projected.embryoSize).toBeGreaterThan(0);
      expect(projected.embryoLanguage).toBe(candidate.candidateLanguage);
      expect(projected.isolatedStandaloneForm).toBeTruthy();
      expect(projected.plainStandaloneGloss).toBeTruthy();
      expect(projected.sourceNote).toBeTruthy();
      expect(projected.semanticBridge).toBeTruthy();

      expect(String(projected.claimBoundary)).toContain("not historical origin");
      expect(String(projected.rankReason)).toContain("outranks surface or seed-only context");

      expect(Array.isArray(projected.expansionChain)).toBe(true);
      expect(Array.isArray(projected.validationReasons)).toBe(true);
      expectNoMissingIsolationReasons(projected);
    },
  );

  it.each(SEED_CONTEXT_EXAMPLES)(
    "locks a bounded seed/context-only example for $word",
    ({ word, candidateId, candidate }) => {
      const projected = projectExample(word, candidate);

      expectRequiredExampleFields(projected);

      expect(projected.candidateId).toBe(candidateId);
      expect(projected.sourceKind).toBe("SEED");
      expect(projected.claimType).toBe("surfaceResonance");
      expect(projected.originClaim).toBe("not_claimed");
      expect(projected.historicalRelation).toBe("context_only");
      expect(projected.validationOutcome).not.toBe("validated");
      expect(projected.rankGroup).toBe("surfaceOrSeedOnly");
      expect(projected.userDecisionPosture).toBe("user_decides");
      expect(projected.claimBoundary).toBe(
        "seed context only; not historical origin winner or validated functional motivation",
      );

      expect(projected.validationReasons).toEqual(
        expect.arrayContaining([
          "sourceKind_seed_not_validation",
          "missing_isolatedStandaloneForm",
          "missing_plainStandaloneGloss",
          "missing_sourceNote",
          "missing_semanticBridge",
          "embryo_first_full_functional_validation_not_claimed",
        ]),
      );
    },
  );

  it.each([
    ["damage", FUNCTIONAL_EXAMPLES[0], SEED_CONTEXT_EXAMPLES[0]],
    ["study", FUNCTIONAL_EXAMPLES[1], SEED_CONTEXT_EXAMPLES[1]],
  ] as const)(
    "orders %s functional examples ahead of seed/context examples",
    (word, functionalExample, seedExample) => {
      const functional = projectExample(word, functionalExample.candidate);
      const seed = projectExample(word, seedExample.candidate);

      expect(rankGroupOrder(functional.rankGroup)).toBeLessThan(
        rankGroupOrder(seed.rankGroup),
      );
      expect(Number(functional.rankScore)).toBeGreaterThan(Number(seed.rankScore));
      expect(functional.originClaim).toBe("not_claimed");
      expect(seed.originClaim).toBe("not_claimed");
    },
  );

  it.each(["damage", "study"])(
    "keeps current live %s output bounded until real isolation evidence is wired",
    async (word) => {
      const liveCandidates = candidatesFrom(await analyzeV1(word));

      expect(liveCandidates.length).toBeGreaterThan(0);

      for (const candidate of liveCandidates) {
        expect(candidate.originClaim).toBe("not_claimed");
        expect(candidate.userDecisionPosture).toBe("user_decides");

        if (candidate.sourceKind === "SEED") {
          expect(candidate.rankGroup).toBe("surfaceOrSeedOnly");
          expect(candidate.validationOutcome).not.toBe("validated");
          expect(candidate.validationReasons).toEqual(
            expect.arrayContaining([
              "missing_isolatedStandaloneForm",
              "missing_plainStandaloneGloss",
              "missing_sourceNote",
              "missing_semanticBridge",
              "embryo_first_full_functional_validation_not_claimed",
            ]),
          );
        }
      }
    },
  );
});
