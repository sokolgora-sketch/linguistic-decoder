import type { VowelVoice } from "../vowels/vowelVoices.v0.1";
import { extractFeaturesV0_1 } from "./extractFeatures.v0.1";

export type ValidationRecordV01 = {
  id: string;
  lang: string;
  word: string;
  ipa?: string;
  semanticTag: string;
  knownEtymology: string;
  notes?: string;
};

export type ValidationRunResultV01 = {
  version: "0.1";
  dataset: {
    count: number;
    withIpa: number;
    tagDist: Array<{ tag: string; count: number }>;
    langDist: Array<{ lang: string; count: number }>;
  };
  mismatch: {
    mismatchCount: number;
    mismatchRate: number; // among withIpa
  };
  clustering: {
    voiceSpace: {
      withinAvg: number;
      acrossAvg: number;
      delta: number;
      pairs: { within: number; across: number };
    };
    baselines: {
      vowelCount: {
        withinAvg: number;
        acrossAvg: number;
        delta: number;
        pairs: { within: number; across: number };
      };
      orthography: {
        withinAvg: number;
        acrossAvg: number;
        delta: number;
        pairs: { within: number; across: number };
      };
      shuffledTagsControl: {
        withinAvg: number;
        acrossAvg: number;
        delta: number;
        pairs: { within: number; across: number };
      };
    };
  };
  topMismatches: Array<{
    id: string;
    lang: string;
    word: string;
    ipa: string;
    orthographyVoices: VowelVoice[];
    phoneticVoices: VowelVoice[];
    distance: number;
  }>;
  diagnostics: {
    orthographyUnmappedTop: Array<{ sym: string; count: number }>;
    ipaUnmappedTop: Array<{ sym: string; count: number }>;
    notesCount: number;
  };
};

function round6(n: number): number {
  return Math.round(n * 1_000_000) / 1_000_000;
}

function fnv1a32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function distPairsSorted(rec: Record<string, number>): Array<{ key: string; count: number }> {
  return Object.entries(rec)
    .map(([k, v]) => ({ key: k, count: v }))
    .sort((a, b) => (b.count - a.count) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

function levenshteinVoices(a: readonly VowelVoice[], b: readonly VowelVoice[]): number {
  const n = a.length;
  const m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;

  const dp = new Array<number>(m + 1);
  for (let j = 0; j <= m; j++) dp[j] = j;

  for (let i = 1; i <= n; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= m; j++) {
      const tmp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1, // delete
        dp[j - 1] + 1, // insert
        prev + cost // substitute
      );
      prev = tmp;
    }
  }
  return dp[m];
}

function computeWithinAcross<T>(
  items: readonly T[],
  tagOf: (x: T) => string,
  dist: (a: T, b: T) => number
): { withinAvg: number; acrossAvg: number; delta: number; pairs: { within: number; across: number } } {
  let withinSum = 0;
  let acrossSum = 0;
  let withinN = 0;
  let acrossN = 0;

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const di = dist(items[i], items[j]);
      if (tagOf(items[i]) === tagOf(items[j])) {
        withinSum += di;
        withinN++;
      } else {
        acrossSum += di;
        acrossN++;
      }
    }
  }

  const withinAvg = withinN ? withinSum / withinN : 0;
  const acrossAvg = acrossN ? acrossSum / acrossN : 0;
  return {
    withinAvg: round6(withinAvg),
    acrossAvg: round6(acrossAvg),
    delta: round6(acrossAvg - withinAvg),
    pairs: { within: withinN, across: acrossN },
  };
}

function shuffledTagMap(records: readonly ValidationRecordV01[], seed: string): Record<string, string> {
  const ids = records.map((r) => r.id).slice().sort();

  const tagById: Record<string, string> = {};
  for (const r of records) tagById[r.id] = r.semanticTag;

  const tagsInStableOrder = ids.map((id) => tagById[id] ?? "unknown");
  const permIds = ids.slice().sort((a, b) => fnv1a32(seed + "|" + a) - fnv1a32(seed + "|" + b));

  const out: Record<string, string> = {};
  for (let i = 0; i < permIds.length; i++) {
    out[permIds[i]] = tagsInStableOrder[i];
  }
  return out;
}

export function computeValidationResultsV0_1(records: ValidationRecordV01[]): ValidationRunResultV01 {
  const tagCounts: Record<string, number> = {};
  const langCounts: Record<string, number> = {};

  for (const r of records) {
    tagCounts[r.semanticTag] = (tagCounts[r.semanticTag] || 0) + 1;
    langCounts[r.lang] = (langCounts[r.lang] || 0) + 1;
  }

  const items = records.map((r) => {
    const f = extractFeaturesV0_1({ word: r.word, lang: r.lang, ipa: r.ipa });
    const mainVoices =
      f.phoneticVoices && f.phoneticVoices.length ? f.phoneticVoices : f.orthographyVoices;

    return {
      r,
      f,
      mainVoices,
      orthoVoices: f.orthographyVoices,
      ipaVoices: f.phoneticVoices ?? [],
    };
  });

  const withIpa = records.filter((r) => typeof r.ipa === "string" && r.ipa.trim().length > 0).length;
  const mismatchItems = items.filter((x) => x.r.ipa && x.f.maskCarrierMismatch);

  const topMismatches = mismatchItems
    .map((x) => ({
      id: x.r.id,
      lang: x.r.lang,
      word: x.r.word,
      ipa: String(x.r.ipa),
      orthographyVoices: x.orthoVoices,
      phoneticVoices: x.ipaVoices,
      distance: levenshteinVoices(x.orthoVoices, x.ipaVoices),
    }))
    .sort((a, b) => (b.distance - a.distance) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .slice(0, 10);

  const mismatchRate = withIpa ? mismatchItems.length / withIpa : 0;

  const orthoUnmappedFreq: Record<string, number> = {};
  const ipaUnmappedFreq: Record<string, number> = {};
  let notesCount = 0;

  for (const it of items) {
    for (const s of it.f.diagnostics.orthographyUnmapped || []) {
      orthoUnmappedFreq[s] = (orthoUnmappedFreq[s] || 0) + 1;
    }
    for (const s of it.f.diagnostics.ipaUnmapped || []) {
      ipaUnmappedFreq[s] = (ipaUnmappedFreq[s] || 0) + 1;
    }
    if (it.f.diagnostics.notes && it.f.diagnostics.notes.length) {
      notesCount += it.f.diagnostics.notes.length;
    }
  }

  const orthoUnmappedTop = distPairsSorted(orthoUnmappedFreq)
    .slice(0, 10)
    .map((x) => ({ sym: x.key, count: x.count }));

  const ipaUnmappedTop = distPairsSorted(ipaUnmappedFreq)
    .slice(0, 10)
    .map((x) => ({ sym: x.key, count: x.count }));

  const voiceSpace = computeWithinAcross(
    items,
    (x) => x.r.semanticTag,
    (a, b) => levenshteinVoices(a.mainVoices, b.mainVoices)
  );

  const baselineVowelCount = computeWithinAcross(
    items,
    (x) => x.r.semanticTag,
    (a, b) => Math.abs(a.mainVoices.length - b.mainVoices.length)
  );

  const baselineOrthography = computeWithinAcross(
    items,
    (x) => x.r.semanticTag,
    (a, b) => levenshteinVoices(a.orthoVoices, b.orthoVoices)
  );

  const shuffledTags = shuffledTagMap(records, "validation.v0.1");
  const shuffledTagsControl = computeWithinAcross(
    items,
    (x) => shuffledTags[x.r.id] ?? "unknown",
    (a, b) => levenshteinVoices(a.mainVoices, b.mainVoices)
  );

  return {
    version: "0.1",
    dataset: {
      count: records.length,
      withIpa,
      tagDist: distPairsSorted(tagCounts).map((x) => ({ tag: x.key, count: x.count })),
      langDist: distPairsSorted(langCounts).map((x) => ({ lang: x.key, count: x.count })),
    },
    mismatch: {
      mismatchCount: mismatchItems.length,
      mismatchRate: round6(mismatchRate),
    },
    clustering: {
      voiceSpace,
      baselines: {
        vowelCount: baselineVowelCount,
        orthography: baselineOrthography,
        shuffledTagsControl,
      },
    },
    topMismatches,
    diagnostics: {
      orthographyUnmappedTop: orthoUnmappedTop,
      ipaUnmappedTop: ipaUnmappedTop,
      notesCount,
    },
  };
}
