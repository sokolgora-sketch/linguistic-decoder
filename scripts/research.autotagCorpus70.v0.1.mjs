import fs from "fs";

const WORDS_PATH = "tests/research/corpus70.words.v0.1.txt";
const META_PATH  = "tests/research/corpus70.meta.v0.1.json";

function readJson(p){ return JSON.parse(fs.readFileSync(p,"utf8")); }
function writeJson(p, obj){ fs.writeFileSync(p, JSON.stringify(obj,null,2) + "\n", "utf8"); }

function parseWords(s){
  return s.split("\n").map(x=>x.trim()).filter(Boolean).map(line=>{
    const [id, word] = line.split("\t");
    if(!id || !word) throw new Error(`Bad line in words file: ${line}`);
    return { id: id.trim(), word: word.trim() };
  });
}

function uniq2(arr){
  const out = [];
  const seen = new Set();
  for (const x of arr) {
    const t = String(x).trim();
    if (!t) continue;
    if (!seen.has(t)) { seen.add(t); out.push(t); }
    if (out.length >= 2) break;
  }
  return out;
}

// Heuristic tags for THIS corpus70 (v0.3 ids).
// Goal: quick pilot. Adjust anytime.
// allowedTags: substance, motion, position, order, identity, cognition, expression, time
const BY_WORD = {
  // A-ish group / misc
  "alba": ["time"],
  "alma": ["cognition"],
  "atë": ["identity"],
  "amë": ["identity"],
  "father": ["identity"],
  "water": ["substance"],
  "star": ["substance"],
  "art": ["expression"],
  "start": ["motion"],
  "charge": ["motion","expression"],

  // E-ish
  "send": ["motion"],
  "erë": ["substance"],
  "emër": ["identity"],
  "express": ["expression"],
  "echo": ["expression"],
  "energy": ["expression"],
  "enter": ["motion"],
  "edge": ["position"],
  "emerge": ["motion"],
  "effort": ["motion"],

  // I-ish
  "lite": ["cognition"],
  "bind": ["order"],
  "fire": ["substance"],
  "bit": ["order"],
  "wire": ["order"],
  "idea": ["cognition"],
  "vision": ["cognition"],
  "direct": ["order"],
  "tip": ["position"],
  "rise": ["motion"],

  // O-ish
  "ora": ["time"],
  "or": ["time"],
  "omë": ["cognition"],
  "hold": ["motion"],
  "go": ["motion"],
  "order": ["order"],
  "open": ["position"],
  "orbit": ["motion"],
  "whole": ["order"],
  "old": ["time"],

  // Schwa-ish / function-ish
  "the": ["order"],
  "about": ["position"],
  "upon": ["position"],
  "another": ["identity"],
  "above": ["position"],
  "allow": ["order"],
  "support": ["order"],
  "balance": ["order"],
  "ëndërr": ["cognition"],
  "ënjtë": ["substance"],

  // U-ish
  "ujë": ["substance"],
  "udhë": ["motion"],
  "rune": ["cognition"],
  "pool": ["substance"],
  "rule": ["order"],
  "under": ["position"],
  "blue": ["substance"],
  "push": ["motion"],
  "pull": ["motion"],
  "truth": ["cognition"],

  // Y-ish
  "yll": ["substance"],
  "yje": ["substance"],
  "synergy": ["order"],
  "crystal": ["substance"],
  "hymn": ["expression"],
  "rhythm": ["expression"],
  "symbol": ["cognition","expression"],
  "mystery": ["cognition"],
  "system": ["order"],
  "cycle": ["time"],
};

function main(){
  const meta = readJson(META_PATH);
  const allowed = new Set(meta.allowedTags || []);
  const words = parseWords(fs.readFileSync(WORDS_PATH,"utf8"));

  let filled = 0;
  let missing = 0;

  for (const {id, word} of words) {
    const guess = BY_WORD[word];
    if (!guess) { missing++; continue; }

    const tags = uniq2(guess);
    for (const t of tags) {
      if (!allowed.has(t)) throw new Error(`Invalid tag "${t}" for word "${word}" (id=${id})`);
    }
    meta.tags[id] = tags;
    if (tags.length) filled++;
  }

  writeJson(META_PATH, meta);

  const total = words.length;
  const empty = total - Object.values(meta.tags||{}).filter(a=>Array.isArray(a)&&a.length>0).length;

  console.log("OK: auto-tagged");
  console.log({ total, filledNow: total - empty, emptyNow: empty, missingWords: missing });
  if (missing) {
    console.log("Missing words (no mapping) will remain empty. Add to BY_WORD if needed.");
  }
}

main();
