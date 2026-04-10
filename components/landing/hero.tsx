"use client";

import React from "react";
import type { Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { TimelineAnimation } from "@/components/ui/timeline-animation";
import { LightBeamButton }   from "@/components/ui/light-beam-button";
import RotatingText          from "@/components/ui/rotating-text";
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
      className="relative min-h-screen overflow-hidden px-4 pt-32 pb-20 sm:px-6 md:pt-36 lg:px-8"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12">
        <div className="flex max-w-5xl flex-col items-center gap-6 text-center">

          {/* ── Badge ── */}
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

          {/* ── H1 with rotating last word ── */}
          <TimelineAnimation
            as="h1"
            animationNum={1}
            customVariants={heroCopyVariants}
            timelineRef={timelineRef}
            className="max-w-5xl text-balance font-display text-5xl font-medium tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl"
          >
            {/*
             * Line 1 → static
             * Line 2 → static + rotating pill at the very end
             *
             * splitBy="words" so the whole phrase swaps as one unit —
             * no char-by-char jitter at this large font size.
             */}
            <span className="block">Your Website Logo, Name,</span>

            <span className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
              <span>and UI —</span>

              {/* ── Rotating last word ── */}
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
                  // pill — glassy white tint on dark bg
                  "px-4 py-1 rounded-xl overflow-hidden",
                  "bg-white/10 border border-white/20",
                  "text-blue-600 justify-center",
                ].join(" ")}
                splitLevelClassName="overflow-hidden pb-1"
              />
            </span>
          </TimelineAnimation>

          {/* ── Subheading ── */}
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

          {/* ── CTA ── */}
          <TimelineAnimation
            animationNum={3}
            customVariants={heroCopyVariants}
            timelineRef={timelineRef}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <LightBeamButton onClick={() => (window.location.href = "/signup")}>
              Get Started Free
              <ArrowUpRight size={15} />
            </LightBeamButton>

            <LightBeamButton
              tone="dark"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-7 py-3.5"
            >
              How It Works
            </LightBeamButton>
          </TimelineAnimation>
        </div>

        {/* ── Hero image ── */}
        <TimelineAnimation
          animationNum={4}
          timelineRef={timelineRef}
          className="relative w-full max-w-7xl overflow-hidden"
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
    </section>
  );
}
