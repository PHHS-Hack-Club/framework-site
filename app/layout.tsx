import type { Metadata } from "next";
import { JetBrains_Mono, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import BuildStamp from "./components/BuildStamp";

const headlineFont = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-source-code-pro",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "https://framework.phhshack.club"),
  title: "FRAMEWORK 2027 | PHHS HACK CLUB",
  description:
    "Framework 2027 — a same-day software hackathon for Bergen County students who already know how to build.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.png",
  },
  openGraph: {
    title: "FRAMEWORK 2027 | PHHS HACK CLUB",
    description:
      "A same-day software build sprint from PHHS Hack Club for experienced student builders in Bergen County.",
    type: "website",
    images: [{ url: "/logo.png", width: 800, height: 144 }],
  },
};

import SmoothScrollProvider from "./components/SmoothScrollProvider";
import TargetCursor from "./components/TargetCursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${headlineFont.variable} ${monoFont.variable}`}>
      <body className="bg-background text-on-surface font-body overflow-x-hidden">
        <SmoothScrollProvider>
          <TargetCursor
            targetSelector="a, button, [role='button'], input, textarea, select, .cursor-target"
            spinDuration={3}
            hoverDuration={0.15}
            parallaxOn
          />
          <BuildStamp />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
