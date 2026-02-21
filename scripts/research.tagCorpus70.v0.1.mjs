import fs from "fs";
import readline from "readline";

const WORDS_PATH = "tests/research/corpus70.words.v0.1.txt";
const META_PATH  = "tests/research/corpus70.meta.v0.1.json";

function die(msg) {
  console.error("ERROR:", msg);
  process.exit(1);
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function parseWordsFile(s) {
  const lines = s.split("\n").map(x => x.trim()).filter(Boolean);
  const out = [];
  for (const line of lines) {
    const [id, word] = line.split("\t");
    if (!id || !word) die(`Bad words line (expected "id<TAB>word"): ${line}`);
    out.push({ id: id.trim(), word: word.trim() });
  }
  return out;
}

function uniq(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    if (!seen.has(x)) { seen.add(x); out.push(x); }
  }
  return out;
}

function helpText(allowed) {
  return [
    "",
    "Allowed tags:",
    "  " + allowed.join(", "),
    "",
    "Definitions (use as a guide):",
    "  substance   = elements/materials (water/fire/air etc)",
    "  motion      = move/send/pull/enter/rise etc",
    "  position    = above/under/open/upon etc",
    "  order       = rule/order/balance/whole/system etc",
    "  identity    = father/name/self markers",
    "  cognition   = idea/vision/mystery/truth etc",
    "  expression  = express/echo/energy etc",
    "  time        = old/or/ora etc",
    "",
    "Commands:",
    "  ? / help    = show this help",
    "  b           = back one word",
    "  s / skip    = keep tags empty and move on",
    "  c / clear   = clear tags for current id (sets to [])",
    "  j N         = jump to index N (1-based)",
    "  q           = quit (saves progress)",
    "",
    "Input format:",
    "  Enter 1–2 tags separated by spaces or commas, e.g.:",
    "    motion",
    "    cognition, expression",
    ""
  ].join("\n");
}

async function main() {
  if (!fs.existsSync(WORDS_PATH)) die(`Missing ${WORDS_PATH}`);
  if (!fs.existsSync(META_PATH)) die(`Missing ${META_PATH}`);

  const words = parseWordsFile(fs.readFileSync(WORDS_PATH, "utf8"));
  const meta = readJson(META_PATH);

  if (!Array.isArray(meta.allowedTags) || meta.allowedTags.length === 0) die("meta.allowedTags missing/empty");
  if (!meta.tags || typeof meta.tags !== "object") die("meta.tags missing");

  const allowed = meta.allowedTags.map(String);
  const allowedSet = new Set(allowed);

  // Ensure all ids exist
  for (const { id } of words) {
    if (!Array.isArray(meta.tags[id])) meta.tags[id] = [];
  }
  writeJson(META_PATH, meta);

  // Start at first empty by default
  let idx = Math.max(0, words.findIndex(({ id }) => (meta.tags[id] || []).length === 0));
  if (idx < 0) idx = 0;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = (q) => new Promise((res) => rl.question(q, res));

  console.log(helpText(allowed));
  console.log(`Starting at #${idx + 1}/${words.length}. (meta saved to ${META_PATH})\n`);

  while (idx >= 0 && idx < words.length) {
    const { id, word } = words[idx];
    const current = Array.isArray(meta.tags[id]) ? meta.tags[id] : [];
    const filled = words.filter(w => (meta.tags[w.id] || []).length > 0).length;

    console.log(`\n[${idx + 1}/${words.length}] filled=${filled} id=${id} word="${word}"`);
    console.log(`current tags: ${current.length ? current.join(", ") : "(empty)"}`);

    const raw = String(await ask("tags> ")).trim();

    if (raw === "" ) {
      // keep current; move on
      idx++;
      continue;
    }

    const low = raw.toLowerCase();

    if (low === "?" || low === "help") {
      console.log(helpText(allowed));
      continue;
    }

    if (low === "q" || low === "quit") {
      writeJson(META_PATH, meta);
      console.log("\nSaved. Bye.");
      rl.close();
      return;
    }

    if (low === "b" || low === "back") {
      idx = Math.max(0, idx - 1);
      continue;
    }

    if (low === "s" || low === "skip") {
      // leave as-is (could be empty), move on
      idx++;
      continue;
    }

    if (low === "c" || low === "clear") {
      meta.tags[id] = [];
      writeJson(META_PATH, meta);
      console.log("OK: cleared tags for", id);
      continue;
    }

    if (low.startsWith("j ")) {
      const n = Number(low.slice(2).trim());
      if (!Number.isFinite(n) || n < 1 || n > words.length) {
        console.log(`ERROR: jump expects 1..${words.length}`);
        continue;
      }
      idx = n - 1;
      continue;
    }

    // parse tags
    const parts = raw
      .split(/[,\s]+/g)
      .map(x => x.trim())
      .filter(Boolean);

    const tags = uniq(parts);

    if (tags.length < 1 || tags.length > 2) {
      console.log("ERROR: enter 1 or 2 tags only.");
      continue;
    }

    const bad = tags.filter(t => !allowedSet.has(t));
    if (bad.length) {
      console.log("ERROR: invalid tag(s):", bad.join(", "));
      console.log("Type ? for allowed tags.");
      continue;
    }

    meta.tags[id] = tags;
    writeJson(META_PATH, meta);
    console.log("OK: saved", id, "=>", tags.join(", "));
    idx++;
  }

  writeJson(META_PATH, meta);
  console.log("\nAll done. Saved.");
  rl.close();
}

main().catch((e) => {
  console.error("FATAL:", e?.stack || String(e));
  process.exit(1);
});
