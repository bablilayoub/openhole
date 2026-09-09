"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToTop } from "@/lib/scroll";

type LogoProps = {
  iconClassName?: string;
  className?: string;
  inverted?: boolean;
};

export function Logo({
  iconClassName = "h-7 w-7",
  className = "",
  inverted = false,
}: LogoProps) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    e.preventDefault();
    scrollToTop();
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={`flex items-center gap-2.5 text-base font-semibold tracking-tight transition-opacity hover:opacity-70 ${
        inverted ? "text-white" : "text-ink"
      } ${className}`}
    >
      <Image
        src="/icon-transparent.png"
        alt=""
        width={28}
        height={28}
        className={`shrink-0 ${
          inverted ? "brightness-0 invert" : "brightness-0 dark:invert"
        } ${iconClassName}`}
        priority
      />
      <span>OpenHole</span>
    </Link>
  );
}
