import { z } from "zod";
import type {
  AlbanianSourceLinkedComponentReadingV0_1,
  AlbanianSourceLinkedRecordV0_1,
} from "./motivationEngineDiscoveryServerOnly.v0_1";
import type {
  AlbanianKaikkiExactLexicalSourceRelatedFormV0_1,
  AlbanianKaikkiExactLexicalSourceFactV0_1,
} from "./albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
} from "./albanianKaikkiExactLexicalSourceIdentity.v0_1";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
  type InterpretationDecisionPolicyV0_1,
} from "./interpretationDecisionPolicy.v0_1";
import { isSevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";

const text = z.string().refine((value) => value.trim().length > 0);
const senseRef = z.object({
  form: text,
  sourceRecordId: text,
  entryLocator: text,
  senseId: text,
  glosses: z.array(text).min(1),
}).strict();
const frame = z.object({
  lemma: text,
  senseId: text,
  synsetId: text,
  definition: text,
  semanticCategory: z.literal("noun.person"),
}).strict();
const voice = z.object({
  voice: z.string().refine(isSevenVoiceKey),
  position: z.number().int().nonnegative(),
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
}).passthrough();
const sourceRelationAssertion = z.object({
  assertionScope: z.enum(["SOURCE_RECORD", "SOURCE_SENSE"]),
  sourceSenseId: text.nullable(),
  sourceSenseOrdinal: z.number().int().nonnegative().nullable(),
  sourceSenseIdentityStatus: z.enum(["VERIFIED", "NOT_APPLICABLE", "UNKNOWN_OR_NULL"]),
  sourceAssertionOrdinal: z.number().int().nonnegative(),
  reasonCodes: z.array(z.string()),
}).strict();
const usableSourceRelationAssertion = sourceRelationAssertion.extend({
  sourceSenseIdentityStatus: z.enum(["VERIFIED", "NOT_APPLICABLE"]),
});
const exactSourceSense = z.object({
  senseId: text.nullable(),
  glosses: z.array(text),
}).passthrough();
const sourceDerivedForm = z.object({
  form: text,
  relation: z.enum(["SOURCE_RELATED_FORM", "SOURCE_DERIVED_FORM"]),
  entryLocator: text,
  sourceRelationAssertion,
}).strict();
const sourceRecordEvidence = z.object({
  sourceRecordId: text,
  entryLocator: text,
  physicalRecordOrdinal: z.number().int().nonnegative(),
  form: text,
  language: z.literal("Albanian"),
  languageCode: z.literal("sq"),
  partOfSpeech: text.nullable(),
  senses: z.array(exactSourceSense),
  relatedForms: z.array(sourceDerivedForm),
  sourceSnapshot: z.object({
    sourceFamilyId: z.literal(ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1),
    sha256: z.literal(ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1),
    bytes: z.literal(ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1),
    sourceUrl: text,
  }).strict(),
}).passthrough();
export const nativeDomainToAgentSourceDerivedInputSchemaV0_1 = z.object({
  target: sourceLinkedRecord,
  bases: z.array(z.object({
    base: sourceLinkedRecord,
    sourceRecord: sourceRecordEvidence,
    relation: z.object({
      form: text,
      relation: z.literal("SOURCE_DERIVED_FORM"),
      entryLocator: text,
      sourceRelationAssertion: usableSourceRelationAssertion,
    }).strict(),
  }).strict()).min(1),
}).strict();

export const NATIVE_AGENT_OEWN_SHA256_V0_1 =
  "7d749f6e2c39e6970e4997839dcf6e42fd281f3c2fae0171d2192bae8cfa4b51" as const;

export const nativeDomainToAgentReadingSchemaV0_1 = z.object({
  origin: z.literal("NATIVE_GENERATED"),
  status: z.literal("EXPLORATORY_FUNCTIONAL_HYPOTHESIS"),
  operation: z.literal("DOMAIN_TO_AGENT_ROLE"),
  oewnArtifactSha256: z.literal(NATIVE_AGENT_OEWN_SHA256_V0_1),
  interpretationDecisionPolicy: z.custom<InterpretationDecisionPolicyV0_1>(isInterpretationDecisionPolicyV0_1),
  userDecisionPosture: z.literal("user_decides"),
  inputForm: text,
  voiceBasis: z.literal("ORTHOGRAPHIC_ONLY"),
  writtenVoices: z.array(voice),
  alternatives: z.array(z.object({
    base: senseRef,
    target: senseRef,
    frames: z.array(frame.extend({ matchedTerms: z.array(text).min(1) })).min(1),
    sourceDerivedRelation: z.object({
      direction: z.literal("BASE_SOURCE_RECORD_TO_TARGET_DERIVED_FORM"),
      sourceRecordId: text,
      entryLocator: text,
      assertionScope: z.enum(["SOURCE_RECORD", "SOURCE_SENSE"]),
      sourceSenseId: text.nullable(),
      sourceSenseIdentityStatus: z.enum(["VERIFIED", "NOT_APPLICABLE"]),
      sourceAssertionOrdinal: z.number().int().nonnegative(),
    }).strict().optional(),
    explanation: text,
  }).strict()).min(1),
}).strict();

export type NativeDomainToAgentReadingV0_1 = z.infer<typeof nativeDomainToAgentReadingSchemaV0_1>;
export type OewnAgentFrameV0_1 = z.infer<typeof frame>;
export type NativeDomainToAgentSourceDerivedInputV0_1 = Readonly<{
  target: AlbanianSourceLinkedRecordV0_1;
  bases: readonly Readonly<{
    base: AlbanianSourceLinkedRecordV0_1;
    sourceRecord: AlbanianKaikkiExactLexicalSourceFactV0_1;
    relation: AlbanianKaikkiExactLexicalSourceRelatedFormV0_1;
  }>[];
}>;

export function domainToAgentGlossTermsV0_1(glosses: readonly string[]): string[] {
  return glosses.flatMap((gloss) => gloss.split(/[;,]/u).map((part) => part.trim()).filter(Boolean));
}

// Keep domain matching, but take human-agent classification from OEWN's noun.person membership.
function predicateTokens(value: string): string[] {
  return (value.match(/[a-z]+/giu) ?? []).map((token) => {
    let normalized = token.toLowerCase();
    if (normalized === "labour") normalized = "labor";
    if (normalized.endsWith("ing") && normalized.length > 5) normalized = normalized.slice(0, -3);
    else if (normalized.endsWith("s") && normalized.length > 4) normalized = normalized.slice(0, -1);
    return normalized;
  });
}

function sourceKey(value: string): string {
  return value.normalize("NFC").toLocaleLowerCase("sq-AL");
}

function uniquelyIdentifiedSenses(record: AlbanianSourceLinkedComponentReadingV0_1["primary"]) {
  const senses = record.sourceSenses ?? [];
  return senses.flatMap((sense) =>
    sense.senseId && senses.filter((other) => other.senseId === sense.senseId).length === 1 &&
        sense.glosses.length > 0 && sense.glosses.every((gloss) => gloss.trim())
      ? [{
          form: record.form,
          sourceRecordId: record.sourceRecordId,
          entryLocator: record.entryLocator,
          senseId: sense.senseId,
          glosses: [...sense.glosses],
        }]
      : [],
  );
}

export function buildNativeDomainToAgentV0_1(
  inputForm: string,
  reading: AlbanianSourceLinkedComponentReadingV0_1 | null,
  frames: readonly OewnAgentFrameV0_1[],
  sourceDerivedInput?: NativeDomainToAgentSourceDerivedInputV0_1,
): NativeDomainToAgentReadingV0_1 | null {
  const target = reading?.primary ?? sourceDerivedInput?.target;
  if (!target || target.partOfSpeech !== "noun" || sourceKey(target.form) !== sourceKey(inputForm)) return null;
  if (reading) {
    const [baseReference, suffixReference] = reading.relation.references;
    if (reading.relation.relation !== "SOURCE_AUTHORED_SUFFIX_TEMPLATE" ||
      reading.relation.references.length !== 2 || !baseReference || !suffixReference ||
      sourceKey(target.form) !== sourceKey(baseReference.sourceForm + suffixReference.sourceForm.slice(1))) return null;
  } else if (!sourceDerivedInput || sourceKey(sourceDerivedInput.target.form) !== sourceKey(inputForm) ||
    sourceDerivedInput.bases.length === 0 ||
    !nativeDomainToAgentSourceDerivedInputSchemaV0_1.safeParse(sourceDerivedInput).success) {
    return null;
  }

  const baseEntries = reading
    ? reading.components
        .filter((component) => component.partOfSpeech === "noun" &&
          sourceKey(component.form) === sourceKey(reading.relation.references[0]?.sourceForm ?? ""))
        .map((base) => ({ base, sourceDerivedRelation: undefined }))
    : (sourceDerivedInput?.bases ?? []).flatMap(({ base, relation, sourceRecord }) => {
        const assertion = relation.sourceRelationAssertion;
        const exactTargetLocator = `jsonl://word/${encodeURIComponent(target.form)}`;
        const sourceRelationCount = sourceRecord.relatedForms?.filter((candidate) =>
          candidate.relation === "SOURCE_DERIVED_FORM" && candidate.form === relation.form &&
          candidate.entryLocator === relation.entryLocator &&
          candidate.sourceRelationAssertion.assertionScope === assertion.assertionScope &&
          candidate.sourceRelationAssertion.sourceSenseId === assertion.sourceSenseId &&
          candidate.sourceRelationAssertion.sourceSenseOrdinal === assertion.sourceSenseOrdinal &&
          candidate.sourceRelationAssertion.sourceSenseIdentityStatus === assertion.sourceSenseIdentityStatus &&
          candidate.sourceRelationAssertion.sourceAssertionOrdinal === assertion.sourceAssertionOrdinal,
        ).length ?? 0;
        const assertionValid = assertion.assertionScope === "SOURCE_RECORD"
          ? assertion.sourceSenseIdentityStatus === "NOT_APPLICABLE" && assertion.sourceSenseId === null
          : assertion.assertionScope === "SOURCE_SENSE" && assertion.sourceSenseIdentityStatus === "VERIFIED" &&
            Boolean(assertion.sourceSenseId && base.sourceSenses?.some((sense) => sense.senseId === assertion.sourceSenseId) &&
              assertion.sourceSenseOrdinal !== null &&
              sourceRecord.senses[assertion.sourceSenseOrdinal]?.senseId === assertion.sourceSenseId);
        return relation.relation === "SOURCE_DERIVED_FORM" &&
          sourceKey(relation.form) === sourceKey(target.form) && relation.entryLocator === exactTargetLocator &&
          base.partOfSpeech === "noun" && sourceRecord.sourceRecordId === base.sourceRecordId &&
          sourceRecord.form === base.form && sourceRecord.entryLocator === base.entryLocator &&
          sourceRelationCount === 1 && assertionValid
          ? [{
              base,
              sourceDerivedRelation: {
                direction: "BASE_SOURCE_RECORD_TO_TARGET_DERIVED_FORM" as const,
                sourceRecordId: base.sourceRecordId,
                entryLocator: base.entryLocator,
                assertionScope: assertion.assertionScope as "SOURCE_RECORD" | "SOURCE_SENSE",
                sourceSenseId: assertion.sourceSenseId,
                sourceSenseIdentityStatus: assertion.sourceSenseIdentityStatus as "VERIFIED" | "NOT_APPLICABLE",
                sourceAssertionOrdinal: assertion.sourceAssertionOrdinal!,
              },
            }]
          : [];
      });
  if (new Set(baseEntries.map(({ base }) => base.sourceRecordId)).size !== baseEntries.length) return null;
  const baseSenses = baseEntries.flatMap(({ base, sourceDerivedRelation }) =>
    uniquelyIdentifiedSenses(base).flatMap((sense) =>
      sourceDerivedRelation?.assertionScope === "SOURCE_SENSE" && sense.senseId !== sourceDerivedRelation.sourceSenseId
        ? []
        : [{ sense, sourceDerivedRelation }],
    ),
  );
  const orderedFrames = [...frames].sort((left, right) =>
    left.senseId < right.senseId ? -1 : left.senseId > right.senseId ? 1 : 0);
  const alternatives = uniquelyIdentifiedSenses(target).flatMap((targetSense) => {
    const targetTerms = new Set(domainToAgentGlossTermsV0_1(targetSense.glosses)
      .map((gloss) => gloss.toLowerCase()));
    return baseSenses.flatMap(({ sense: baseSense, sourceDerivedRelation }) => {
      const domainTerms = [...new Set(baseSense.glosses.flatMap(predicateTokens))];
      const matchingFrames = orderedFrames.flatMap((candidate) => {
        if (!targetTerms.has(candidate.lemma.toLowerCase()) || candidate.semanticCategory !== "noun.person") return [];
        const definitionTerms = new Set(predicateTokens(candidate.definition));
        const matchedTerms = domainTerms.filter((term) => definitionTerms.has(term));
        return matchedTerms.length ? [{ ...candidate, matchedTerms }] : [];
      });
      if (matchingFrames.length === 0) return [];
      const matched = [...new Set(matchingFrames.flatMap(({ matchedTerms }) => matchedTerms))];
      const definitions = matchingFrames.map(({ lemma, definition }) => `“${lemma}” means “${definition}”`).join(". ");
      const sourceRelationExplanation = sourceDerivedRelation
        ? `The source lists “${inputForm}” as a derived form under this “${baseSense.form}” sense; the suffix function remains unresolved. `
        : "";
      const rolePhrase = sourceDerivedRelation ? "the human role expressed by" : "the person named by";
      return [{
        base: baseSense,
        target: targetSense,
        frames: matchingFrames,
        ...(sourceDerivedRelation ? { sourceDerivedRelation } : {}),
        explanation: `“${baseSense.form}” means “${baseSense.glosses.join(" / ")}”. ${sourceRelationExplanation}In the English comparison, ${definitions}. The shared meaning (${matched.join(", ")}) suggests that the smaller word describes a domain or activity of ${rolePhrase} “${inputForm}”.`,
      }];
    });
  });

  if (!alternatives.length) return null;
  return {
    origin: "NATIVE_GENERATED",
    status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
    operation: "DOMAIN_TO_AGENT_ROLE",
    oewnArtifactSha256: NATIVE_AGENT_OEWN_SHA256_V0_1,
    inputForm,
    interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
    userDecisionPosture: "user_decides",
    voiceBasis: "ORTHOGRAPHIC_ONLY",
    writtenVoices: Array.from(inputForm.normalize("NFC")).flatMap((character, position) => {
      const writtenVoice = character.toUpperCase();
      return isSevenVoiceKey(writtenVoice) ? [{ voice: writtenVoice, position }] : [];
    }),
    alternatives,
  };
}
