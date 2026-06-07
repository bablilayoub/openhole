const reasons = [
  {
    title: "Zero friction",
    text: "No accounts, API keys, or YAML files. Install the binary and run it.",
  },
  {
    title: "HTTPS by default",
    text: "Every tunnel gets a secure public URL on ophl.link automatically.",
  },
  {
    title: "Built for devs",
    text: "Clean terminal output, custom subdomains, and a single static Go binary.",
  },
];

export function WhyOpenHole() {
  return (
    <section className="section" id="why">
      <div className="container">
        <p className="section-label">Why OpenHole</p>
        <h2 className="section-title">Ngrok-like tunnels, without the baggage</h2>
        <p className="section-desc">
          Share localhost with teammates, test webhooks, or demo a WIP app — in
          seconds, not minutes.
        </p>
        <div className="why-grid">
          {reasons.map((r) => (
            <article key={r.title} className="why-card">
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
