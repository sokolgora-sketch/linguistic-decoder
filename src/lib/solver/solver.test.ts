
import { solveMatrix } from "./index";
import type { SolveOptions } from "./index";

const strict: SolveOptions = { beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false, opCost:{sub:1,del:3,ins:2} };
const open: SolveOptions   = { beamWidth: 8, maxOps: 2, allowDelete: true,  allowClosure: true,  opCost:{sub:1,del:3,ins:2} };

const V = (p:any)=> p.checksums.find((c:any)=>c.type==="V").value;
const E = (p:any)=> p.checksums.find((c:any)=>c.type==="E").value;
const C = (p:any)=> p.checksums.find((c:any)=>c.type==="C").value;

test("mind (strict) → I", () => {
  const { primaryPath } = solveMatrix("mind", strict);
  expect(primaryPath.voicePath).toEqual(["I"]);
  expect(V(primaryPath)).toBe(5);
  expect(E(primaryPath)).toBe(0);
  expect(C(primaryPath)).toBe(0);
});

test("study (strict) → U→I (Y normalized to I)", () => {
  const { primaryPath } = solveMatrix("study", strict);
  expect(primaryPath.voicePath).toEqual(["U","I"]);
  expect(V(primaryPath)).toBe(55);
  // Y is normalized to I before solving, so there is no op. E=0.
  expect(E(primaryPath)).toBe(0);
  expect(C(primaryPath)).toBe(0);
});

test("damage (open) → A→E→Ë", () => {
  const { primaryPath } = solveMatrix("damage", open);
  expect(primaryPath.voicePath).toEqual(["A","E","Ë"]);
  expect(V(primaryPath)).toBe(102); // 2*3*17
  expect(E(primaryPath)).toBeGreaterThanOrEqual(2); // includes closure Ë
  expect(C(primaryPath)).toBe(0);
});
