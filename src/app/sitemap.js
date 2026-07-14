import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
