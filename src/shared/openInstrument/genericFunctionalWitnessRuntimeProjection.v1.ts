import { extractSevenVowelsFromString } from "../math7.core";
import type { StructuralHypothesisV0_1 } from "../structuralHypothesisDiscovery.v0_1";
import { isSevenVoiceKey } from "../sevenVoiceOrderedViews.v0.1";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  queryGenericFunctionalWitnessesV1,
  type GenericFunctionalWitnessDiscoveryResultV1,
  type GenericFunctionalWitnessSourceAdapterV1,
} from "./genericFunctionalWitnessDiscovery.v1";
import {
  evaluateGenericFunctionalWitnessCorrespondenceV1,
  GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1,
  type GenericFunctionalWitnessCorrespondenceResultV1,
} from "./genericFunctionalWitnessCorrespondence.v1";
import { createGenericFunctionalWitnessSourceAdapterV1 } from "./genericFunctionalWitnessSourceAcquisition.v1";

export const GENERIC_FUNCTIONAL_WITNESS_RUNTIME_PROJECTION_SCHEMA_V1 =
  "open-instrument.generic-functional-witness-runtime-projection.v1" as const;

export type GenericFunctionalWitnessRuntimeTargetSenseV1 = Readonly<{
  id: string;
  label: string;
}>;

export type GenericFunctionalWitnessRuntimeProjectionInputV1 = Readonly<{
  targetWord: string;
  structuralHypothesis: StructuralHypothesisV0_1;
  targetSense?: GenericFunctionalWitnessRuntimeTargetSenseV1 | null;
}>;

export type GenericFunctionalWitnessRuntimeProjectionV1 = Readonly<{
  schemaVersion: typeof GENERIC_FUNCTIONAL_WITNESS_RUNTIME_PROJECTION_SCHEMA_V1;
  targetWord: string;
  hypothesisId: string;
  embryo: string;
  voicePath: readonly ReturnType<typeof extractSevenVowelsFromString>[number][];
  discovery: GenericFunctionalWitnessDiscoveryResultV1;
  correspondences: readonly GenericFunctionalWitnessCorrespondenceResultV1[];
}>;

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }

  seen.add(value);
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV1(child, seen);
  }
  return value;
}

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function parseGenericFunctionalWitnessRuntimeProjectionV1(
  value: unknown,
): GenericFunctionalWitnessRuntimeProjectionV1 | null {
  if (!isRecordV1(value)) return null;
  if (
    value.schemaVersion !==
    GENERIC_FUNCTIONAL_WITNESS_RUNTIME_PROJECTION_SCHEMA_V1
  ) {
    return null;
  }

  const voicePath = value.voicePath;
  const discovery = value.discovery;
  const correspondences = value.correspondences;

  if (
    typeof value.targetWord !== "string" ||
    !value.targetWord.trim() ||
    typeof value.hypothesisId !== "string" ||
    !value.hypothesisId.trim() ||
    typeof value.embryo !== "string" ||
    !value.embryo.trim() ||
    !Array.isArray(voicePath) ||
    voicePath.length === 0 ||
    !voicePath.every(
      (voice): voice is ReturnType<typeof extractSevenVowelsFromString>[number] =>
        typeof voice === "string" && isSevenVoiceKey(voice),
    ) ||
    !isRecordV1(discovery) ||
    discovery.schemaVersion !== GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1 ||
    !Array.isArray(discovery.matches) ||
    !Array.isArray(correspondences) ||
    correspondences.length !== discovery.matches.length ||
    !correspondences.every(
      (correspondence) =>
        isRecordV1(correspondence) &&
        correspondence.schemaVersion ===
          GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1,
    )
  ) {
    return null;
  }

  return value as unknown as GenericFunctionalWitnessRuntimeProjectionV1;
}

const DEFAULT_SOURCE_ADAPTERS_V1: readonly GenericFunctionalWitnessSourceAdapterV1[] =
  Object.freeze([createGenericFunctionalWitnessSourceAdapterV1()]);

export function buildGenericFunctionalWitnessRuntimeProjectionV1(
  input: GenericFunctionalWitnessRuntimeProjectionInputV1,
  adapters: readonly GenericFunctionalWitnessSourceAdapterV1[] =
    DEFAULT_SOURCE_ADAPTERS_V1,
): GenericFunctionalWitnessRuntimeProjectionV1 | null {
  const targetWord = input.targetWord.trim();
  const hypothesis = input.structuralHypothesis;

  if (!targetWord || !hypothesis?.hypothesisId || !hypothesis.embryo) {
    return null;
  }

  const voicePath = extractSevenVowelsFromString(hypothesis.embryo);
  if (voicePath.length === 0) {
    return null;
  }

  const targetSense = input.targetSense
    ? {
        id: input.targetSense.id,
        label: input.targetSense.label,
      }
    : null;

  const discovery = queryGenericFunctionalWitnessesV1(
    {
      schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
      embryo: hypothesis.embryo,
      voicePath,
      queryNormalization: "EXACT_NFC",
    },
    adapters,
  );

  const targetAnalysis = {
    analysisId: `analysis:${targetWord}:${hypothesis.hypothesisId}`,
    targetWord,
    targetSense,
  };

  const correspondences = discovery.matches.map((sourceWitness) =>
    evaluateGenericFunctionalWitnessCorrespondenceV1({
      schemaVersion: GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1,
      targetAnalysis,
      structuralAnalysis: {
        hypothesisId: hypothesis.hypothesisId,
        embryo: hypothesis.embryo,
        voicePath,
      },
      sourceWitness,
    }),
  );

  return deepFreezeV1({
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_RUNTIME_PROJECTION_SCHEMA_V1,
    targetWord,
    hypothesisId: hypothesis.hypothesisId,
    embryo: hypothesis.embryo,
    voicePath,
    discovery,
    correspondences,
  });
}
