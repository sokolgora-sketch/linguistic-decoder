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
      "Clean archive, but wrong-bracket controls stayed intermediate."
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
    mainPairStats: {
      notes: "Journal-facing stats pending structured import from evidence pack."
    },
    controlPairStats: {
      notes: "Journal-facing stats pending structured import from evidence pack."
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
