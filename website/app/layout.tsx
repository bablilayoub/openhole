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
    title: "OpenHole — Share localhost instantly",
    description: "Expose local ports to the internet over HTTPS. No accounts, no config. Just one command.",
    url: siteUrl,
    siteName: "OpenHole",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenHole — Share localhost instantly",
    description: "Expose local ports to the internet over HTTPS. No accounts, no config. Just one command.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
