import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { isAbsolute } from "node:path";
import JSZip from "jszip";
import {
  domainToAgentGlossTermsV0_1,
  NATIVE_AGENT_OEWN_SHA256_V0_1,
  type OewnAgentFrameV0_1,
} from "./albanianNativeDomainToAgent.v0_1";

export const OEWN_AGENT_ARCHIVE_PATH_ENV_V0_1 = "OPEN_INSTRUMENT_OEWN_2025_ARCHIVE_PATH";
const OEWN_ARCHIVE_BYTES = 9_986_555;

type NounEntries = Record<string, { n?: { sense?: { id: string; synset: string }[] } }>;
type PersonSynsets = Record<string, { definition?: string[] }>;
type FrameLookup = (glosses: readonly string[]) => Promise<OewnAgentFrameV0_1[]>;

let cached: { path: string; lookup: Promise<FrameLookup | null> } | undefined;

async function openFrameLookup(path: string): Promise<FrameLookup | null> {
  try {
    const info = await stat(path);
    if (!info.isFile() || info.size !== OEWN_ARCHIVE_BYTES) return null;
    const bytes = await readFile(path);
    if (bytes.length !== OEWN_ARCHIVE_BYTES ||
      createHash("sha256").update(bytes).digest("hex") !== NATIVE_AGENT_OEWN_SHA256_V0_1) return null;
    const zip = await JSZip.loadAsync(bytes);
    const persons = zip.file("noun.person.json");
    if (!persons) return null;
    const synsets = JSON.parse(await persons.async("string")) as PersonSynsets;
    const files = new Map<string, Promise<NounEntries>>();
    return async (glosses) => {
      const lemmas = [...new Set(domainToAgentGlossTermsV0_1(glosses).map((gloss) => gloss.toLowerCase()))];
      const results = await Promise.all(lemmas.map(async (lemma) => {
        const initial = lemma[0];
        if (!initial || !/^[a-z]$/u.test(initial)) return [];
        const member = zip.file(`entries-${initial}.json`);
        if (!member) return [];
        let table = files.get(initial);
        if (!table) {
          table = member.async("string").then((data) => JSON.parse(data) as NounEntries);
          files.set(initial, table);
        }
        const entries = await table;
        if (!Object.prototype.hasOwnProperty.call(entries, lemma)) return [];
        return (entries[lemma]?.n?.sense ?? []).flatMap(({ id, synset }) => {
          const definition = synsets[synset]?.definition?.join("; ");
          return definition ? [{ lemma, senseId: id, synsetId: synset, definition }] : [];
        });
      }));
      return results.flat();
    };
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
    const lookup = await entry.lookup;
    if (lookup) return await lookup(glosses);
  } catch {
    // Unavailable optional source evidence leaves existing readings intact.
  }
  if (cached === entry) cached = undefined;
  return [];
}
