import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OpenHole — Share localhost instantly",
  description: "Expose local ports to the internet over HTTPS. No accounts, no config. Just one command.",
  icons: {
    icon: "/icon-transparent.png",
    apple: "/icon-transparent.png",
  },
  openGraph: {
    title: "OpenHole",
    description: "Share localhost instantly over HTTPS.",
    url: siteUrl,
    siteName: "OpenHole",
    images: [
      {
        url: "/icon-black-bg.png",
        width: 1024,
        height: 1024,
        alt: "OpenHole",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "OpenHole",
    description: "Share localhost instantly over HTTPS.",
    images: ["/icon-black-bg.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
