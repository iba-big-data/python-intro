import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // PGlite bringt eigene WASM-Dateien mit und darf nicht mitgebündelt werden.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
