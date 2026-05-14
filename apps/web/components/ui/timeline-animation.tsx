'use client';

import { type HTMLMotionProps, motion, useInView, type Variants } from 'framer-motion';
import type React from 'react';

const motionComponents = {
  a: motion.a,
  button: motion.button,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  img: motion.img,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const;

type MotionTag = keyof typeof motionComponents;

type TimelineAnimationProps = {
  as?: MotionTag;
  animationNum: number;
  children?: React.ReactNode;
  className?: string;
  customVariants?: Variants;
  once?: boolean;
  timelineRef: React.RefObject<HTMLElement | null>;
} & HTMLMotionProps<'div'>;

const defaultSequenceVariants: Variants = {
  hidden: {
    filter: 'blur(18px)',
    opacity: 0,
    y: 32,
  },
  visible: (i: number) => ({
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.28,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function TimelineAnimation({
  as,
  animationNum,
  children,
  className,
  customVariants,
  once = true,
  timelineRef,
  ...props
}: TimelineAnimationProps) {
  const isInView = useInView(timelineRef, {
    amount: 0.2,
    once,
  });

  const MotionComponent = motionComponents[as ?? 'div'] as React.ElementType;

  return (
    <MotionComponent
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      custom={animationNum}
      initial="hidden"
      variants={customVariants ?? defaultSequenceVariants}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
