import { z } from "zod";
import {
  ALBANET_SOURCE_FILE_BYTES_V0_1,
  ALBANET_SOURCE_FILE_SHA256_V0_1,
  ALBANET_SOURCE_FAMILY_ID_V0_1,
  ALBANET_SOURCE_REVISION_V0_1,
} from "./albanetSourceIdentity.v0_1";
import { canonicalOperatorProfilesV0_1 } from "@/shared/canonicalOperatorProfile.v0_1";
import { reviewedExternalLexiconSourceRowCandidateRegistryV0_1 } from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "./interpretationDecisionPolicy.v0_1";
import { isSevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";

export const NATIVE_SEPARATIVE_EVENT_TO_STATE_SCHEMA_V0_1 =
  "open-instrument.native-separative-event-to-state.v0_1" as const;

const text = z.string().refine((value) => value.trim().length > 0);
const sourceIdentity = z.object({
  sourceFamilyId: z.literal(ALBANET_SOURCE_FAMILY_ID_V0_1),
  revision: z.literal(ALBANET_SOURCE_REVISION_V0_1),
  sha256: z.literal(ALBANET_SOURCE_FILE_SHA256_V0_1),
  bytes: z.literal(ALBANET_SOURCE_FILE_BYTES_V0_1),
}).strict();
const targetSense = z.object({
  sourceRecordId: text,
  synsetId: text,
  lemma: text,
  definitions: z.array(text),
  examples: z.array(text),
  sourceStatus: z.literal("SOURCE_REPORTED_UNREVIEWED_RESEARCH_CANDIDATE"),
  entryLocator: text,
}).strict();
export const nativeSeparativeEventToStateInputSchemaV0_1 = z.object({
  inputForm: text,
  sourceIdentity,
  targetSenses: z.array(targetSense).min(1),
}).strict();
const claim = z.object({
  status: z.enum(["SOURCE_REPORTED", "INFERRED", "UNKNOWN_OR_NULL"]),
  text: text.nullable(),
  evidenceRefs: z.array(text),
}).strict();
const voice = z.object({
  voice: z.string().refine(isSevenVoiceKey),
  position: z.number().int().nonnegative(),
}).strict();
const alternative = z.object({
  target: targetSense,
  compatibility: z.enum(["COMPATIBLE_FUNCTION_FAMILY", "NO_COMPATIBLE_FUNCTION_CUE"]),
  functionalEmbryo: z.object({
    form: text,
    sourceId: text,
    lexicalFunction: text,
    sourceTitle: text,
    citationId: text,
    citationUrl: text,
    locator: text,
  }).strict().nullable(),
  action: claim,
  patient: z.object({
    role: z.literal("AFFECTED_ENTITY"),
    description: claim,
    identity: claim,
  }).strict(),
  initialState: claim,
  changedState: claim,
  wholeWordMeaning: claim,
  explanation: text.nullable(),
  claimStatus: z.literal("EXPLORATORY_HYPOTHESIS"),
}).strict();

export const nativeSeparativeEventToStateReadingSchemaV0_1 = z.object({
  schemaVersion: z.literal(NATIVE_SEPARATIVE_EVENT_TO_STATE_SCHEMA_V0_1),
  origin: z.literal("NATIVE_GENERATED"),
  status: z.literal("EXPLORATORY_FUNCTIONAL_HYPOTHESIS"),
  operation: z.literal("SEPARATIVE_EVENT_TO_STATE"),
  inputForm: text,
  voiceBasis: z.literal("ORTHOGRAPHIC_ONLY"),
  writtenVoices: z.array(voice),
  albanetSource: sourceIdentity,
  alternatives: z.array(alternative).min(1),
  interpretationDecisionPolicy: z.custom(isInterpretationDecisionPolicyV0_1),
  userDecisionPosture: z.literal("user_decides"),
  historicalOriginClaim: z.literal("NOT_CLAIMED"),
}).strict();

export type NativeSeparativeTargetSenseInputV0_1 = z.infer<typeof targetSense>;
export type NativeSeparativeEventToStateInputV0_1 = Readonly<{
  inputForm: string;
  sourceIdentity: z.infer<typeof sourceIdentity>;
  targetSenses: readonly NativeSeparativeTargetSenseInputV0_1[];
}>;
export type NativeSeparativeEventToStateReadingV0_1 = z.infer<
  typeof nativeSeparativeEventToStateReadingSchemaV0_1
>;

function tokens(value: string): Set<string> {
  return new Set((value.normalize("NFC").toLocaleLowerCase("sq-AL").match(/[\p{L}]+/gu) ?? []));
}

const SEPARATIVE_SOURCE_FUNCTION_TERMS_V0_1 = new Set(["split", "divide", "separate"]);
const SEPARATIVE_ALBANIAN_SENSE_TERMS_V0_1 = new Set([
  "veçim", "veçimit", "veçime", "veçohen", "veçuar", "veçuarit",
  "shqitje", "shqitjes", "shkëputje", "shkëputjes",
  "ndarje", "ndarjes", "ndarjeve", "ndarë", "ndahen", "ndahet", "ndash",
  "copëzim", "copëzimi", "copëzimit", "copëtim", "copëtimi",
  "particion", "particione", "particionim", "particionit",
]);

function reviewedSeparativeEmbryos() {
  return canonicalOperatorProfilesV0_1.flatMap((profile) => {
    const row = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find((candidate) =>
      candidate.sourceId === profile.sourceId && candidate.sourceStatus === "reviewed_accepted" &&
      candidate.candidateLanguage === "sq",
    );
    if (!row || ![...tokens(row.plainStandaloneGloss)].some((term) =>
      SEPARATIVE_SOURCE_FUNCTION_TERMS_V0_1.has(term),
    )) return [];
    const citation = row.externalCitations.find((candidate) => candidate.citationStatus === "reviewed_accepted");
    if (!citation) return [];
    return [{
      form: profile.embryo,
      sourceId: row.sourceId,
      lexicalFunction: citation.attestedGloss,
      sourceTitle: citation.sourceTitle,
      citationId: citation.citationId,
      citationUrl: citation.sourceUrlOrArchiveRef,
      locator: citation.entryLocator,
    }];
  });
}

function writtenVoices(inputForm: string): NativeSeparativeEventToStateReadingV0_1["writtenVoices"] {
  type VoiceKey = NativeSeparativeEventToStateReadingV0_1["writtenVoices"][number]["voice"];
  const voices = new Set<VoiceKey>(["A", "E", "I", "O", "U", "Y", "Ë"]);
  return [...inputForm.normalize("NFC")].flatMap((character, position) => {
    const canonical = character.toLocaleUpperCase("sq-AL") as VoiceKey;
    return voices.has(canonical) ? [{ voice: canonical, position }] : [];
  });
}

export function buildNativeSeparativeEventToStateV0_1(
  input: NativeSeparativeEventToStateInputV0_1,
): NativeSeparativeEventToStateReadingV0_1 | null {
  const parsedInput = nativeSeparativeEventToStateInputSchemaV0_1.safeParse(input);
  if (!parsedInput.success) return null;
  const embryos = reviewedSeparativeEmbryos();
  const alternatives = [...parsedInput.data.targetSenses]
    .sort((left, right) => left.sourceRecordId < right.sourceRecordId ? -1 :
      left.sourceRecordId > right.sourceRecordId ? 1 : 0)
    .map((target) => {
      const compatible = [...tokens(target.definitions.join(" "))].some((term) =>
        SEPARATIVE_ALBANIAN_SENSE_TERMS_V0_1.has(term),
      );
      const embryo = compatible ? embryos[0] ?? null : null;
      const targetRef = `${target.sourceRecordId} · ${target.entryLocator}`;
      const actionRef = embryo ? `${embryo.sourceId} · ${embryo.citationId}` : "";
      const sourceAction = embryo?.lexicalFunction ?? null;
      const explanation = compatible && embryo
        ? `${embryo.form} is independently source-reported as “${sourceAction}.” As a functional hypothesis, a division/separation action can affect an initially undivided whole and leave distinct parts or separated entities; that proposed event-to-state frame is compatible with this source-reported target meaning: “${target.definitions.join("; ")}.” The sources do not report a morphological or historical relation between the records.`
        : null;
      return {
        target,
        compatibility: compatible && embryo ? "COMPATIBLE_FUNCTION_FAMILY" as const : "NO_COMPATIBLE_FUNCTION_CUE" as const,
        functionalEmbryo: embryo,
        action: {
          status: "SOURCE_REPORTED" as const,
          text: sourceAction,
          evidenceRefs: embryo ? [actionRef] : [],
        },
        patient: {
          role: "AFFECTED_ENTITY" as const,
          description: {
            status: compatible ? "INFERRED" as const : "UNKNOWN_OR_NULL" as const,
            text: compatible ? "an initially undivided whole" : null,
            evidenceRefs: compatible && embryo ? [actionRef] : [],
          },
          identity: { status: "UNKNOWN_OR_NULL" as const, text: null, evidenceRefs: [] },
        },
        initialState: {
          status: compatible ? "INFERRED" as const : "UNKNOWN_OR_NULL" as const,
          text: compatible ? "one undivided whole" : null,
          evidenceRefs: compatible && embryo ? [actionRef] : [],
        },
        changedState: {
          status: compatible ? "INFERRED" as const : "UNKNOWN_OR_NULL" as const,
          text: compatible ? "distinct parts or separated entities" : null,
          evidenceRefs: compatible && embryo ? [actionRef, targetRef] : [],
        },
        wholeWordMeaning: {
          status: target.definitions.length > 0 ? "SOURCE_REPORTED" as const : "UNKNOWN_OR_NULL" as const,
          text: target.definitions.length > 0 ? target.definitions.join("; ") : null,
          evidenceRefs: target.definitions.length > 0 ? [targetRef] : [],
        },
        explanation,
        claimStatus: "EXPLORATORY_HYPOTHESIS" as const,
      };
    });
  const reading = {
    schemaVersion: NATIVE_SEPARATIVE_EVENT_TO_STATE_SCHEMA_V0_1,
    origin: "NATIVE_GENERATED" as const,
    status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" as const,
    operation: "SEPARATIVE_EVENT_TO_STATE" as const,
    inputForm: parsedInput.data.inputForm,
    voiceBasis: "ORTHOGRAPHIC_ONLY" as const,
    writtenVoices: writtenVoices(parsedInput.data.inputForm),
    albanetSource: parsedInput.data.sourceIdentity,
    alternatives,
    interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
    userDecisionPosture: "user_decides" as const,
    historicalOriginClaim: "NOT_CLAIMED" as const,
  };
  const parsed = nativeSeparativeEventToStateReadingSchemaV0_1.safeParse(reading);
  return parsed.success ? parsed.data : null;
}
