"use client";

import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-inner">
        <a href="/" className="logo">
          <span className="logo-mark">O</span>
          OpenHole
        </a>
        <ul className="nav-links">
          <li>
            <a href="#how">How it works</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a
              href="https://github.com/bablilayoub/openhole"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a href="#install" className="nav-cta">
              Install
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
