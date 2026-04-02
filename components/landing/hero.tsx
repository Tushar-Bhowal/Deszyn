"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconArrowRight, IconPlayerPlay, IconSparkles } from "@tabler/icons-react";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 200 },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-24 px-6 overflow-hidden">

      {/* Background radial glow — blue only, subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px]" />
      </div>

      {/* Grid dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, oklch(0.9 0 0) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
      >
        {/* Badge pill */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-8 cursor-default select-none">
            <IconSparkles size={12} />
            <span>Now with AI Agent Design</span>
            <span className="w-1 h-1 rounded-full bg-primary/60" />
            <span className="text-primary/70">Phase 1 live</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-[-0.03em] text-foreground mb-6"
        >
          Your{" "}
          <span className="relative">
            <span
              className="bg-gradient-to-r from-primary via-primary/90 to-blue-400 bg-clip-text text-transparent"
            >
              Design System
            </span>
            {/* Underline glow */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 origin-left"
            />
          </span>
          ,{" "}
          <br className="hidden sm:block" />
          Generated in 60 Seconds
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-muted-foreground max-w-[600px] leading-relaxed mb-10"
        >
          Describe your idea or paste any URL. Get production-ready React
          components, <code className="font-mono text-sm text-foreground/70 bg-muted px-1.5 py-0.5 rounded">global.css</code> and design tokens.{" "}
          <span className="text-foreground/80">No design skills needed.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-3 mb-10"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              backgroundColor: "rgb(0, 85, 254)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              boxShadow: "0 8px 40px 0 rgba(0, 85, 255, 0.5), 0 0 10px 1px rgba(255, 255, 255, 0) inset, 0 0 0 1px rgba(0, 85, 255, 0.12)",
            }}
          >
            Start Generating Free
            <IconArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-180"
            />
          </Link>
          <button className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-border/80 px-6 py-3 rounded-xl transition-all duration-180 hover:bg-muted/50">
            <IconPlayerPlay size={14} className="text-primary" />
            Watch Demo
          </button>
        </motion.div>

        {/* Trust items */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
        >
          {["Free forever", "No credit card", "Export React + CSS"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="text-primary font-bold">✓</span>
              {t}
            </span>
          ))}
        </motion.div>

        {/* Hero dashboard mockup */}
        <motion.div
          variants={itemVariants}
          className="mt-16 w-full max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: "spring", damping: 25, stiffness: 120 }}
            className="relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Browser chrome bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 h-6 bg-muted/60 rounded-md flex items-center px-3">
                <span className="text-xs text-muted-foreground font-mono">
                  app.deszyn.io/design/new
                </span>
              </div>
            </div>

            {/* Dashboard mockup content */}
            <div className="grid grid-cols-[240px_1fr] min-h-[420px]">
              {/* Sidebar */}
              <div className="border-r border-border/50 p-4 space-y-2 bg-sidebar/50">
                <div className="h-3 w-24 bg-muted/60 rounded-full" />
                <div className="space-y-1.5 pt-2">
                  {[80, 60, 70, 50, 65].map((w, i) => (
                    <div
                      key={i}
                      className="h-8 rounded-lg bg-muted/40 flex items-center px-3 gap-2"
                    >
                      <div className="w-3.5 h-3.5 rounded bg-muted/60 flex-shrink-0" />
                      <div
                        className="h-2 bg-muted/60 rounded-full"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Main area */}
              <div className="p-6 space-y-4">
                {/* Chat input area */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-muted/20">
                  <div className="flex-1 h-5 bg-muted/40 rounded-full w-3/4" />
                  <div className="w-8 h-8 rounded-lg bg-primary/80 flex-shrink-0" />
                </div>

                {/* Generated sections preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-2">
                    <div className="h-3 w-20 bg-primary/30 rounded-full" />
                    <div className="h-2 w-full bg-muted/50 rounded-full" />
                    <div className="h-2 w-5/6 bg-muted/50 rounded-full" />
                    <div className="h-2 w-4/6 bg-muted/50 rounded-full" />
                    <div className="mt-3 h-7 w-24 bg-primary/60 rounded-lg" />
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                    <div className="h-3 w-16 bg-primary/40 rounded-full" />
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-8 rounded-lg bg-primary/20" />
                      ))}
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <div className="h-2 w-full bg-muted/40 rounded-full" />
                      <div className="h-2 w-2/3 bg-muted/40 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Approve bar */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/10">
                  <span className="text-xs text-muted-foreground font-mono">
                    Hero section generated ✦
                  </span>
                  <div className="flex gap-2">
                    <div className="h-7 w-16 rounded-lg border border-border/60 bg-muted/30" />
                    <div className="h-7 w-16 rounded-lg bg-primary/80" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom glow under mockup */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-primary/10 blur-[60px] pointer-events-none" />
        </motion.div>
      </motion.div>
    </section>
  );
}