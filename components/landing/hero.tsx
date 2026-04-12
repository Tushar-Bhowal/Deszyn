"use client";

import React from "react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { TimelineAnimation } from "@/components/ui/timeline-animation";
import { LightBeamButton }   from "@/components/ui/light-beam-button";
import RotatingText          from "@/components/ui/rotating-text";
import SocialProofCounter    from "@/components/ui/social-proof-counter";
import HeroBackground        from "./hero-background";

const heroCopyVariants: Variants = {
  hidden: {
    filter: "blur(18px)",
    opacity: 0,
    y: 40,
  },
  visible: (i: number) => ({
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.5,
      duration: 0.95,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function Hero() {
  const timelineRef = React.useRef<HTMLElement>(null);

  return (
    <section
      ref={timelineRef}
      className="relative min-h-screen overflow-hidden"
    >
      <HeroBackground />

      {/* Noise texture — film-grain depth above WebGL */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-repeat"
        style={{
          backgroundImage: "url('/noise.gif')",
          opacity: 0.03,
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col">

        {/* ─── Zone: Copy + CTA + Social Proof ─── */}
        <div className="border-b border-white/[0.06] px-4 pt-32 pb-12 sm:px-6 md:pt-36 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">

            {/* Badge */}
            <TimelineAnimation
              animationNum={0}
              customVariants={heroCopyVariants}
              timelineRef={timelineRef}
              className="flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(16,16,20,0.75)] p-2 pr-3 backdrop-blur-lg"
            >
              <span className="rounded-lg bg-blue-600 px-1 py-0.5 text-xs font-medium text-white">
                Phase 1
              </span>
              <span className="text-sm text-white/70">
                Currently in progress — join the waitlist
              </span>
            </TimelineAnimation>

            {/* H1 with rotating last word */}
            <TimelineAnimation
              as="h1"
              animationNum={1}
              customVariants={heroCopyVariants}
              timelineRef={timelineRef}
              className="max-w-5xl text-balance font-display text-5xl font-medium tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl"
            >
              <span className="block">Your Logo, Name,</span>

              <span className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
                <span>and UI —</span>

                {/* Rotating last word — solid blue bg + white text */}
                <RotatingText
                  texts={[
                    "in Seconds.",
                    "without Figma.",
                    "no Designers.",
                    "just Describe.",
                  ]}
                  splitBy="words"
                  staggerFrom="last"
                  staggerDuration={0.03}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ type: "spring", damping: 26, stiffness: 340 }}
                  rotationInterval={2400}
                  mainClassName={[
                    "px-5 py-1.5 rounded-xl overflow-hidden",
                    "text-white justify-center",
                  ].join(" ")}
                  style={{
                    background:
                      "linear-gradient(180deg, rgb(18, 88, 236) 0%, rgb(0, 70, 220) 100%)",
                    boxShadow:
                      "0 4px 24px rgba(0,70,220,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
                  splitLevelClassName="overflow-hidden pb-1"
                />
              </span>
            </TimelineAnimation>

            {/* Subheading */}
            <TimelineAnimation
              as="p"
              animationNum={2}
              customVariants={heroCopyVariants}
              timelineRef={timelineRef}
              className="max-w-3xl text-pretty px-2 text-lg leading-8 text-white/70 sm:text-xl"
            >
              Describe your idea or paste any URL. Deszyn instantly generates
              your project name, logo, color tokens, and complete UI — ready
              to ship. No designer. No Figma. Just build.
            </TimelineAnimation>

            {/* CTA */}
            <TimelineAnimation
              animationNum={3}
              customVariants={heroCopyVariants}
              timelineRef={timelineRef}
              className="flex flex-col items-center gap-4 pt-2 sm:flex-row"
            >
              <LightBeamButton onClick={() => (window.location.href = "/signup")}>
                Get Started Free
                <ArrowUpRight size={15} />
              </LightBeamButton>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm font-semibold text-white/80 transition-colors duration-300 hover:text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  background:
                    "linear-gradient(180deg, rgba(13,13,18,0.98) 0%, rgba(8,8,12,0.98) 100%)",
                }}
              >
                How It Works
              </motion.button>
            </TimelineAnimation>

            {/* Social proof */}
            <TimelineAnimation
              animationNum={3}
              customVariants={heroCopyVariants}
              timelineRef={timelineRef}
              className="pt-1"
            >
              <SocialProofCounter totalCount={100} />
            </TimelineAnimation>
          </div>
        </div>

        {/* ─── Zone: Hero Image ─── */}
        <div className="px-4 pt-12 pb-20 sm:px-6 lg:px-8">
          <TimelineAnimation
            animationNum={4}
            timelineRef={timelineRef}
            className="relative mx-auto w-full max-w-7xl overflow-hidden"
          >
            <Image
              width={1000}
              height={600}
              loading="eager"
              src="/hero-finance.avif"
              alt="Deszyn — logo, UI, and brand generated from your idea"
              className="w-full rounded-3xl object-cover"
            />
          </TimelineAnimation>
        </div>

      </div>
    </section>
  );
}
