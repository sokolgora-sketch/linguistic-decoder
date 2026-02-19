import { vectorDeltaSummaryV0_1 } from "@/shared/geometry/vectorDeltaSummary.v0.1";

test("VectorDelta (Geometry) v0.1 lock", () => {
  const cases = [
    { id: "O->A", path: ["O", "A"] as const },
    { id: "I->Ë", path: ["I", "Ë"] as const },
    { id: "E->Y", path: ["E", "Y"] as const },
    // “surfaces differ but geometry comparable” — hand-curated example placeholder:
    // mask-ish vs carrier-ish, both should be stable signatures.
    { id: "mask-ish", path: ["E", "A"] as const },
    { id: "carrier-ish", path: ["I", "Ë"] as const },
  ];

  const view = cases.map((c) => ({ ...c, out: vectorDeltaSummaryV0_1(c.path as any) }));
  expect(view).toMatchSnapshot();
});
