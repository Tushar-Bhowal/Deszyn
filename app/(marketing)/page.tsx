import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";

export default function LandingPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      {/* Sections will go here as we build them */}
    </main>
  );
}