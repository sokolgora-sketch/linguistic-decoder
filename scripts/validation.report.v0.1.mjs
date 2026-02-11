import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const runner = path.join(root, "scripts", "validation.report.runner.v0.1.ts");

function tryBin(rel) {
  const p = path.join(root, rel);
  return fs.existsSync(p) ? p : null;
}

const tsx = tryBin("node_modules/.bin/tsx");
const tsNode = tryBin("node_modules/.bin/ts-node");

let cmd = null;
let args = [];

if (tsx) {
  cmd = tsx;
  args = [runner];
} else if (tsNode) {
  cmd = tsNode;
  args = [runner];
} else {
  console.error("No TS runtime found. Install devDependency `tsx` (preferred) or `ts-node`.");
  process.exit(1);
}

const r = spawnSync(cmd, args, { stdio: "inherit" });
process.exit(r.status ?? 1);
