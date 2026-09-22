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

async function analyze(word: string): Promise<AnalyzeBody> {
  const route = await import("../app/api/analyze-v1/route");
  const response = await route.GET({
    url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
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
  it("projects a single canonical surface Voice without candidate selection", async () => {
    const body = await analyze("a");
    const reading = body.doctrineReading as AnalyzeBody;

    expect(body.heartInstrumentV1.surfaceVowels).toEqual(["A"]);
    expect(reading.analyzedVoicePath).toEqual(["A"]);
    expect(reading.entries).toEqual([
      expect.objectContaining({ pathIndex: 0, voice: "A" }),
    ]);
    expectDoctrineBoundaries(reading);
  });

  it("preserves the ordered multi-Voice surface path", async () => {
    const body = await analyze("study");
    const reading = body.doctrineReading as AnalyzeBody;

    expect(body.heartInstrumentV1.surfaceVowels).toEqual(["U", "Y"]);
    expect(reading.analyzedVoicePath).toEqual(["U", "Y"]);
    expect(reading.entries.map((entry: AnalyzeBody) => [entry.pathIndex, entry.voice])).toEqual([
      [0, "U"],
      [1, "Y"],
    ]);
    expectDoctrineBoundaries(reading);
  });

  it("preserves repeated surface Voice positions as distinct entries", async () => {
    const body = await analyze("banana");
    const reading = body.doctrineReading as AnalyzeBody;

    expect(body.heartInstrumentV1.surfaceVowels).toEqual(["A", "A", "A"]);
    expect(reading.analyzedVoicePath).toEqual(["A", "A", "A"]);
    expect(reading.entries.map((entry: AnalyzeBody) => [entry.pathIndex, entry.voice])).toEqual([
      [0, "A"],
      [1, "A"],
      [2, "A"],
    ]);
  });

  it("keeps doctrine reading present beside a valid Null analysis", async () => {
    const body = await analyze("wind");
    const reading = body.doctrineReading as AnalyzeBody;

    expect(body.analysisStatusV0_1.status).toBe("null_no_supported_candidate");
    expect(body.heartInstrumentV1.surfaceVowels.length).toBeGreaterThan(0);
    expect(reading).not.toBeNull();
    expect(body.candidates).toEqual([]);
    expectDoctrineBoundaries(reading);
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
