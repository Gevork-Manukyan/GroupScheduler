const FALLBACK_SITE_URL = "https://groupscheduler.gevorkmanukyan.com";

function resolveSiteUrl(value) {
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  const trimmed = value.trim().replace(/\/+$/, "");
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withScheme);

    // Never canonicalize to a Vercel preview/default domain. Those redirect
    // (308) to the custom domain, and social crawlers do not follow redirects
    // for og:image, which breaks link-preview thumbnails.
    if (url.hostname.endsWith(".vercel.app")) {
      return FALLBACK_SITE_URL;
    }

    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const SITE_NAME = "Group Scheduler";
export const SITE_DESCRIPTION =
  "Share a group link, collect availability, and find the dates that work.";
