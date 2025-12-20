import fs from "node:fs";

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

const hasRootApp = exists("app");
const hasSrcApp = exists("src/app");

console.log("ZË-RO layout check");
console.log("------------------");
console.log(`app/ exists: ${hasRootApp ? "YES" : "NO"}`);
console.log(`src/app exists: ${hasSrcApp ? "YES" : "NO"}`);

if (hasRootApp && hasSrcApp) {
  console.log("\nWARNING: Both app/ and src/app/ exist.");
  console.log("Policy for v1: app/ is canonical. src/app/ should be treated as legacy.");
  console.log("\nNext recommended action:");
  console.log("  git mv src/app src/app__legacy");
  console.log("  # then run: npm test");
} else if (hasRootApp) {
  console.log("\nOK: Using root app/ layout.");
} else if (hasSrcApp) {
  console.log("\nNOTE: Using src/app layout (not our v1 baseline).");
  console.log("If you're aligning to v1, create/move routes to root app/.");
} else {
  console.log("\nERROR: No app router directory found (app/ or src/app).");
  process.exitCode = 1;
}
