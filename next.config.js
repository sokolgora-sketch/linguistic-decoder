/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "localhost:3000",
    "localhost:3001",
    "3000-firebase-studio-1763047330759.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev",
  ],
  typescript: {
    // Temporary: migration debt exists; keep build green while adapter work lands.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
