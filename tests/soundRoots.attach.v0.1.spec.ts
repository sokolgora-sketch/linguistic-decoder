import { attachSoundRootsV0_1 } from "@/shared/soundRoots/soundRoots.attach.v0.1";

describe("soundRoots.attach.v0.1", () => {
  test("attaches deepRoot.soundRoots.matches deterministically", () => {
    const r: any = { normalized: "trokas", deepRoot: {} };
    attachSoundRootsV0_1(r);
    expect(r.deepRoot.soundRoots).toBeTruthy();
    expect(r.deepRoot.soundRoots.matches).toBeTruthy();
    expect(r.deepRoot.soundRoots.matches.map((m: any) => [m.id, m.cluster, m.at])).toEqual([["SR6", "trok", 0]]);
  });
});
