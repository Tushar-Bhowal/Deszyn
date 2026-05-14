'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LightBeamButton } from '@/components/ui/light-beam-button';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';

const mainEase = [0.65, 0.01, 0.05, 0.99] as const;

const backdropVariants: Variants = {
  closed: { x: '101%' },
  open: { x: '0%' },
};

const overlayVariants: Variants = {
  closed: { opacity: 0, pointerEvents: 'none' as const },
  open: { opacity: 1, pointerEvents: 'auto' as const },
};

const linkVariants: Variants = {
  closed: (i: number) => ({
    y: '140%',
    rotate: 10,
    opacity: 0,
    transition: { duration: 0.28, delay: i * 0.03, ease: mainEase }, // fast exit, tiny stagger
  }),
  open: (i: number) => ({
    y: '0%',
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: 0.35 + i * 0.07, ease: mainEase }, // existing enter timing
  }),
};

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function MobileNavigation({ isOpen, onClose, onToggle }: MobileNavigationProps) {
  const router = useRouter();

  return (
    <>
      {/* Toggle button — always rendered, always on top */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="
          lg:hidden fixed z-200
          flex items-center justify-center
          w-10 h-10 rounded-lg
          border border-white/10 bg-white/5
          hover:bg-white/10 transition-colors text-white
        "
        style={{
          top: '1.25rem',
          right: '2.5rem',
        }}
      >
        <MenuToggleIcon open={isOpen} className="size-6" duration={500} />
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 lg:hidden">
            {/* Click-outside dismiss */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.4, ease: mainEase }}
              onClick={onClose}
            />

            {/* Staggered backdrop layers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[
                { id: 'back', openDelay: 0.24, exitDelay: 0.42 },
                { id: 'mid', openDelay: 0.12, exitDelay: 0.36 },
                { id: 'front', openDelay: 0, exitDelay: 0.3 },
              ].map(({ id, openDelay, exitDelay }, i) => (
                <motion.div
                  key={id}
                  className="absolute inset-0"
                  style={{
                    background:
                      i === 2
                        ? 'linear-gradient(135deg, #0d0d0f 0%, #111118 100%)'
                        : `rgba(17,17,24,${0.6 + i * 0.2})`,
                    pointerEvents: i === 2 ? 'auto' : 'none',
                  }}
                  variants={backdropVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{
                    duration: 0.575,
                    delay: isOpen ? openDelay : exitDelay,
                    ease: mainEase,
                  }}
                />
              ))}
            </div>

            {/* Menu content */}
            <div className="absolute inset-0 flex pointer-events-auto">
              <div className="flex flex-col justify-between w-full px-8 py-24">
                {/* Nav links */}
                <ul className="flex flex-col gap-3 overflow-hidden">
                  {navItems.map((item, i) => (
                    <li key={item.label} className="overflow-hidden">
                      <motion.div
                        className="flex items-center gap-3 cursor-pointer"
                        initial="initial"
                        whileHover="hover"
                      >
                        {/* Sliding arrow */}
                        <motion.div
                          variants={{
                            initial: { x: '-120%', opacity: 0 },
                            hover: { x: 0, opacity: 1 },
                          }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="shrink-0"
                          style={{ color: 'rgb(0, 85, 254)' }}
                        >
                          <ArrowRight strokeWidth={3} className="size-10 sm:size-12 md:size-14" />
                        </motion.div>

                        {/* Link text */}
                        <motion.a
                          href={item.href}
                          onClick={onClose}
                          variants={{
                            initial: {
                              x: -44,
                              color: 'rgba(255,255,255,0.85)',
                              skewX: 0,
                            },
                            hover: {
                              x: 0,
                              color: 'rgb(0, 85, 254)',
                              skewX: -2,
                            },
                          }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="font-display font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight"
                        >
                          <motion.span
                            className="block"
                            variants={linkVariants}
                            custom={i}
                            initial="closed"
                            animate="open"
                            exit="closed"
                          >
                            {item.label}
                          </motion.span>
                        </motion.a>
                      </motion.div>
                    </li>
                  ))}
                </ul>

                {/* Bottom CTA */}
                <motion.div
                  className="pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.55, duration: 0.5, ease: mainEase },
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { delay: 0, duration: 0.15, ease: mainEase },
                  }}
                >
                  <LightBeamButton
                    onClick={() => {
                      onClose();
                      router.push('/auth?type=login');
                    }}
                    className="flex w-full items-center justify-center gap-2 text-base font-semibold py-4 h-auto"
                  >
                    Login / Signup
                  </LightBeamButton>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
