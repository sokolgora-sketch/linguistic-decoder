import { matchSoundRootsV0_1 } from "@/shared/soundRoots/soundRoots.match.v0.1";

describe("soundRoots.match.v0.1", () => {
  test("shi → SR1", () => {
    expect(matchSoundRootsV0_1("shi")).toMatchSnapshot();
  });

  test("kuzhinë → SR2 (zhi...)", () => {
    expect(matchSoundRootsV0_1("kuzhinë")).toMatchSnapshot();
  });

  test("dru → SR9 (dr)", () => {
    expect(matchSoundRootsV0_1("dru")).toMatchSnapshot();
  });

  test("gurë → SR10 (gur)", () => {
    expect(matchSoundRootsV0_1("gurë")).toMatchSnapshot();
  });

  test("trokas → SR6 (trok)", () => {
    expect(matchSoundRootsV0_1("trokas")).toMatchSnapshot();
  });
});
