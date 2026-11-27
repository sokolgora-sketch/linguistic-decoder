import { z } from "zod";
import type { AlbanianKaikkiExactLexicalSourceFactV0_1 } from "./albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import type { AlbanianSourceLinkedRecordV0_1 } from "./motivationEngineDiscoveryServerOnly.v0_1";
import {
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
} from "./albanianKaikkiExactLexicalSourceIdentity.v0_1";
import { NATIVE_AGENT_OEWN_SHA256_V0_1 } from "./albanianNativeDomainToAgent.v0_1";
import { reviewedExternalLexiconSourceRowCandidateRegistryV0_1 } from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
  type InterpretationDecisionPolicyV0_1,
} from "./interpretationDecisionPolicy.v0_1";
import { isSevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";

/** Exact OEWN verb.cognition senses admitted for the reviewed cognitive operators. */
export const NATIVE_COGNITIVE_STATE_OEWN_SENSE_ID_BY_LEMMA_V0_1: Readonly<Record<string, string>> =
  Object.freeze({ know: "know%2:31:01::" });

const text = z.string().refine((value) => value.trim().length > 0);
const senseRef = z.object({
  form: text,
  sourceRecordId: text,
  entryLocator: text,
  senseId: text,
  glosses: z.array(text).min(1),
}).strict();
const sourceSense = z.object({
  sourceSenseOrdinal: z.number().int().nonnegative(),
  senseId: text.nullable(),
  glosses: z.array(text),
}).passthrough();
const sourceLinkedRecord = z.object({
  sourceRecordId: text,
  entryLocator: text,
  form: text,
  partOfSpeech: text.nullable(),
  sourceSenses: z.array(sourceSense),
  etymologyText: text.nullable().optional(),
  etymologyLinks: z.array(z.object({ sourceForm: text, reference: text }).passthrough()).optional(),
}).passthrough();
const sourceFact = z.object({
  sourceRecordId: text,
  entryLocator: text,
  physicalRecordOrdinal: z.number().int().nonnegative(),
  form: text,
  language: z.literal("Albanian"),
  languageCode: z.literal("sq"),
  partOfSpeech: text.nullable(),
  senses: z.array(z.object({ senseId: text.nullable(), glosses: z.array(text) }).passthrough()),
  sourceSnapshot: z.object({
    sourceFamilyId: z.literal(ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1),
    sha256: z.literal(ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1),
    bytes: z.literal(ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1),
    sourceUrl: z.literal(ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1),
  }).strict(),
}).passthrough();
const sourceLink = z.object({ sourceForm: text, reference: text }).strict();
export const nativeCognitiveStateToContentSourceInputSchemaV0_1 = z.object({
  target: sourceLinkedRecord,
  bases: z.array(z.object({
    base: sourceLinkedRecord,
    sourceRecord: sourceFact,
    etymologyLink: sourceLink,
  }).strict()).min(1),
}).strict();

const frame = z.object({
  lemma: text,
  senseId: text,
  synsetId: text,
  definition: text,
  semanticCategory: z.literal("verb.cognition"),
}).strict();
const claim = z.object({
  claimStatus: z.literal("INFERRED"),
  text,
}).strict();
const unknownClaim = z.object({
  claimStatus: z.literal("UNKNOWN_OR_NULL"),
  text: z.null(),
  reason: text,
}).strict();
const voice = z.object({
  voice: z.string().refine(isSevenVoiceKey),
  position: z.number().int().nonnegative(),
}).strict();
const sourceRelation = z.object({
  targetSourceRecordId: text,
  targetEntryLocator: text,
  sourceText: text,
  baseSourceRecordId: text,
  baseEntryLocator: text,
  sourceForm: text,
  reference: text,
  albanianSourceSha256: z.literal(ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1),
  reviewedCandidateSourceId: text,
  reviewedCandidateDisplayForm: text,
}).strict();
const alternative = z.object({
  base: senseRef,
  target: senseRef,
  frame,
  sourceRelation,
  stateOfKnowing: claim,
  knownContent: claim,
  acquisition: unknownClaim,
  unknownToKnownTransition: unknownClaim,
  explanation: text,
  claimStatus: z.literal("EXPLORATORY_HYPOTHESIS"),
  interpretationDecisionPolicy: z.custom<InterpretationDecisionPolicyV0_1>(isInterpretationDecisionPolicyV0_1),
  userDecisionPosture: z.literal("user_decides"),
  unresolved: z.array(text).min(1),
}).strict();

export const nativeCognitiveStateToContentReadingSchemaV0_1 = z.object({
  origin: z.literal("NATIVE_GENERATED"),
  status: z.literal("EXPLORATORY_FUNCTIONAL_HYPOTHESIS"),
  operation: z.literal("COGNITIVE_STATE_TO_CONTENT"),
  oewnArtifactSha256: z.literal(NATIVE_AGENT_OEWN_SHA256_V0_1),
  interpretationDecisionPolicy: z.custom<InterpretationDecisionPolicyV0_1>(isInterpretationDecisionPolicyV0_1),
  userDecisionPosture: z.literal("user_decides"),
  inputForm: text,
  voiceBasis: z.literal("ORTHOGRAPHIC_ONLY"),
  writtenVoices: z.array(voice),
  alternatives: z.array(alternative).min(1),
}).strict();

export type NativeCognitiveStateToContentReadingV0_1 = z.infer<
  typeof nativeCognitiveStateToContentReadingSchemaV0_1
>;
export type OewnCognitiveStateFrameV0_1 = z.infer<typeof frame>;
export type NativeCognitiveStateToContentSourceInputV0_1 = Readonly<{
  target: AlbanianSourceLinkedRecordV0_1;
  bases: readonly Readonly<{
    base: AlbanianSourceLinkedRecordV0_1;
    sourceRecord: AlbanianKaikkiExactLexicalSourceFactV0_1;
    etymologyLink: Readonly<{ sourceForm: string; reference: string }>;
  }>[];
}>;

function sourceKey(value: string): string {
  return value.normalize("NFC").toLocaleLowerCase("sq-AL");
}

export function isReviewedCognitiveCandidateFormV0_1(form: string): boolean {
  const key = sourceKey(form);
  return reviewedExternalLexiconSourceRowCandidateRegistryV0_1.some((row) =>
    row.sourceStatus === "reviewed_accepted" && row.candidateLanguage === "sq" &&
    sourceKey(row.isolatedStandaloneForm) === key && /\bknow(?:ledge)?\b/iu.test(row.plainStandaloneGloss),
  );
}

function reviewedCognitiveCandidates(form: string) {
  const key = sourceKey(form);
  return reviewedExternalLexiconSourceRowCandidateRegistryV0_1.filter((row) =>
    row.sourceStatus === "reviewed_accepted" && row.candidateLanguage === "sq" &&
    sourceKey(row.isolatedStandaloneForm) === key && /\bknow(?:ledge)?\b/iu.test(row.plainStandaloneGloss),
  );
}

function uniqueSenses(record: AlbanianSourceLinkedRecordV0_1) {
  const senses = record.sourceSenses ?? [];
  return senses.flatMap((sense) =>
    sense.senseId && senses.filter((other) => other.senseId === sense.senseId).length === 1 &&
      sense.glosses.length > 0 && sense.glosses.every((gloss) => gloss.trim())
      ? [{ form: record.form, sourceRecordId: record.sourceRecordId, entryLocator: record.entryLocator,
          senseId: sense.senseId, glosses: [...sense.glosses] }]
      : [],
  );
}

function sourceSenseProjectionMatches(
  base: AlbanianSourceLinkedRecordV0_1,
  sourceRecord: AlbanianKaikkiExactLexicalSourceFactV0_1,
): boolean {
  const projectedSenses = base.sourceSenses ?? [];
  if (projectedSenses.length !== sourceRecord.senses.length) return false;
  return projectedSenses.every((sense, ordinal) => {
    const exact = sourceRecord.senses[ordinal];
    return sense.sourceSenseOrdinal === ordinal && Boolean(exact) && sense.senseId === exact?.senseId &&
      JSON.stringify(sense.glosses) === JSON.stringify(exact?.glosses);
  });
}

function baseCandidateIsBound(
  target: AlbanianSourceLinkedRecordV0_1,
  candidate: NativeCognitiveStateToContentSourceInputV0_1["bases"][number],
): boolean {
  const { base, sourceRecord, etymologyLink } = candidate;
  const snapshot = sourceRecord.sourceSnapshot;
  const targetLinks = target.etymologyLinks ?? [];
  return target.partOfSpeech === "noun" && Boolean(target.etymologyText?.trim()) &&
    sourceKey(base.form) === sourceKey(etymologyLink.sourceForm) && base.partOfSpeech === "verb" &&
    base.sourceRecordId === sourceRecord.sourceRecordId && base.entryLocator === sourceRecord.entryLocator &&
    base.form === sourceRecord.form && sourceRecord.language === "Albanian" && sourceRecord.languageCode === "sq" &&
    sourceSenseProjectionMatches(base, sourceRecord) &&
    snapshot.sourceFamilyId === ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1 &&
    snapshot.sha256 === ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1 &&
    snapshot.bytes === ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1 &&
    snapshot.sourceUrl === ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1 &&
    targetLinks.some((link) => sourceKey(link.sourceForm) === sourceKey(etymologyLink.sourceForm) &&
      link.reference === etymologyLink.reference) &&
    isReviewedCognitiveCandidateFormV0_1(base.form);
}

function contentKind(glosses: readonly string[]): "KNOWLEDGE" | "INFORMATION" | null {
  const value = glosses.join("; ");
  if (/\bknowledge\b/iu.test(value)) return "KNOWLEDGE";
  if (/\b(?:learning|information|news)\b/iu.test(value)) return "INFORMATION";
  return null;
}

function baseGlossContainsLemma(glosses: readonly string[], lemma: string): boolean {
  const lemmaKey = lemma.toLocaleLowerCase("en-US");
  return glosses.some((gloss) => (gloss.match(/[a-z]+/giu) ?? [])
    .some((token) => token.toLocaleLowerCase("en-US") === lemmaKey));
}

export function buildNativeCognitiveStateToContentV0_1(
  inputForm: string,
  sourceInput: NativeCognitiveStateToContentSourceInputV0_1 | undefined,
  frames: readonly OewnCognitiveStateFrameV0_1[],
): NativeCognitiveStateToContentReadingV0_1 | null {
  if (!sourceInput || !nativeCognitiveStateToContentSourceInputSchemaV0_1.safeParse(sourceInput).success) return null;
  const { target, bases } = sourceInput;
  const targetEtymologyText = target.etymologyText;
  if (target.partOfSpeech !== "noun" || sourceKey(target.form) !== sourceKey(inputForm) ||
    !targetEtymologyText?.trim()) return null;

  const uniqueBaseRecords = new Set(bases.map(({ base }) => base.sourceRecordId));
  if (uniqueBaseRecords.size !== bases.length) return null;
  const orderedFrames = [...frames].sort((left, right) =>
    left.senseId < right.senseId ? -1 : left.senseId > right.senseId ? 1 : 0);
  const alternatives = bases.flatMap((candidate) => {
    if (!baseCandidateIsBound(target, candidate)) return [];
    const row = reviewedCognitiveCandidates(candidate.base.form)[0];
    if (!row) return [];
    const baseSenses = uniqueSenses(candidate.base);
    const targetSenses = uniqueSenses(target);
    return targetSenses.flatMap((targetSense) => {
      const kind = contentKind(targetSense.glosses);
      if (!kind) return [];
      return baseSenses.flatMap((baseSense) => orderedFrames.flatMap((candidateFrame) => {
        if (candidateFrame.semanticCategory !== "verb.cognition" ||
          !baseGlossContainsLemma(baseSense.glosses, candidateFrame.lemma) ||
          !baseGlossContainsLemma([row.plainStandaloneGloss], candidateFrame.lemma)) return [];
        const gloss = targetSense.glosses.join(" / ");
        const baseGloss = baseSense.glosses.join(" / ");
        const stateText = "being aware of or possessing knowledge about a fact or information";
        const knowledgeExplanation = "The target source sense “" + gloss +
          "” can provisionally name known content or the state associated with knowing. The “learning” facet does not establish an acquisition event.";
        const informationExplanation = "The target source sense “" + gloss +
          "” can be investigated as content associated with knowing. This relation does not explain the “news” nuance.";
        const unresolved = [
          "The target source record reports this relation; reviewed morphology is not established.",
          "No function is assigned to J or E.",
        ];
        return [{
          base: baseSense,
          target: targetSense,
          frame: candidateFrame,
          sourceRelation: {
            targetSourceRecordId: target.sourceRecordId,
            targetEntryLocator: target.entryLocator,
            sourceText: targetEtymologyText,
            baseSourceRecordId: candidate.sourceRecord.sourceRecordId,
            baseEntryLocator: candidate.sourceRecord.entryLocator,
            sourceForm: candidate.etymologyLink.sourceForm,
            reference: candidate.etymologyLink.reference,
            albanianSourceSha256: candidate.sourceRecord.sourceSnapshot.sha256 as typeof ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
            reviewedCandidateSourceId: row.sourceId,
            reviewedCandidateDisplayForm: row.displayForm,
          },
          stateOfKnowing: { claimStatus: "INFERRED" as const, text: stateText },
          knownContent: {
            claimStatus: "INFERRED" as const,
            text: "a fact or information associated with the knowing state",
          },
          acquisition: {
            claimStatus: "UNKNOWN_OR_NULL" as const,
            text: null,
            reason: "The source gloss “" + baseGloss +
              "” and its approximate cognitive definition do not independently establish acquiring or learning.",
          },
          unknownToKnownTransition: {
            claimStatus: "UNKNOWN_OR_NULL" as const,
            text: null,
            reason: "A transition is not required for a stative knowing relation and is not established by these inputs.",
          },
          explanation: "The exact source sense “" + baseGloss + "” supplies the knowing candidate. The approximate English WordNet cognitive definition for “" +
            candidateFrame.lemma + "” is “" + candidateFrame.definition + "”. " +
            (kind === "KNOWLEDGE" ? knowledgeExplanation : informationExplanation) +
            " The resulting relation is an exploratory hypothesis for user review.",
          claimStatus: "EXPLORATORY_HYPOTHESIS" as const,
          interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
          userDecisionPosture: "user_decides" as const,
          unresolved,
        }];
      }));
    });
  });
  if (!alternatives.length) return null;

  return {
    origin: "NATIVE_GENERATED",
    status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
    operation: "COGNITIVE_STATE_TO_CONTENT",
    oewnArtifactSha256: NATIVE_AGENT_OEWN_SHA256_V0_1,
    interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
    userDecisionPosture: "user_decides",
    inputForm,
    voiceBasis: "ORTHOGRAPHIC_ONLY",
    writtenVoices: Array.from(inputForm.normalize("NFC")).flatMap((character, position) => {
      const writtenVoice = character.toUpperCase();
      return isSevenVoiceKey(writtenVoice) ? [{ voice: writtenVoice, position }] : [];
    }),
    alternatives,
  };
}
