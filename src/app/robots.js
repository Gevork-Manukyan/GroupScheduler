import { SITE_URL } from "@/lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Group pages are private share links and the API is not for crawlers.
      disallow: ["/api/", "/groups/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
