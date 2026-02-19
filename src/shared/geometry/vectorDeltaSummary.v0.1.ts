import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";
import { hexDistanceVoiceV0_1, voiceRadiusV0_1 } from "./voiceCoordsHex.v0.1";

export type TurnKindV0_1 = "inward" | "outward" | "circular";

export type VectorDeltaStepV0_1 = {
  from: VowelVoice;
  to: VowelVoice;
  dist: number;
  radialFrom: 0 | 1 | 2 | 3;
  radialTo: 0 | 1 | 2 | 3;
  radialDelta: number; // to - from
  turnKind: TurnKindV0_1;
};

export type VectorDeltaSummaryV0_1 = {
  path: VowelVoice[];
  steps: VectorDeltaStepV0_1[];
  totals: {
    totalDist: number;
    netRadial: number;
    inwardCount: number;
    outwardCount: number;
    circularCount: number;
  };
  signature: string; // stable human/debug string
};

function kindFromRadialDelta(d: number): TurnKindV0_1 {
  if (d > 0) return "outward";
  if (d < 0) return "inward";
  return "circular";
}

export function vectorDeltaSummaryV0_1(path: VowelVoice[]): VectorDeltaSummaryV0_1 {
  const p = Array.isArray(path) ? path.slice() : [];
  const steps: VectorDeltaStepV0_1[] = [];

  let totalDist = 0;
  let netRadial = 0;
  let inwardCount = 0;
  let outwardCount = 0;
  let circularCount = 0;

  for (let i = 0; i < p.length - 1; i++) {
    const from = p[i];
    const to = p[i + 1];

    const radialFrom = voiceRadiusV0_1(from);
    const radialTo = voiceRadiusV0_1(to);
    const radialDelta = radialTo - radialFrom;

    const dist = hexDistanceVoiceV0_1(from, to);
    const turnKind = kindFromRadialDelta(radialDelta);

    if (turnKind === "inward") inwardCount++;
    else if (turnKind === "outward") outwardCount++;
    else circularCount++;

    totalDist += dist;
    netRadial += radialDelta;

    steps.push({
      from,
      to,
      dist,
      radialFrom,
      radialTo,
      radialDelta,
      turnKind,
    });
  }

  const signature =
    steps.length === 0
      ? "∅"
      : steps
          .map((s) => `${s.from}→${s.to}:d${s.dist},r${s.radialDelta >= 0 ? "+" : ""}${s.radialDelta},${s.turnKind}`)
          .join(" | ");

  return {
    path: p,
    steps,
    totals: {
      totalDist,
      netRadial,
      inwardCount,
      outwardCount,
      circularCount,
    },
    signature,
  };
}
