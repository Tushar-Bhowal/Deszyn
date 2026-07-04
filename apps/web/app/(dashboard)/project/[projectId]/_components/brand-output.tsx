'use client';

import { Check } from 'lucide-react';

import type { DomainStatus, NameCandidate, TrademarkStatus } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { useStudio } from './studio-provider';

const TRADEMARK: Record<TrademarkStatus, { label: string; className: string }> = {
  safe: {
    label: 'Likely safe',
    className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  },
  crowded: { label: 'Crowded', className: 'border-amber-500/25 bg-amber-500/10 text-amber-300' },
  conflict: { label: 'Likely conflict', className: 'border-red-500/25 bg-red-500/10 text-red-300' },
};

const DOMAIN: Record<DomainStatus, string> = {
  available: 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300',
  taken: 'border-white/10 bg-white/[0.03] text-neutral-500 line-through',
  expiring: 'border-amber-500/25 bg-amber-500/5 text-amber-300',
};

function NameCard({ candidate }: { candidate: NameCandidate }) {
  const { chosenNameId, chooseName, saveName, brandKit } = useStudio();
  const isSaved = brandKit.name === candidate.name;
  const isChosen = chosenNameId === candidate.id && !isSaved;
  const trademark = TRADEMARK[candidate.trademark];

  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 rounded-2xl border p-4 transition-colors',
        isSaved
          ? 'border-[#3a4f88] bg-[#101a33]'
          : isChosen
            ? 'border-[#2c3d6e] bg-[#12161f]'
            : 'border-white/10 bg-[#161619]',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-neutral-50">
            {candidate.name}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[0.68rem] text-neutral-400 capitalize">
            {candidate.tone}
          </span>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full border px-2 py-0.5 text-[0.68rem] font-medium',
            trademark.className,
          )}
        >
          {trademark.label}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-neutral-400">{candidate.rationale}</p>
      <div className="flex flex-wrap gap-1.5">
        {candidate.domains.map((domain) => (
          <span
            key={domain.tld}
            className={cn(
              'rounded-md border px-1.5 py-0.5 font-mono text-[0.7rem]',
              DOMAIN[domain.status],
            )}
          >
            {candidate.name.toLowerCase()}
            {domain.tld}
          </span>
        ))}
      </div>
      <div className="pt-1">
        {isSaved ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <Check className="size-3.5" /> Saved to brand kit
          </span>
        ) : isChosen ? (
          <button
            type="button"
            onClick={saveName}
            className="w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-white/90"
          >
            Save to brand kit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => chooseName(candidate.id)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-neutral-100 transition-colors hover:bg-white/[0.1]"
          >
            Choose
          </button>
        )}
      </div>
    </div>
  );
}

export function BrandOutput({ names }: { names: NameCandidate[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {names.map((candidate) => (
        <NameCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
