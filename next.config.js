const { execSync } = require("node:child_process");

/** @type {import('next').NextConfig} */

function shortSha(value) {
  const s = String(value ?? "").trim();
  return s ? s.slice(0, 7) : "";
}

function resolveGitSha() {
  return (
    shortSha(process.env.NEXT_PUBLIC_GIT_SHA) ||
    shortSha(process.env.VERCEL_GIT_COMMIT_SHA) ||
    shortSha(process.env.GIT_SHA) ||
    (() => {
      try {
        return shortSha(
          execSync("git rev-parse --short HEAD", {
            stdio: ["ignore", "pipe", "ignore"],
          }).toString("utf8")
        );
      } catch {
        return "unknown";
      }
    })()
  );
}

const nextConfig = {
  distDir: (process.env.NEXT_DIST_DIR ?? "").trim() || ".next",

  allowedDevOrigins: [
    "9002-firebase-studio-1763047330759.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev",
    "3000-firebase-studio-1763047330759.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev",
    "6000-firebase-studio-1763047330759.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev",
  ],

  env: {
    NEXT_PUBLIC_GIT_SHA: resolveGitSha(),
  },
};

module.exports = nextConfig;
