import { SOUND_ROOTS_V0_1 } from "@/shared/soundRoots/soundRoots.lexicon.v0.1";

describe("soundRoots.lexicon.v0.1 — lock", () => {
  test("SOUND_ROOTS_V0_1 locked", () => {
    expect(SOUND_ROOTS_V0_1).toMatchSnapshot();
  });
});
