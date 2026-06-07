import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "OpenHole — Share localhost instantly",
  description: "Expose local ports to the internet over HTTPS. No accounts, no config. Just one command.",
  openGraph: {
    title: "OpenHole",
    description: "Share localhost instantly over HTTPS.",
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
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
