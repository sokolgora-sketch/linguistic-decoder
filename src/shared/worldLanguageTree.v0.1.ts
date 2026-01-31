export type WorldLangNodeType =
  | "root"
  | "family"
  | "branch"
  | "isolate"
  | "proto"
  | "bucket";

export type WorldLangNode = {
  id: string;                // stable machine id (never change once shipped)
  label: string;             // human label (can change later)
  type: WorldLangNodeType;
  parentId?: string | null;
  childrenIds: string[];
  aliases?: string[];        // alias strings for resolving engine labels
};

export type WorldLanguageTreeV01 = {
  version: "world_language_tree.v0.1";
  rootId: "world";
  nodes: Record<string, WorldLangNode>;
};

const n = (
  id: WorldLangNode["id"],
  label: string,
  type: WorldLangNodeType,
  parentId: string | null,
  childrenIds: string[],
  aliases: string[] = []
): WorldLangNode => ({ id, label, type, parentId: parentId ?? undefined, childrenIds, aliases });

export const WORLD_LANGUAGE_TREE_V01: WorldLanguageTreeV01 = {
  version: "world_language_tree.v0.1",
  rootId: "world",
  nodes: {
    // Root
    world: n("world", "WORLD", "root", null, [
      "fam.ie",
      "fam.afro_asiatic",
      "fam.sino_tibetan",
      "fam.austronesian",
      "fam.niger_congo",
      "fam.dravidian",
      "fam.uralic",
      "bucket.isolates",
      "bucket.proto",
      "bucket.unknown",
    ]),

    // Major families
    "fam.ie": n("fam.ie", "Indo-European", "family", "world", [
      "ie.albanian",
      "ie.hellenic",
      "ie.italic",
      "ie.germanic",
      "ie.balto_slavic",
      "ie.indo_iranian",
    ], ["indo-european", "indoeuropean", "ie"]),

    "fam.afro_asiatic": n("fam.afro_asiatic", "Afro-Asiatic", "family", "world", [
      "afro_asiatic.semitic",
    ], ["afro-asiatic", "afroasiatic"]),

    "fam.sino_tibetan": n("fam.sino_tibetan", "Sino-Tibetan", "family", "world", [], [
      "sino-tibetan",
      "sinotibetan",
    ]),

    "fam.austronesian": n("fam.austronesian", "Austronesian", "family", "world", [], [
      "austronesian",
    ]),

    "fam.niger_congo": n("fam.niger_congo", "Niger-Congo", "family", "world", [], [
      "niger-congo",
      "nigercongo",
    ]),

    "fam.dravidian": n("fam.dravidian", "Dravidian", "family", "world", [], [
      "dravidian",
    ]),

    "fam.uralic": n("fam.uralic", "Uralic", "family", "world", [], [
      "uralic",
      "finno-ugric",
      "finnougric",
    ]),

    // IE branches
    "ie.albanian": n("ie.albanian", "Albanian", "branch", "fam.ie", [], [
      "albanian",
      "shqip",
      "shqiperi",
      "sq",
    ]),
    "ie.hellenic": n("ie.hellenic", "Hellenic (Greek)", "branch", "fam.ie", [], [
      "hellenic",
      "greek",
      "ellinika",
      "gr",
    ]),
    "ie.italic": n("ie.italic", "Italic (Latin)", "branch", "fam.ie", [], [
      "italic",
      "latin",
      "la",
    ]),
    "ie.germanic": n("ie.germanic", "Germanic (English)", "branch", "fam.ie", [], [
      "germanic",
      "english",
      "en",
    ]),
    "ie.balto_slavic": n("ie.balto_slavic", "Balto-Slavic (Slavic)", "branch", "fam.ie", [], [
      "balto-slavic",
      "baltoslavic",
      "slavic",
      "baltic",
    ]),
    "ie.indo_iranian": n("ie.indo_iranian", "Indo-Iranian (Sanskrit)", "branch", "fam.ie", [], [
      "indo-iranian",
      "indoiranian",
      "sanskrit",
      "sa",
    ]),

    // Afro-Asiatic branch
    "afro_asiatic.semitic": n("afro_asiatic.semitic", "Semitic", "branch", "fam.afro_asiatic", [], [
      "semitic",
      "arabic",
      "hebrew",
      "ar",
      "he",
    ]),

    // Buckets
    "bucket.isolates": n("bucket.isolates", "Language Isolates / Special", "bucket", "world", [
      "iso.sumerian",
      "iso.basque",
    ], ["isolates", "isolate", "special"]),

    "iso.sumerian": n("iso.sumerian", "Sumerian", "isolate", "bucket.isolates", [], [
      "sumerian",
      "sumer",
      "sux",
    ]),
    "iso.basque": n("iso.basque", "Basque", "isolate", "bucket.isolates", [], [
      "basque",
      "euskara",
      "eu",
    ]),

    "bucket.proto": n("bucket.proto", "Proto / Reconstructed", "bucket", "world", [
      "proto.pie",
    ], ["proto", "reconstructed"]),

    "proto.pie": n("proto.pie", "Proto-Indo-European (PIE)", "proto", "bucket.proto", [], [
      "pie",
      "proto-indo-european",
      "protoindoeuropean",
      "proto indo european",
    ]),

    "bucket.unknown": n("bucket.unknown", "Other / Unknown", "bucket", "world", [], [
      "unknown",
      "other",
    ]),
  },
};

// Resolve a node ID from an engine/emitted label (language/family/etc).
// This is NOT proof. It’s a visualization mapping.
export function resolveWorldLangNodeId(input: string | null | undefined): string {
  const s = String(input ?? "").trim().toLowerCase();
  if (!s) return "bucket.unknown";

  // direct id hit
  if ((WORLD_LANGUAGE_TREE_V01.nodes as any)[s]) return s;

  // alias match
  for (const node of Object.values(WORLD_LANGUAGE_TREE_V01.nodes)) {
    const aliases = (node.aliases ?? []).map((a) => a.toLowerCase());
    if (aliases.includes(s)) return node.id;
  }

  // small normalization (strip punctuation/spaces)
  const compact = s.replace(/[^a-z0-9]+/g, "");
  for (const node of Object.values(WORLD_LANGUAGE_TREE_V01.nodes)) {
    const aliases = (node.aliases ?? []).map((a) => a.toLowerCase().replace(/[^a-z0-9]+/g, ""));
    if (aliases.includes(compact)) return node.id;
  }

  return "bucket.unknown";
}
