// landingBaselines.v0.1.ts
// Landing page uses committed numbers (no runtime parsing of baseline markdown).

export type BucketIdV0_1 = "V1" | "V2" | "V3" | "V4" | "V5" | "V6" | "V7";

export type LandingBucketPointV0_1 = {
  bucket: BucketIdV0_1;
  idx: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  n: number;
  aperturePrimary: number;
  aperturePresenceMean: number;
};

export type LandingSlopeStatsV0_1 = {
  pearson_r: number;
  p_perm: number;
  spearman_rho: number;
  p_perm_spearman: number;
  iters: number;
};

export type LandingBaselineV0_1 = {
  id: string;
  label: string;
  subtitle: string;
  nTotal: number;
  nPerBucket: number;
  points: LandingBucketPointV0_1[];
  slope?: {
    aperturePrimary?: LandingSlopeStatsV0_1;
    aperturePresenceMean?: LandingSlopeStatsV0_1;
  };
  notes?: string[];
};

export const LANDING_BASELINES_V0_1: {
  version: "landing.baselines.v0.1";
  turkish_step20: LandingBaselineV0_1;
  albanian_gegtosk_step10: LandingBaselineV0_1;
  pseudowords_step20: LandingBaselineV0_1;
} = {
  version: "landing.baselines.v0.1",

  turkish_step20: {
    id: "turkish.step20.v0.1",
    label: "🇹🇷 Turkish STEP20",
    subtitle: "Cross-linguistic validation (baseline-locked)",
    nTotal: 140,
    nPerBucket: 20,
    points: [
      { bucket: "V1", idx: 1, n: 20, aperturePrimary: 1.0, aperturePresenceMean: 0.955 },
      { bucket: "V2", idx: 2, n: 20, aperturePrimary: 0.8, aperturePresenceMean: 0.760 },
      { bucket: "V3", idx: 3, n: 20, aperturePrimary: 0.6, aperturePresenceMean: 0.587 },
      { bucket: "V4", idx: 4, n: 20, aperturePrimary: 1.0, aperturePresenceMean: 0.563 },
      { bucket: "V5", idx: 5, n: 20, aperturePrimary: 0.4, aperturePresenceMean: 0.400 },
      { bucket: "V6", idx: 6, n: 20, aperturePrimary: 0.3, aperturePresenceMean: 0.307 },
      { bucket: "V7", idx: 7, n: 20, aperturePrimary: 0.1, aperturePresenceMean: 0.125 },
    ],
    slope: {
      aperturePrimary: { pearson_r: -0.857, p_perm: 0.014, spearman_rho: -0.786, p_perm_spearman: 0.045, iters: 12000 },
      aperturePresenceMean: { pearson_r: -0.989, p_perm: 0.0, spearman_rho: -1.0, p_perm_spearman: 0.0, iters: 12000 },
    },
    notes: ["permutation iters: 12000", "seed(base): 90924101"],
  },

  // NOTE: Albanian slope numbers are not copied here yet (we’ll add once we extract the slope table).
  // We still show means + N (replication / cross-dialect).
  albanian_gegtosk_step10: {
    id: "albanian.gegTosk.step10.v0.3",
    label: "🇦🇱 Albanian STEP10",
    subtitle: "Gegë vs Tosk replication (baseline-locked)",
    nTotal: 140,
    nPerBucket: 20,
    points: [
      { bucket: "V1", idx: 1, n: 20, aperturePrimary: 1.0, aperturePresenceMean: 0.875 },
      { bucket: "V2", idx: 2, n: 20, aperturePrimary: 0.86, aperturePresenceMean: 0.735 },
      { bucket: "V3", idx: 3, n: 20, aperturePrimary: 0.6, aperturePresenceMean: 0.550 },
      { bucket: "V4", idx: 4, n: 20, aperturePrimary: 0.55, aperturePresenceMean: 0.530 },
      { bucket: "V5", idx: 5, n: 20, aperturePrimary: 0.4, aperturePresenceMean: 0.433 },
      { bucket: "V6", idx: 6, n: 20, aperturePrimary: 0.16, aperturePresenceMean: 0.345 },
      { bucket: "V7", idx: 7, n: 20, aperturePrimary: 0.12, aperturePresenceMean: 0.150 },
    ],
    notes: ["pairKeys: 70", "unpaired pairKeys: 0", "permutation iters: 12000", "seed(base): 90924101"],
  },

  pseudowords_step20: {
    id: "pseudowords.step20.v0.1",
    label: "🔬 Pseudowords (Control)",
    subtitle: "Negative control (no semantic intent)",
    nTotal: 140,
    nPerBucket: 20,
    points: [
      { bucket: "V1", idx: 1, n: 20, aperturePrimary: 0.530, aperturePresenceMean: 0.538 },
      { bucket: "V2", idx: 2, n: 20, aperturePrimary: 0.505, aperturePresenceMean: 0.522 },
      { bucket: "V3", idx: 3, n: 20, aperturePrimary: 0.550, aperturePresenceMean: 0.529 },
      { bucket: "V4", idx: 4, n: 20, aperturePrimary: 0.500, aperturePresenceMean: 0.520 },
      { bucket: "V5", idx: 5, n: 20, aperturePrimary: 0.560, aperturePresenceMean: 0.530 },
      { bucket: "V6", idx: 6, n: 20, aperturePrimary: 0.520, aperturePresenceMean: 0.524 },
      { bucket: "V7", idx: 7, n: 20, aperturePrimary: 0.510, aperturePresenceMean: 0.519 },
    ],
    slope: {
      aperturePrimary: { pearson_r: -0.067, p_perm: 0.884, spearman_rho: -0.036, p_perm_spearman: 0.961, iters: 12000 },
      aperturePresenceMean: { pearson_r: -0.590, p_perm: 0.158, spearman_rho: -0.536, p_perm_spearman: 0.227, iters: 12000 },
    },
    notes: ["purpose: negative control", "permutation iters: 12000", "seed(base): 90924101"],
  },
};
