'use client';

import type { Creativity } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { useStudio } from './studio-provider';

const OPTIONS: { value: Creativity; label: string }[] = [
  { value: 'safe', label: 'Safe' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'bold', label: 'Bold' },
];

/** Steers how abstract/inventive generations are (Namelix-style randomness dial). */
export function CreativityControl() {
  const { creativity, setCreativity } = useStudio();

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-white/[0.04] p-0.5">
      {OPTIONS.map((option) => {
        const active = creativity === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={`Creativity: ${option.label}`}
            onClick={() => setCreativity(option.value)}
            className={cn(
              'rounded-md px-2 py-1 text-[0.7rem] font-medium transition-colors',
              active ? 'bg-white/10 text-neutral-100' : 'text-neutral-400 hover:text-neutral-200',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
