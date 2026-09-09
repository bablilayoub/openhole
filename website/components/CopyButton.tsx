"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  className?: string;
  /** Show the word next to the icon. */
  label?: boolean;
};

export function CopyButton({ text, className, label = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 px-2 font-mono text-2xs tracking-wide text-muted uppercase transition-colors hover:text-ink",
        className
      )}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {label ? <span>{copied ? "Copied" : "Copy"}</span> : null}
    </button>
  );
}
