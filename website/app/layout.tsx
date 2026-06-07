import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenHole — punch a hole through localhost",
  description:
    "One-command tunnels. No accounts. HTTPS on ophl.link. Open source Go binary.",
  openGraph: {
    title: "OpenHole",
    description: "Punch a hole from localhost to the internet.",
    url: "https://openhole.dev",
    siteName: "OpenHole",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${ibmPlex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
