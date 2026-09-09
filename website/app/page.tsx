import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WorksWith } from "@/components/WorksWith";
import { Features } from "@/components/Features";
import { Operate } from "@/components/Operate";
import { Install } from "@/components/Install";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { StarModal } from "@/components/StarModal";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WorksWith />
        <Features />
        <Operate />
        <Install />
        <CTA />
      </main>
      <Footer />
      <StarModal />
    </>
  );
}
