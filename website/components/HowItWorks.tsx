"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    step: "01",
    title: "Run your app",
    text: "Start your local server on any port — Next.js, Vite, Django, anything.",
  },
  {
    step: "02",
    title: "Open the tunnel",
    text: "Run openhole 3000. A public URL is assigned in under a second.",
  },
  {
    step: "03",
    title: "Share the URL",
    text: "Anyone can hit your HTTPS link. Traffic flows through to localhost.",
  },
];

export function HowItWorks() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".step-item",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        },
      }
    );
  }, { scope: container });

  return (
    <section ref={container} id="how" className="py-24 bg-zinc-900/20 border-y border-zinc-800/50">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Three steps. That&apos;s it.</h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            We removed all the friction so you can focus on your code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div key={step.title} className="step-item relative">
              <div className="text-5xl font-bold text-zinc-800 mb-6 font-mono">{step.step}</div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-3">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
