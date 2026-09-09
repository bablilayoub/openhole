import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WindowProps = {
  /** `terminal` is dark in both themes; `app` follows the theme. */
  variant?: "app" | "terminal";
  /** Compact chrome for fragments inside cards. */
  size?: "md" | "sm";
  /** Centered title in the chrome. Ignored when `toolbar` is given. */
  title?: string;
  /** Replaces the title — e.g. a URL bar. Rendered after the dots. */
  toolbar?: ReactNode;
  className?: string;
  children: ReactNode;
  "aria-hidden"?: boolean;
};

/** Window chrome shared by every product mock on the site. */
export function Window({
  variant = "app",
  size = "md",
  title,
  toolbar,
  className,
  children,
  ...rest
}: WindowProps) {
  const terminal = variant === "terminal";
  const hasChrome = Boolean(title || toolbar);

  return (
    <div
      className={cn(
        "window",
        terminal ? "bg-terminal text-terminal-fg" : "bg-surface",
        className
      )}
      {...rest}
    >
      {hasChrome ? (
        <div
          className={cn(
            "flex items-center gap-2 border-b",
            size === "sm" ? "h-8 gap-1.5 px-3" : "h-10 px-4",
            terminal ? "border-white/[0.06]" : "border-line"
          )}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "rounded-full",
                size === "sm" ? "size-2" : "size-2.5",
                terminal ? "bg-white/15" : "bg-ink/10"
              )}
            />
          ))}
          {toolbar ?? (
            <>
              <span
                className={cn(
                  "mx-auto font-mono text-2xs",
                  terminal ? "text-white/35" : "text-muted"
                )}
              >
                {title}
              </span>
              <span className={size === "sm" ? "w-8" : "w-[3.25rem]"} aria-hidden />
            </>
          )}
        </div>
      ) : null}
      {children}
    </div>
  );
}
