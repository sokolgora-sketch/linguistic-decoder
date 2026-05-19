// Language Registry v0.1 — known human language whitelist for LANG_KNOWN verifier rule.
//
// Scope (Phase 2, v1.2a):
//   - Current canon languages (Albanian, Latin)
//   - Major living languages relevant to ZË-RO cohort coverage
//   - Selected historical languages that appear in etymology discussions
//
// Deliberately absent (do not add silently):
//   - Constructed languages: Klingon, Quenya, Sindarin, Esperanto, Interlingua, Volapük
//   - Reconstructed languages: Proto-Indo-European, Proto-Semitic, etc. — require explicit decision
//   - Languages without ZË-RO research relevance yet: many real languages are simply not in scope
//
// Expansion path (future PRs):
//   - Add living languages as Cohort 03 or Open Instrument needs them
//   - Add historical languages when canon/research requires them
//   - Reconstructed languages: discuss methodologically before adding (they are hypotheses, not attested data)

export type LanguageStatus = "living" | "historical";

export type LanguageRegistryEntry = {
  canonicalName: string;
  iso6393: string;
  aliases: readonly string[];
  status: LanguageStatus;
};

export const LANGUAGE_REGISTRY_V0_1: readonly LanguageRegistryEntry[] = Object.freeze([
  // Current canon
  { canonicalName: "Albanian", iso6393: "sqi", aliases: ["sq", "alb"], status: "living" },
  { canonicalName: "Latin", iso6393: "lat", aliases: ["la"], status: "historical" },

  // Major living languages — Indo-European
  { canonicalName: "English", iso6393: "eng", aliases: ["en"], status: "living" },
  { canonicalName: "German", iso6393: "deu", aliases: ["de", "ger"], status: "living" },
  { canonicalName: "French", iso6393: "fra", aliases: ["fr", "fre"], status: "living" },
  { canonicalName: "Italian", iso6393: "ita", aliases: ["it"], status: "living" },
  { canonicalName: "Spanish", iso6393: "spa", aliases: ["es"], status: "living" },
  { canonicalName: "Portuguese", iso6393: "por", aliases: ["pt"], status: "living" },
  { canonicalName: "Russian", iso6393: "rus", aliases: ["ru"], status: "living" },
  { canonicalName: "Greek", iso6393: "ell", aliases: ["el", "gre"], status: "living" },
  { canonicalName: "Norwegian", iso6393: "nor", aliases: ["no"], status: "living" },
  { canonicalName: "Danish", iso6393: "dan", aliases: ["da"], status: "living" },
  { canonicalName: "Swedish", iso6393: "swe", aliases: ["sv"], status: "living" },
  { canonicalName: "Romanian", iso6393: "ron", aliases: ["ro", "rum"], status: "living" },
  { canonicalName: "Hindi", iso6393: "hin", aliases: ["hi"], status: "living" },
  { canonicalName: "Persian", iso6393: "fas", aliases: ["fa", "per"], status: "living" },

  // Major living languages — other families
  { canonicalName: "Mandarin", iso6393: "cmn", aliases: ["zh", "zho", "chi"], status: "living" },
  { canonicalName: "Arabic", iso6393: "arb", aliases: ["ar", "ara"], status: "living" },
  { canonicalName: "Hebrew", iso6393: "heb", aliases: ["he", "iw"], status: "living" },
  { canonicalName: "Finnish", iso6393: "fin", aliases: ["fi"], status: "living" },
  { canonicalName: "Turkish", iso6393: "tur", aliases: ["tr"], status: "living" },
  { canonicalName: "Hungarian", iso6393: "hun", aliases: ["hu"], status: "living" },
  { canonicalName: "Japanese", iso6393: "jpn", aliases: ["ja"], status: "living" },
  { canonicalName: "Korean", iso6393: "kor", aliases: ["ko"], status: "living" },
  { canonicalName: "Vietnamese", iso6393: "vie", aliases: ["vi"], status: "living" },
  { canonicalName: "Indonesian", iso6393: "ind", aliases: ["id"], status: "living" },

  // Historical languages
  { canonicalName: "Ancient Greek", iso6393: "grc", aliases: [], status: "historical" },
  { canonicalName: "Sanskrit", iso6393: "san", aliases: ["sa"], status: "historical" },
]);

// Build a lookup set lazily — frozen registry above is the source of truth.
// All comparisons are case-insensitive and trimmed.
const LOOKUP_SET_V0_1: ReadonlySet<string> = (() => {
  const s = new Set<string>();
  for (const entry of LANGUAGE_REGISTRY_V0_1) {
    s.add(entry.canonicalName.toLowerCase());
    s.add(entry.iso6393.toLowerCase());
    for (const alias of entry.aliases) s.add(alias.toLowerCase());
  }
  return s;
})();

/**
 * Returns true if `input` is a recognized human language in the v0.1 registry.
 *
 * Acceptance rules:
 *   - Matches canonicalName (case-insensitive, trimmed)
 *   - Matches iso6393 code (case-insensitive, trimmed)
 *   - Matches any alias including ISO 639-1 two-letter codes
 *
 * Rejection rules:
 *   - Non-string input
 *   - Empty/whitespace-only string
 *   - String not present in registry under any field
 */
export function isKnownLanguageV0_1(input: unknown): boolean {
  if (typeof input !== "string") return false;
  const normalized = input.trim().toLowerCase();
  if (!normalized) return false;
  return LOOKUP_SET_V0_1.has(normalized);
}
