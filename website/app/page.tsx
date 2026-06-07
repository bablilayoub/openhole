import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SpecSheet } from "@/components/SpecSheet";
import { Install } from "@/components/Install";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SpecSheet />
        <Install />
      </main>
      <Footer />
    </>
  );
}
