"use client";

import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-extrabold text-lg tracking-tight uppercase hover:text-hole transition-colors"
        >
          OpenHole
        </Link>

        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          <a href="#spec" className="hidden sm:inline text-muted hover:text-ink transition-colors">
            Spec
          </a>
          <a
            href="https://github.com/bablilayoub/openhole"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-ink transition-colors"
          >
            GitHub
          </a>
          <a
            href="#install"
            className="bg-ink text-paper px-3 py-1.5 hover:bg-hole transition-colors"
          >
            Install
          </a>
        </nav>
      </div>
    </header>
  );
}
