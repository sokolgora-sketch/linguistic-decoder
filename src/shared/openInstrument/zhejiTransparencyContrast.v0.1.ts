import {
  isZhejiTransparencyLevelV0_1,
  type ZhejiTransparencyContrastV0_1,
  type ZhejiTransparencyLevelV0_1,
} from "./zhejiTransparencyTypes.v0.1";

export interface DetectTransparencyContrastCandidateV0_1 {
  language: string;
  nullCandidate?: boolean;
  semanticTransparency?: {
    level?: unknown;
  };
  candidateType?: unknown;
}

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values));
}

export function detectTransparencyContrastV0_1(
  candidates: readonly DetectTransparencyContrastCandidateV0_1[],
): ZhejiTransparencyContrastV0_1 {
  const matrix: Record<ZhejiTransparencyLevelV0_1, string[]> = {
    atomic: [],
    metaphorical: [],
    opaque: [],
  };

  for (const candidate of candidates) {
    if (candidate.nullCandidate === true) continue;

    const level = candidate.semanticTransparency?.level;
    if (!isZhejiTransparencyLevelV0_1(level)) continue;

    matrix[level].push(candidate.language);
  }

  const resultMatrix = {
    atomic: unique(matrix.atomic),
    metaphorical: unique(matrix.metaphorical),
    opaque: unique(matrix.opaque),
  };

  const nonEmptyBucketCount = [
    resultMatrix.atomic,
    resultMatrix.metaphorical,
    resultMatrix.opaque,
  ].filter((bucket) => bucket.length > 0).length;

  return {
    hasContrast: nonEmptyBucketCount >= 2,
    matrix: resultMatrix,
  };
}
