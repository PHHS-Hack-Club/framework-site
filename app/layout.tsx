import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FRAMEWORK 2027 | PHHS HACK CLUB",
  description:
    "Framework 2027 — The premier 24-hour hackathon for Bergen County students. PHHS Hack Club. Pure building. No fluff.",
  openGraph: {
    title: "FRAMEWORK 2027 | PHHS HACK CLUB",
    description:
      "An elite gathering of builders, breakers, and visionaries. Bergen County's premier hackathon.",
    type: "website",
  },
};

import SmoothScrollProvider from "./components/SmoothScrollProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body overflow-x-hidden">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
