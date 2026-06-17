import { ImageResponse } from "next/og";

export const alt = "OpenHole v0.2.0 — Share localhost instantly";
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
          background: "#050508",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-20%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.25) 0%, rgba(56, 189, 248, 0.12) 35%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 400,
            height: 400,
            marginLeft: -200,
            marginTop: -200,
            borderRadius: "50%",
            border: "1px solid rgba(56, 189, 248, 0.2)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#c084fc",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            v0.2.0 — WebSocket passthrough
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Punch a hole to localhost.
          </div>
          <div style={{ fontSize: 26, color: "#a1a1aa", maxWidth: 720, lineHeight: 1.4 }}>
            HTTPS tunnels. No accounts. One command.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
