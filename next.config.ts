import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly set the project root to silence the lockfile warning
  // This tells Next.js that the project root is the current directory
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
