import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
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
        <Features />
        <Compare />
        <Install />
      </main>
      <Footer />
      <StarModal />
    </>
  );
}
