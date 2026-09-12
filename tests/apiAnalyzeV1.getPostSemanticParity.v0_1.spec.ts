import { GET, POST } from "../app/api/analyze-v1/route";
import { GET as legacyGET } from "../app/api/analyze/route";

type JsonObject = Record<string, unknown>;

const CANONICAL_VOICES = new Set(["A", "E", "I", "O", "U", "Y", "Ë"]);
const CANONICAL_ALPHABETS = [
  "auto",
  "albanian",
  "latin",
  "sanskrit",
  "ancient_greek",
  "pie",
  "turkish",
  "german",
] as const;

const CLAIM_BOUNDARY = {
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  linguisticOwnershipClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
  structuralOutputIsCandidateTruth: false,
  nullIsValid: true,
};

const REPRESENTATIVE_CASES = [
  { word: "study", status: "reviewed_functional_evidence" },
  { word: "damage", status: "reviewed_functional_evidence" },
  { word: "xyz", status: "null_no_supported_candidate" },
  { word: "mode", status: "structural_unreviewed" },
  { word: "sterile", status: "research_functional_hypothesis" },
  { word: "data", status: "candidate_only" },
  { word: "dij", status: "candidate_only" },
] as const;

const EXPECTED_EVIDENCE_REFS: Record<string, string[]> = {
  study: ["reviewed.external.di.knowledge.candidate.citation.v0_1"],
  damage: ["reviewed.external.gheg-da.damage.candidate.citation.v0_1"],
  sterile: [
    "research.external.pokorny-er5-lrc.citation.v0_1",
    "research.external.logeion-eremos.citation.v0_1",
    "research.external.pokorny-er5-greek-reflex.citation.v0_1",
  ],
};

function object(value: unknown, label: string): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} was not an object`);
  }

  return value as JsonObject;
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function candidateProjection(value: unknown): JsonObject {
  const candidate = object(value, "candidate");

  return {
    candidateId: candidate.candidateId,
    displayForm: candidate.displayForm,
    status: candidate.status,
    sourceKind: candidate.sourceKind,
    sourceStatus: candidate.sourceStatus,
    targetSenseId: candidate.targetSenseId,
    targetSenseLabel: candidate.targetSenseLabel,
    semanticAlignmentStatus: candidate.semanticAlignmentStatus,
    semanticAlignmentSource: candidate.semanticAlignmentSource,
    semanticAlignmentReasonCodes: candidate.semanticAlignmentReasonCodes,
    semanticAlignmentBridge: candidate.semanticAlignmentBridge,
    claimType: candidate.claimType,
    semanticBridge: candidate.semanticBridge,
    functionalSupportStatus: candidate.functionalSupportStatus,
    historicalRelation: candidate.historicalRelation,
    evidenceRefs: candidate.evidenceRefs,
    claimBoundary: candidate.claimBoundary,
    userDecisionPosture: candidate.userDecisionPosture,
    originClaim: candidate.originClaim,
  };
}

function originClaimProjection(value: unknown): JsonObject {
  const originClaim = object(value, "originClaim");

  return {
    version: originClaim.version,
    policy: originClaim.policy,
    candidates: array(originClaim.candidates).map((candidate) => {
      const projected = object(candidate, "origin candidate");
      return {
        id: projected.id,
        status: projected.status,
        confidence: projected.confidence,
        evidenceRefs: projected.evidenceRefs,
      };
    }),
  };
}

/**
 * Test-only semantic projection. Volatile timestamps, raw mirrors, transport
 * metadata, and method-specific seed provenance are intentionally excluded.
 */
function projectSemanticResponse(value: unknown): JsonObject {
  const response = object(value, "analyze-v1 response");
  const status = object(response.analysisStatusV0_1, "analysis status");
  const primaryPath = object(response.primaryPath, "primary path");
  const evidence = object(response.evidence, "evidence");

  return {
    word: response.word,
    mode: response.mode,
    alphabet: response.alphabet,
    primaryPath: {
      voicePath: primaryPath.voicePath,
      levelPath: primaryPath.levelPath,
      ringPath: primaryPath.ringPath,
    },
    analysisStatusV0_1: status,
    candidates: array(response.candidates).map(candidateProjection),
    evidence: {
      basis: evidence.basis,
      surfaceVowels: evidence.surfaceVowels,
      vowelPath: evidence.vowelPath,
      normalizationSteps: evidence.normalizationSteps,
      signals: evidence.signals,
    },
    originClaim: originClaimProjection(response.originClaim),
  };
}

function queryUrl(
  word: string,
  options: {
    mode?: string;
    alphabet?: string;
    ipa?: string;
    language?: string;
    targetSenseLabel?: string;
  } = {},
): string {
  const params = new URLSearchParams();
  params.set("word", word);
  if (options.mode !== undefined) params.set("mode", options.mode);
  if (options.alphabet !== undefined) params.set("alphabet", options.alphabet);
  if (options.ipa !== undefined) params.set("ipa", options.ipa);
  if (options.language !== undefined) params.set("language", options.language);
  if (options.targetSenseLabel !== undefined) {
    params.set("targetSenseLabel", options.targetSenseLabel);
  }

  return `http://localhost/api/analyze-v1?${params.toString()}`;
}

async function responseJson(response: {
  status: number;
  json(): Promise<unknown>;
}): Promise<JsonObject> {
  return object(await response.json(), "response JSON");
}

async function getAnalysis(
  word: string,
  options: Parameters<typeof queryUrl>[1] = {},
): Promise<{ status: number; body: JsonObject }> {
  const response = await GET(new Request(queryUrl(word, options)));
  return { status: response.status, body: await responseJson(response) };
}

async function postAnalysis(
  word: string,
  options: Parameters<typeof queryUrl>[1] = {},
): Promise<{ status: number; body: JsonObject }> {
  const body: JsonObject = { word };
  for (const key of ["mode", "alphabet", "ipa", "language", "targetSenseLabel"] as const) {
    if (options[key] !== undefined) body[key] = options[key];
  }

  return postBody(body);
}

async function postBody(
  body: JsonObject,
): Promise<{ status: number; body: JsonObject }> {
  const response = await POST(
    new Request("http://localhost/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );

  return { status: response.status, body: await responseJson(response) };
}

async function semanticPair(
  word: string,
  options: Parameters<typeof queryUrl>[1] = {},
): Promise<{ get: JsonObject; post: JsonObject }> {
  const [get, post] = await Promise.all([
    getAnalysis(word, options),
    postAnalysis(word, options),
  ]);

  expect(get.status).toBe(200);
  expect(post.status).toBe(200);

  return { get: get.body, post: post.body };
}

function expectCanonicalPrimaryVoicePath(response: JsonObject): void {
  const primaryPath = object(response.primaryPath, "primary path");
  const voicePath = array(primaryPath.voicePath);

  expect(voicePath.length).toBeGreaterThan(0);
  for (const voice of voicePath) {
    expect(typeof voice).toBe("string");
    expect(CANONICAL_VOICES.has(String(voice))).toBe(true);
  }
}

function inputMetadata(response: JsonObject): JsonObject {
  return object(object(response.meta, "response meta").inputs, "input metadata");
}

function profileSignal(response: JsonObject): string | undefined {
  return array(object(response.evidence, "evidence").signals)
    .map(String)
    .find((signal) => signal.startsWith("consonant_profile="));
}

async function withoutSemanticAlignmentTestProvider<T>(
  run: () => Promise<T>,
): Promise<T> {
  const envName = "OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER";
  const previous = process.env[envName];
  delete process.env[envName];

  try {
    return await run();
  } finally {
    if (previous === undefined) {
      delete process.env[envName];
    } else {
      process.env[envName] = previous;
    }
  }
}

describe("/api/analyze-v1 GET/POST semantic parity v0.1", () => {
  it.each(REPRESENTATIVE_CASES)(
    "GET and POST preserve equivalent semantic analysis for $word",
    async ({ word, status }) => {
      const pair = await semanticPair(word, { mode: "strict", alphabet: "auto" });

      expect(projectSemanticResponse(pair.get)).toEqual(
        projectSemanticResponse(pair.post),
      );

      const analysisStatus = object(pair.get.analysisStatusV0_1, "analysis status");
      expect(analysisStatus.status).toBe(status);
      expect(analysisStatus.userDecisionPosture).toBe("user_decides");
      expect(analysisStatus.claimBoundary).toEqual(CLAIM_BOUNDARY);

      const originClaim = object(pair.get.originClaim, "origin claim");
      expect(originClaim.policy).toBe("no_single_winner");
      expectCanonicalPrimaryVoicePath(pair.get);
      expectCanonicalPrimaryVoicePath(pair.post);

      const refs = array(pair.get.candidates)
        .flatMap((candidate) => array(candidateProjection(candidate).evidenceRefs))
        .map(String);
      expect(refs).toEqual(EXPECTED_EVIDENCE_REFS[word] ?? []);
    },
  );

  it("GET and POST preserve equivalent valid open-mode and concrete-alphabet analysis", async () => {
    const pair = await semanticPair("study", {
      mode: "open",
      alphabet: "latin",
    });

    expect(projectSemanticResponse(pair.get)).toEqual(
      projectSemanticResponse(pair.post),
    );
    expect(pair.get.mode).toBe("open");
    expect(pair.post.mode).toBe("open");
    expect(pair.get.alphabet).toBe("latin");
    expect(pair.post.alphabet).toBe("latin");
  });

  it.each([
    { label: "missing", options: {} },
    { label: "empty", options: { mode: "" } },
    { label: "whitespace-only", options: { mode: " \t\n" } },
  ])(
    "GET and POST treat $label mode as the strict default",
    async ({ options }) => {
      const get = await getAnalysis("study", options);
      const post = await postAnalysis("study", options);

      expect(get.status).toBe(200);
      expect(post.status).toBe(200);
      expect(get.body.mode).toBe("strict");
      expect(post.body.mode).toBe("strict");
      expect(inputMetadata(get.body).mode).toBe("strict");
      expect(inputMetadata(post.body).mode).toBe("strict");
    },
  );

  it.each(["strict", "open"])(
    "GET and POST trim and accept padded %s mode without changing semantics",
    async (mode) => {
      const exact = await semanticPair("study", {
        mode,
        alphabet: "auto",
      });
      const padded = await semanticPair("study", {
        mode: ` ${mode} `,
        alphabet: "auto",
      });

      expect(padded.get.mode).toBe(mode);
      expect(padded.post.mode).toBe(mode);
      expect(projectSemanticResponse(padded.get)).toEqual(
        projectSemanticResponse(exact.get),
      );
      expect(projectSemanticResponse(padded.post)).toEqual(
        projectSemanticResponse(exact.post),
      );
    },
  );

  it("GET and POST preserve equivalent valid IPA output while allowing method metadata differences", async () => {
    const pair = await semanticPair("rhythm", {
      mode: "strict",
      alphabet: "auto",
      ipa: "/ɹɪðəm/",
      language: "English",
    });

    expect(projectSemanticResponse(pair.get)).toEqual(
      projectSemanticResponse(pair.post),
    );

    const getIpa = object(pair.get.phoneticIpaV0_1, "GET IPA output");
    const postIpa = object(pair.post.phoneticIpaV0_1, "POST IPA output");
    expect(getIpa).toEqual(postIpa);
    expect(getIpa.ipa).toBe("/ɹɪðəm/");
    expect(getIpa.voices).toEqual(["I", "Ë"]);
  });

  it("GET and POST preserve target-sense input at the contract seam without provider execution", async () => {
    await withoutSemanticAlignmentTestProvider(async () => {
      const targetSenseLabel = "a fashion or manner";
      const pair = await semanticPair("mode", {
        mode: "strict",
        alphabet: "auto",
        targetSenseLabel,
      });

      expect(projectSemanticResponse(pair.get)).toEqual(
        projectSemanticResponse(pair.post),
      );

      const expectedInputs = {
        targetSenseId: "user_sense_a_fashion_or_manner",
        targetSenseLabel,
      };
      expect(inputMetadata(pair.get)).toMatchObject(expectedInputs);
      expect(inputMetadata(pair.post)).toMatchObject(expectedInputs);
    });
  });

  it("GET and POST preserve ordered candidate projection and evidence references for sterile", async () => {
    const pair = await semanticPair("sterile", {
      mode: "strict",
      alphabet: "auto",
    });

    const getCandidates = array(pair.get.candidates).map(candidateProjection);
    const postCandidates = array(pair.post.candidates).map(candidateProjection);

    expect(getCandidates).toEqual(postCandidates);
    expect(getCandidates.map((candidate) => candidate.candidateId)).toEqual([
      "logic-structural:sterile:er:peel_right_vowel_led_expansion+peel_left_consonant_frame+peel_left_consonant_frame",
      "logic-structural:sterile:erile:peel_left_consonant_frame+peel_left_consonant_frame",
      "research-functional:multi-source-functional:sterile:ER:research.external.pokorny-er5-loose-crumbly.v0_1",
      "research-functional:multi-source-functional:sterile:ER:research.external.greek-eremos-empty-devoid.v0_1",
    ]);
  });

  it.each(["", "   ", "\t\n"])(
    "GET rejects logically blank word %j with the existing 400 behavior",
    async (word) => {
      const result = await getAnalysis(word, { mode: "strict" });

      expect(result.status).toBe(400);
      expect(result.body.error).toBe(
        'Missing "word" query param. Use: /api/analyze-v1?word=study',
      );
    },
  );

  it.each(["", "   ", "\t\n"])(
    "POST rejects logically blank word %j with the explicit 400 validation contract",
    async (word) => {
      const result = await postAnalysis(word, { mode: "strict" });

      expect(result.status).toBe(400);
      expect(result.body.error).toBe(
        'Missing/invalid "word". Expected: { word: string }',
      );
    },
  );

  it("POST rejects non-string word with the existing invalid-request response", async () => {
    const response = await POST(
      new Request("http://localhost/api/analyze-v1", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ word: 42, mode: "strict" }),
      }),
    );
    const body = await responseJson(response);

    expect(response.status).toBe(400);
    expect(body.error).toBe(
      'Missing/invalid "word". Expected: { word: string }',
    );
  });

  it("POST preserves valid padded-word metadata and analytical semantics", async () => {
    const padded = await postAnalysis(" study ", {
      mode: "strict",
      alphabet: "auto",
    });
    const canonical = await postAnalysis("study", {
      mode: "strict",
      alphabet: "auto",
    });

    expect(padded.status).toBe(200);
    expect(canonical.status).toBe(200);
    expect(inputMetadata(padded.body).word).toBe(" study ");
    expect(padded.body.analysisStatusV0_1).toEqual(
      canonical.body.analysisStatusV0_1,
    );
    expect(padded.body.primaryPath).toEqual(canonical.body.primaryPath);
    expect(padded.body.candidates).toEqual(canonical.body.candidates);
    expect(padded.body.evidence).toEqual(canonical.body.evidence);
  });

  it("GET rejects unknown non-empty mode with the mode-specific 400 error", async () => {
    const result = await getAnalysis("study", { mode: "bogus" });

    expect(result.status).toBe(400);
    expect(result.body.error).toBe(
      'Invalid "mode". Expected: "strict" or "open".',
    );
  });

  it("POST rejects unknown non-empty mode with the mode-specific 400 error", async () => {
    const result = await postAnalysis("study", { mode: "bogus" });

    expect(result.status).toBe(400);
    expect(result.body.error).toBe(
      'Invalid "mode". Expected: "strict" or "open".',
    );
  });

  it.each([
    { label: "missing", alphabet: undefined },
    { label: "empty", alphabet: "" },
    { label: "whitespace-only", alphabet: " \t\n" },
  ])(
    "GET and POST normalize $label alphabet to the canonical auto selector",
    async ({ alphabet }) => {
      const get = await getAnalysis("study", {
        mode: "strict",
        ...(alphabet === undefined ? {} : { alphabet }),
      });
      const post = await postAnalysis("study", {
        mode: "strict",
        ...(alphabet === undefined ? {} : { alphabet }),
      });

      expect(get.status).toBe(200);
      expect(post.status).toBe(200);
      expect(get.body.alphabet).toBe("auto");
      expect(post.body.alphabet).toBe("auto");
      expect(inputMetadata(get.body).alphabet).toBe("auto");
      expect(inputMetadata(post.body).alphabet).toBe("auto");
    },
  );

  it.each(CANONICAL_ALPHABETS)(
    "GET and POST preserve canonical alphabet %s",
    async (alphabet) => {
      const get = await getAnalysis("study", { mode: "strict", alphabet });
      const post = await postAnalysis("study", { mode: "strict", alphabet });

      expect(get.status).toBe(200);
      expect(post.status).toBe(200);
      expect(get.body.alphabet).toBe(alphabet);
      expect(post.body.alphabet).toBe(alphabet);
      expect(inputMetadata(get.body).alphabet).toBe(alphabet);
      expect(inputMetadata(post.body).alphabet).toBe(alphabet);
    },
  );

  it.each(CANONICAL_ALPHABETS)(
    "GET and POST trim padded canonical alphabet %s without changing semantics",
    async (alphabet) => {
      const exact = await semanticPair("study", {
        mode: "strict",
        alphabet,
      });
      const padded = await semanticPair("study", {
        mode: "strict",
        alphabet: ` ${alphabet} `,
      });

      expect(padded.get.alphabet).toBe(alphabet);
      expect(padded.post.alphabet).toBe(alphabet);
      expect(inputMetadata(padded.get).alphabet).toBe(alphabet);
      expect(inputMetadata(padded.post).alphabet).toBe(alphabet);
      expect(projectSemanticResponse(padded.get)).toEqual(
        projectSemanticResponse(exact.get),
      );
      expect(projectSemanticResponse(padded.post)).toEqual(
        projectSemanticResponse(exact.post),
      );
    },
  );

  it("GET and POST use the same explicit profile for padded latin", async () => {
    const exact = await getAnalysis("gjuhë", {
      mode: "strict",
      alphabet: "latin",
    });
    const padded = await postAnalysis("gjuhë", {
      mode: "strict",
      alphabet: " latin ",
    });

    expect(exact.status).toBe(200);
    expect(padded.status).toBe(200);
    expect(exact.body.alphabet).toBe("latin");
    expect(padded.body.alphabet).toBe("latin");
    expect(inputMetadata(padded.body).alphabet).toBe("latin");
    expect(profileSignal(exact.body)).toBe("consonant_profile=latin");
    expect(profileSignal(padded.body)).toBe("consonant_profile=latin");
    expect(projectSemanticResponse(padded.body)).toEqual(
      projectSemanticResponse(exact.body),
    );
  });

  it.each([
    { label: "mixed-case canonical spelling", alphabet: "Latin" },
    { label: "unknown non-empty value", alphabet: "bogus" },
  ])(
    "GET and POST reject $label before producing analysis output",
    async ({ alphabet }) => {
      const get = await getAnalysis("study", { alphabet });
      const post = await postAnalysis("study", { alphabet });

      expect(get.status).toBe(400);
      expect(post.status).toBe(400);
      expect(get.body).not.toHaveProperty("alphabet");
      expect(post.body).not.toHaveProperty("alphabet");
      expect(get.body.error).toBe(
        'Invalid "alphabet". Expected one of: "auto", "albanian", "latin", "sanskrit", "ancient_greek", "pie", "turkish", "german".',
      );
      expect(post.body.error).toBe(
        'Invalid "alphabet". Expected one of: "auto", "albanian", "latin", "sanskrit", "ancient_greek", "pie", "turkish", "german".',
      );
    },
  );

  it.each([
    ["null", null],
    ["number", 42],
    ["boolean", true],
    ["array", []],
    ["object", {}],
  ] as const)(
    "POST rejects non-string alphabet (%s) through the existing 400 path",
    async (_label, alphabet) => {
      const result = await postBody({ word: "study", alphabet });

      expect(result.status).toBe(400);
      expect(result.body).not.toHaveProperty("alphabet");
    },
  );

  it("POST retains malformed-JSON rejection behavior", async () => {
    const response = await POST(
      new Request("http://localhost/api/analyze-v1", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: '{"word":"study"',
      }),
    );
    const body = await responseJson(response);

    expect(response.status).toBe(400);
    expect(body.error).toBe(
      'Invalid JSON body. Expected: { word: string, mode?: "strict"|"open", alphabet?: string }',
    );
  });

  it("GET and POST retain independent missing-word 400 errors", async () => {
    const get = await getAnalysis("", { mode: "strict" });
    const post = await POST(
      new Request("http://localhost/api/analyze-v1", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "strict" }),
      }),
    );
    const postBody = await responseJson(post);

    expect(get.status).toBe(400);
    expect(post.status).toBe(400);
    expect(get.body.error).toContain('Missing "word" query param');
    expect(postBody.error).toBe('Missing/invalid "word". Expected: { word: string }');
  });

  it("legacy /api/analyze delegates to the v1 GET semantic result", async () => {
    const v1 = await getAnalysis("study", { mode: "strict", alphabet: "auto" });
    const legacyResponse = await legacyGET(
      new Request(queryUrl("study", { mode: "strict", alphabet: "auto" })),
    );
    const legacyBody = await responseJson(legacyResponse);

    expect(legacyResponse.status).toBe(v1.status);
    expect(projectSemanticResponse(legacyBody)).toEqual(
      projectSemanticResponse(v1.body),
    );
  });
});
