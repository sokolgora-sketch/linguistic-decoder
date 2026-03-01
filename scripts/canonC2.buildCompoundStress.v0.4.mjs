import fs from "fs";
import path from "path";

const SRC = "tests/research/albanian200.compoundStress.v0.2.txt";
const OUT_TRAIN = "tests/validation/datasets/canonC2.train.v0.4.json";
const OUT_HOLD = "tests/validation/datasets/canonC2.holdout.v0.4.json";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function parseNum(id) {
  // id like "cs.01"
  const m = /^cs\.(\d+)/.exec(id);
  return m ? Number(m[1]) : null;
}

function stableSortById(a, b) {
  return String(a.id).localeCompare(String(b.id));
}

const raw = fs.readFileSync(SRC, "utf8");
const lines = raw.split(/\r?\n/);

const train = [];
const hold = [];

for (const line0 of lines) {
  const line = line0.trim();
  if (!line) continue;
  if (line.startsWith("#")) continue;

  // whitespace columns:
  // cs.01  word  /ipa/  tag  anchor  /anchor_ipa/
  const cols = line.split(/\s+/g);
  if (cols.length < 3) continue;

  const srcId = cols[0];
  const word = cols[1];
  const ipa = cols[2];

  const n = parseNum(srcId);
  const isTrain = (n == null) ? true : (n % 2 === 1); // odd=train, even=holdout (balanced)

  const caseId = `${isTrain ? "train" : "holdout"}.${srcId}`;

  const c = { id: caseId, word, mode: "strict", ipa };

  if (isTrain) train.push(c);
  else hold.push(c);
}

train.sort(stableSortById);
hold.sort(stableSortById);

const outTrain = { version: "canonC2.train.v0.4", cases: train };
const outHold = { version: "canonC2.holdout.v0.4", cases: hold };

fs.mkdirSync(path.dirname(OUT_TRAIN), { recursive: true });

fs.writeFileSync(OUT_TRAIN, JSON.stringify(outTrain, null, 2) + "\n", "utf8");
fs.writeFileSync(OUT_HOLD, JSON.stringify(outHold, null, 2) + "\n", "utf8");

console.log("OK wrote:", { train: train.length, holdout: hold.length });
console.log(" -", OUT_TRAIN);
console.log(" -", OUT_HOLD);
