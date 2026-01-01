#!/usr/bin/env node
/**
 * Local safety gate.
 * - gate:quick => lint + test
 * - gate       => lint + test + build
 *
 * Usage:
 *   node scripts/gate.mjs --quick
 *   node scripts/gate.mjs
 */
import { spawnSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const quick = args.has("--quick");

function run(cmd, cmdArgs) {
  const r = spawnSync(cmd, cmdArgs, { stdio: "inherit", shell: false });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("npm", ["run", "lint"]);
run("npm", ["test"]);

if (!quick) run("npm", ["run", "build"]);

console.log(`\n✅ gate${quick ? ":quick" : ""} passed\n`);
