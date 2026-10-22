import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { assets, destinations, experience, sources } from "@/data/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "What Harry Potter Villain Are You? | MuggleNet",
  description: "Eight choices. Four dark destinies. Discover your Harry Potter villain in MuggleNet's immersive personality quiz.",
  openGraph: {
    title: "What Harry Potter Villain Are You?",
    description: "The Dark Arts have something to tell you. Discover your dark side.",
    url: destinations.share,
    siteName: "MuggleNet",
    images: [{ url: assets.social, width: 1200, height: 630, alt: "MuggleNet Harry Potter villain personality quiz" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: [assets.social] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const tokens = Object.fromEntries(Object.entries(experience.colors).map(([name, value]) => [`--${name}`, value])) as CSSProperties;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href={sources.fontStyles} />
        <link rel="preconnect" href={sources.fontFiles} crossOrigin="anonymous" />
        <link href={sources.fontStylesheet} rel="stylesheet" />
      </head>
      <body style={tokens}>
        {children}
        <noscript><p style={{ padding: 24, textAlign: "center" }}>Enable JavaScript to reveal your dark side. This interactive quiz needs JavaScript to record your choices.</p></noscript>
      </body>
    </html>
  );
}
