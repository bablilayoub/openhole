"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToTop } from "@/lib/scroll";

type LogoProps = {
  iconClassName?: string;
  className?: string;
};

export function Logo({
  iconClassName = "h-10 w-10 sm:h-11 sm:w-11",
  className = "",
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
      className={`flex items-center gap-3 font-semibold tracking-tight text-white transition-opacity hover:opacity-90 ${className}`}
    >
      <Image
        src="/icon-transparent.png"
        alt=""
        width={44}
        height={44}
        className={`shrink-0 ${iconClassName}`}
        priority
      />
      <span>OpenHole</span>
    </Link>
  );
}
