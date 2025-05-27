import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
   //  This tells Next.js to serve everything under /admin
  basePath: "/admin",
};

export default nextConfig;
