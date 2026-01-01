import fs from "node:fs";

const p = "src/lib/historyStore.ts";
let s = fs.readFileSync(p, "utf8");

// We expect a call like:
// await saveHistoryRecord(
//   {
//     word: input.word,
//     engineVersion: input.engineVersion,
//     ...
//   },
//   input.uid
// );
//
// We patch it to:
// await saveHistoryRecord(
//   {
//     cacheId: input.cacheId,
//     payload: input.payload,
//     word: input.word,
//     ...
//   },
//   input.uid
// );

const callRe = /await\s+saveHistoryRecord\s*\(\s*\{\s*([\s\S]*?)\}\s*,\s*input\.uid\s*\)\s*;/m;
const m = s.match(callRe);

if (!m) {
  console.error("PATCH FAILED: could not find `await saveHistoryRecord({ ... }, input.uid);` in historyStore.ts");
  process.exit(1);
}

const body = m[1];

// If already patched, exit.
if (/\bcacheId:\s*input\.cacheId\b/.test(body) && /\bpayload:\s*input\.payload\b/.test(body)) {
  console.log("No change: saveHistoryRecord call already includes cacheId and payload.");
  process.exit(0);
}

const patchedBody =
  `cacheId: input.cacheId,\n      payload: input.payload,\n      ` + body.trim();

s = s.replace(callRe, `await saveHistoryRecord(\n    {\n      ${patchedBody}\n    },\n    input.uid\n  );`);

fs.writeFileSync(p, s, "utf8");
console.log("Patched:", p, "(saveHistoryRecord call now includes cacheId + payload)");
