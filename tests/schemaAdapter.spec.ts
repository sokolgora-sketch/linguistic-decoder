
import { toMappingRecord } from "@/lib/schemaAdapter";

test("toMappingRecord provides required fields", () => {
  const engine: any = {
    word: "life",
    engineVersion: "2025-11-14-core-6",
    mode: "strict",
    alphabet: "albanian",
    primary: {
      voice_path: ["I","E"],
      ring_path: [1,2],
      level_path: [1,1],
      ops: []
    },
    signals: []
  };
  const m = toMappingRecord(engine);
  expect(m.word).toBe("life");
  expect(m.voice_path).toEqual(["I","E"]);
  expect(m.ring_path).toEqual([1,2]);
  expect(m.level_path).toEqual([1,1]);
  expect(Array.isArray(m.ops)).toBe(true);
});
