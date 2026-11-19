import type { MetadataRoute } from "next";

/** robots.txt: everything may be crawled; points search engines to the sitemap. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://women-in-ai-research.github.io/sitemap.xml",
  };
}
