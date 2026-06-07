import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenHole — localhost tunnels in one command",
  description:
    "Fast, clean, no-login tunnel for developers. Expose localhost to the internet with one command.",
  openGraph: {
    title: "OpenHole",
    description: "Open localhost to the internet in one command.",
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
    <html lang="en" className={`${dmSans.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
