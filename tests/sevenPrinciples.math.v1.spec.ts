import {
  mirrorIndex,
  ringOfIndex,
  pathCrossesCenter,
  pathCompletion,
  pathRingFlow,
  pathDrift,
  type Index1,
} from "@/shared/sevenPrinciples.math.v1";

describe("Seven Principles Math v1 (diagnostics)", () => {
  it("mirror symmetry is locked", () => {
    expect(mirrorIndex(1)).toBe(7);
    expect(mirrorIndex(7)).toBe(1);
    expect(mirrorIndex(2)).toBe(6);
    expect(mirrorIndex(6)).toBe(2);
    expect(mirrorIndex(3)).toBe(5);
    expect(mirrorIndex(5)).toBe(3);
    expect(mirrorIndex(4)).toBe(4);
  });

  it("ringOfIndex mapping is locked", () => {
    expect(ringOfIndex(4)).toBe(0);

    expect(ringOfIndex(3)).toBe(1);
    expect(ringOfIndex(5)).toBe(1);

    expect(ringOfIndex(2)).toBe(2);
    expect(ringOfIndex(6)).toBe(2);

    expect(ringOfIndex(1)).toBe(3);
    expect(ringOfIndex(7)).toBe(3);
  });

  it("pathCrossesCenter works", () => {
    expect(pathCrossesCenter([])).toBe(false);
    expect(pathCrossesCenter([1, 2, 3] as Index1[])).toBe(false);
    expect(pathCrossesCenter([1, 4, 7] as Index1[])).toBe(true);
  });

  it("completion detection works", () => {
    expect(pathCompletion([])).toEqual({ endsOnE: false, endsOnË: false });
    expect(pathCompletion([1, 2] as Index1[])).toEqual({ endsOnE: true, endsOnË: false });
    expect(pathCompletion([6, 7] as Index1[])).toEqual({ endsOnE: false, endsOnË: true });
  });

  it("ring flow is derived from indices", () => {
    expect(pathRingFlow([1, 4, 7] as Index1[])).toEqual([3, 0, 3]);
    expect(pathRingFlow([3, 2, 6, 5] as Index1[])).toEqual([1, 2, 2, 1]);
  });

  it("drift is descriptive only", () => {
    expect(pathDrift([]).kind).toBe("none");
    expect(pathDrift([4] as Index1[]).kind).toBe("none");

    const inc = pathDrift([1, 2, 3, 4] as Index1[]);
    expect(inc.kind).toBe("mostly_increasing");

    const dec = pathDrift([7, 6, 5, 4] as Index1[]);
    expect(dec.kind).toBe("mostly_decreasing");

    const flat = pathDrift([4, 4, 4] as Index1[]);
    expect(flat.kind).toBe("flat");
  });
});
