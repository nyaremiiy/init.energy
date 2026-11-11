import type { MetadataRoute } from "next";

import { getMessagesFor } from "@/i18n/messages";

/** Web app manifest: name, colours and icon for browsers and «Add to home screen». */
export default function manifest(): MetadataRoute.Manifest {
  const t = getMessagesFor("uk").meta;

  return {
    name: t.siteName,
    short_name: "INIT ENERGY",
    description: t.organizationDescription,
    start_url: "/",
    display: "browser",
    lang: "uk",
    background_color: "#ffffff",
    theme_color: "#000217",
    // TODO(content): add icon.png 512×512 and apple-icon.png 180×180 to src/app/.
    icons: [{ src: "/favicon.ico", sizes: "32x32", type: "image/x-icon" }],
  };
}
