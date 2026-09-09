import { cn } from "@/lib/utils";

type GlowProps = {
  /** Position and size via utilities — the element is `absolute -z-10`. */
  className?: string;
  /** Override the gradient geometry. Defaults to a soft circle. */
  gradient?: string;
};

/** The one decorative element the design allows: a soft radial glow in the accent colour. */
export function Glow({ className, gradient }: GlowProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute -z-10", className)}
      style={{
        background:
          gradient ?? "radial-gradient(closest-side, var(--glow), transparent 70%)",
      }}
    />
  );
}
