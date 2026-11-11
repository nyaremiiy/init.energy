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
  // Basic security headers (also counted by Lighthouse / Search Console).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/ses/", destination: "/cec/", permanent: true },
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
