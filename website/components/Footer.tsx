import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-neutral-900 py-16">
      <div className="page-container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo iconClassName="h-8 w-8 sm:h-9 sm:w-9" className="text-sm sm:text-base" />

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500">
          <Link href="/terms" className="transition-colors hover:text-white">
            Terms & Abuse
          </Link>
          <a
            href="https://github.com/bablilayoub/openhole#self-hosting"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Self-host
          </a>
          <a href="mailto:abuse@openhole.dev" className="transition-colors hover:text-white">
            abuse@openhole.dev
          </a>
        </div>
      </div>
    </footer>
  );
}
