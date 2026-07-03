'use client';

import { cn } from '@/lib/utils';

const BARS = [
  { x: 3, h: 9, delay: '0s' },
  { x: 7.5, h: 15, delay: '0.15s' },
  { x: 12, h: 21, delay: '0.3s' },
  { x: 16.5, h: 15, delay: '0.45s' },
  { x: 21, h: 9, delay: '0.6s' },
];

function EqualizerIcon({ animate }: { animate: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {BARS.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={(24 - bar.h) / 2}
          width="2"
          height={bar.h}
          rx="1"
          fill="currentColor"
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation: animate ? `voice-wave 0.9s ease-in-out ${bar.delay} infinite` : undefined,
          }}
        />
      ))}
    </svg>
  );
}

export function VoiceInput({
  listening,
  supported,
  onClick,
}: {
  listening: boolean;
  supported: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!supported}
      aria-label={listening ? 'Stop recording' : 'Dictate with your voice'}
      title={supported ? undefined : 'Voice input is not supported in this browser'}
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-lg text-neutral-400 transition-colors',
        supported && 'hover:bg-white/5 hover:text-neutral-200',
        !supported && 'cursor-not-allowed opacity-40',
        listening && 'bg-red-500/15 text-red-400 hover:bg-red-500/20 hover:text-red-300',
      )}
    >
      <EqualizerIcon animate={listening} />
    </button>
  );
}
