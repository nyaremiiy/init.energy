import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match init.energy URLs (/cec/, /svit-600/ ...) to preserve indexed pages.
  trailingSlash: true,
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
