const steps = [
  {
    title: "Run your app",
    text: "Start your local server on any port — Next.js, Vite, Django, anything.",
  },
  {
    title: "Open the tunnel",
    text: "Run openhole 3000. A public URL is assigned in under a second.",
  },
  {
    title: "Share the URL",
    text: "Anyone can hit your HTTPS link. Traffic flows through to localhost.",
  },
];

export function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <p className="section-label">How it works</p>
        <h2 className="section-title">Three steps. That&apos;s it.</h2>
        <div className="steps-flow">
          {steps.map((step, i) => (
            <div key={step.title} style={{ display: "contents" }}>
              <article className="step">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
              {i < steps.length - 1 && (
                <span className="step-arrow" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
