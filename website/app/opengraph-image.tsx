import { ImageResponse } from "next/og";

export const alt = "OpenHole — Share localhost instantly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#000000",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(52, 211, 153, 0.1) 0%, transparent 72%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#34d399",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            OpenHole
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Share localhost.
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#34d399",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Zero configuration.
          </div>
          <div style={{ fontSize: 28, color: "#a3a3a3", maxWidth: 760, lineHeight: 1.4 }}>
            Expose local ports over HTTPS. No accounts. One command.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
