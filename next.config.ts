import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
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
