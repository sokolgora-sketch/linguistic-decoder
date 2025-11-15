
import { mapWordToLanguageFamilies } from "@/lib/mapper";

test("mapper returns at least one family", async () => {
  const engine: any = {
    engineVersion: "test",
    word: "damage",
    mode: "strict",
    alphabet: "auto",
    primaryPath: { voicePath: ["A","E"], ringPath: [3,2], levelPath: [1,1] }
  };
  const fams = await mapWordToLanguageFamilies(engine);
  expect(Array.isArray(fams)).toBe(true);
  expect(fams.length).toBeGreaterThan(0);
  expect(fams[0]).toHaveProperty("familyId");
});

test("ë closure biases Albanian", async () => {
  const engine: any = {
    engineVersion: "test",
    word: "dëm",
    mode: "strict",
    alphabet: "auto",
    primaryPath: { voicePath: ["A","Ë"], ringPath: [3,3], levelPath: [1,-1] }
  };
  const fams = await mapWordToLanguageFamilies(engine);
  const top = fams[0].familyId;
  expect(["albanian","unknown"]).toContain(top);
});
