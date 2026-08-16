import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Emits `.next/standalone` — a self-contained server bundle with only the
   * node_modules it actually needs. The server never has to run `npm install`,
   * which is what makes the VPS deploy a plain file copy plus a restart.
   */
  output: "standalone",

  // Served behind nginx; no reason to advertise the framework version.
  poweredByHeader: false,

  // A type error must fail the deploy, not ship broken pages.
  // (Linting is enforced separately in the CI workflow — Next 16 no longer
  // accepts an `eslint` key here.)
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
