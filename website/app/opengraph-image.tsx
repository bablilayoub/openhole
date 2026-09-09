import { ImageResponse } from "next/og";

export const alt = "OpenHole — Expose localhost with one command";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#f7f8f8";
const muted = "#8a8f98";
const line = "rgba(255,255,255,0.1)";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(700px 320px at 50% -80px, rgba(124,156,255,0.28), transparent 70%), #08090a",
          color: ink,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: `1px solid ${line}`,
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <span style={{ fontWeight: 600 }}>OpenHole</span>
          <span style={{ color: muted }}>·</span>
          <span style={{ color: muted }}>localhost over HTTPS</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              fontWeight: 500,
              maxWidth: 900,
            }}
          >
            Expose localhost with one command.
          </div>
          <div style={{ fontSize: 26, color: muted, maxWidth: 760, lineHeight: 1.4 }}>
            A public HTTPS URL for any local port. No account, no dashboard, one static binary.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: "20px 24px",
            borderRadius: 14,
            border: `1px solid ${line}`,
            background: "#0b0c0d",
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex" }}>
            <span style={{ color: muted }}>$&nbsp;</span>openhole 3000
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#4ade80",
                marginRight: 12,
              }}
            />
            Tunnel ready
            <span style={{ color: muted, margin: "0 12px" }}>-&gt;</span>
            <span style={{ color: "#7c9cff" }}>https://blue-fox.ophl.link</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
