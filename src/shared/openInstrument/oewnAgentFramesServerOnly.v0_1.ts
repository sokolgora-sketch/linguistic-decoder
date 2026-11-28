import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { isAbsolute } from "node:path";
import JSZip from "jszip";
import {
  domainToAgentGlossTermsV0_1,
  NATIVE_AGENT_OEWN_SHA256_V0_1,
  type OewnAgentFrameV0_1,
} from "./albanianNativeDomainToAgent.v0_1";
import {
  NATIVE_COGNITIVE_STATE_OEWN_SENSE_ID_BY_LEMMA_V0_1,
  type OewnCognitiveStateFrameV0_1,
} from "./nativeCognitiveStateToContent.v0_1";
import type { IndependentCompositionComparisonV0_1 } from "./independentFunctionalComposition.v0_1";

export const OEWN_AGENT_ARCHIVE_PATH_ENV_V0_1 = "OPEN_INSTRUMENT_OEWN_2025_ARCHIVE_PATH";
const OEWN_ARCHIVE_BYTES = 9_986_555;

type LexicalEntries = Record<string, {
  n?: { sense?: { id: string; synset: string }[] };
  v?: { sense?: { id: string; synset: string }[] };
}>;
type DefinitionSynsets = Record<string, { definition?: string[] }>;
type FrameLookup = (glosses: readonly string[]) => Promise<OewnAgentFrameV0_1[]>;
type CognitiveFrameLookup = (glosses: readonly string[]) => Promise<OewnCognitiveStateFrameV0_1[]>;
type CompositionLookup = (lemmas: readonly string[]) => Promise<IndependentCompositionComparisonV0_1[]>;
type OewnLookups = Readonly<{ agent: FrameLookup; cognitive: CognitiveFrameLookup; composition: CompositionLookup }>;

const COMPOSITION_SYNSET_FILES: Readonly<Record<string, string>> = {
  "04": "noun.act.json",
  "11": "noun.event.json",
  "22": "noun.process.json",
  "24": "noun.relation.json",
  "26": "noun.state.json",
};

let cached: { path: string; lookup: Promise<OewnLookups | null> } | undefined;

async function openFrameLookup(path: string): Promise<OewnLookups | null> {
  try {
    const info = await stat(path);
    if (!info.isFile() || info.size !== OEWN_ARCHIVE_BYTES) return null;
    const bytes = await readFile(path);
    if (bytes.length !== OEWN_ARCHIVE_BYTES ||
      createHash("sha256").update(bytes).digest("hex") !== NATIVE_AGENT_OEWN_SHA256_V0_1) return null;
    const zip = await JSZip.loadAsync(bytes);
    const persons = zip.file("noun.person.json");
    const cognition = zip.file("verb.cognition.json");
    if (!persons || !cognition) return null;
    const synsets = JSON.parse(await persons.async("string")) as DefinitionSynsets;
    const cognitiveSynsets = JSON.parse(await cognition.async("string")) as DefinitionSynsets;
    const files = new Map<string, Promise<LexicalEntries>>();
    const lexicalEntry = async (lemma: string, initial: string) => {
      const member = zip.file(`entries-${initial}.json`);
      if (!member) return undefined;
      let table = files.get(initial);
      if (!table) {
        table = member.async("string").then((data) => JSON.parse(data) as LexicalEntries);
        files.set(initial, table);
      }
      const entries = await table;
      return Object.prototype.hasOwnProperty.call(entries, lemma) ? entries[lemma] : undefined;
    };
    const agent: FrameLookup = async (glosses) => {
      const lemmas = [...new Set(domainToAgentGlossTermsV0_1(glosses).map((gloss) => gloss.toLowerCase()))];
      const results = await Promise.all(lemmas.map(async (lemma) => {
        const initial = lemma[0];
        if (!initial || !/^[a-z]$/u.test(initial)) return [];
        const entry = await lexicalEntry(lemma, initial);
        if (!entry) return [];
        return (entry.n?.sense ?? []).flatMap(({ id, synset }) => {
          const definition = synsets[synset]?.definition?.join("; ");
          return definition ? [{ lemma, senseId: id, synsetId: synset, definition, semanticCategory: "noun.person" as const }] : [];
        });
      }));
      return results.flat();
    };
    const cognitive: CognitiveFrameLookup = async (glosses) => {
      const lemmas = [...new Set(glosses.flatMap((gloss) =>
        (gloss.match(/[a-z]+/giu) ?? []).map((token) => token.toLowerCase()),
      ).filter((lemma) => lemma !== "to"))];
      const results = await Promise.all(lemmas.map(async (lemma) => {
        const initial = lemma[0];
        if (!initial || !/^[a-z]$/u.test(initial)) return [];
        const entry = await lexicalEntry(lemma, initial);
        if (!entry) return [];
        const selectedSenseId = NATIVE_COGNITIVE_STATE_OEWN_SENSE_ID_BY_LEMMA_V0_1[lemma];
        if (!selectedSenseId) return [];
        return (entry.v?.sense ?? []).flatMap(({ id, synset }) => {
          if (id !== selectedSenseId) return [];
          const definition = cognitiveSynsets[synset]?.definition?.join("; ");
          return definition
            ? [{ lemma, senseId: id, synsetId: synset, definition, semanticCategory: "verb.cognition" as const }]
            : [];
        });
      }));
      return results.flat();
    };
    const compositionSynsets = new Map<string, Promise<DefinitionSynsets>>();
    const composition: CompositionLookup = async (lemmas) => {
      const comparisons = await Promise.all([...new Set(lemmas)].map(async (lemma) => {
        const initial = lemma[0];
        if (!initial || !/^[a-z]+(?:[ -][a-z]+)*$/u.test(lemma)) return [];
        const entry = await lexicalEntry(lemma, initial);
        if (!entry) return [];
        return (await Promise.all((entry.n?.sense ?? []).map(async ({ id, synset }) => {
          const lexicalFile = COMPOSITION_SYNSET_FILES[id.split(":")[1] ?? ""];
          if (!lexicalFile) return [];
          const file = zip.file(lexicalFile);
          if (!file) return [];
          let records = compositionSynsets.get(lexicalFile);
          if (!records) {
            records = file.async("string").then((data) => JSON.parse(data) as DefinitionSynsets);
            compositionSynsets.set(lexicalFile, records);
          }
          const definition = (await records)[synset]?.definition?.join("; ");
          return definition ? [{ lemma, senseId: id, synsetId: synset, definition }] : [];
        }))).flat();
      }));
      return comparisons.flat();
    };
    return { agent, cognitive, composition };
  } catch {
    return null;
  }
}

export async function lookupOewnAgentFramesServerOnlyV0_1(
  glosses: readonly string[],
): Promise<OewnAgentFrameV0_1[]> {
  const path = process.env[OEWN_AGENT_ARCHIVE_PATH_ENV_V0_1];
  if (!path || !isAbsolute(path)) return [];
  if (cached?.path !== path) cached = { path, lookup: openFrameLookup(path) };
  const entry = cached;
  try {
    const lookups = await entry.lookup;
    if (lookups) return await lookups.agent(glosses);
  } catch {
    // Unavailable optional source evidence leaves existing readings intact.
  }
  if (cached === entry) cached = undefined;
  return [];
}

export async function lookupOewnCognitiveStateFramesServerOnlyV0_1(
  glosses: readonly string[],
): Promise<OewnCognitiveStateFrameV0_1[]> {
  const path = process.env[OEWN_AGENT_ARCHIVE_PATH_ENV_V0_1];
  if (!path || !isAbsolute(path)) return [];
  if (cached?.path !== path) cached = { path, lookup: openFrameLookup(path) };
  const entry = cached;
  try {
    const lookups = await entry.lookup;
    if (lookups) return await lookups.cognitive(glosses);
  } catch {
    // Unavailable optional cognitive evidence leaves the lexical reading intact.
  }
  if (cached === entry) cached = undefined;
  return [];
}

export async function lookupOewnCompositionComparisonsServerOnlyV0_1(
  lemmas: readonly string[],
): Promise<IndependentCompositionComparisonV0_1[]> {
  const path = process.env[OEWN_AGENT_ARCHIVE_PATH_ENV_V0_1];
  if (!path || !isAbsolute(path)) return [];
  if (cached?.path !== path) cached = { path, lookup: openFrameLookup(path) };
  const entry = cached;
  try {
    const lookups = await entry.lookup;
    if (lookups) return await lookups.composition(lemmas);
  } catch {
    // A missing comparison leaves the existing lexical reading available.
  }
  if (cached === entry) cached = undefined;
  return [];
}
