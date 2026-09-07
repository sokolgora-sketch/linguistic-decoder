import {
  DOCTRINE_PROJECTION_PROVENANCE_V0_1,
  DOCTRINE_PROJECTION_SCHEMA_V0_1,
  projectSevenVoiceDoctrineV0_1,
} from "../src/shared/openInstrument/doctrineProjection.v0_1";

describe("Open Instrument deterministic doctrine projection v0.1", () => {
  test("projects all canonical voices in path order and preserves duplicates", () => {
    const result = projectSevenVoiceDoctrineV0_1([
      "A",
      "E",
      "I",
      "O",
      "U",
      "Y",
      "Ë",
      "E",
    ]);

    expect(result).toEqual({
      ok: true,
      schemaVersion: DOCTRINE_PROJECTION_SCHEMA_V0_1,
      inputPath: ["A", "E", "I", "O", "U", "Y", "Ë", "E"],
      projections: [
        {
          pathIndex: 0,
          voice: "A",
          doctrineRole: "Initiation/Source",
          symbolicMetadata: {
            symbolicMathIndex: 1,
            math7Value: 1,
            symbolicLevel: "high",
            symbolicRing: 3,
            symbolicColor: "red",
          },
        },
        {
          pathIndex: 1,
          voice: "E",
          doctrineRole: "Expansion/Bridge",
          symbolicMetadata: {
            symbolicMathIndex: 2,
            math7Value: 2,
            symbolicLevel: "high",
            symbolicRing: 2,
            symbolicColor: "orange",
          },
        },
        {
          pathIndex: 2,
          voice: "I",
          doctrineRole: "Direction/Focus",
          symbolicMetadata: {
            symbolicMathIndex: 3,
            math7Value: 3,
            symbolicLevel: "high",
            symbolicRing: 1,
            symbolicColor: "yellow",
          },
        },
        {
          pathIndex: 3,
          voice: "O",
          doctrineRole: "Mediation/Balance",
          symbolicMetadata: {
            symbolicMathIndex: 4,
            math7Value: 4,
            symbolicLevel: "mid",
            symbolicRing: 0,
            symbolicColor: "green",
          },
        },
        {
          pathIndex: 4,
          voice: "U",
          doctrineRole: "Containment/Depth",
          symbolicMetadata: {
            symbolicMathIndex: 5,
            math7Value: 5,
            symbolicLevel: "low",
            symbolicRing: 1,
            symbolicColor: "blue",
          },
        },
        {
          pathIndex: 5,
          voice: "Y",
          doctrineRole: "Reflection/Mirror",
          symbolicMetadata: {
            symbolicMathIndex: 6,
            math7Value: 6,
            symbolicLevel: "low",
            symbolicRing: 2,
            symbolicColor: "indigo",
          },
        },
        {
          pathIndex: 6,
          voice: "Ë",
          doctrineRole: "Completion/Unit",
          symbolicMetadata: {
            symbolicMathIndex: 7,
            math7Value: 7,
            symbolicLevel: "low",
            symbolicRing: 3,
            symbolicColor: "violet",
          },
        },
        {
          pathIndex: 7,
          voice: "E",
          doctrineRole: "Expansion/Bridge",
          symbolicMetadata: {
            symbolicMathIndex: 2,
            math7Value: 2,
            symbolicLevel: "high",
            symbolicRing: 2,
            symbolicColor: "orange",
          },
        },
      ],
      emptyPath: false,
      provenance: DOCTRINE_PROJECTION_PROVENANCE_V0_1,
    });

    expect(result.ok).toBe(true);
  });

  test("returns a deterministic explicit result for an empty path", () => {
    expect(projectSevenVoiceDoctrineV0_1([])).toEqual({
      ok: true,
      schemaVersion: DOCTRINE_PROJECTION_SCHEMA_V0_1,
      inputPath: [],
      projections: [],
      emptyPath: true,
      provenance: DOCTRINE_PROJECTION_PROVENANCE_V0_1,
    });
  });

  test.each([
    [null, "path_not_array"],
    [["a"], "unsupported_voice"],
    [["A", "V1"], "unsupported_voice"],
    [["A", 1], "malformed_path_entry"],
    [["A", null], "malformed_path_entry"],
  ])("fails closed for malformed or unsupported input %#", (path, reasonCode) => {
    expect(projectSevenVoiceDoctrineV0_1(path)).toMatchObject({
      ok: false,
      schemaVersion: DOCTRINE_PROJECTION_SCHEMA_V0_1,
      reasonCodes: [reasonCode],
    });
  });

  test("records the existing Seven-Voice and doctrine SSOT references", () => {
    expect(DOCTRINE_PROJECTION_PROVENANCE_V0_1).toEqual({
      orderedViewsSchema: "open-instrument.seven-voice-ordered-views.v0.1",
      voiceRegistry: "src/shared/sevenVoiceOrderedViews.v0.1.ts",
      doctrineRegistry: "src/shared/doctrine/voiceDoctrine.v0.1.ts",
      principleRegistry: "src/shared/sevenPrinciples.v1.ts",
    });
  });
});
