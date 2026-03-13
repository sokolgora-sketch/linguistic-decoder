/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: (process.env.NEXT_DIST_DIR ?? "").trim() || ".next",

  allowedDevOrigins: [
    "9002-firebase-studio-1763047330759.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev",
    "3000-firebase-studio-1763047330759.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev",
    "6000-firebase-studio-1763047330759.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev",
  ],
};

module.exports = nextConfig;
