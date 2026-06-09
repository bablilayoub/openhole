"use client";

import { useEffect, useState } from "react";
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

        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#features"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            Features
          </a>
          <a
            href="https://github.com/bablilayoub/openhole"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            GitHub
          </a>
          <a
            href="#install"
            className="ml-1 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Install
          </a>
        </nav>
        </div>
      </div>
    </header>
  );
}
