export type TokenGeometryMarkerCountsV0_1 = {
  readonly i: number;
  readonly e: number;
  readonly ee: number;
  readonly ei: number;
  readonly ea: number;
  readonly ii: number;
};

export type TokenGeometryTokenSummaryV0_1 = {
  readonly token: string;
  readonly length: number;
  readonly finalChar: string;
  readonly finalShape: "open_final" | "closed_final";
  readonly targetVowelCount: number;
  readonly finalIsTargetVowel: boolean;
  readonly targetVowelPositions: readonly number[];
};

export type TokenGeometryBucketSummaryV0_1 = {
  readonly bucketId: string;
  readonly targetVowel: string;
  readonly tokens: readonly string[];
  readonly tokenSummaries: readonly TokenGeometryTokenSummaryV0_1[];
  readonly tokenCount: number;
  readonly uniqueTokenCount: number;
  readonly meanTokenLength: number;
  readonly minTokenLength: number;
  readonly maxTokenLength: number;
  readonly openFinalTokenCount: number;
  readonly closedFinalTokenCount: number;
  readonly maxConsonantCluster: number;
  readonly markerCounts: TokenGeometryMarkerCountsV0_1;
  readonly markerTokenCounts: TokenGeometryMarkerCountsV0_1;
  readonly longHighFrontMarkerCount: number;
  readonly shortIMarkerCount: number;
  readonly targetVowelCount: number;
  readonly targetVowelTokenCount: number;
  readonly finalTargetVowelTokenCount: number;
  readonly meanTargetVowelCount: number;
};

export type TokenGeometryComparisonV0_1 = {
  readonly label: string;
  readonly target: TokenGeometryBucketSummaryV0_1;
  readonly highAnchor: TokenGeometryBucketSummaryV0_1;
  readonly deltas: {
    readonly highAnchorMeanTokenLengthMinusTarget: number;
    readonly highAnchorLongHighFrontMarkersMinusTarget: number;
    readonly highAnchorShortIMarkersMinusTarget: number;
    readonly highAnchorTargetVowelCountMinusTarget: number;
    readonly highAnchorFinalTargetVowelTokenCountMinusTarget: number;
  };
  readonly flags: readonly string[];
};

export type TokenGeometryBucketComparisonV0_1 = {
  readonly label: string;
  readonly base: TokenGeometryBucketSummaryV0_1;
  readonly comparison: TokenGeometryBucketSummaryV0_1;
  readonly deltas: {
    readonly comparisonMeanTokenLengthMinusBase: number;
    readonly comparisonMinTokenLengthMinusBase: number;
    readonly comparisonMaxTokenLengthMinusBase: number;
    readonly comparisonOpenFinalTokenCountMinusBase: number;
    readonly comparisonClosedFinalTokenCountMinusBase: number;
    readonly comparisonMaxConsonantClusterMinusBase: number;
    readonly comparisonShortIMarkerCountMinusBase: number;
    readonly comparisonLongHighFrontMarkerCountMinusBase: number;
    readonly comparisonTargetVowelCountMinusBase: number;
    readonly comparisonFinalTargetVowelTokenCountMinusBase: number;
    readonly markerCounts: TokenGeometryMarkerCountsV0_1;
    readonly markerTokenCounts: TokenGeometryMarkerCountsV0_1;
  };
};

const VOWELS_V0_1 = new Set(["a", "e", "i", "o", "u", "y", "ë", "ı"]);

export function summarizeTokenGeometryBucketV0_1(args: {
  readonly bucketId: string;
  readonly tokens: readonly string[];
  readonly targetVowel?: string;
}): TokenGeometryBucketSummaryV0_1 {
  const targetVowel = normalizeTargetVowelV0_1(args.targetVowel ?? "i");
  const tokens = args.tokens.map(normalizeTokenV0_1).filter(Boolean);
  const lengths = tokens.map((token) => token.length);
  const markerCounts = countMarkersAcrossTokensV0_1(tokens);
  const markerTokenCounts = countMarkerTokensV0_1(tokens);
  const tokenSummaries = tokens.map((token) => summarizeTokenGeometryV0_1(token, targetVowel));

  const targetVowelCount = sumV0_1(
    tokenSummaries.map((summary) => summary.targetVowelCount),
  );

  return {
    bucketId: args.bucketId,
    targetVowel,
    tokens,
    tokenSummaries,
    tokenCount: tokens.length,
    uniqueTokenCount: new Set(tokens).size,
    meanTokenLength: round6V0_1(meanV0_1(lengths)),
    minTokenLength: lengths.length ? Math.min(...lengths) : 0,
    maxTokenLength: lengths.length ? Math.max(...lengths) : 0,
    openFinalTokenCount: tokenSummaries.filter(
      (summary) => summary.finalShape === "open_final",
    ).length,
    closedFinalTokenCount: tokenSummaries.filter(
      (summary) => summary.finalShape === "closed_final",
    ).length,
    maxConsonantCluster: tokens.reduce(
      (max, token) => Math.max(max, maxConsonantClusterV0_1(token)),
      0,
    ),
    markerCounts,
    markerTokenCounts,
    longHighFrontMarkerCount:
      markerCounts.ee + markerCounts.ei + markerCounts.ea + markerCounts.ii,
    shortIMarkerCount: markerCounts.i,
    targetVowelCount,
    targetVowelTokenCount: tokenSummaries.filter(
      (summary) => summary.targetVowelCount > 0,
    ).length,
    finalTargetVowelTokenCount: tokenSummaries.filter(
      (summary) => summary.finalIsTargetVowel,
    ).length,
    meanTargetVowelCount: round6V0_1(
      tokens.length === 0 ? 0 : targetVowelCount / tokens.length,
    ),
  };
}

export function compareTargetToHighAnchorTokenGeometryV0_1(args: {
  readonly label: string;
  readonly targetTokens: readonly string[];
  readonly highAnchorTokens: readonly string[];
  readonly targetVowel?: string;
}): TokenGeometryComparisonV0_1 {
  const targetVowel = args.targetVowel ?? "i";
  const target = summarizeTokenGeometryBucketV0_1({
    bucketId: `${args.label}:target`,
    tokens: args.targetTokens,
    targetVowel,
  });
  const highAnchor = summarizeTokenGeometryBucketV0_1({
    bucketId: `${args.label}:highAnchor`,
    tokens: args.highAnchorTokens,
    targetVowel,
  });

  const deltas = {
    highAnchorMeanTokenLengthMinusTarget: round6V0_1(
      highAnchor.meanTokenLength - target.meanTokenLength,
    ),
    highAnchorLongHighFrontMarkersMinusTarget:
      highAnchor.longHighFrontMarkerCount - target.longHighFrontMarkerCount,
    highAnchorShortIMarkersMinusTarget: highAnchor.shortIMarkerCount - target.shortIMarkerCount,
    highAnchorTargetVowelCountMinusTarget:
      highAnchor.targetVowelCount - target.targetVowelCount,
    highAnchorFinalTargetVowelTokenCountMinusTarget:
      highAnchor.finalTargetVowelTokenCount - target.finalTargetVowelTokenCount,
  };

  return {
    label: args.label,
    target,
    highAnchor,
    deltas,
    flags: inferComparisonFlagsV0_1({ target, highAnchor, deltas }),
  };
}

export function compareTokenGeometryBucketsV0_1(args: {
  readonly label: string;
  readonly baseBucketId: string;
  readonly baseTokens: readonly string[];
  readonly comparisonBucketId: string;
  readonly comparisonTokens: readonly string[];
  readonly targetVowel?: string;
}): TokenGeometryBucketComparisonV0_1 {
  const targetVowel = args.targetVowel ?? "i";
  const base = summarizeTokenGeometryBucketV0_1({
    bucketId: args.baseBucketId,
    tokens: args.baseTokens,
    targetVowel,
  });
  const comparison = summarizeTokenGeometryBucketV0_1({
    bucketId: args.comparisonBucketId,
    tokens: args.comparisonTokens,
    targetVowel,
  });

  return {
    label: args.label,
    base,
    comparison,
    deltas: {
      comparisonMeanTokenLengthMinusBase: round6V0_1(
        comparison.meanTokenLength - base.meanTokenLength,
      ),
      comparisonMinTokenLengthMinusBase: comparison.minTokenLength - base.minTokenLength,
      comparisonMaxTokenLengthMinusBase: comparison.maxTokenLength - base.maxTokenLength,
      comparisonOpenFinalTokenCountMinusBase:
        comparison.openFinalTokenCount - base.openFinalTokenCount,
      comparisonClosedFinalTokenCountMinusBase:
        comparison.closedFinalTokenCount - base.closedFinalTokenCount,
      comparisonMaxConsonantClusterMinusBase:
        comparison.maxConsonantCluster - base.maxConsonantCluster,
      comparisonShortIMarkerCountMinusBase:
        comparison.shortIMarkerCount - base.shortIMarkerCount,
      comparisonLongHighFrontMarkerCountMinusBase:
        comparison.longHighFrontMarkerCount - base.longHighFrontMarkerCount,
      comparisonTargetVowelCountMinusBase:
        comparison.targetVowelCount - base.targetVowelCount,
      comparisonFinalTargetVowelTokenCountMinusBase:
        comparison.finalTargetVowelTokenCount - base.finalTargetVowelTokenCount,
      markerCounts: subtractMarkerCountsV0_1(comparison.markerCounts, base.markerCounts),
      markerTokenCounts: subtractMarkerCountsV0_1(
        comparison.markerTokenCounts,
        base.markerTokenCounts,
      ),
    },
  };
}

function inferComparisonFlagsV0_1(args: {
  readonly target: TokenGeometryBucketSummaryV0_1;
  readonly highAnchor: TokenGeometryBucketSummaryV0_1;
  readonly deltas: TokenGeometryComparisonV0_1["deltas"];
}): string[] {
  const flags: string[] = [];

  if (args.deltas.highAnchorLongHighFrontMarkersMinusTarget > 0) {
    flags.push("HIGH_ANCHOR_HAS_MORE_LONG_HIGH_FRONT_MARKERS_THAN_TARGET");
  }

  if (args.deltas.highAnchorShortIMarkersMinusTarget < 0) {
    flags.push("HIGH_ANCHOR_HAS_FEWER_SHORT_I_MARKERS_THAN_TARGET");
  }

  if (args.deltas.highAnchorMeanTokenLengthMinusTarget >= 0.5) {
    flags.push("HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET");
  }

  if (args.highAnchor.markerTokenCounts.ee >= Math.ceil(args.highAnchor.tokenCount * 0.7)) {
    flags.push("HIGH_ANCHOR_DOMINATED_BY_EE_MARKER_TOKENS");
  }

  if (args.highAnchor.markerTokenCounts.i === args.highAnchor.tokenCount) {
    flags.push("HIGH_ANCHOR_ALL_TOKENS_HAVE_SHORT_I_MARKER");
  }

  if (args.target.finalTargetVowelTokenCount >= Math.ceil(args.target.tokenCount * 0.4)) {
    flags.push("TARGET_HAS_FINAL_TARGET_VOWEL_INFLATION");
  }

  if (args.target.meanTargetVowelCount >= 1.5) {
    flags.push("TARGET_HAS_HIGH_AVERAGE_TARGET_VOWEL_COUNT");
  }

  return flags;
}

function summarizeTokenGeometryV0_1(
  token: string,
  targetVowel: string,
): TokenGeometryTokenSummaryV0_1 {
  const letters = tokenLettersV0_1(token);
  const finalChar = letters.at(-1) ?? "";
  const targetVowelPositions: number[] = [];

  letters.forEach((letter, index) => {
    if (letter === targetVowel) {
      targetVowelPositions.push(index + 1);
    }
  });

  return {
    token,
    length: letters.length,
    finalChar,
    finalShape: endsWithVowelV0_1(token) ? "open_final" : "closed_final",
    targetVowelCount: targetVowelPositions.length,
    finalIsTargetVowel: finalChar === targetVowel,
    targetVowelPositions,
  };
}

function subtractMarkerCountsV0_1(
  comparison: TokenGeometryMarkerCountsV0_1,
  base: TokenGeometryMarkerCountsV0_1,
): TokenGeometryMarkerCountsV0_1 {
  return {
    i: comparison.i - base.i,
    e: comparison.e - base.e,
    ee: comparison.ee - base.ee,
    ei: comparison.ei - base.ei,
    ea: comparison.ea - base.ea,
    ii: comparison.ii - base.ii,
  };
}

function normalizeTargetVowelV0_1(targetVowel: string): string {
  const normalized = normalizeTokenV0_1(targetVowel).replace(/[^a-zëı]/g, "");
  return normalized.length === 1 ? normalized : "i";
}

function normalizeTokenV0_1(token: string): string {
  return token.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

function tokenLettersV0_1(token: string): readonly string[] {
  return [...token].filter((letter) => /[a-zëı]/i.test(letter));
}

function countMarkersAcrossTokensV0_1(tokens: readonly string[]): TokenGeometryMarkerCountsV0_1 {
  return {
    i: sumV0_1(tokens.map((token) => countCharV0_1(token, "i"))),
    e: sumV0_1(tokens.map((token) => countCharV0_1(token, "e"))),
    ee: sumV0_1(tokens.map((token) => countSubstringV0_1(token, "ee"))),
    ei: sumV0_1(tokens.map((token) => countSubstringV0_1(token, "ei"))),
    ea: sumV0_1(tokens.map((token) => countSubstringV0_1(token, "ea"))),
    ii: sumV0_1(tokens.map((token) => countSubstringV0_1(token, "ii"))),
  };
}

function countMarkerTokensV0_1(tokens: readonly string[]): TokenGeometryMarkerCountsV0_1 {
  return {
    i: tokens.filter((token) => token.includes("i")).length,
    e: tokens.filter((token) => token.includes("e")).length,
    ee: tokens.filter((token) => token.includes("ee")).length,
    ei: tokens.filter((token) => token.includes("ei")).length,
    ea: tokens.filter((token) => token.includes("ea")).length,
    ii: tokens.filter((token) => token.includes("ii")).length,
  };
}

function countCharV0_1(token: string, char: string): number {
  return [...token].filter((letter) => letter === char).length;
}

function countSubstringV0_1(token: string, substring: string): number {
  return token.split(substring).length - 1;
}

function endsWithVowelV0_1(token: string): boolean {
  const finalChar = tokenLettersV0_1(token).at(-1) ?? "";
  return VOWELS_V0_1.has(finalChar);
}

function maxConsonantClusterV0_1(token: string): number {
  let max = 0;
  let current = 0;

  for (const letter of tokenLettersV0_1(token)) {
    if (VOWELS_V0_1.has(letter)) {
      current = 0;
    } else {
      current += 1;
      max = Math.max(max, current);
    }
  }

  return max;
}

function sumV0_1(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function meanV0_1(values: readonly number[]): number {
  return values.length === 0 ? 0 : sumV0_1(values) / values.length;
}

function round6V0_1(value: number): number {
  return Number(value.toFixed(6));
}
