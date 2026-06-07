import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  iconClassName?: string;
  className?: string;
};

export function Logo({
  iconClassName = "h-10 w-10 sm:h-11 sm:w-11",
  className = "",
}: LogoProps) {
  return (
    <Link
      href="/"
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
