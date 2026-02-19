/**
 * Helper to ensure a valid Next.js production build exists for `next start`.
 *
 * IMPORTANT:
 * - `next start` requires `${distDir}/BUILD_ID`.
 * - Other manifests (like build-manifest.json) are NOT sufficient (can exist from partial/incomplete builds).
 */

import { execSync } from "node:child_process";
import { rmSync, statSync } from "node:fs";

let hasBuilt = false;

function nextDistDir(): string {
  const v = (process.env.NEXT_DIST_DIR ?? "").trim();
  return v.length ? v : ".next";
}

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

  const distDir = nextDistDir();
  const buildIdPath = `${distDir}/BUILD_ID`;

  if (exists(buildIdPath)) {
    console.log(`Skipping build, ${buildIdPath} already exists.`);
    hasBuilt = true;
    return;
  }

  console.log("Running `npm run build` for integration tests...");
  rmSync(distDir, { recursive: true, force: true });
  execSync("npm run build", { stdio: "inherit" });

  if (!exists(buildIdPath)) {
    throw new Error(`next build completed but ${buildIdPath} is missing`);
  }

  hasBuilt = true;
}
