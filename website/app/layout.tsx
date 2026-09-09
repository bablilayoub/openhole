import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteUrl } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const siteUrl = getSiteUrl();

// Variable font; latin subset is ~48 KB. Requesting fixed weights returns the same files.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const description =
  "OpenHole gives any local port a public HTTPS URL with one command. No account, no dashboard, one static binary.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OpenHole — Expose localhost with one command",
    template: "%s — OpenHole",
  },
  description,
  icons: {
    icon: "/icon-transparent.png",
    apple: "/icon-transparent.png",
  },
  openGraph: {
    title: "OpenHole — Expose localhost with one command",
    description,
    url: siteUrl,
    siteName: "OpenHole",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenHole — Expose localhost with one command",
    description,
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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
