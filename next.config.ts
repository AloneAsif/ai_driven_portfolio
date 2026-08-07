import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the Sanity CMS + Studio packages out of the server bundle. They ship
  // their own bundled React copy (via @sanity/cli), which otherwise collides
  // with the app's React during SSR and breaks React context ("createContext
  // is not a function"). The Studio renders client-side only.
  serverExternalPackages: [
    "sanity",
    "@sanity/vision",
    "@sanity/cli",
    "@sanity/ui",
    "@sanity/icons",
    "@sanity/logos",
    "@sanity/sdk",
    "@sanity/telemetry",
    "@sanity/code-input",
    "@portabletext/editor",
    "styled-components",
  ],
  images: {
    // Sanity Image CDN is the image source for all content images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
