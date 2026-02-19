import {
  voiceToAxialV0_1,
  voiceRadiusV0_1,
  hexDistanceVoiceV0_1,
} from "@/shared/geometry/voiceCoordsHex.v0.1";

const VOICES = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;

test("voiceCoordsHex SSOT v0.1 lock (coords + radius + distance matrix)", () => {
  const coords = VOICES.map((v) => ({ v, radius: voiceRadiusV0_1(v), axial: voiceToAxialV0_1(v) }));

  const dist = VOICES.map((a) => ({
    a,
    row: VOICES.map((b) => hexDistanceVoiceV0_1(a, b)),
  }));

  expect({ coords, dist }).toMatchSnapshot();
});
