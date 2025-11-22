// src/engine/math7.ts
// Simple "Seven-Principles" math layer based on the existing analyzeWord result.
// Safe placeholder: does not change the core engine, only adds a secondary view.

export interface Math7Primary {
  cycleState: string;          // e.g. 'Open', 'Closed', 'Seed'
  totalMod7: number;           // length of path mod 7
  principlesPath: string[];    // mapped Seven Principles
}

export interface Math7Result {
  primary: Math7Primary;
}

// We keep this loose on purpose to avoid tight coupling with engineShape.ts
// and accidentally breaking the locked AnalyzeWordResult contract.
export function computeMath7ForResult(result: any): Math7Result {
  const voicePathStr: string = result?.primaryPath?.voicePath || "";

  // voicePath is like "O → E" or "U → I"
  const steps = voicePathStr
    .split("→")
    .map((s) => s.trim())
    .filter(Boolean);

  const totalMod7 = steps.length % 7;

  // Your Seven Principles in fixed order
  const SEVEN_PRINCIPLES = [
    "Truth",
    "Expansion",
    "Insight",
    "Balance",
    "Unity",
    "Network Integrity",
    "Evolution",
  ];

  // For now: map each step index onto a principle by position.
  const principlesPath = steps.map((_, idx) => {
    return SEVEN_PRINCIPLES[idx % SEVEN_PRINCIPLES.length];
  });

  const cycleState =
    totalMod7 === 0 ? "Closed" :
    totalMod7 === 1 ? "Seed" :
    "Open";

  return {
    primary: {
      cycleState,
      totalMod7,
      principlesPath,
    },
  };
}
