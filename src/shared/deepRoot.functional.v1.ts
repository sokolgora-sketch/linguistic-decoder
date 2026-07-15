import {
  resolveLegacyFunctionalRootCompatibilityV0_1,
  type FunctionalRootHypothesisV1,
} from "./legacyFunctionalRootCompatibilityRegistry.v0_1";

export type {
  FunctionalRootHypothesisV1,
} from "./legacyFunctionalRootCompatibilityRegistry.v0_1";

/**
 * DeepRoot Functional Roots v1
 *
 * Compatibility boundary:
 * - Existing v1 study, damage, and father outputs remain stable.
 * - Whole-word records are owned by an explicit compatibility registry.
 * - This resolver does not authorize new words or reviewed evidence.
 * - No winner or historical-origin claim is created here.
 */
export function extractFunctionalRootsV1(params: {
  basis: {
    word: string;
    normalizedWord: string;
  };
}): FunctionalRootHypothesisV1[] {
  const normalizedWord = String(
    params.basis.normalizedWord ?? "",
  )
    .trim()
    .toLocaleLowerCase("en-US");

  const compatibilityOutput =
    resolveLegacyFunctionalRootCompatibilityV0_1(
      normalizedWord,
    );

  return compatibilityOutput
    ? [compatibilityOutput]
    : [];
}
