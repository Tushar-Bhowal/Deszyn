'use client';

import { motion } from 'framer-motion';
import { Palette, PanelLeft, ShieldCheck, Sparkles } from 'lucide-react';

import { NoiseTexture } from '@/components/ui/noise-texture';
import { useSidebar } from '@/components/ui/sidebar';
import { Composer } from './composer';
import { GridBackdrop } from './grid-backdrop';
import { MessageList } from './message-list';
import { useStudio } from './studio-provider';
import { WelcomeHero } from './welcome-hero';

const SUGGESTIONS = [
  { icon: Sparkles, label: 'Name my startup' },
  { icon: ShieldCheck, label: 'Check trademark & domain' },
  { icon: Palette, label: 'Design a logo & palette' },
];

export function ChatPanel() {
  const { messages, sendMessage } = useStudio();
  const { toggleSidebar } = useSidebar();
  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-[#0a0a0b] text-foreground">
      {/* drifting grid backdrop */}
      <GridBackdrop />
      {/* blue top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 z-0 h-[620px] w-[1100px] -translate-x-1/2 rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(26, 92, 255, 0.28), rgba(26, 92, 255, 0.06) 55%, transparent 75%)',
        }}
      />
      <NoiseTexture className="z-0 opacity-[0.6]" noiseOpacity={0.5} />

      {/* top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5">
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          className="grid size-9 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200"
        >
          <PanelLeft className="size-[18px]" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/[0.06]"
        >
          <Sparkles className="size-4 text-[#6f9bff]" />
          Upgrade
        </button>
      </header>

      {hasMessages ? (
        <main className="relative z-10 flex min-h-0 flex-1 flex-col">
          <MessageList />
          <div className="shrink-0 px-4 pb-4">
            <div className="mx-auto w-full max-w-3xl">
              <Composer autoFocus />
            </div>
          </div>
        </main>
      ) : (
        <>
          <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-6">
            <WelcomeHero />
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14 w-full max-w-[640px]"
            >
              <Composer autoFocus />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                {SUGGESTIONS.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => sendMessage(label)}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#131315] px-3.5 py-2.5 text-[0.82rem] text-neutral-400 transition-colors hover:bg-white/[0.05] hover:text-neutral-200"
                  >
                    <Icon className="size-4 text-neutral-500" />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </main>
          <footer className="relative z-10 pb-6 text-center text-sm text-neutral-600">
            Unlock new era with Deszyn.
          </footer>
        </>
      )}
    </div>
  );
}
