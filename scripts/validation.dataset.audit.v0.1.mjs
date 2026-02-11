import fs from "node:fs";

const DATASET = "tests/validation/datasets/validation.dataset.v0.1.json";

function isLatinOnlyWord(w) {
  return /^[\p{Script=Latin}\p{Mark}0-9\s'’\-_,.]+$/u.test(String(w ?? ""));
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const ds = readJson(DATASET);

const errs = [];
const ids = new Set();
const tagCounts = {};
const langCounts = {};
let withIpa = 0;

for (const r of ds) {
  const id = String(r?.id ?? "");
  const lang = String(r?.lang ?? "");
  const word = String(r?.word ?? "");
  const tag = String(r?.semanticTag ?? "");
  const ety = String(r?.knownEtymology ?? "");

  if (!id) errs.push({ id, what: "missing id" });
  if (!lang) errs.push({ id, what: "missing lang" });
  if (!word) errs.push({ id, what: "missing word" });
  if (!tag) errs.push({ id, what: "missing semanticTag" });
  if (!ety) errs.push({ id, what: "missing knownEtymology" });

  if (ids.has(id)) errs.push({ id, what: "duplicate id" });
  ids.add(id);

  if (!isLatinOnlyWord(word)) errs.push({ id, what: "non-latin word", word });

  if (typeof r.ipa === "string" && r.ipa.trim()) withIpa++;

  tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  langCounts[lang] = (langCounts[lang] || 0) + 1;
}

function topK(obj, k = 20) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, k);
}

console.log("dataset:", ds.length, "withIpa:", withIpa);
console.log("langs:", topK(langCounts));
console.log("tags:", topK(tagCounts));

if (errs.length) {
  console.log("\nERRORS:", errs.length);
  console.table(errs.slice(0, 30));
  process.exitCode = 1;
} else {
  console.log("\nOK: audit passed");
}
