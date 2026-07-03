'use client';

import type { BrandResult, DomainStatus, NameCandidate, TrademarkStatus } from '@/lib/contracts';
import { cn } from '@/lib/utils';

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
  const trademark = TRADEMARK[candidate.trademark];
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
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
    </div>
  );
}

export function BrandOutput({ result }: { result: BrandResult }) {
  return (
    <div className="mt-1 grid gap-3 sm:grid-cols-2">
      {result.names.map((candidate) => (
        <NameCard key={candidate.id} candidate={candidate} />
      ))}
    </div>
  );
}
