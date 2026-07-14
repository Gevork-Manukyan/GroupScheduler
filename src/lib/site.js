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
    return new URL(withScheme).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const SITE_NAME = "Group Scheduler";
export const SITE_DESCRIPTION =
  "Share a group link, collect availability, and find the dates that work.";
