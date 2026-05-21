export type TokenGeometryMarkerCountsV0_1 = {
  readonly i: number;
  readonly e: number;
  readonly ee: number;
  readonly ei: number;
  readonly ea: number;
  readonly ii: number;
};

export type TokenGeometryBucketSummaryV0_1 = {
  readonly bucketId: string;
  readonly tokens: readonly string[];
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
};

export type TokenGeometryComparisonV0_1 = {
  readonly label: string;
  readonly target: TokenGeometryBucketSummaryV0_1;
  readonly highAnchor: TokenGeometryBucketSummaryV0_1;
  readonly deltas: {
    readonly highAnchorMeanTokenLengthMinusTarget: number;
    readonly highAnchorLongHighFrontMarkersMinusTarget: number;
    readonly highAnchorShortIMarkersMinusTarget: number;
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
    readonly markerCounts: TokenGeometryMarkerCountsV0_1;
    readonly markerTokenCounts: TokenGeometryMarkerCountsV0_1;
  };
};

const VOWELS_V0_1 = new Set(["a", "e", "i", "o", "u", "y", "ë", "ı"]);

export function summarizeTokenGeometryBucketV0_1(args: {
  readonly bucketId: string;
  readonly tokens: readonly string[];
}): TokenGeometryBucketSummaryV0_1 {
  const tokens = args.tokens.map(normalizeTokenV0_1).filter(Boolean);
  const lengths = tokens.map((token) => token.length);
  const markerCounts = countMarkersAcrossTokensV0_1(tokens);
  const markerTokenCounts = countMarkerTokensV0_1(tokens);

  return {
    bucketId: args.bucketId,
    tokens,
    tokenCount: tokens.length,
    uniqueTokenCount: new Set(tokens).size,
    meanTokenLength: round6V0_1(meanV0_1(lengths)),
    minTokenLength: lengths.length ? Math.min(...lengths) : 0,
    maxTokenLength: lengths.length ? Math.max(...lengths) : 0,
    openFinalTokenCount: tokens.filter(endsWithVowelV0_1).length,
    closedFinalTokenCount: tokens.filter((token) => !endsWithVowelV0_1(token)).length,
    maxConsonantCluster: tokens.reduce(
      (max, token) => Math.max(max, maxConsonantClusterV0_1(token)),
      0,
    ),
    markerCounts,
    markerTokenCounts,
    longHighFrontMarkerCount:
      markerCounts.ee + markerCounts.ei + markerCounts.ea + markerCounts.ii,
    shortIMarkerCount: markerCounts.i,
  };
}

export function compareTargetToHighAnchorTokenGeometryV0_1(args: {
  readonly label: string;
  readonly targetTokens: readonly string[];
  readonly highAnchorTokens: readonly string[];
}): TokenGeometryComparisonV0_1 {
  const target = summarizeTokenGeometryBucketV0_1({
    bucketId: `${args.label}:target`,
    tokens: args.targetTokens,
  });
  const highAnchor = summarizeTokenGeometryBucketV0_1({
    bucketId: `${args.label}:highAnchor`,
    tokens: args.highAnchorTokens,
  });

  const deltas = {
    highAnchorMeanTokenLengthMinusTarget: round6V0_1(
      highAnchor.meanTokenLength - target.meanTokenLength,
    ),
    highAnchorLongHighFrontMarkersMinusTarget:
      highAnchor.longHighFrontMarkerCount - target.longHighFrontMarkerCount,
    highAnchorShortIMarkersMinusTarget: highAnchor.shortIMarkerCount - target.shortIMarkerCount,
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
}): TokenGeometryBucketComparisonV0_1 {
  const base = summarizeTokenGeometryBucketV0_1({
    bucketId: args.baseBucketId,
    tokens: args.baseTokens,
  });
  const comparison = summarizeTokenGeometryBucketV0_1({
    bucketId: args.comparisonBucketId,
    tokens: args.comparisonTokens,
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

  return flags;
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

function normalizeTokenV0_1(token: string): string {
  return token.trim().toLowerCase();
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
  return [...token].filter((item) => item === char).length;
}

function countSubstringV0_1(token: string, marker: string): number {
  return token.match(new RegExp(marker, "g"))?.length ?? 0;
}

function endsWithVowelV0_1(token: string): boolean {
  const last = [...token].at(-1);
  return Boolean(last && VOWELS_V0_1.has(last));
}

function maxConsonantClusterV0_1(token: string): number {
  let current = 0;
  let max = 0;

  for (const char of token) {
    if (VOWELS_V0_1.has(char)) {
      current = 0;
      continue;
    }

    current += 1;
    max = Math.max(max, current);
  }

  return max;
}

function meanV0_1(values: readonly number[]): number {
  return values.length ? sumV0_1(values) / values.length : 0;
}

function sumV0_1(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function round6V0_1(value: number): number {
  return Number(value.toFixed(6));
}
