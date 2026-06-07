const features = [
  "No login required",
  "One command",
  "HTTPS by default",
  "Random public URLs",
  "Custom subdomains",
  "Simple self-hosting",
  "Fast Go binary",
  "Clean terminal logs",
];

export function Features() {
  return (
    <section id="features">
      <div className="container">
        <h2>Features</h2>
        <ul className="feature-list">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
