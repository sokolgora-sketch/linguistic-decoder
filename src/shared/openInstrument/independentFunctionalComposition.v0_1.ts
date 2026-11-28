import { z } from "zod";
import { isSevenVoiceKey } from "../sevenVoiceOrderedViews.v0.1";
import { discoverStructuralHypothesesV0_1 } from "../structuralHypothesisDiscovery.v0_1";
import { INTERPRETATION_DECISION_POLICY_V0_1 } from "./interpretationDecisionPolicy.v0_1";

const text = z.string().min(1);
const sourceSense = z.object({ senseId: text.nullable(), glosses: z.array(text) });
const lexicalRecord = z.object({
  form: text,
  partOfSpeech: text.nullable(),
  sourceRecordId: text,
  entryLocator: text,
  senses: z.array(sourceSense),
});
const comparison = z.object({
  lemma: text,
  senseId: text,
  synsetId: text,
  definition: text,
});
export const independentCompositionInputSchemaV0_1 = z.object({
  inputForm: text,
  target: lexicalRecord,
  lexicalRecords: z.array(lexicalRecord),
  comparisons: z.array(comparison),
});

export type IndependentCompositionRecordV0_1 = z.infer<typeof lexicalRecord>;
export type IndependentCompositionComparisonV0_1 = z.infer<typeof comparison>;
export type IndependentCompositionInputV0_1 = z.infer<typeof independentCompositionInputSchemaV0_1>;

export const independentCompositionFormKeyV0_1 = (form: string) =>
  form.normalize("NFC").toLocaleLowerCase("sq-AL");

function jointnessKind(gloss: string) {
  const words = gloss.toLowerCase().match(/[a-z]+/gu) ?? [];
  if (words.some((word) => ["not", "without", "separately", "alone"].includes(word))) return null;
  if (words.some((word) => /^(mutual|mutually|reciprocal|reciprocally)$/u.test(word))) return "RECIPROCAL";
  return words.some((word) => /^(together|joint|jointly)$/u.test(word)) ? "JOINT" : null;
}

export function isJointModifierV0_1(record: IndependentCompositionRecordV0_1): boolean {
  return record.partOfSpeech === "adv" && record.senses.some((sense) =>
    sense.glosses.some((gloss) => jointnessKind(gloss) !== null),
  );
}

export function independentCompositionSplitsV0_1(inputForm: string) {
  const letters = [...inputForm.normalize("NFC")];
  if (letters.length < 4 || letters.length > 24 ||
      !letters.every((letter) => /^\p{Script=Latin}$/u.test(letter))) return [];
  return letters.slice(2, -1).map((_, i) => ({
    end: i + 2,
    left: letters.slice(0, i + 2).join(""),
    right: letters.slice(i + 2).join(""),
  }));
}

function smallerForms(form: string): string[] {
  return [...new Set(discoverStructuralHypothesesV0_1(form)
    .flatMap(({ expansionChain }) => expansionChain.map(independentCompositionFormKeyV0_1))
    .filter((candidate) => candidate !== independentCompositionFormKeyV0_1(form)))];
}

export function independentModifierProbesV0_1(form: string): string[] {
  const key = independentCompositionFormKeyV0_1(form);
  return [...new Set([...smallerForms(form), ...[...key].slice(2).map((_, i) => [...key].slice(0, i + 2).join(""))])];
}

export function independentActivityProbesV0_1(surface: string) {
  const key = independentCompositionFormKeyV0_1(surface);
  const reduced = smallerForms(surface).filter((form) => form.length >= 3 && key.startsWith(form));
  return [
    { lookup: key, covered: [...surface].length },
    ...reduced.flatMap((form) => [
      { lookup: form, covered: [...form].length },
      // Check a nearby lexical form after reduction. The added vowel has no written span.
      { lookup: form + "ë", covered: [...form].length },
    ]),
  ];
}

export function independentComparisonLemmasV0_1(gloss: string) {
  return gloss.toLowerCase().split(/[,;]/u).map((part) => part.trim())
    .filter((part) => /^[a-z]+(?:[ -][a-z]+)*$/u.test(part));
}

// Normalize a small set of semantic equivalents for the first operation. The
// remaining vocabulary can match directly between the activity and comparison.
function activityTerms(gloss: string): string[] {
  // Exclude duration, biography, figurative and other "life" readings when
  // matching a state of living. Retain their source meanings for inspection.
  const nonLivingSense = /\b(lifespan|duration|lifestyle|biography|reality|friend|movement|energy)\b/iu.test(gloss);
  return (gloss.toLowerCase().replace(/\([^)]*\)/gu, " ").match(/[a-z]+/gu) ?? [])
    .filter((word) => word.length >= 3 && !/^(the|and|for|act|being|with|from|some|one|thing|person|group|state|process|together|joint|jointly|mutual|mutually|reciprocal|reciprocally)$/u.test(word))
    .filter((word) => !nonLivingSense || word !== "life")
    .map((word) => {
      if (/^(life|live|lives|living|alive|exist|exists|existing|existence)$/u.test(word)) return "live";
      if (/^work(s|ed|ing)?$/u.test(word)) return "work";
      if (/^(action|actions|acting)$/u.test(word)) return "action";
      return word;
    });
}

function ownedRecord(record: IndependentCompositionRecordV0_1): boolean {
  const encoded = encodeURIComponent(record.form);
  const prefix = `kaikki-albanian-jsonl:word=${encoded}:ordinal=`;
  const ordinal = record.sourceRecordId.slice(prefix.length);
  return record.sourceRecordId.startsWith(prefix) && /^(0|[1-9]\d*)$/u.test(ordinal) &&
    record.entryLocator === `jsonl://word/${encoded}/match/${ordinal}`;
}

function sensesOf(records: readonly IndependentCompositionRecordV0_1[]) {
  return records.flatMap((record) => record.senses.flatMap((sense, senseOrdinal) =>
    sense.glosses.map((gloss) => ({ record, senseOrdinal, gloss })),
  ));
}

function buildJointAlternatives(
  input: IndependentCompositionInputV0_1,
  { end, left, right }: ReturnType<typeof independentCompositionSplitsV0_1>[number],
  recordsFor: (form: string) => IndependentCompositionRecordV0_1[],
) {
  const modifiers = sensesOf(recordsFor(left).filter(isJointModifierV0_1))
    .filter(({ gloss }) => jointnessKind(gloss) !== null);
  if (!modifiers.length) return [];
  const smallerProbes = independentModifierProbesV0_1(left).flatMap((form) => {
    const start = independentCompositionFormKeyV0_1(left).indexOf(form);
    if (start < 0) return [];
    const end = start + [...form].length;
    return [{ form: [...left].slice(start, end).join(""), start, end, records: recordsFor(form), function: null }];
  });
  const activities = independentActivityProbesV0_1(right).flatMap(({ lookup, covered }) => {
    const records = recordsFor(lookup).filter((record) =>
      record.partOfSpeech === "noun" || record.partOfSpeech === "verb",
    );
    return sensesOf(records).map((sense) => ({ ...sense, covered, terms: activityTerms(sense.gloss) }));
  });
  const frames = input.target.senses.flatMap((sense, targetSenseOrdinal) => {
    const lemmas = sense.glosses.flatMap(independentComparisonLemmasV0_1);
    return input.comparisons.flatMap((frame) => {
      const relation = jointnessKind(frame.definition);
      const senseKeyMatches = frame.senseId.startsWith(`${frame.lemma.replaceAll(" ", "_")}%1:`) &&
        /^\d{8}-n$/u.test(frame.synsetId);
      return relation && senseKeyMatches && lemmas.includes(frame.lemma)
        ? [{ frame, relation, terms: activityTerms(frame.definition), targetSenseOrdinal, sense }]
        : [];
    });
  });
  return frames.flatMap(({ frame, relation, terms, targetSenseOrdinal, sense }) =>
    activities.flatMap(({ record, gloss, senseOrdinal, covered, terms: activityKeys }) => {
      const shared = terms.find((term) => activityKeys.includes(term));
      if (!shared) return [];
      const observedActivity = [...right].slice(0, covered).join("");
      const unresolved = [...right].slice(covered).join("");
      const activityMeaning = shared === "live" ? "living" : shared === "work" ? "working" : shared;
      const interaction = relation === "RECIPROCAL"
        ? `The ${activityMeaning} goes between participants, with each acting on or responding to another.`
        : `The participants share the same activity or state: ${activityMeaning} together.`;
      return modifiers.map((modifier) => ({
        modifier: { surface: left, start: 0, end, record: modifier.record, senseOrdinal: modifier.senseOrdinal },
        activity: { surface: observedActivity, start: end, end: end + covered, record, senseOrdinal },
        unresolved: unresolved
          ? [{ surface: unresolved, start: end + covered, end: end + [...right].length, function: null }]
          : [],
        smallerProbes,
        targetSenseOrdinal,
        comparison: frame,
        relation,
        explanation: `“${left}” contributes “${modifier.gloss}”. “${observedActivity}” suggests “${activityMeaning}” using the source sense “${gloss}” of “${record.form}”. ${interaction} This could motivate “${input.inputForm}” in the sense “${sense.glosses.join("; ")}”.`,
      }));
    }),
  );
}

export function buildIndependentFunctionalCompositionV0_1(input: IndependentCompositionInputV0_1) {
  const { inputForm, target, lexicalRecords, comparisons } = input;
  if (target.partOfSpeech !== "noun" || !ownedRecord(target) ||
      independentCompositionFormKeyV0_1(target.form) !== independentCompositionFormKeyV0_1(inputForm)) return null;
  const splits = independentCompositionSplitsV0_1(inputForm);
  if (!splits.length || !lexicalRecords.every(ownedRecord) ||
      new Set(lexicalRecords.map(({ sourceRecordId }) => sourceRecordId)).size !== lexicalRecords.length) return null;

  const recordsFor = (form: string) => lexicalRecords.filter((record) =>
    independentCompositionFormKeyV0_1(record.form) === independentCompositionFormKeyV0_1(form),
  );
  const alternatives = splits.flatMap((split) => buildJointAlternatives(input, split, recordsFor));
  if (!alternatives.length) return null;
  return {
    inputForm,
    status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" as const,
    operation: "JOINT_PARTICIPATION" as const,
    writtenVoices: [...inputForm.normalize("NFC")].flatMap((letter, position) => {
      const voice = letter.toLocaleUpperCase("sq-AL");
      return isSevenVoiceKey(voice) ? [{ voice, position }] : [];
    }),
    smallestEmbryo: null,
    alternatives: [...new Map(alternatives.map((alternative) => [
      JSON.stringify(alternative), alternative,
    ])).values()],
    userDecisionPosture: "user_decides" as const,
    interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
  };
}

export type IndependentFunctionalCompositionV0_1 = NonNullable<
  ReturnType<typeof buildIndependentFunctionalCompositionV0_1>
>;
