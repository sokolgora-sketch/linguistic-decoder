import {
  VOICES_V0_1,
  COLORS_BY_VOICE_V0_1,
  NOTES_BY_VOICE_V0_1,
  PRINCIPLES_SETS_V0_1,
  DEFAULT_PRINCIPLES_SET_KEY_V0_1,
  VOICE_DOCTRINE_V0_1,
} from "../../src/shared/doctrine/voiceDoctrine.v0.1";

function keysSorted(x: Record<string, unknown>): string[] {
  return Object.keys(x).slice().sort((a, b) => a.localeCompare(b));
}

test("voice doctrine v0.1 — snapshot lock", () => {
  expect(VOICE_DOCTRINE_V0_1).toMatchSnapshot();
});

test("voice doctrine v0.1 — invariants", () => {
  const voices = VOICES_V0_1.slice();

  // invariant: exactly 7, unique
  expect(voices.length).toBe(7);
  expect(new Set(voices).size).toBe(7);

  const voiceKeys = voices.slice().sort((a, b) => a.localeCompare(b));

  // invariant: mapping keys match voices exactly
  expect(keysSorted(COLORS_BY_VOICE_V0_1 as any)).toEqual(voiceKeys);
  expect(keysSorted(NOTES_BY_VOICE_V0_1 as any)).toEqual(voiceKeys);

  // invariant: principle sets cover all voices
  for (const [setKey, map] of Object.entries(PRINCIPLES_SETS_V0_1)) {
    expect(typeof setKey).toBe("string");
    expect(keysSorted(map as any)).toEqual(voiceKeys);
  }

  // invariant: default set exists
  expect(Object.prototype.hasOwnProperty.call(PRINCIPLES_SETS_V0_1, DEFAULT_PRINCIPLES_SET_KEY_V0_1)).toBe(true);
});
