import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "fabri.test",
      },
      {
        protocol: "https",
        hostname: "fabri.test",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: "http://fabri.test/backend/public/storage/:path*",
      },
      { source: "/deals", destination: "/shop?sort=best-selling" },
      { source: "/new-arrivals", destination: "/shop?sort=newest" },
      { source: "/best-sellers", destination: "/shop?sort=best-selling" },
      { source: "/under-499", destination: "/shop?max=499" },
      { source: "/trending", destination: "/shop?sort=best-selling" },
      { source: "/featured", destination: "/shop" },
      { source: "/gift-ideas", destination: "/shop" },
    ];
  },
};

export default nextConfig;
