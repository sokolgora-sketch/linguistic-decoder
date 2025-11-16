
import { solveWord } from "@/functions/sevenVoicesCore";
import type { SolveOptions, Vowel } from "@/functions/sevenVoicesCore";
import { CFG } from "./engineConfig";
import { checksumV } from '@/functions/sevenVoicesCore'


const strict: SolveOptions = { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsStrict, allowDelete: false, allowClosure: false, opCost: { sub: CFG.cost.sub, del: CFG.cost.del, insClosure: CFG.cost.insClosure } };
const open: SolveOptions   = { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsOpen,   allowDelete: true,  allowClosure: true,  opCost: { sub: CFG.cost.sub, del: CFG.cost.del, insClosure: CFG.cost.insClosure } };


const V = (p:any)=> p.checksums.V;
const E = (p:any)=> p.checksums.E;
const C = (p:any)=> p.checksums.C;

describe("checksumV", () => {
    test("UI → 55 (11*5)", () => {
      expect(checksumV(['U','I'] as any)).toBe(55);
    });
  
    test("AEË → 102 (2*3*17)", () => {
      expect(checksumV(['A','E','Ë'] as any)).toBe(102);
    });
  
    test("A A E E → 6 (dedup)", () => {
      expect(checksumV(['A','A','E','E'] as any)).toBe(6);
    });
});


test("mind (strict) → I", () => {
  const { primaryPath } = solveWord("mind", strict, "auto");
  expect(primaryPath.voicePath).toEqual(["I"]);
  expect(V(primaryPath)).toBe(5);
  expect(E(primaryPath)).toBe(0);
  expect(C(primaryPath)).toBe(0);
});

test("study (strict) → U→I (Y normalized to I)", () => {
  const { primaryPath } = solveWord("study", strict, "auto");
  expect(primaryPath.voicePath).toEqual(["U","I"]);
  expect(V(primaryPath)).toBe(55);
  expect(E(primaryPath)).toBe(0); // Y→I is a normalization, not an op
  expect(C(primaryPath)).toBe(2); // |1-1|=0, t is plosive [2,3] → penalty 2
});

test("damage (open) → A→I→Ë", () => {
  const { primaryPath } = solveWord("damage", open, "auto");
  expect(primaryPath.voicePath).toEqual(["A","I","Ë"]);
  expect(V(primaryPath)).toBe(170); // 2*5*17
  expect(E(primaryPath)).toBe(3); // A→E->I is 1 op, + closure-Ë
  expect(C(primaryPath)).toBe(0); // A(3)->I(1) |d|=2; I(1)->E(3) |d|=2
});

test('checksumV basics', () => {
  expect(checksumV(['U','I'] as any)).toBe(55);         // 11*5
  expect(checksumV(['A','E','Ë'] as any)).toBe(102);    // 2*3*17
  expect(checksumV(['A','A','E','E'] as any)).toBe(6);  // dedup
});
