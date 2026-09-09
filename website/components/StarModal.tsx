"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { githubRepo, isGitHubReferrer } from "@/lib/site";

const STORAGE_KEY = "openhole-star-dismissed";
const FALLBACK_DELAY_MS = 8000;

export function StarModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    if (isGitHubReferrer(document.referrer)) return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
    };
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(show, FALLBACK_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function close() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          aria-label="Star OpenHole on GitHub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="window fixed right-4 bottom-4 z-40 w-[calc(100%-2rem)] max-w-xs bg-surface p-4 sm:right-6 sm:bottom-6"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">OpenHole is open source.</p>
            <button
              type="button"
              onClick={close}
              aria-label="Dismiss"
              className="-mt-1 -mr-1 rounded-md p-1 text-muted transition-colors hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-muted">A star helps the next person find it.</p>
          <Button href={githubRepo} size="sm" className="mt-3 w-full" onClick={close}>
            Star on GitHub
          </Button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
