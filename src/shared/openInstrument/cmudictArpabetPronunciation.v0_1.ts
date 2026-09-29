import { readFileSync } from "node:fs";
import { join } from "node:path";

export const CMUDICT_SOURCE_PROFILE_ID_V0_1 =
  "open-instrument.cmudict-arpabet-en-us.v0_1" as const;
export const CMUDICT_SOURCE_REVISION_V0_1 =
  "74790861f652b15e4ac49015a90074ad62a27690" as const;
export const CMUDICT_SOURCE_NOTATION_V0_1 = "ARPABET" as const;
export const CMUDICT_DATA_SHA256_V0_1 =
  "81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22" as const;
export const CMUDICT_DATA_BYTES_V0_1 = 3618488 as const;

export type CmuDictPronunciationVariantV0_1 = Readonly<{
  lexicalWord: string;
  sourceForm: string;
  variantId: string;
  variantOrder: number;
  sourcePronunciation: string;
  sourceUnits: readonly string[];
  sourceProfileId: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1;
  sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1;
  sourceNotation: typeof CMUDICT_SOURCE_NOTATION_V0_1;
}>;

const DATASET_PATH_V0_1 = join(
  process.cwd(),
  "src/data/openInstrument/pronunciation/cmudict.dict",
);

function normalizeLexicalWordV0_1(word: string): string {
  return String(word ?? "").normalize("NFC").trim().toLowerCase();
}

function splitVariantSuffixV0_1(sourceForm: string): {
  lexicalWord: string;
  variantId: string;
} {
  const match = /^(.*)\((\d+)\)$/.exec(sourceForm);
  if (!match) return { lexicalWord: sourceForm, variantId: "1" };
  return { lexicalWord: match[1], variantId: match[2] };
}

function loadCmuDictV0_1(): ReadonlyMap<string, readonly CmuDictPronunciationVariantV0_1[]> {
  const rows = new Map<string, CmuDictPronunciationVariantV0_1[]>();
  const text = readFileSync(DATASET_PATH_V0_1, "utf8");

  for (const line of text.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(";;;")) continue;

    const separator = trimmed.indexOf(" ");
    if (separator <= 0) continue;

    const sourceForm = trimmed.slice(0, separator);
    const sourcePronunciation = trimmed.slice(separator + 1).trim();
    if (!sourcePronunciation) continue;

    const { lexicalWord, variantId } = splitVariantSuffixV0_1(sourceForm);
    const normalizedWord = normalizeLexicalWordV0_1(lexicalWord);
    if (!normalizedWord) continue;

    const variants = rows.get(normalizedWord) ?? [];
    variants.push(
      Object.freeze({
        lexicalWord: normalizedWord,
        sourceForm,
        variantId,
        variantOrder: variants.length,
        sourcePronunciation,
        sourceUnits: Object.freeze(sourcePronunciation.split(/\s+/u)),
        sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
        sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
        sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
      }),
    );
    rows.set(normalizedWord, variants);
  }

  for (const [word, variants] of rows) {
    rows.set(word, variants);
    Object.freeze(variants);
  }
  return rows;
}

let cachedLexiconV0_1: ReadonlyMap<
  string,
  readonly CmuDictPronunciationVariantV0_1[]
> | null = null;

function lexiconV0_1(): ReadonlyMap<
  string,
  readonly CmuDictPronunciationVariantV0_1[]
> {
  cachedLexiconV0_1 ??= loadCmuDictV0_1();
  return cachedLexiconV0_1;
}

export function normalizeCmuDictLexicalWordV0_1(word: string): string {
  return normalizeLexicalWordV0_1(word);
}

export function lookupCmuDictPronunciationsV0_1(
  word: string,
): readonly CmuDictPronunciationVariantV0_1[] {
  return lexiconV0_1().get(normalizeLexicalWordV0_1(word)) ?? [];
}
