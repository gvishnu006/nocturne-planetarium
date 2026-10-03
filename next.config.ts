import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag|bin)$/i,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
