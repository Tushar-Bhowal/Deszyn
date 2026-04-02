"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";

const mainEase = [0.65, 0.01, 0.05, 0.99] as const;

const backdropVariants: Variants = {
  closed: { x: "101%" },
  open:   { x: "0%"  },
};

const overlayVariants: Variants = {
  closed: { opacity: 0, pointerEvents: "none" as const },
  open:   { opacity: 1, pointerEvents: "auto" as const },
};

const linkVariants: Variants = {
  closed: { y: "140%", rotate: 10, opacity: 0 },
  open:   { y: "0%",   rotate: 0,  opacity: 1 },
};

const shapeElVariants: Variants = {
  hidden:  { scale: 0.5, opacity: 0, rotate: -10 },
  visible: { scale: 1,   opacity: 1, rotate: 0   },
};

type NavItem = { label: string; href: string; shape: number };
const navItems: NavItem[] = [
  { label: "Features",     href: "#features",    shape: 1 },
  { label: "How it works", href: "#how-it-works", shape: 2 },
  { label: "Pricing",      href: "#pricing",     shape: 3 },
  { label: "Reviews",      href: "#reviews",     shape: 4 },
  { label: "Contact",      href: "#contact",     shape: 5 },
];

function Shape1() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
      <motion.circle variants={shapeElVariants} cx="80"  cy="120" r="40" fill="rgba(99,102,241,0.15)" />
      <motion.circle variants={shapeElVariants} cx="300" cy="80"  r="60" fill="rgba(139,92,246,0.12)" />
      <motion.circle variants={shapeElVariants} cx="200" cy="300" r="80" fill="rgba(99,136,255,0.10)" />
      <motion.circle variants={shapeElVariants} cx="350" cy="280" r="30" fill="rgba(99,102,241,0.15)" />
    </svg>
  );
}

function Shape2() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
      <motion.path variants={shapeElVariants}
        d="M0 200 Q100 100, 200 200 T400 200"
        stroke="rgba(99,102,241,0.2)" strokeWidth="60" fill="none"
      />
      <motion.path variants={shapeElVariants}
        d="M0 280 Q100 180, 200 280 T400 280"
        stroke="rgba(139,92,246,0.15)" strokeWidth="40" fill="none"
      />
    </svg>
  );
}

function Shape3() {
  const dots = [
    [50,50],[150,50],[250,50],[350,50],
    [100,150],[200,150],[300,150],
    [50,250],[150,250],[250,250],[350,250],
    [100,350],[200,350],[300,350],
  ];
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
      {dots.map(([cx, cy], i) => (
        <motion.circle key={i} variants={shapeElVariants}
          cx={cx} cy={cy} r={i < 4 ? 8 : i < 7 ? 12 : 10}
          fill="rgba(99,102,241,0.25)"
        />
      ))}
    </svg>
  );
}

function Shape4() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
      <motion.path variants={shapeElVariants}
        d="M100 100 Q150 50,200 100 Q250 150,200 200 Q150 250,100 200 Q50 150,100 100"
        fill="rgba(99,102,241,0.12)"
      />
      <motion.path variants={shapeElVariants}
        d="M250 200 Q300 150,350 200 Q400 250,350 300 Q300 350,250 300 Q200 250,250 200"
        fill="rgba(139,92,246,0.10)"
      />
    </svg>
  );
}

function Shape5() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
      <motion.line variants={shapeElVariants} x1="0"   y1="100" x2="300" y2="400" stroke="rgba(99,102,241,0.15)" strokeWidth="30" />
      <motion.line variants={shapeElVariants} x1="100" y1="0"   x2="400" y2="300" stroke="rgba(139,92,246,0.12)" strokeWidth="25" />
      <motion.line variants={shapeElVariants} x1="200" y1="0"   x2="400" y2="200" stroke="rgba(99,136,255,0.10)" strokeWidth="20" />
    </svg>
  );
}

const shapeComponents = [Shape1, Shape2, Shape3, Shape4, Shape5];

const shapeContainerVariants: Variants = {
  hidden:  { transition: { staggerChildren: 0.08 } },
  visible: { transition: { staggerChildren: 0.08 } },
};

interface KineticNavigationProps {
  isOpen:   boolean;
  onClose:  () => void;
  onToggle: () => void;   // ← NEW: controls the toggle button inside
}

export function KineticNavigation({ isOpen, onClose, onToggle }: KineticNavigationProps) {
  const [activeShape, setActiveShape] = useState<number | null>(null);

  return (
    <>
      {/* ── Toggle button — always rendered, always on top ── */}
      {/* Sits outside AnimatePresence so it's never unmounted  */}
      <button
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="
          md:hidden fixed z-[200]
          flex items-center justify-center
          w-10 h-10 rounded-lg
          border border-white/10 bg-white/5
          hover:bg-white/10 transition-colors text-white
        "
        style={{
          top: "0.75rem",    /* 12px — aligns with h-16 navbar */
          right: "1.5rem",   /* 24px — matches px-6 */
        }}
      >
        <MenuToggleIcon
          open={isOpen}
          className="size-5"
          duration={500}
        />
      </button>

      {/* ── Full-screen menu overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">

            {/* Click-outside overlay */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.4, ease: mainEase }}
              onClick={onClose}
            />

            {/* 3 staggered backdrop layers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[0.24, 0.12, 0].map((delay, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    background: i === 2
                      ? "linear-gradient(135deg, #0d0d0f 0%, #111118 100%)"
                      : `rgba(17,17,24,${0.6 + i * 0.2})`,
                    pointerEvents: i === 2 ? "auto" : "none",
                  }}
                  variants={backdropVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ duration: 0.575, delay, ease: mainEase }}
                />
              ))}
            </div>

            {/* Ambient shapes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {shapeComponents.map((ShapeComponent, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  variants={shapeContainerVariants}
                  initial="hidden"
                  animate={activeShape === i + 1 ? "visible" : "hidden"}
                >
                  <ShapeComponent />
                </motion.div>
              ))}
            </div>

            {/* Menu content */}
            <div className="absolute inset-0 flex pointer-events-auto">
              <div className="flex flex-col justify-between w-full px-8 py-24">

                {/* Nav links */}
                <ul className="flex flex-col gap-2 overflow-hidden">
                  {navItems.map((item, i) => (
                    <li
                      key={item.label}
                      className="overflow-hidden"
                      onMouseEnter={() => setActiveShape(item.shape)}
                      onMouseLeave={() => setActiveShape(null)}
                    >
                      <motion.a
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center justify-between py-4 border-b border-white/10 cursor-pointer"
                        variants={linkVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{
                          duration: 0.7,
                          delay: 0.35 + i * 0.05,
                          ease: mainEase,
                        }}
                      >
                        <span className="font-display font-bold text-4xl text-white/80 group-hover:text-white transition-colors duration-200 tracking-tight">
                          {item.label}
                        </span>
                        <motion.span
                          className="text-white/20 group-hover:text-primary transition-colors duration-200"
                          whileHover={{ x: 6 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <path
                              d="M6 16H26M26 16L18 8M26 16L18 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.span>
                      </motion.a>
                    </li>
                  ))}
                </ul>

                {/* Bottom CTAs */}
                <motion.div
                  className="flex flex-col gap-4 pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.55, duration: 0.5, ease: mainEase }}
                >
                  <a
                    href="/login"
                    className="text-sm font-medium text-white/50 hover:text-white transition-colors"
                    onClick={onClose}
                  >
                    Log in →
                  </a>
                  <a
                    href="/signup"
                    onClick={onClose}
                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white px-6 py-3"
                    style={{
                      backgroundColor: "rgb(0, 85, 254)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "10px",
                      boxShadow: "0 8px 40px 0 rgba(0, 85, 255, 0.5), 0 0 10px 1px rgba(255, 255, 255, 0) inset, 0 0 0 1px rgba(0, 85, 255, 0.12)",
                    }}
                  >
                    Get Started Free →
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}