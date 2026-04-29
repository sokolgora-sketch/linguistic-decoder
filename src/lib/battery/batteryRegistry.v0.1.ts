import type { BatteryBracketStatsV0_1 } from "@/lib/battery/batteryStats.v0.1";

export type BatterySection = "core" | "expansion" | "pressure";
export type ScientificStatus = "support" | "mixed" | "pressure";
export type Strength =
  | "weak"
  | "weak-moderate"
  | "moderate"
  | "strong"
  | "volatile"
  | "strong-pressure";

export type BracketId =
  | "V1-V3"
  | "V2-V3"
  | "V1-V4"
  | "V2-V4"
  | "V2-V5"
  | "V5-V7"
  | "V6-V7";

export type BatteryBracket = {
  bracketId: BracketId;
  low: string;
  high: string;
  note?: string;
};

export type BatteryCaseStats = {
  positionMean?: number;
  effectSize?: number;
  ci95?: [number, number];
  pValue?: number;
  notes?: string;
};

export type BatterySeriesRunPairStatsV0_1 = {
  bracketId: BracketId;
  main: BatteryBracketStatsV0_1;
  alt: BatteryBracketStatsV0_1;
};

export type BatteryFourRunSeriesStatsV0_1 = {
  source: "evidence-pack";
  seriesLabel: string;
  evidenceZipFilename: string;
  inspectedManifestPath?: string;
  intended: BatterySeriesRunPairStatsV0_1;
  control: BatterySeriesRunPairStatsV0_1;
  notes?: string;
};

export type BatteryCase = {
  caseId: string;
  displayName: string;
  languageHint: string;
  family: string;
  section: BatterySection;

  vowelUnderTest: string;
  intendedBracketId: BracketId;
  controlBracketId: BracketId;

  seriesLabel: string;
  evidenceZipFilename: string;

  structuralStatus: "clean";
  scientificStatus: ScientificStatus;
  strength: Strength;

  mainPairOutcome: string;
  controlPairOutcome: string;

  ordinalsConfirmed: [1, 2, 3, 4];
  shortInterpretation: string;

  mainPairStats?: BatteryCaseStats;
  controlPairStats?: BatteryCaseStats;
  seriesStats?: BatteryFourRunSeriesStatsV0_1;
};

export const BRACKETS: Record<BracketId, BatteryBracket> = {
  "V1-V3": {
    bracketId: "V1-V3",
    low: "V1",
    high: "V3",
    note: "Open-to-front-high stability interval"
  },
  "V2-V3": {
    bracketId: "V2-V3",
    low: "V2",
    high: "V3",
    note: "Mid-to-front-high control interval"
  },
  "V1-V4": {
    bracketId: "V1-V4",
    low: "V1",
    high: "V4",
    note: "Open-to-mid-center interval"
  },
  "V2-V4": {
    bracketId: "V2-V4",
    low: "V2",
    high: "V4",
    note: "Mid-to-center control interval"
  },
  "V2-V5": {
    bracketId: "V2-V5",
    low: "V2",
    high: "V5",
    note: "Rounded-front boundary family interval"
  },
  "V5-V7": {
    bracketId: "V5-V7",
    low: "V5",
    high: "V7",
    note: "Back/central control interval"
  },
  "V6-V7": {
    bracketId: "V6-V7",
    low: "V6",
    high: "V7",
    note: "Provisional Turkish ı intended interval"
  }
};

export const BATTERY_CASES: BatteryCase[] = [
  {
    caseId: "de-oe",
    displayName: "German ö",
    languageHint: "de",
    family: "front-rounded",
    section: "core",
    vowelUnderTest: "ö",
    intendedBracketId: "V2-V5",
    controlBracketId: "V1-V3",
    seriesLabel: "t5-de-oe-v2-v5-core-v0.2",
    evidenceZipFilename:
      "evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1.zip",
    structuralStatus: "clean",
    scientificStatus: "support",
    strength: "weak",
    mainPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    controlPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    ordinalsConfirmed: [1, 2, 3, 4],
    shortInterpretation:
      "Clean archive, but wrong-bracket controls stayed intermediate.",
    seriesStats: {
      source: "evidence-pack",
      seriesLabel: "t5-de-oe-v2-v5-core-v0.2",
      evidenceZipFilename:
        "evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1.zip",
      inspectedManifestPath: "docs/evals/inspected-battery-packs-v0.1.md",
      intended: {
        bracketId: "V2-V5",
        main: {
          source: "evidence-pack",
          seriesLabel: "t5-de-oe-v2-v5-core-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: 0.13500000000000034,
            pValue: 0,
            iters: 12000,
            seed: 85605032
          },
          effectSizes: {
            hedgesGLowX: 1.2995551896449504,
            hedgesGXHigh: 1.3790991837809656
          },
          bootstrap: {
            ci95GapLow: [0.08333333333333359, 0.18666666666666687],
            ci95GapHigh: [0.09833333333333305, 0.20999999999999952],
            ci95NormalizedPosition: [0.29774946495452204, 0.6384180790960461],
            iters: 12000,
            seed: 85605032
          },
          notes:
            "role:intended-main; source:runs/t5.de.oe.v2-v5.core.main.r01/report.json"
        },
        alt: {
          source: "evidence-pack",
          seriesLabel: "t5-de-oe-v2-v5-core-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: 0.09500000000000008,
            pValue: 0,
            iters: 12000,
            seed: 85605032
          },
          effectSizes: {
            hedgesGLowX: 1.4093058122409403,
            hedgesGXHigh: 4.182285217921306
          },
          bootstrap: {
            ci95GapLow: [0.06333333333333357, 0.12833333333333374],
            ci95GapHigh: [0.19999999999999968, 0.25333333333333297],
            ci95NormalizedPosition: [0.20689655172413862, 0.380000000000001],
            iters: 12000,
            seed: 85605032
          },
          notes:
            "role:intended-alt; source:runs/t5.de.oe.v2-v5.core.alt.r02/report.json"
        }
      },
      control: {
        bracketId: "V1-V3",
        main: {
          source: "evidence-pack",
          seriesLabel: "t5-de-oe-v2-v5-core-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: 0.2666666666666674,
            pValue: 0,
            iters: 12000,
            seed: 85605032
          },
          effectSizes: {
            hedgesGLowX: 2.357960820159967,
            hedgesGXHigh: 3.0171932124650485
          },
          bootstrap: {
            ci95GapLow: [0.21166666666666722, 0.3233333333333337],
            ci95GapHigh: [0.3149999999999999, 0.4416666666666663],
            ci95NormalizedPosition: [0.3350920029286223, 0.49580005555941425],
            iters: 12000,
            seed: 85605032
          },
          notes:
            "role:control-main; source:runs/t5.de.oe.v1-v3.core.ctrl.r03/report.json"
        },
        alt: {
          source: "evidence-pack",
          seriesLabel: "t5-de-oe-v2-v5-core-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: 0.11277777777777853,
            pValue: 0,
            iters: 12000,
            seed: 85605032
          },
          effectSizes: {
            hedgesGLowX: 1.6303220871775905,
            hedgesGXHigh: 4.349068466504851
          },
          bootstrap: {
            ci95GapLow: [0.07833333333333381, 0.1466666666666674],
            ci95GapHigh: [0.2794444444444444, 0.34999999999999976],
            ci95NormalizedPosition: [0.19236073332608147, 0.3325242718446611],
            iters: 12000,
            seed: 85605032
          },
          notes:
            "role:control-alt; source:runs/t5.de.oe.v1-v3.core.ctrl-alt.r04/report.json"
        }
      },
      notes:
        "Imported from inspected manifest. Fresh evidence confirms weak support: intended and control brackets both remained intermediate."
    }
  },
  {
    caseId: "da-oe",
    displayName: "Danish ø",
    languageHint: "da",
    family: "front-rounded",
    section: "core",
    vowelUnderTest: "ø",
    intendedBracketId: "V2-V5",
    controlBracketId: "V1-V3",
    seriesLabel: "t5-da-oe-v2-v5-core-v0.2",
    evidenceZipFilename:
      "evals.series-evidence-pack.t5-da-oe-v2-v5-core-v0.2.v0.1.zip",
    structuralStatus: "clean",
    scientificStatus: "support",
    strength: "moderate",
    mainPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    controlPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    ordinalsConfirmed: [1, 2, 3, 4],
    shortInterpretation:
      "Replicated low-edge tendency with modest separation."
  },
  {
    caseId: "fi-ae",
    displayName: "Finnish ä",
    languageHint: "fi",
    family: "open-front-ae",
    section: "core",
    vowelUnderTest: "ä",
    intendedBracketId: "V1-V3",
    controlBracketId: "V2-V3",
    seriesLabel: "t5-fi-ae-v1-v3-core-v0.2",
    evidenceZipFilename:
      "evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip",
    structuralStatus: "clean",
    scientificStatus: "support",
    strength: "strong",
    mainPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    controlPairOutcome: "EXCEEDS_LOW / EXCEEDS_LOW",
    ordinalsConfirmed: [1, 2, 3, 4],
    shortInterpretation:
      "Intended bracket stayed intermediate while controls exceeded low.",
    seriesStats: {
      source: "evidence-pack",
      seriesLabel: "t5-fi-ae-v1-v3-core-v0.2",
      evidenceZipFilename:
        "evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip",
      inspectedManifestPath: "docs/evals/inspected-battery-packs-v0.1.md",
      intended: {
        bracketId: "V1-V3",
        main: {
          source: "evidence-pack",
          seriesLabel: "t5-fi-ae-v1-v3-core-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: 0.03222222222222204,
            pValue: 0.05383333333333333,
            iters: 12000,
            seed: 85605032
          },
          effectSizes: {
            hedgesGLowX: 0.15786370458162743,
            hedgesGXHigh: 2.555873476619985
          },
          bootstrap: {
            ci95GapLow: [-0.06999999999999995, 0.13111111111111096],
            ci95GapHigh: [0.41500000000000037, 0.6122222222222224],
            ci95NormalizedPosition: [-0.14128318043643415, 0.22555698479845424],
            iters: 12000,
            seed: 85605032
          },
          notes:
            "role:intended-main; source:runs/t5.fi.ae.v1-v3.core.main.r01/report.json"
        },
        alt: {
          source: "evidence-pack",
          seriesLabel: "t5-fi-ae-v1-v3-core-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: 0.044444444444444176,
            pValue: 0.02225,
            iters: 12000,
            seed: 85605032
          },
          effectSizes: {
            hedgesGLowX: 0.2358221892385302,
            hedgesGXHigh: 2.452306194073692
          },
          bootstrap: {
            ci95GapLow: [-0.04833333333333345, 0.1372222222222217],
            ci95GapHigh: [0.3527638888888892, 0.531666666666667],
            ci95NormalizedPosition: [-0.11084128960841325, 0.2586216851158711],
            iters: 12000,
            seed: 85605032
          },
          notes:
            "role:intended-alt; source:runs/t5.fi.ae.v1-v3.core.alt.r02/report.json"
        }
      },
      control: {
        bracketId: "V2-V3",
        main: {
          source: "evidence-pack",
          seriesLabel: "t5-fi-ae-v1-v3-core-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: -0.13166666666666693,
            pValue: 0.9251666666666667,
            iters: 12000,
            seed: 85605032
          },
          effectSizes: {
            hedgesGLowX: -0.7168234910674489,
            hedgesGXHigh: 2.555873476619985
          },
          bootstrap: {
            ci95GapLow: [-0.22277777777777807, -0.04166666666666696],
            ci95GapHigh: [0.41500000000000037, 0.6122222222222224],
            ci95NormalizedPosition: [-0.6582400418069919, -0.1005741189322699],
            iters: 12000,
            seed: 85605032
          },
          notes:
            "role:control-main; source:runs/t5.fi.ae.v2-v3.core.ctrl.r03/report.json"
        },
        alt: {
          source: "evidence-pack",
          seriesLabel: "t5-fi-ae-v1-v3-core-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: -0.05777777777777826,
            pValue: 0.6138333333333333,
            iters: 12000,
            seed: 85605032
          },
          effectSizes: {
            hedgesGLowX: -0.34312025976015914,
            hedgesGXHigh: 2.4047766805732387
          },
          bootstrap: {
            ci95GapLow: [-0.14166666666666672, 0.024444444444444158],
            ci95GapHigh: [0.3538888888888891, 0.532777777777778],
            ci95NormalizedPosition: [-0.4226173776319394, 0.05906610605618381],
            iters: 12000,
            seed: 85605032
          },
          notes:
            "role:control-alt; source:runs/t5.fi.ae.v2-v3.core.ctrl-alt.r04/report.json"
        }
      },
      notes:
        "Imported from inspected manifest. The inspected local ZIP had duplicate-export suffix '(1)', while registry keeps the canonical evidence filename."
    }
  },
  {
    caseId: "pt-aa",
    displayName: "Portuguese â",
    languageHint: "pt",
    family: "marked-quality-circumflex",
    section: "core",
    vowelUnderTest: "â",
    intendedBracketId: "V1-V4",
    controlBracketId: "V2-V4",
    seriesLabel: "t5-pt-aa-v1-v4-core-v0.2",
    evidenceZipFilename:
      "evals.series-evidence-pack.t5-pt-aa-v1-v4-core-v0.2.v0.1.zip",
    structuralStatus: "clean",
    scientificStatus: "mixed",
    strength: "volatile",
    mainPairOutcome: "COLLAPSED_HIGH / INTERMEDIATE",
    controlPairOutcome: "COLLAPSED_HIGH / EXCEEDS_LOW",
    ordinalsConfirmed: [1, 2, 3, 4],
    shortInterpretation: "Structurally clean, scientifically unstable."
  },
  {
    caseId: "sv-oe",
    displayName: "Swedish ö",
    languageHint: "sv",
    family: "front-rounded",
    section: "expansion",
    vowelUnderTest: "ö",
    intendedBracketId: "V2-V5",
    controlBracketId: "V1-V3",
    seriesLabel: "t5-sv-oe-v2-v5-exp-v0.2",
    evidenceZipFilename:
      "evals.series-evidence-pack.t5-sv-oe-v2-v5-exp-v0.2.v0.1.zip",
    structuralStatus: "clean",
    scientificStatus: "support",
    strength: "weak-moderate",
    mainPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    controlPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    ordinalsConfirmed: [1, 2, 3, 4],
    shortInterpretation: "Usable but limited discrimination."
  },
  {
    caseId: "no-oe",
    displayName: "Norwegian ø",
    languageHint: "no",
    family: "front-rounded",
    section: "expansion",
    vowelUnderTest: "ø",
    intendedBracketId: "V2-V5",
    controlBracketId: "V1-V3",
    seriesLabel: "t5-no-oe-v2-v5-exp-v0.2",
    evidenceZipFilename:
      "evals.series-evidence-pack.t5-no-oe-v2-v5-exp-v0.2.v0.1.zip",
    structuralStatus: "clean",
    scientificStatus: "support",
    strength: "moderate",
    mainPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    controlPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    ordinalsConfirmed: [1, 2, 3, 4],
    shortInterpretation: "Replicated low-edge intermediate behavior."
  },
  {
    caseId: "fr-euoe",
    displayName: "French /ø~œ/",
    languageHint: "fr",
    family: "front-rounded-boundary",
    section: "expansion",
    vowelUnderTest: "eu/œ",
    intendedBracketId: "V2-V5",
    controlBracketId: "V1-V3",
    seriesLabel: "t5-fr-euoe-v2-v5-exp-v0.2",
    evidenceZipFilename:
      "evals.series-evidence-pack.t5-fr-euoe-v2-v5-exp-v0.2.v0.1.zip",
    structuralStatus: "clean",
    scientificStatus: "support",
    strength: "strong",
    mainPairOutcome: "COLLAPSED_HIGH / COLLAPSED_HIGH",
    controlPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    ordinalsConfirmed: [1, 2, 3, 4],
    shortInterpretation: "Strong high-boundary discrimination.",
    mainPairStats: {
      notes: "Journal-facing stats pending structured import from evidence pack."
    },
    controlPairStats: {
      notes: "Journal-facing stats pending structured import from evidence pack."
    }
  },
  {
    caseId: "tr-ii",
    displayName: "Turkish ı",
    languageHint: "tr",
    family: "central-back-unrounded-tension",
    section: "pressure",
    vowelUnderTest: "ı",
    intendedBracketId: "V6-V7",
    controlBracketId: "V5-V7",
    seriesLabel: "t5-tr-ii-v6-v7-core-v0.2",
    evidenceZipFilename:
      "evals.series-evidence-pack.t5-tr-ii-v6-v7-core-v0.2.v0.1.zip",
    structuralStatus: "clean",
    scientificStatus: "pressure",
    strength: "strong-pressure",
    mainPairOutcome: "EXCEEDS_LOW / EXCEEDS_LOW",
    controlPairOutcome: "COLLAPSED_HIGH / COLLAPSED_HIGH",
    ordinalsConfirmed: [1, 2, 3, 4],
    shortInterpretation:
      "Clearest pressure case; current V6-V7 placement challenged.",
    mainPairStats: {
      notes: "Journal-facing stats pending structured import from evidence pack."
    },
    controlPairStats: {
      notes: "Journal-facing stats pending structured import from evidence pack."
    }
  },
  {
    caseId: "et-ae",
    displayName: "Estonian ä",
    languageHint: "et",
    family: "open-front-ae",
    section: "expansion",
    vowelUnderTest: "ä",
    intendedBracketId: "V1-V3",
    controlBracketId: "V2-V3",
    seriesLabel: "t5-et-ae-v1-v3-exp-v0.2",
    evidenceZipFilename:
      "evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip",
    structuralStatus: "clean",
    scientificStatus: "support",
    strength: "strong",
    mainPairOutcome: "INTERMEDIATE / INTERMEDIATE",
    controlPairOutcome: "EXCEEDS_LOW / EXCEEDS_LOW",
    ordinalsConfirmed: [1, 2, 3, 4],
    shortInterpretation: "Good partner case to Finnish ä.",
    seriesStats: {
      source: "evidence-pack",
      seriesLabel: "t5-et-ae-v1-v3-exp-v0.2",
      evidenceZipFilename:
        "evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip",
      inspectedManifestPath: "docs/evals/inspected-battery-packs-v0.1.md",
      intended: {
        bracketId: "V1-V3",
        main: {
          source: "evidence-pack",
          seriesLabel: "t5-et-ae-v1-v3-exp-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: null,
            pValue: 0.0025833333333333333,
            iters: null,
            seed: null
          },
          effectSizes: {
            hedgesGLowX: 0.5545588905459405,
            hedgesGXHigh: 3.3788729357208416
          },
          bootstrap: {
            ci95GapLow: null,
            ci95GapHigh: null,
            ci95NormalizedPosition: [0.01687618549916784, 0.25953006089362474],
            iters: null,
            seed: null
          },
          notes:
            "role:intended-main; source:runs/t5.et.ae.v1-v3.exp.main.r01/report.json"
        },
        alt: {
          source: "evidence-pack",
          seriesLabel: "t5-et-ae-v1-v3-exp-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: null,
            pValue: 0.05316666666666667,
            iters: null,
            seed: null
          },
          effectSizes: {
            hedgesGLowX: 0.18585610045242854,
            hedgesGXHigh: 3.228770024675538
          },
          bootstrap: {
            ci95GapLow: null,
            ci95GapHigh: null,
            ci95NormalizedPosition: [-0.10315486549358109, 0.1923810142806043],
            iters: null,
            seed: null
          },
          notes:
            "role:intended-alt; source:runs/t5.et.ae.v1-v3.exp.alt.r02/report.json"
        }
      },
      control: {
        bracketId: "V2-V3",
        main: {
          source: "evidence-pack",
          seriesLabel: "t5-et-ae-v1-v3-exp-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: null,
            pValue: 0.9974166666666666,
            iters: null,
            seed: null
          },
          effectSizes: {
            hedgesGLowX: -1.2548084847778591,
            hedgesGXHigh: 3.3788729357208416
          },
          bootstrap: {
            ci95GapLow: null,
            ci95GapHigh: null,
            ci95NormalizedPosition: [-0.9694656488549633, -0.3360955329356846],
            iters: null,
            seed: null
          },
          notes:
            "role:control-main; source:runs/t5.et.ae.v2-v3.exp.ctrl.r03/report.json"
        },
        alt: {
          source: "evidence-pack",
          seriesLabel: "t5-et-ae-v1-v3-exp-v0.2",
          evidenceZipFilename:
            "evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip",
          marginPermutation: {
            observedMinGap: null,
            pValue: 0.99975,
            iters: null,
            seed: null
          },
          effectSizes: {
            hedgesGLowX: -1.5256813128871087,
            hedgesGXHigh: 3.228770024675538
          },
          bootstrap: {
            ci95GapLow: null,
            ci95GapHigh: null,
            ci95NormalizedPosition: [-1.3543749569648162, -0.49355045311160994],
            iters: null,
            seed: null
          },
          notes:
            "role:control-alt; source:runs/t5.et.ae.v2-v3.exp.ctrl-alt.r04/report.json"
        }
      },
      notes:
        "Imported from inspected manifest. The inspected local ZIP had duplicate-export suffix '(1)', while registry keeps the canonical evidence filename."
    }
  }
];

export const BATTERY_CASES_BY_ID = Object.fromEntries(
  BATTERY_CASES.map((batteryCase) => [batteryCase.caseId, batteryCase])
) as Record<string, BatteryCase>;

export const BATTERY_CASES_BY_SERIES_LABEL = Object.fromEntries(
  BATTERY_CASES.map((batteryCase) => [batteryCase.seriesLabel, batteryCase])
) as Record<string, BatteryCase>;
