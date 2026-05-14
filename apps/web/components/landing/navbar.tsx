'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LightBeamButton } from '@/components/ui/light-beam-button';
import { MobileNavigation } from '@/components/ui/mobile-navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

interface Highlight {
  x: number;
  width: number;
}

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const pillRef = useRef<HTMLDivElement>(null);
  const [hoverActive, setHoverActive] = useState(false);
  const [justHovered, setJustHovered] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [fadingOut, setFadingOut] = useState(false);

  // Only shrink on desktop ≥1024px
  const shouldShrink = isDesktop && scrolled;

  // desktop + scroll detection
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');

    const update = () => {
      const desktop = mq.matches;
      setIsDesktop(desktop);
      setScrolled(desktop ? window.scrollY > 80 : false);
    };

    const onScroll = () => setScrolled(mq.matches ? window.scrollY > 80 : false);

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', update);
    };
  }, []);

  // body lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // cleanup
  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  // scroll-spy
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.slice(1));
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        setActiveSection(sectionIds.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Pure derivation: which label should be highlighted?
  const targetLabel = useMemo<string | null>(() => {
    if (hoveredLink) return hoveredLink;
    if (hoverActive || justHovered || fadingOut) return null;
    if (!activeSection) return null;
    return navLinks.find((l) => l.href === `#${activeSection}`)?.label ?? null;
  }, [hoveredLink, hoverActive, justHovered, activeSection, fadingOut]);

  // DOM measurement sync — position the highlight pill under targetLabel
  // biome-ignore lint/correctness/useExhaustiveDependencies: shouldShrink layout change requires re-measurement even though it's not read in the effect body
  useLayoutEffect(() => {
    if (!targetLabel) return;
    const el = linkRefs.current.get(targetLabel);
    const pill = pillRef.current;
    if (!el || !pill) return;
    const pillRect = pill.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setHighlight({ x: elRect.left - pillRect.left - 6, width: elRect.width });
  }, [targetLabel, shouldShrink]);

  // ── click handler ─────────────────────────────────────────────
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHoverActive(false);
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  };

  // hover handlers
  const handlePillMouseLeave = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);

    setHoveredLink(null);
    setFadingOut(true); // block activeSection sync during fade
    setHoverActive(false);
    setJustHovered(false);

    leaveTimer.current = setTimeout(() => {
      setFadingOut(false); // allow re-sync
      setHighlight(null); // clear position after fade completes
    }, 220);
  };
  const handleLinkMouseEnter = (_e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHoverActive(true);
    setJustHovered(true);
    setHoveredLink(label);
  };

  return (
    <>
      {/*
       * Outer wrapper: entrance animation only.
       * pointer-events:none so the transparent gap never blocks clicks.
       */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center"
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{ pointerEvents: 'auto' }}
          className={cn(
            'relative flex items-center justify-between',
            'border border-transparent',
            'transition-all duration-500 ease-out',
            !shouldShrink && [
              'w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-7xl h-[80px]',
              'px-4 sm:px-6 lg:px-10 gap-6',
              'rounded-none bg-transparent',
            ],
            shouldShrink && [
              'mt-3 w-[calc(100%-24px)] md:w-full max-w-3xl px-3 py-2 gap-3',
              'rounded-[14px]',
              'bg-[rgba(13,13,15,0.88)] backdrop-blur-xl',
              'border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.50)]',
            ],
          )}
        >
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="/logo.png"
              alt="Deszyn"
              width={28}
              height={28}
              loading="eager"
              priority
              className="rounded-md group-hover:scale-105 transition-transform duration-300 w-auto h-auto"
            />
            {/* Logo text fades + collapses on shrink */}
            <span
              className={cn(
                'font-display font-bold text-xl tracking-tight text-white',
                'overflow-hidden whitespace-nowrap',
                'transition-all duration-500 ease-out',
                shouldShrink ? 'opacity-0 max-w-0' : 'opacity-100 max-w-30',
              )}
            >
              Deszyn
            </span>
          </Link>

          {/* ── Desktop nav pill ── */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: pill is a visual hover-highlight container; nav links inside are the keyboard-accessible interactive elements */}
          <div
            ref={pillRef}
            onMouseLeave={handlePillMouseLeave}
            className={cn(
              'hidden lg:flex items-center px-1.5 py-1.5 gap-0.5',
              'transition-all duration-500 ease-out',
              shouldShrink ? 'relative' : 'absolute left-1/2 -translate-x-1/2',
            )}
            style={
              shouldShrink
                ? {}
                : {
                    background: 'rgba(10,10,15,0.75)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                  }
            }
          >
            {/* Sliding highlight */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                height: 'calc(100% - 12px)',
                borderRadius: '8px',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(96,165,250,0.6)',
                boxShadow: '0 0 15px rgba(59,130,246,0.3), inset 0 0 10px rgba(59,130,246,0.1)',
                pointerEvents: 'none',
                zIndex: 0,
                // FIX: Use hoveredLink to control opacity primarily
                opacity: hoveredLink || (activeSection && !hoverActive) ? 1 : 0,
                width: highlight ? `${highlight.width}px` : '80px',
                transform: `translateX(${highlight?.x ?? 0}px)`,
                transition:
                  hoveredLink || activeSection
                    ? 'transform 0.35s cubic-bezier(0.34,1.18,0.64,1), width 0.35s cubic-bezier(0.34,1.18,0.64,1), opacity 0.2s ease'
                    : 'opacity 0.2s ease', // When disappearing, don't animate the 'transform'
              }}
            />

            {/* Nav links */}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                ref={(el) => {
                  if (el) linkRefs.current.set(link.label, el);
                  else linkRefs.current.delete(link.label);
                }}
                onClick={(e) => handleClick(e, link.href)}
                onMouseEnter={(e) => handleLinkMouseEnter(e, link.label)}
                onMouseLeave={() => setHoveredLink(null)}
                className={cn(
                  'relative z-10 py-2 text-sm font-medium whitespace-nowrap',
                  'transition-all duration-500 ease-out cursor-pointer',
                  shouldShrink ? 'px-[10px]' : 'px-4',
                )}
                style={{
                  borderRadius: '8px',
                  color:
                    (activeSection && `#${activeSection}` === link.href) ||
                    hoveredLink === link.label
                      ? 'rgb(150, 195, 255)'
                      : 'rgba(255,255,255,0.55)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Desktop CTA ── */}
          <LightBeamButton
            onClick={() => router.push('/auth?type=login')}
            className="hidden shrink-0 px-5 py-2.5 text-sm font-semibold lg:inline-flex"
          >
            Login / Signup
          </LightBeamButton>
        </div>

        {/* Full-width navbar border — only when expanded */}
        {!shouldShrink && (
          <div className="w-full border-b border-white/6" style={{ pointerEvents: 'none' }} />
        )}
      </motion.div>

      <MobileNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onToggle={() => setMobileOpen((v) => !v)}
      />
    </>
  );
}
