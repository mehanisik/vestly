import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["better-auth", "@vestly/ui", "@vestly/auth"],
};

export default nextConfig;
