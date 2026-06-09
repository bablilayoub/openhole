"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, type ReactNode } from "react";
import { hashHref, scrollToSection } from "@/lib/scroll";

type SectionHash = "features" | "compare" | "install";

type HashLinkProps = {
  section: SectionHash;
  className?: string;
  children: ReactNode;
};

export function HashLink({ section, className, children }: HashLinkProps) {
  const pathname = usePathname();
  const hash = `#${section}` as const;
  const href = hashHref(hash, pathname);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    e.preventDefault();
    scrollToSection(section);
  };

  if (pathname === "/") {
    return (
      <a href={hash} onClick={handleClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
