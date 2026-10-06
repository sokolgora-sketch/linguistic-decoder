import {
  createGenericFunctionalWitnessSourceAdapterV1,
  loadGenericFunctionalWitnessSourceDatasetV1,
} from "./genericFunctionalWitnessSourceAcquisition.v1";
import type {
  GenericFunctionalWitnessQueryV1,
  GenericFunctionalWitnessSourceAdapterResultV1,
  GenericFunctionalWitnessSourceAdapterV1,
} from "./genericFunctionalWitnessDiscovery.v1";

export const LATIN_LEXICAL_SUBSTRATE_ADAPTER_ID_V0_1 =
  "latin-generic-lexical-substrate.v0_1" as const;

export const LATIN_LEXICAL_SUBSTRATE_SOURCE_SCOPE_V0_1 =
  "RESEARCH_EXTERNAL_SOURCE_INPUT_LEWIS_SHORT_PINNED_RECORDS_ONLY" as const;

const SOURCE_DATASET_V0_1 = loadGenericFunctionalWitnessSourceDatasetV1();

const LATIN_RECORDS_V0_1 = Object.freeze(
  SOURCE_DATASET_V0_1.records.filter(
    (record) => record.language === "Latin",
  ),
);

export function getLatinLexicalSubstrateRecordsV0_1():
  readonly (typeof LATIN_RECORDS_V0_1)[number][] {
  return LATIN_RECORDS_V0_1;
}

/**
 * Projects only the already-frozen Latin source records into the generic
 * witness seam. The records carry lexical source facts, not pronunciation or
 * a functional/historical interpretation.
 */
export function createLatinLexicalSubstrateWitnessAdapterV0_1():
  GenericFunctionalWitnessSourceAdapterV1 {
  const sourceAdapter = createGenericFunctionalWitnessSourceAdapterV1({
    datasetVersion: SOURCE_DATASET_V0_1.datasetVersion,
    sourceAuthority: SOURCE_DATASET_V0_1.sourceAuthority,
    records: LATIN_RECORDS_V0_1,
  });

  return Object.freeze({
    adapterId: LATIN_LEXICAL_SUBSTRATE_ADAPTER_ID_V0_1,
    candidateVoicePathPolicy: "NULL_UNAUTHORIZED" as const,
    query(input: GenericFunctionalWitnessQueryV1):
      GenericFunctionalWitnessSourceAdapterResultV1 {
      return sourceAdapter.query(input);
    },
  });
}
