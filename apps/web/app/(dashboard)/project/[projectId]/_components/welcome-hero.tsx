'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const WORDS = ['brand', 'name', 'logo', 'identity', 'palette'];

function CyclingWord() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % WORDS.length), 2200);
    return () => clearInterval(timer);
  }, [reduce]);

  if (reduce) {
    return <span className="text-[#6f9bff]">brand</span>;
  }

  return (
    <span className="relative inline-flex min-w-[5em] justify-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={WORDS[index]}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          className="text-[#6f9bff]"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function WelcomeHero() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center"
    >
      {/* logo */}
      <motion.div variants={item} className="relative mb-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 scale-[1.8] rounded-full bg-[#1a5cff]/25 blur-2xl"
        />
        <Image
          src="/logo.png"
          alt="Deszyn"
          width={64}
          height={64}
          className="size-16 object-contain"
          priority
        />
      </motion.div>

      {/* heading */}
      <motion.h1
        variants={item}
        className="max-w-3xl text-balance text-center font-display text-4xl font-medium leading-[1.08] tracking-tight text-white md:text-[3.35rem]"
      >
        Turn your idea into a <CyclingWord />
      </motion.h1>

      {/* description */}
      <motion.p
        variants={item}
        className="mt-5 max-w-xl text-pretty text-center text-[0.98rem] leading-relaxed text-neutral-400"
      >
        Describe your product and get brandable names, checked domains and trademarks, and a
        matching logo and color palette — a complete brand identity, generated in seconds.
      </motion.p>
    </motion.div>
  );
}
