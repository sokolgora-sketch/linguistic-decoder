import fs from "node:fs";

const p = "src/lib/historyFirestore.ts";
let s = fs.readFileSync(p, "utf8");

// Patch function signature to accept optional uid param.
// BEFORE: export async function saveHistoryRecord(args: { ... }): Promise<void> {
// AFTER:  export async function saveHistoryRecord(args: { ... }, _uid?: string): Promise<void> {

const sigNeedle =
  "export async function saveHistoryRecord(args: {";
const sigIdx = s.indexOf(sigNeedle);

if (sigIdx < 0) {
  console.error("PATCH FAILED: could not find saveHistoryRecord signature anchor.");
  process.exit(1);
}

// Find the close of the args type block: " }): Promise<void> {"
const closeNeedle = "}): Promise<void> {";
const closeIdx = s.indexOf(closeNeedle, sigIdx);

if (closeIdx < 0) {
  console.error("PATCH FAILED: could not find end of saveHistoryRecord signature.");
  process.exit(1);
}

const before = s.slice(0, closeIdx);
const after = s.slice(closeIdx + closeNeedle.length);

// Avoid double-patching
if (before.includes("}, _uid?: string): Promise<void> {")) {
  console.log("No change: saveHistoryRecord already accepts uid.");
  process.exit(0);
}

const patchedClose = "}, _uid?: string): Promise<void> {";
s = before + patchedClose + after;

// Inside function body, add `void _uid;` right after the opening brace line.
// We'll insert after the first "{\n" following the signature we just patched.
const bodyStartIdx = s.indexOf(patchedClose, sigIdx);
const braceIdx = s.indexOf("{", bodyStartIdx);
const insertPoint = s.indexOf("\n", braceIdx) + 1;

if (insertPoint <= 0) {
  console.error("PATCH FAILED: could not locate function body start.");
  process.exit(1);
}

const guard = "  void _uid;";
if (!s.slice(insertPoint, insertPoint + 200).includes(guard)) {
  s = s.slice(0, insertPoint) + `${guard}\n` + s.slice(insertPoint);
}

fs.writeFileSync(p, s, "utf8");
console.log("Patched:", p, "(saveHistoryRecord now accepts optional uid)");
