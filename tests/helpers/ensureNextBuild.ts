
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execSync } from "node:child_process";

/**
 * CI-safe preflight for tests that spawn `next start`.
 *
 * In clean CI checkouts, `.next/` often does not exist, so `next start`
 * crashes (ENOENT) looking for build manifests (e.g. pages-manifest.json).
 *
 * This helper ensures a production build exists before starting the server.
 */
export function ensureNextBuild(cwd: string) {
  const nextDir = path.join(cwd, ".next");
  const pagesManifest = path.join(nextDir, "server", "pages-manifest.json");
  const appBuildManifest = path.join(nextDir, "app-build-manifest.json");
  const buildManifest = path.join(nextDir, "build-manifest.json");

  const hasBuild =
    fs.existsSync(pagesManifest) ||
    fs.existsSync(appBuildManifest) ||
    fs.existsSync(buildManifest);

  if (hasBuild) return;

  execSync("npm run build", {
    cwd,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });
}
