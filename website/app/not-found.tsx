import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative flex min-h-[80vh] items-center overflow-hidden pt-16">
        <Glow
          className="inset-x-0 top-0 h-[30rem]"
          gradient="radial-gradient(50rem 20rem at 50% -6rem, var(--glow), transparent 70%)"
        />
        <div className="page-container flex flex-col items-center text-center">
          <p className="font-mono text-sm text-muted">404</p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
            Nothing at this address.
          </h1>
          <p className="mt-4 max-w-md text-md text-muted text-pretty">
            Tunnels come and go. This page never existed.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Button href="/">Back home</Button>
            <Button href="/docs" variant="secondary">
              Documentation
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
