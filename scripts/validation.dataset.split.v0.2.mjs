import fs from "node:fs";
import path from "node:path";

const DATASET = "tests/validation/datasets/validation.dataset.v0.2.json";
const TRAIN = "tests/validation/datasets/validation.train.v0.2.json";
const HOLDOUT = "tests/validation/datasets/validation.holdout.v0.2.json";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJson(p, x) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(x, null, 2) + "\n", "utf8");
}

function isLatinOrGreekWord(w) {
  return /^[\p{Script=Latin}\p{Script=Greek}\p{Mark}0-9\s'’\-_,.]+$/u.test(String(w ?? ""));
}

function fnv1a32(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const ds0 = readJson(DATASET);

// enforce latin/greek-only dataset at the split boundary
const bad = ds0.filter((r) => !isLatinOrGreekWord(r?.word));
if (bad.length) {
  console.error("ERROR: non latin/greek words present. Fix dataset first.");
  console.table(bad.map((r) => ({ id: r.id, lang: r.lang, word: r.word })));
  process.exit(1);
}

const ids = ds0.map((r) => String(r.id)).filter(Boolean).slice().sort((a,b)=>a.localeCompare(b));

const train = [];
const holdout = [];

for (const id of ids) {
  const h = fnv1a32(id);
  (h % 10 < 8 ? train : holdout).push(id);
}

writeJson(TRAIN, train);
writeJson(HOLDOUT, holdout);

console.log("wrote splits:", { dataset: ids.length, train: train.length, holdout: holdout.length });
