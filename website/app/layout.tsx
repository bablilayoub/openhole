import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenHole — localhost tunnels in one command",
  description:
    "Fast, clean, no-login tunnel for developers. Expose localhost to the internet with one command.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
