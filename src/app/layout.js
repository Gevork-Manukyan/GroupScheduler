import "./app.css";

import Link from "next/link";
import { Bricolage_Grotesque, DM_Mono, Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import BrandMark from "@/components/brand-mark";
import SiteFooter from "@/components/site-footer";
import ThemeToggle, { themeBootScript } from "@/components/theme-toggle";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Self-hosted through next/font so there is no render-blocking request to
// fonts.googleapis.com and no swap-in shift. Most of the traffic is mobile.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

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
    /*
      The boot script in head stamps data-theme on this element before React
      hydrates, so the client always has an attribute the server never sent —
      the server cannot know a preference held in localStorage. React compares
      the two and warns.

      suppressHydrationWarning is the escape hatch for exactly this, and it
      covers only this element's own attributes, so a genuine mismatch further
      down the tree still reports. The alternative — keeping the theme in a
      cookie so the server can render it — would make every route dynamic just
      to read it, and the landing page is prerendered.
    */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Runs before first paint so a stored theme never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 pt-5 sm:px-6 lg:px-10 lg:pt-8">
          <Link
            href="/"
            className="-my-2.5 inline-flex items-center gap-2.5 py-2.5 transition hover:opacity-70"
            aria-label={`${SITE_NAME} home`}
          >
            <BrandMark size={26} />
            <span className="font-display text-[1.0625rem] font-bold tracking-[-0.02em] text-ink">
              {SITE_NAME}
            </span>
          </Link>
          <ThemeToggle />
        </header>
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
