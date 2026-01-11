/**
 * Helper to ensure a valid Next.js production build exists for `next start`.
 *
 * IMPORTANT:
 * - `next start` requires `.next/BUILD_ID`.
 * - `.next/build-manifest.json` alone is NOT sufficient (can exist from partial/incomplete builds).
 */

import { execSync } from "node:child_process";
import { statSync } from "node:fs";

let hasBuilt = false;

function exists(p: string): boolean {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

export async function ensureNextBuild() {
  if (hasBuilt) return;

  const ok = exists(".next/BUILD_ID") && exists(".next/build-manifest.json");

  if (ok) {
    console.log("Skipping build, .next/BUILD_ID + build-manifest.json already exist.");
  } else {
    console.log("Running `npm run build` for integration tests...");
    execSync("npm run build", { stdio: "inherit" });

    if (!exists(".next/BUILD_ID")) {
      throw new Error("next build completed but .next/BUILD_ID is missing");
    }
  }

  hasBuilt = true;
}
