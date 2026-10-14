import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Kept deliberately minimal. Every page is statically generated per language.
// MDX is enabled for the blog articles in content/blog/<locale>/*.mdx.
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
