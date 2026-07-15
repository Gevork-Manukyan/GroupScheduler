import "./app.css";

import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

import BrandMark from "@/components/brand-mark";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "group scheduling",
    "availability",
    "meeting planner",
    "find a date",
    "shared calendar",
    "when2meet alternative",
  ],
  authors: [{ name: "Gevork Manukyan", url: SITE_URL }],
  creator: "Gevork Manukyan",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 transition hover:opacity-80"
            aria-label={`${SITE_NAME} home`}
          >
            <BrandMark size={38} />
            <span className="text-lg font-extrabold tracking-tight text-[var(--text)]">
              {SITE_NAME}
            </span>
          </Link>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
