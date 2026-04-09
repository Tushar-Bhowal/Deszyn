"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import HeroBackground from "./hero-background";
import { ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative px-4 pt-28 pb-0 sm:px-6 md:pt-32 min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* WebGL Hero Background */}
      <HeroBackground />

    </section>
  );
}
