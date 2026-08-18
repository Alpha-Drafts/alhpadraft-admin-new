import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "placeholderjs.com",
      "randomuser.me",
      "images.unsplash.com",
      "plus.unsplash.com",
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

module.exports = bundleAnalyzer(nextConfig);
