import "./app.css";

export const metadata = {
  metadataBase: new URL("https://groupscheduler.gevorkmanukyan.com"),
  title: "Group Scheduler",
  description: "Share a group link, collect availability, and find the dates that work.",
  openGraph: {
    title: "Group Scheduler",
    description:
      "Share a group link, collect availability, and find the dates that work.",
    url: "https://groupscheduler.gevorkmanukyan.com/",
    siteName: "Group Scheduler",
    type: "website",
    images: [
      {
        url: "/group-scheduler.png",
        width: 1145,
        height: 822,
        alt: "Group Scheduler landing page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Group Scheduler",
    description:
      "Share a group link, collect availability, and find the dates that work.",
    images: ["/group-scheduler.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
