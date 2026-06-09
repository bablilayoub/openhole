"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section, SectionHeader } from "./Section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const columns = ["OpenHole", "ngrok", "localtunnel", "cloudflared"] as const;

type Column = (typeof columns)[number];

type CompareCell =
  | { icon: "check"; note?: string }
  | { icon: "cross" }
  | { icon: "partial"; label: string };

const rows: { feature: string; values: Record<Column, CompareCell> }[] = [
  {
    feature: "No sign-up required",
    values: {
      OpenHole: { icon: "check" },
      ngrok: { icon: "cross" },
      localtunnel: { icon: "check" },
      cloudflared: { icon: "partial", label: "Optional" },
    },
  },
  {
    feature: "HTTPS",
    values: {
      OpenHole: { icon: "check" },
      ngrok: { icon: "check" },
      localtunnel: { icon: "check" },
      cloudflared: { icon: "check" },
    },
  },
  {
    feature: "Custom subdomain",
    values: {
      OpenHole: { icon: "check", note: "--subdomain" },
      ngrok: { icon: "partial", label: "Paid plan" },
      localtunnel: { icon: "partial", label: "If available" },
      cloudflared: { icon: "partial", label: "Named tunnel" },
    },
  },
  {
    feature: "Self-hostable",
    values: {
      OpenHole: { icon: "check" },
      ngrok: { icon: "cross" },
      localtunnel: { icon: "cross" },
      cloudflared: { icon: "check" },
    },
  },
  {
    feature: "Open source",
    values: {
      OpenHole: { icon: "check" },
      ngrok: { icon: "partial", label: "Client only" },
      localtunnel: { icon: "check" },
      cloudflared: { icon: "check" },
    },
  },
  {
    feature: "Web dashboard",
    values: {
      OpenHole: { icon: "cross" },
      ngrok: { icon: "check" },
      localtunnel: { icon: "cross" },
      cloudflared: { icon: "partial", label: "Cloudflare" },
    },
  },
  {
    feature: "Live CLI request logs",
    values: {
      OpenHole: { icon: "check" },
      ngrok: { icon: "partial", label: "Limited" },
      localtunnel: { icon: "cross" },
      cloudflared: { icon: "cross" },
    },
  },
  {
    feature: "WebSocket passthrough",
    values: {
      OpenHole: { icon: "cross" },
      ngrok: { icon: "check" },
      localtunnel: { icon: "check" },
      cloudflared: { icon: "check" },
    },
  },
];

function cellLabel(cell: CompareCell): string {
  if (cell.icon === "check") return cell.note ? `Yes, ${cell.note}` : "Yes";
  if (cell.icon === "cross") return "No";
  return cell.label;
}

function YesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-emerald-400"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function NoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-neutral-600"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function PartialIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
      className="shrink-0 text-neutral-500"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function CompareValue({ cell, highlight = false }: { cell: CompareCell; highlight?: boolean }) {
  const textClass = highlight ? "text-neutral-300" : "text-neutral-500";

  return (
    <div className="flex items-center justify-center gap-2">
      {cell.icon === "check" && <YesIcon />}
      {cell.icon === "cross" && <NoIcon />}
      {cell.icon === "partial" && <PartialIcon />}
      {cell.icon === "check" && cell.note ? (
        <span className={`text-xs sm:text-sm ${textClass}`}>{cell.note}</span>
      ) : null}
      {cell.icon === "partial" ? (
        <span className={`text-xs sm:text-sm ${textClass}`}>{cell.label}</span>
      ) : null}
      <span className="sr-only">{cellLabel(cell)}</span>
    </div>
  );
}

function Cell({
  cell,
  highlight = false,
  openHoleCol = false,
}: {
  cell: CompareCell;
  highlight?: boolean;
  openHoleCol?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3.5 text-center sm:px-6 sm:py-4 ${
        openHoleCol ? "compare-col-openhole" : ""
      }`}
    >
      <CompareValue cell={cell} highlight={highlight} />
    </td>
  );
}

export function Compare() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const table = root.current?.querySelector(".compare-table");
    if (!table) return;

    gsap.fromTo(
      table,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          once: true,
        },
      }
    );
  }, { scope: root });

  return (
    <Section id="compare" border>
      <div ref={root}>
        <SectionHeader
          eyebrow="Compare"
          title="How it compares"
          description="A quick look at OpenHole next to other popular tunneling tools. Pick what fits your workflow."
        />

        <div className="compare-scroll-wrap compare-table card-base overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-800">
                <th
                  scope="col"
                  className="px-4 py-4 text-sm font-medium text-neutral-500 sm:px-6 sm:text-base"
                >
                  Feature
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className={`px-4 py-4 text-center text-sm font-semibold sm:px-6 sm:text-base ${
                      col === "OpenHole"
                        ? "compare-col-openhole text-accent"
                        : "text-neutral-300"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i < rows.length - 1 ? "border-b border-neutral-800/80" : ""}
                >
                  <th
                    scope="row"
                    className="px-4 py-3.5 text-sm font-medium text-neutral-300 sm:px-6 sm:py-4 sm:text-base"
                  >
                    {row.feature}
                  </th>
                  {columns.map((col) => (
                    <Cell
                      key={col}
                      cell={row.values[col]}
                      highlight={col === "OpenHole"}
                      openHoleCol={col === "OpenHole"}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <YesIcon />
            Supported
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PartialIcon />
            Partial
          </span>
          <span className="inline-flex items-center gap-1.5">
            <NoIcon />
            Not available
          </span>
        </p>

        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-neutral-600 sm:text-sm">
          Based on default quick-tunnel usage. Paid plans, named tunnels, and self-hosted setups may
          differ.
        </p>
      </div>
    </Section>
  );
}
