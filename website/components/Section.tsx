import { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  border?: boolean;
  className?: string;
};

export function Section({ id, children, border = false, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-24 sm:py-32 ${border ? "border-t border-white/[0.06]" : ""} ${className}`}
    >
      <div className="page-container">{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-16 max-w-2xl">
      {eyebrow ? (
        <p className="text-accent mb-3 font-mono text-[11px] uppercase tracking-[0.2em] opacity-80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="text-lg leading-relaxed text-neutral-400">{description}</p>
    </div>
  );
}
