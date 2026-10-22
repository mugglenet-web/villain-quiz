import type { NextConfig } from "next";
import { embed, sources } from "./data/config";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: new URL(sources.assets).hostname, pathname: "/wp-content/uploads/**" }],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          `style-src 'self' 'unsafe-inline' ${sources.fontStyles}`,
          `font-src 'self' ${sources.fontFiles}`,
          `img-src 'self' data: ${sources.assets}`,
          `media-src 'self' ${sources.assets}`,
          "connect-src 'self'",
          `frame-ancestors 'self' ${embed.allowedOrigins.join(" ")}`,
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; ") },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};

export default nextConfig;
