"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { githubRepo, isGitHubReferrer } from "@/lib/site";

gsap.registerPlugin(useGSAP);

const STORAGE_KEY = "openhole-star-dismissed";
const FALLBACK_DELAY_MS = 4000;

export function StarModal() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (isGitHubReferrer(document.referrer)) return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
    };

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.12) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(show, FALLBACK_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useGSAP(() => {
    if (!open || !bar.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.fromTo(
      bar.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  }, { dependencies: [open] });

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  function star() {
    localStorage.setItem(STORAGE_KEY, "1");
    window.open(githubRepo, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <div
        ref={bar}
        role="dialog"
        aria-labelledby="star-prompt-title"
        className="pointer-events-auto floating-nav flex w-full max-w-2xl items-center gap-3 rounded-full py-2.5 pl-4 pr-2 sm:gap-4 sm:py-3 sm:pl-5"
      >
        <p
          id="star-prompt-title"
          className="min-w-0 flex-1 text-xs leading-snug text-neutral-400 sm:text-sm"
        >
          <span className="font-medium text-neutral-200">OpenHole</span> is open source.
          <span className="hidden sm:inline"> A GitHub star helps others find it.</span>
        </p>

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.preventDefault();
              star();
            }}
            className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-neutral-200 sm:px-4 sm:text-sm"
          >
            Star
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
