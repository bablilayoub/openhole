"use client";

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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-4 sm:pt-5">
      <div className="page-container pointer-events-auto">
        <div
          className={`flex h-12 w-full items-center justify-between rounded-full px-2 pl-4 transition-all duration-300 sm:h-14 sm:pl-5 ${
            scrolled ? "floating-nav floating-nav-scrolled" : "floating-nav"
          }`}
        >
        <Logo iconClassName="h-10 w-10 sm:h-11 sm:w-11" className="text-base sm:text-lg" />

        <nav className="flex items-center gap-0.5 sm:gap-2">
          <HashLink
            section="features"
            className="rounded-full px-2 py-1 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-emerald-400 sm:px-3 sm:py-1.5 sm:text-sm"
          >
            Features
          </HashLink>
          <HashLink
            section="compare"
            className="rounded-full px-2 py-1 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-emerald-400 sm:px-3 sm:py-1.5 sm:text-sm"
          >
            Compare
          </HashLink>
          <a
            href="https://github.com/bablilayoub/openhole"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-emerald-400 sm:inline-block"
          >
            GitHub
          </a>
          <HashLink
            section="install"
            className="ml-0.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-neutral-200 sm:ml-1 sm:px-4 sm:py-1.5 sm:text-sm"
          >
            Install
          </HashLink>
        </nav>
        </div>
      </div>
    </header>
  );
}
