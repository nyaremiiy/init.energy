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
          // Same rule in the current standard; a CSP with only frame-ancestors does not restrict scripts or styles.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          // Isolates the window from pages that open it (XS-leaks); popups the site opens keep working.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Photos in public/images have no content hash in the name: 7 days fresh, then up to
        // 7 more days served from cache while the browser revalidates in the background.
        // A replaced photo reaches returning visitors within a week at most.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=604800" }],
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
