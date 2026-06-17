"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HashLink } from "./HashLink";
import { Logo } from "./Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-black/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="page-container flex h-16 items-center justify-between">
        <Logo iconClassName="h-8 w-8 sm:h-9 sm:w-9" className="text-base sm:text-lg" />

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/docs"
            className="hidden text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:block"
          >
            Docs
          </Link>
          <HashLink
            section="features"
            className="hidden text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:block"
          >
            Features
          </HashLink>
          <HashLink
            section="compare"
            className="hidden text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:block"
          >
            Compare
          </HashLink>
          <a
            href="https://github.com/bablilayoub/openhole"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:block"
          >
            GitHub
          </a>
          <HashLink
            section="install"
            className="inline-flex h-8 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Install
          </HashLink>
        </nav>
      </div>
    </header>
  );
}
