jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import {
  AnalyzeWordResultV1ContractSchema,
  toAnalyzeWordResultV1Contract,
} from "@/shared/analyzeWordResult.v1.contract";

type AnalyzeBody = Record<string, any>;

async function analyze(word: string, suffix = ""): Promise<AnalyzeBody> {
  const route = await import("../app/api/analyze-v1/route");
  const response = await route.GET({
    url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict${suffix}`,
  } as any);

  expect(response.status).toBe(200);
  return response.json();
}

function expectDoctrineBoundaries(reading: AnalyzeBody) {
  expect(reading.schemaVersion).toBe("open-instrument.doctrine-reading.v1");
  expect(reading.compositionMode).toBe("ORDERED_ROLES_ONLY");
  expect(reading.pathComposition).toBe("NOT_AUTHORIZED");
  expect(reading.providerIndependent).toBe(true);
  expect(reading.externalEvidenceIndependent).toBe(true);
  expect(reading.candidateWinnerIndependent).toBe(true);
  expect(reading.userDecisionPosture).toBe("user_decides");
  expect(reading.noSingleWinner).toBe(true);
}

describe("/api/analyze-v1 doctrine reading runtime projection v1", () => {
  it("fails closed when pronunciation variants do not agree", async () => {
    const body = await analyze("a");

    expect(body.heartInstrumentV1.surfaceVowels).toEqual(["A"]);
    expect(body.heartInstrumentV1.canonicalSpokenVoicePath).toBeNull();
    expect(body.doctrineReading).toBeNull();
  });

  it("preserves the ordered multi-Voice surface path", async () => {
    const body = await analyze("study");
    const reading = body.doctrineReading as AnalyzeBody;

    expect(body.heartInstrumentV1.surfaceVowels).toEqual(["U", "Y"]);
    expect(reading.analyzedVoicePath).toEqual(["Ë", "I"]);
    expect(reading.entries.map((entry: AnalyzeBody) => [entry.pathIndex, entry.voice])).toEqual([
      [0, "Ë"],
      [1, "I"],
    ]);
    expect(reading.level3WholePathReading).toMatchObject({
      analyzedVoicePath: ["Ë", "I"],
      reading: "harmonious resolution with clear understanding",
      truthClassification: "inference",
      level: 3,
    });
    expectDoctrineBoundaries(reading);
  });

  it("projects the A to E proof reading independently of target-sense context", async () => {
    const withoutTargetSense = await analyze("water");
    const withTargetSense = await analyze(
      "water",
      "&targetSenseId=water.v1&targetSenseLabel=water",
    );
    const reading = withoutTargetSense.doctrineReading as AnalyzeBody;

    expect(withoutTargetSense.heartInstrumentV1.surfaceVowels).toEqual(["A", "E"]);
    expect(reading.analyzedVoicePath).toEqual(["O", "Ë"]);
    expect(reading.level3WholePathReading).toMatchObject({
      analyzedVoicePath: ["O", "Ë"],
      reading: "balanced mediation with harmonious resolution",
      truthClassification: "inference",
      level: 3,
    });
    expectDoctrineBoundaries(reading);
    expect(withoutTargetSense.doctrineReading).toEqual(withTargetSense.doctrineReading);
  });

  it("projects the E to A reversal without adding transition semantics", async () => {
    const body = await analyze("ea");
    const reading = body.doctrineReading as AnalyzeBody;

    expect(body.heartInstrumentV1.surfaceVowels).toEqual(["E", "A"]);
    expect(body.heartInstrumentV1.canonicalSpokenVoicePath).toBeNull();
    expect(body.doctrineReading).toBeNull();
  });

  it("preserves repeated surface Voice positions as distinct entries", async () => {
    const body = await analyze("banana");
    const reading = body.doctrineReading as AnalyzeBody;

    expect(body.heartInstrumentV1.surfaceVowels).toEqual(["A", "A", "A"]);
    expect(reading.analyzedVoicePath).toEqual(["Ë", "A", "Ë"]);
    expect(reading.level3WholePathReading).toBeUndefined();
    expect(reading.entries.map((entry: AnalyzeBody) => [entry.pathIndex, entry.voice])).toEqual([
      [0, "Ë"],
      [1, "A"],
      [2, "Ë"],
    ]);
  });

  it("keeps pronunciation Null distinct from a valid structural Null analysis", async () => {
    const body = await analyze("wind");
    const reading = body.doctrineReading as AnalyzeBody;

    expect(body.analysisStatusV0_1.status).toBe("null_no_supported_candidate");
    expect(body.heartInstrumentV1.surfaceVowels.length).toBeGreaterThan(0);
    expect(body.heartInstrumentV1.canonicalSpokenVoicePath).toBeNull();
    expect(reading).toBeNull();
    expect(body.candidates).toEqual([]);
  });

  it("keeps the U to Y proof reading independent of target-sense context", async () => {
    const withoutTargetSense = await analyze("study");
    const withTargetSense = await analyze(
      "study",
      "&targetSenseId=study.v1&targetSenseLabel=to%20study",
    );

    expect(withoutTargetSense.doctrineReading).toEqual(withTargetSense.doctrineReading);
  });

  it("keeps the additive field inside the strict public contract", async () => {
    const body = await analyze("study");
    const projected = toAnalyzeWordResultV1Contract(body);
    const parsed = AnalyzeWordResultV1ContractSchema.safeParse(projected);

    expect(parsed.success).toBe(true);
    expect(projected.doctrineReading).not.toBeNull();
  });

  it("returns null doctrine reading for the empty canonical surface path", async () => {
    const body = await analyze("bcd");

    expect(body.heartInstrumentV1.surfaceVowels).toEqual([]);
    expect(body.doctrineReading).toBeNull();
  });
});
