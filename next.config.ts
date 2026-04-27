import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // puppeteer (full) is only used in local dev; @sparticuz/chromium needs to be external too
  serverExternalPackages: ["puppeteer", "puppeteer-core", "@sparticuz/chromium"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle puppeteer (full) when deploying to serverless — only needed locally.
      // The dynamic `import('puppeteer')` in lib/pdf-browser.ts is gated on env, but Next
      // still tries to resolve it at build time. We mark it external so it's required at runtime.
      config.externals = config.externals || [];
      config.externals.push({ puppeteer: "commonjs puppeteer" });
    }
    return config;
  },
};

export default nextConfig;
