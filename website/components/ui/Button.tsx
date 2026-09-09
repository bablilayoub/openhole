import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-[color,background-color,border-color,opacity,transform] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-void hover:opacity-90 active:scale-[0.98]",
  secondary: "border border-line bg-surface text-ink hover:border-line-2",
  ghost: "text-muted hover:text-ink",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-sm",
  md: "h-10 px-5 text-sm",
};

/** Class string for things that must stay their own element (HashLink, Radix triggers). */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string; external?: boolean } & Omit<
    ComponentPropsWithoutRef<"a">,
    "href" | "className" | "children"
  >;
type AsButton = Common & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

export type ButtonProps = AsLink | AsButton;

const OWN_PROPS = new Set(["variant", "size", "className", "children", "href", "external"]);

/** Everything that should reach the DOM element. */
function domProps(props: object) {
  return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.has(key)));
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = buttonClasses(variant, size, className);
  const rest = domProps(props);

  if (props.href !== undefined) {
    const { href, external } = props;
    if (external || href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={classes}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
