import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.signaturebd.net",
      },
      {
        protocol: "https",
        hostname: "*.signaturebd.net",
      },
      {
        protocol: "https",
        hostname: "signaturebd.net",
      },
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
    ],
  },
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    return [
      {
        source: "/storage/:path*",
        destination: `${backendUrl}/storage/:path*`,
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
