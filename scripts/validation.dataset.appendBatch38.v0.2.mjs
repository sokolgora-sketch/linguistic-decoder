import fs from "node:fs";
import path from "node:path";

const DATASET = "tests/validation/datasets/validation.dataset.v0.2.json";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, x) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(x, null, 2) + "\n", "utf8");
}

const ds = readJson(DATASET);
if (!Array.isArray(ds)) {
  console.error("ERROR: dataset is not an array:", DATASET);
  process.exit(1);
}

const additions = [
  // -------------------- GREEK (el) --------------------
  {
    id: "el_kyklos_v0_2",
    lang: "el",
    word: "κύκλος",
    ipa: "/ˈciklos/",
    semanticTag: "tool",
    knownEtymology: "Greek κύκλος (circle).",
    notes: "Orthography expects Y,O (υ,ο). IPA uses i,o."
  },
  {
    id: "el_mythos_v0_2",
    lang: "el",
    word: "μύθος",
    ipa: "/ˈmiθos/",
    semanticTag: "culture",
    knownEtymology: "Greek μῦθος (myth).",
    notes: "Orthography expects Y,O. IPA uses i,o."
  },
  {
    id: "el_logos_v0_2",
    lang: "el",
    word: "λόγος",
    ipa: "/ˈloɣos/",
    semanticTag: "systems",
    knownEtymology: "Greek λόγος (word/reason).",
    notes: "Orthography O,O. IPA uses o,o."
  },
  {
    id: "el_nomos_v0_2",
    lang: "el",
    word: "νόμος",
    ipa: "/ˈnomos/",
    semanticTag: "law",
    knownEtymology: "Greek νόμος (law).",
    notes: "Orthography O,O. IPA uses o,o."
  },
  {
    id: "el_psyche_v0_2",
    lang: "el",
    word: "ψυχή",
    ipa: "/psiˈçi/",
    semanticTag: "emotion",
    knownEtymology: "Greek ψυχή (soul).",
    notes: "Orthography Y,E (υ,ή). IPA uses i,i (Modern Greek)."
  },
  {
    id: "el_kardia_v0_2",
    lang: "el",
    word: "καρδία",
    ipa: "/karˈði.a/",
    semanticTag: "body",
    knownEtymology: "Greek καρδία (heart).",
    notes: "Orthography A,I,A. IPA uses a,i,a."
  },
  {
    id: "el_soma_v0_2",
    lang: "el",
    word: "σώμα",
    ipa: "/ˈsoma/",
    semanticTag: "body",
    knownEtymology: "Greek σῶμα (body).",
    notes: "Orthography O,A. IPA uses o,a."
  },
  {
    id: "el_gaia_poly_v0_2",
    lang: "el",
    word: "γαῖα",
    ipa: "/ˈɣaia/",
    semanticTag: "nature",
    knownEtymology: "Greek γαῖα (earth).",
    notes: "Polytonic; exercises NFD fallback. Orthography A,A. IPA a,i,a."
  },
  {
    id: "el_thalassa_v0_2",
    lang: "el",
    word: "θάλασσα",
    ipa: "/ˈθalasa/",
    semanticTag: "nature",
    knownEtymology: "Greek θάλασσα (sea).",
    notes: "Orthography A,A,A. IPA a,a,a."
  },
  {
    id: "el_ouranos_poly_v0_2",
    lang: "el",
    word: "οὐρανός",
    ipa: "/u.raˈnos/",
    semanticTag: "nature",
    knownEtymology: "Greek οὐρανός (sky).",
    notes: "Polytonic digraph οὐ. Orthography O,A,O. IPA u,a,o."
  },
  {
    id: "el_meli_v0_2",
    lang: "el",
    word: "μέλι",
    ipa: "/ˈmeli/",
    semanticTag: "food",
    knownEtymology: "Greek μέλι (honey).",
    notes: "Orthography E,I. IPA e,i."
  },
  {
    id: "el_oinos_poly_v0_2",
    lang: "el",
    word: "οἶνος",
    ipa: "/ˈinos/",
    semanticTag: "food",
    knownEtymology: "Greek οἶνος (wine).",
    notes: "Polytonic; orthography O,I,O. IPA i,o."
  },

  // -------------------- ENGLISH (en) --------------------
  { id: "en_mother_v0_2", lang: "en", word: "mother", ipa: "/ˈmʌðər/", semanticTag: "kinship", knownEtymology: "TODO: verify.", notes: "ʌ + ə only." },
  { id: "en_brother_v0_2", lang: "en", word: "brother", ipa: "/ˈbrʌðər/", semanticTag: "kinship", knownEtymology: "TODO: verify.", notes: "ʌ + ə only." },
  { id: "en_sister_v0_2", lang: "en", word: "sister", ipa: "/ˈsɪstər/", semanticTag: "kinship", knownEtymology: "TODO: verify.", notes: "ɪ + ə only." },
  { id: "en_son_v0_2", lang: "en", word: "son", ipa: "/sʌn/", semanticTag: "kinship", knownEtymology: "TODO: verify.", notes: "ʌ only." },
  { id: "en_daughter_v0_2", lang: "en", word: "daughter", ipa: "/ˈdɔːtər/", semanticTag: "kinship", knownEtymology: "TODO: verify.", notes: "ɔ + ə only." },
  { id: "en_blood_v0_2", lang: "en", word: "blood", ipa: "/blʌd/", semanticTag: "body", knownEtymology: "TODO: verify.", notes: "ʌ only." },
  { id: "en_heart_v0_2", lang: "en", word: "heart", ipa: "/hɑːrt/", semanticTag: "body", knownEtymology: "TODO: verify.", notes: "ɑ only." },
  { id: "en_bone_v0_2", lang: "en", word: "bone", ipa: "/boʊn/", semanticTag: "body", knownEtymology: "TODO: verify.", notes: "o + ʊ only." },
  { id: "en_breath_v0_2", lang: "en", word: "breath", ipa: "/brɛθ/", semanticTag: "body", knownEtymology: "TODO: verify.", notes: "ɛ only." },
  { id: "en_sun_v0_2", lang: "en", word: "sun", ipa: "/sʌn/", semanticTag: "nature", knownEtymology: "TODO: verify.", notes: "ʌ only." },
  { id: "en_moon_v0_2", lang: "en", word: "moon", ipa: "/muːn/", semanticTag: "nature", knownEtymology: "TODO: verify.", notes: "u only." },
  { id: "en_tree_v0_2", lang: "en", word: "tree", ipa: "/triː/", semanticTag: "nature", knownEtymology: "TODO: verify.", notes: "i only." },

  // -------------------- ITALIAN (it) --------------------
  { id: "it_madre_v0_2", lang: "it", word: "madre", ipa: "/ˈma.dre/", semanticTag: "kinship", knownEtymology: "TODO: verify.", notes: "a,e." },
  { id: "it_padre_v0_2", lang: "it", word: "padre", ipa: "/ˈpa.dre/", semanticTag: "kinship", knownEtymology: "TODO: verify.", notes: "a,e." },
  { id: "it_acqua_v0_2", lang: "it", word: "acqua", ipa: "/ˈak.kwa/", semanticTag: "nature", knownEtymology: "TODO: verify.", notes: "a,a." },
  { id: "it_mare_v0_2", lang: "it", word: "mare", ipa: "/ˈma.re/", semanticTag: "nature", knownEtymology: "TODO: verify.", notes: "a,e." },
  { id: "it_pane_v0_2", lang: "it", word: "pane", ipa: "/ˈpa.ne/", semanticTag: "food", knownEtymology: "TODO: verify.", notes: "a,e." },
  { id: "it_vino_v0_2", lang: "it", word: "vino", ipa: "/ˈvi.no/", semanticTag: "food", knownEtymology: "TODO: verify.", notes: "i,o." },
  { id: "it_cuore_v0_2", lang: "it", word: "cuore", ipa: "/ˈkwɔ.re/", semanticTag: "body", knownEtymology: "TODO: verify.", notes: "ɔ,e." },

  // -------------------- ALBANIAN (sq) --------------------
  { id: "sq_nene_v0_2", lang: "sq", word: "nënë", ipa: "/ˈnənə/", semanticTag: "kinship", knownEtymology: "TODO: verify.", notes: "ë -> ə." },
  { id: "sq_babe_v0_2", lang: "sq", word: "babë", ipa: "/babə/", semanticTag: "kinship", knownEtymology: "TODO: verify.", notes: "ë -> ə." },
  { id: "sq_zemer_v0_2", lang: "sq", word: "zemër", ipa: "/ˈzɛmər/", semanticTag: "body", knownEtymology: "TODO: verify.", notes: "ɛ + ə." },
  { id: "sq_gjak_v0_2", lang: "sq", word: "gjak", ipa: "/ɟak/", semanticTag: "body", knownEtymology: "TODO: verify.", notes: "a only." },
  { id: "sq_uje_v0_2", lang: "sq", word: "ujë", ipa: "/ˈujə/", semanticTag: "nature", knownEtymology: "TODO: verify.", notes: "u + ə." },
  { id: "sq_diell_v0_2", lang: "sq", word: "diell", ipa: "/diˈɛl/", semanticTag: "nature", knownEtymology: "TODO: verify.", notes: "i + ɛ." },
  { id: "sq_kulture_v0_2", lang: "sq", word: "kulturë", ipa: "/kulˈturə/", semanticTag: "systems", knownEtymology: "TODO: verify.", notes: "u,u + ə." },
];

const existing = new Set(ds.map((r) => String(r?.id ?? "")));
const dup = additions.filter((r) => existing.has(r.id)).map((r) => r.id);
if (dup.length) {
  console.error("ERROR: duplicate ids already in dataset:", dup);
  process.exit(1);
}

ds.push(...additions);
writeJson(DATASET, ds);

console.log("OK: appended", additions.length, "records");
console.log("OK: dataset now", ds.length, "records");
