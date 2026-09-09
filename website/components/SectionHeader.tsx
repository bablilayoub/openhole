import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  icon: LucideIcon;
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  icon: Icon,
  label,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p
        className={cn(
          "inline-flex items-center gap-2 text-sm font-medium text-muted",
          align === "center" && "justify-center"
        )}
      >
        <Icon className="size-4 text-accent" />
        {label}
      </p>
      <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.08] font-medium tracking-[-0.03em] text-balance">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-md leading-relaxed text-muted text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
