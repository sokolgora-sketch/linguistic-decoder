// src/shared/sClusterVision.v1.ts
//
// S-Cluster Vision DeepDive v1
// - Deterministic, conservative
// - Consonant-cluster only (prefix-based)
// - Dictionary-first, minimal heuristics

export type SCluster = "S" | "SH" | "ST" | "SK" | "SP" | "Z";

export type SClusterVision = "FLOW" | "CUT" | "PRESSURE" | "SPREAD" | "VIBRATION";

export type SClusterTag = {
  cluster: SCluster;
  vision: SClusterVision;
  notes?: string[];
};

function normalizeWord(w: string): string {
  return (w || "").toLowerCase().replace(/[^a-zëç]/g, "");
}

export function sClusterVisionForWord(word: string): SClusterTag | null {
  const w = normalizeWord(word);

  // Explicit dictionary (v1 lock)
  const dict: Record<string, SClusterTag> = {
    shkel: { cluster: "SH", vision: "CUT" },
    strukturë: { cluster: "ST", vision: "PRESSURE" },
    shpërndaj: { cluster: "SP", vision: "SPREAD" },
    zhurmë: { cluster: "Z", vision: "VIBRATION" },
  };

  if (dict[w]) return dict[w];

  // Minimal safe heuristics (prefix-only)
  if (w.startsWith("sh")) return { cluster: "SH", vision: "CUT" };
  if (w.startsWith("st")) return { cluster: "ST", vision: "PRESSURE" };
  if (w.startsWith("sk")) return { cluster: "SK", vision: "CUT" };
  if (w.startsWith("sp")) return { cluster: "SP", vision: "SPREAD" };
  if (w.startsWith("z")) return { cluster: "Z", vision: "VIBRATION" };
  if (w.startsWith("s")) return { cluster: "S", vision: "FLOW" };

  return null;
}
