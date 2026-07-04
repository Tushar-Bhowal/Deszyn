'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { BorderBeam } from '@/components/ui/border-beam';
import type { WorkStatus } from '@/lib/contracts';
import { cn } from '@/lib/utils';

const STATUS_STEPS: Record<WorkStatus, string[]> = {
  idle: [],
  thinking: ['Thinking…'],
  generating_names: [
    'Analyzing your product…',
    'Generating names…',
    'Checking trademarks…',
    'Checking domains…',
  ],
  generating_logo: ['Sketching logo concepts…', 'Refining the mark…', 'Preparing exports…'],
  generating_system: ['Choosing your palette…', 'Balancing contrast…', 'Setting the type scale…'],
};

/** The animated brand orb — used as the assistant avatar while a turn is generating. */
export function LoadingOrb({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-[#0f0f12]',
        className,
      )}
    >
      <BorderBeam
        size={14}
        duration={2.2}
        borderWidth={1.5}
        colorFrom="#4f7bff"
        colorTo="#9cbaff"
      />
      <Image
        src="/logo.png"
        alt=""
        width={16}
        height={16}
        className="relative size-4 object-contain"
      />
    </span>
  );
}

/** Cycling status text shown next to the orb while generating (no logo of its own). */
export function WorkingStatus({ status }: { status: WorkStatus }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const count = (STATUS_STEPS[status] ?? []).length;
    if (count <= 1) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % count), 1500);
    return () => clearInterval(timer);
  }, [status]);

  const steps = STATUS_STEPS[status] ?? [];
  const label = steps[index] ?? 'Working…';

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
        className="bg-linear-to-r from-neutral-200 to-neutral-500 bg-clip-text text-sm text-transparent"
      >
        {label}
      </motion.span>
    </AnimatePresence>
  );
}
