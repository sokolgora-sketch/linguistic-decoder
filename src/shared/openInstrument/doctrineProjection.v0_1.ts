import {
  isSevenVoiceKey,
  lookupSevenVoice,
  sevenVoiceOrderedViewsSchemaVersion,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";
import {
  SEVEN_PRINCIPLES,
  type PrincipleRole,
} from "@/shared/sevenPrinciples.v1";

export const DOCTRINE_PROJECTION_SCHEMA_V0_1 =
  "open-instrument.doctrine-projection.v0_1" as const;

export const DOCTRINE_PROJECTION_PROVENANCE_V0_1 = Object.freeze({
  orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
  voiceRegistry: "src/shared/sevenVoiceOrderedViews.v0.1.ts",
  doctrineRegistry: "src/shared/doctrine/voiceDoctrine.v0.1.ts",
  principleRegistry: "src/shared/sevenPrinciples.v1.ts",
});

export type DoctrineProjectionEntryV0_1 = Readonly<{
  pathIndex: number;
  voice: SevenVoiceKey;
  doctrineRole: PrincipleRole;
  symbolicMetadata: Readonly<{
    symbolicMathIndex: number;
    math7Value: number;
    symbolicLevel: "high" | "mid" | "low";
    symbolicRing: number;
    symbolicColor: string;
  }>;
}>;

export type DoctrineProjectionSuccessV0_1 = Readonly<{
  ok: true;
  schemaVersion: typeof DOCTRINE_PROJECTION_SCHEMA_V0_1;
  inputPath: SevenVoiceKey[];
  projections: DoctrineProjectionEntryV0_1[];
  emptyPath: boolean;
  provenance: typeof DOCTRINE_PROJECTION_PROVENANCE_V0_1;
}>;

export type DoctrineProjectionFailureV0_1 = Readonly<{
  ok: false;
  schemaVersion: typeof DOCTRINE_PROJECTION_SCHEMA_V0_1;
  reasonCodes: readonly [
    "path_not_array" | "unsupported_voice" | "malformed_path_entry",
  ];
  invalidIndex?: number;
}>;

export type DoctrineProjectionResultV0_1 =
  | DoctrineProjectionSuccessV0_1
  | DoctrineProjectionFailureV0_1;

function failureV0_1(
  reasonCode:
    | "path_not_array"
    | "unsupported_voice"
    | "malformed_path_entry",
  invalidIndex?: number,
): DoctrineProjectionFailureV0_1 {
  return {
    ok: false,
    schemaVersion: DOCTRINE_PROJECTION_SCHEMA_V0_1,
    reasonCodes: [reasonCode],
    ...(invalidIndex === undefined ? {} : { invalidIndex }),
  };
}

export function projectSevenVoiceDoctrineV0_1(
  inputPath: unknown,
): DoctrineProjectionResultV0_1 {
  if (!Array.isArray(inputPath)) {
    return failureV0_1("path_not_array");
  }

  const path: SevenVoiceKey[] = [];

  for (let index = 0; index < inputPath.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(inputPath, index)) {
      return failureV0_1("malformed_path_entry", index);
    }

    const voice = inputPath[index];
    if (typeof voice !== "string") {
      return failureV0_1("malformed_path_entry", index);
    }

    if (!isSevenVoiceKey(voice)) {
      return failureV0_1("unsupported_voice", index);
    }

    path.push(voice);
  }

  const projections = path.map((voice, pathIndex) => {
    const symbolic = lookupSevenVoice(voice);
    const principle = SEVEN_PRINCIPLES[voice];

    return {
      pathIndex,
      voice,
      doctrineRole: principle.role,
      symbolicMetadata: {
        symbolicMathIndex: symbolic.symbolicMathIndex,
        math7Value: symbolic.math7Value,
        symbolicLevel: symbolic.symbolicLevel,
        symbolicRing: symbolic.symbolicRing,
        symbolicColor: symbolic.symbolicColor,
      },
    };
  });

  return {
    ok: true,
    schemaVersion: DOCTRINE_PROJECTION_SCHEMA_V0_1,
    inputPath: path,
    projections,
    emptyPath: path.length === 0,
    provenance: DOCTRINE_PROJECTION_PROVENANCE_V0_1,
  };
}
