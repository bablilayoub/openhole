const features = [
  { icon: "01", label: "No login required" },
  { icon: "02", label: "One command setup" },
  { icon: "03", label: "HTTPS by default" },
  { icon: "04", label: "Random public URLs" },
  { icon: "05", label: "Custom subdomains" },
  { icon: "06", label: "Simple self-hosting" },
  { icon: "07", label: "Fast Go binary" },
  { icon: "08", label: "Clean request logs" },
];

export function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <p className="section-label">Features</p>
        <h2 className="section-title">Everything you need, nothing you don&apos;t</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.label} className="feature-card">
              <span className="feature-icon" aria-hidden>
                {f.icon}
              </span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
