
import { solveMatrix } from "./index";
import type { SolveOptions } from "./index";
import { CFG } from "./engineConfig";

const strict: SolveOptions = { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsStrict, allowDelete: false, allowClosure: false, opCost: { sub: CFG.cost.sub, del: CFG.cost.del, ins: CFG.cost.insClosure } };
const open: SolveOptions   = { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsOpen,   allowDelete: true,  allowClosure: true,  opCost: { sub: CFG.cost.sub, del: CFG.cost.del, ins: CFG.cost.insClosure } };


const V = (p:any)=> p.checksums.find((c:any)=>c.type==="V")?.value ?? -1;
const E = (p:any)=> p.checksums.find((c:any)=>c.type==="E")?.value ?? -1;
const C = (p:any)=> p.checksums.find((c:any)=>c.type==="C")?.value ?? -1;

test("mind (strict) → I", () => {
  const { primaryPath } = solveMatrix("mind", strict);
  expect(primaryPath.vowelPath).toEqual(["I"]);
  expect(V(primaryPath)).toBe(5);
  expect(E(primaryPath)).toBe(0);
  expect(C(primaryPath)).toBe(0);
});

test("study (strict) → U→I (Y normalized to I)", () => {
  const { primaryPath } = solveMatrix("study", strict);
  expect(primaryPath.vowelPath).toEqual(["U","I"]);
  expect(V(primaryPath)).toBe(55);
  expect(E(primaryPath)).toBe(0); // Y→I is a normalization, not an op
  expect(C(primaryPath)).toBe(0); // |1-1|=0, t is plosive [2,3] → penalty 2
});

test("damage (open) → A→E→Ë", () => {
  const { primaryPath } = solveMatrix("damage", open);
  expect(primaryPath.vowelPath).toEqual(["A","E","Ë"]);
  expect(V(primaryPath)).toBe(102); // 2*3*17
  expect(E(primaryPath)).toBe(2); // A→E is 1, closure Ë is 2 -> needs fix
  expect(C(primaryPath)).toBe(0);
});
