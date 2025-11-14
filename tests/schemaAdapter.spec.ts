
import { toMappingRecord } from "@/lib/schemaAdapter";
import type { Analysis } from "@/lib/solver/types";

test("toMappingRecord provides required fields", () => {
  const engine: Analysis = {
    word: "life",
    engineVersion: "2025-11-14-core-6",
    mode: "strict",
    alphabet: "albanian",
    primaryPath: {
      voicePath: ["I","E"],
      ringPath: [1,2],
      levelPath: [1,1],
      ops: [],
      checksums: { V: 1, E: 1, C: 1 },
      kept: 2,
    },
    frontierPaths: [],
    signals: []
  };
  const m = toMappingRecord(engine);
  expect(m.word).toBe("life");
  expect(m.voice_path).toEqual(["I","E"]);
  expect(m.ring_path).toEqual([1,2]);
  expect(m.level_path).toEqual([1,1]);
  expect(Array.isArray(m.ops)).toBe(true);
});
