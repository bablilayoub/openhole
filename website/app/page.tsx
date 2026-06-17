import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WhatsNew } from "@/components/WhatsNew";
import { Features } from "@/components/Features";
import { Compare } from "@/components/Compare";
import { Install } from "@/components/Install";
import { Footer } from "@/components/Footer";
import { StarModal } from "@/components/StarModal";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhatsNew />
        <Features />
        <Compare />
        <Install />
      </main>
      <Footer />
      <StarModal />
    </>
  );
}
