import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match init.energy URLs (/cec/, /svit-600/ ...) to preserve indexed pages.
  trailingSlash: true,
  allowedDevOrigins: ['192.168.0.24'],
  images: {
    // AVIF first: sharper than WebP at the same size.
    formats: ["image/avif", "image/webp"],
    // 75 — default; 90 — large full-width photos where detail matters.
    qualities: [75, 90],
  },
  async redirects() {
    return [
      { source: "/ses/", destination: "/cec/", permanent: true },
      // Old init.energy URL of the hotel page.
      { source: "/rishennya/ses-dlya-gotelyu/", destination: "/ses/dlya-gotelyu/", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
