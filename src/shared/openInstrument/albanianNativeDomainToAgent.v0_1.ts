import { z } from "zod";
import type { AlbanianSourceLinkedComponentReadingV0_1 } from "./motivationEngineDiscoveryServerOnly.v0_1";
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
}).strict();
const voice = z.object({
  voice: z.string().refine(isSevenVoiceKey),
  position: z.number().int().nonnegative(),
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
    explanation: text,
  }).strict()).min(1),
}).strict();

export type NativeDomainToAgentReadingV0_1 = z.infer<typeof nativeDomainToAgentReadingSchemaV0_1>;
export type OewnAgentFrameV0_1 = z.infer<typeof frame>;

export function domainToAgentGlossTermsV0_1(glosses: readonly string[]): string[] {
  return glosses.flatMap((gloss) => gloss.split(/[;,]/u).map((part) => part.trim()).filter(Boolean));
}

// Preserve the demonstrated v0.3 token comparison and its person-definition filter.
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
  reading: AlbanianSourceLinkedComponentReadingV0_1,
  frames: readonly OewnAgentFrameV0_1[],
): NativeDomainToAgentReadingV0_1 | null {
  const [baseReference, suffixReference] = reading.relation.references;
  const target = reading.primary;
  if (reading.relation.relation !== "SOURCE_AUTHORED_SUFFIX_TEMPLATE" ||
    reading.relation.references.length !== 2 || !baseReference || !suffixReference ||
    target.partOfSpeech !== "noun" || sourceKey(target.form) !== sourceKey(inputForm) ||
    sourceKey(target.form) !== sourceKey(baseReference.sourceForm + suffixReference.sourceForm.slice(1))) {
    return null;
  }

  const baseSenses = reading.components
    .filter((component) => component.partOfSpeech === "noun" &&
      sourceKey(component.form) === sourceKey(baseReference.sourceForm))
    .flatMap(uniquelyIdentifiedSenses);
  const orderedFrames = [...frames].sort((left, right) =>
    left.senseId < right.senseId ? -1 : left.senseId > right.senseId ? 1 : 0);
  const alternatives = uniquelyIdentifiedSenses(target).flatMap((targetSense) => {
    const targetTerms = new Set(domainToAgentGlossTermsV0_1(targetSense.glosses)
      .map((gloss) => gloss.toLowerCase()));
    return baseSenses.flatMap((baseSense) => {
      const domainTerms = [...new Set(baseSense.glosses.flatMap(predicateTokens))];
      const matchingFrames = orderedFrames.flatMap((candidate) => {
        if (!targetTerms.has(candidate.lemma.toLowerCase()) ||
          !/\b(person|someone|individual)\b/iu.test(candidate.definition)) return [];
        const definitionTerms = new Set(predicateTokens(candidate.definition));
        const matchedTerms = domainTerms.filter((term) => definitionTerms.has(term));
        return matchedTerms.length ? [{ ...candidate, matchedTerms }] : [];
      });
      if (matchingFrames.length === 0) return [];
      const matched = [...new Set(matchingFrames.flatMap(({ matchedTerms }) => matchedTerms))];
      const definitions = matchingFrames.map(({ lemma, definition }) => `“${lemma}” means “${definition}”`).join(". ");
      return [{
        base: baseSense,
        target: targetSense,
        frames: matchingFrames,
        explanation: `“${baseSense.form}” means “${baseSense.glosses.join(" / ")}”. In the English comparison, ${definitions}. The shared meaning (${matched.join(", ")}) suggests that the smaller word describes a domain or activity of the person named by “${inputForm}”.`,
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
