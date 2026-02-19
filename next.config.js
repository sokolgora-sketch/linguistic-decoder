/** @type {import('next').NextConfig} */
const nextConfig = {
  // Integration tests can isolate build output via NEXT_DIST_DIR (default .next).
  distDir: (process.env.NEXT_DIST_DIR ?? "").trim() || ".next",
  // Allow Firebase Studio / Cloud Workstations dev proxy origin to load /_next assets.
  allowedDevOrigins: [
    "3000-firebase-studio-1763047330759.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev",
  ],
};

module.exports = nextConfig;
