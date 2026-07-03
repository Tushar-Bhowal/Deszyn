'use client';

import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

const SIZE = 46;
const SPEED = 0.1;

/**
 * A subtle, slowly-drifting grid layered behind the noise + glow — adapted from
 * Morphin's infinite-grid technique, stripped of its demo chrome (mouse parallax,
 * settings, theme toggle) down to a calm ambient backdrop.
 */
export function GridBackdrop() {
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  useAnimationFrame(() => {
    offsetX.set((offsetX.get() + SPEED) % SIZE);
    offsetY.set((offsetY.get() + SPEED) % SIZE);
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 text-neutral-400 opacity-[0.045]"
    >
      <svg className="h-full w-full">
        <title>Background grid</title>
        <defs>
          <motion.pattern
            id="studio-grid"
            width={SIZE}
            height={SIZE}
            patternUnits="userSpaceOnUse"
            x={offsetX}
            y={offsetY}
          >
            <path
              d={`M ${SIZE} 0 L 0 0 0 ${SIZE}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </motion.pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#studio-grid)" />
      </svg>
    </div>
  );
}
