import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "placeholderjs.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/auth/login",
        destination: "/",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const rawBackendUrl = process.env.BACKEND_URL;
    if (rawBackendUrl) {
      const backendUrl = rawBackendUrl
        .trim()
        .replace(/\/+$/, "")
        .replace(/\/api$/, "");
      return [
        { source: "/v1/:path*", destination: `${backendUrl}/v1/:path*` },
        { source: "/v2/:path*", destination: `${backendUrl}/v2/:path*` },
      ];
    }
    // Local mock mode: route /v1/* → /api/v1/*
    return [
      { source: "/v1/:path*", destination: "/api/v1/:path*" },
      { source: "/v2/:path*", destination: "/api/v2/:path*" },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
