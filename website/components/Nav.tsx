"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav" : "bg-transparent"}`}>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-white font-semibold tracking-tight text-lg">
          OpenHole
        </Link>
        
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="hidden sm:block text-neutral-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="https://github.com/bablilayoub/openhole" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#install" className="bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
            Install
          </a>
        </nav>
      </div>
    </header>
  );
}
