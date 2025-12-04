// src/engine/heartArchetypes.ts

export type HeartLevel = "low" | "mid" | "high";
export type HeartTension = "low" | "medium" | "high";

export interface HeartPathLike {
  voiceSequence: string[];     // e.g. ["U", "I"]
  ringPath: number[];          // e.g. [1, 1]
  levelPath: HeartLevel[];     // e.g. ["low", "high"]
  tensionLevel: HeartTension;  // "low" | "medium" | "high"
  frontierCount?: number;
}

export type HeartArchetypeId =
  | "grounded_ascent"
  | "tense_ascent"
  | "crown_to_crown"
  | "collapse"
  | "ground_loop"
  | "explosive_outward"
  | "neutral";

export interface HeartClassification {
  id: HeartArchetypeId;
  label: string;
  summary: string;
}

export function classifyHeart(path: HeartPathLike): HeartClassification {
  const startLevel = path.levelPath[0];
  const endLevel = path.levelPath[path.levelPath.length - 1];

  const startRing = path.ringPath[0];
  const endRing = path.ringPath[path.ringPath.length - 1];

  const tension = path.tensionLevel;

  const movingInward = endRing < startRing;
  const movingOutward = endRing > startRing;
  const innerOrMid = startRing <= 2 && endRing <= 2;

  // 1. Collapse / fall
  if (startLevel === "high" && endLevel === "low") {
    return {
      id: "collapse",
      label: "Collapse / fall",
      summary:
        "Dropping from high to low – burnout, loss, or forced return to ground."
    };
  }

  // 2. Explosive outward
  if (movingOutward && (tension === "medium" || tension === "high")) {
    return {
      id: "explosive_outward",
      label: "Explosive outward",
      summary:
        "Energy moving from the core to the outer rings – broadcast, overflow, or disruption."
    };
  }

  // 3. Grounded ascent (low → high, inner / mid, not high tension)
  if (
    startLevel === "low" &&
    endLevel === "high" &&
    innerOrMid &&
    tension !== "high"
  ) {
    return {
      id: "grounded_ascent",
      label: "Grounded ascent",
      summary:
        "Rising from ground to mind with low tension – stable learning or growth."
    };
  }

  // 4. Tense ascent (any low → high that didn't match the gentle case)
  if (startLevel === "low" && endLevel === "high") {
    return {
      id: "tense_ascent",
      label: "Tense ascent",
      summary:
        "Pushing upwards under pressure – effortful climb or stressful growth."
    };
  }

  // 5. Crown-to-crown (high → high)
  if (startLevel === "high" && endLevel === "high") {
    return {
      id: "crown_to_crown",
      label: "Crown-to-crown flow",
      summary:
        "Movement inside the high band – vision, law, doctrine, or high-level intent."
    };
  }

  // 6. Ground loop (low → low)
  if (startLevel === "low" && endLevel === "low") {
    return {
      id: "ground_loop",
      label: "Ground loop",
      summary:
        "Staying in the low band – maintenance, habit, survival, or repetition."
    };
  }

  // 7. Fallback: neutral / undefined
  return {
    id: "neutral",
    label: "Neutral loop",
    summary:
      "Neutral movement in the heart space – no strong ascent, fall, or explosion."
  };
}
