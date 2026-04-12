import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";

export default function LandingPage() {
  return (
    <main className="relative bg-background min-h-screen">
      {/* Page-level structural grid — vertical container boundaries */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] mx-auto max-w-7xl border-x border-white/[0.06]"
        aria-hidden="true"
      />

      <Navbar />
      <Hero />
      {/* Sections will go here as we build them */}
    </main>
  );
}