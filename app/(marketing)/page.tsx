import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";

export default function LandingPage() {
  return (
    <main className="relative bg-background min-h-screen">
      {/* Page-level structural grid — vertical container boundaries */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] flex justify-center w-full"
        aria-hidden="true"
      >
        <div className="h-full w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-7xl border-x border-white/[0.06]" />
      </div>

      <Navbar />
      <Hero />
      {/* Sections will go here as we build them */}
    </main>
  );
}