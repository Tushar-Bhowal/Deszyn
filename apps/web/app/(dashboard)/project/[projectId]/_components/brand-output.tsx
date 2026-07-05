'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { DomainResult, DomainStatus, NameCandidate, TrademarkStatus } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { useStudio } from './studio-provider';

const EASE = [0.16, 1, 0.3, 1] as const;

const TRADEMARK: Record<TrademarkStatus, { label: string; className: string; dot: string }> = {
  safe: {
    label: 'No obvious conflicts',
    className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  crowded: {
    label: 'Some similar marks',
    className: 'border-amber-500/25 bg-amber-500/10 text-amber-200',
    dot: 'bg-amber-400',
  },
  conflict: {
    label: 'Close matches found',
    className: 'border-red-500/25 bg-red-500/10 text-red-300',
    dot: 'bg-red-400',
  },
};

const DOMAIN: Record<DomainStatus, string> = {
  available: 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300',
  taken: 'border-white/10 bg-white/[0.03] text-neutral-500 line-through',
  expiring: 'border-amber-500/25 bg-amber-500/5 text-amber-200',
};

// Mock "why" behind each verdict — a verdict is only trustworthy if it's reviewable.
function trademarkDetail(candidate: NameCandidate): { summary: string; matches: string[] } {
  const cls = 'class 9 (software)';
  switch (candidate.trademark) {
    case 'safe':
      return {
        summary: `No live word marks matching "${candidate.name}" in USPTO for ${cls}.`,
        matches: [],
      };
    case 'crowded':
      return {
        summary: `A few similar live marks in ${cls} — usable, but not highly distinctive.`,
        matches: [`${candidate.name}ly — registered`, `${candidate.name} Labs — pending`],
      };
    case 'conflict':
      return {
        summary: `Live word marks closely matching "${candidate.name}" in ${cls}.`,
        matches: [`${candidate.name} — registered`, `${candidate.name} Inc — registered`],
      };
  }
}

// Remembers which checks have already resolved so re-mounting (collapse/expand) doesn't re-run them.
const resolvedKeys = new Set<string>();
function useResolved(key: string, delayMs: number): boolean {
  const [resolved, setResolved] = useState(() => resolvedKeys.has(key));
  useEffect(() => {
    if (resolvedKeys.has(key)) return;
    const timer = setTimeout(() => {
      resolvedKeys.add(key);
      setResolved(true);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [key, delayMs]);
  return resolved;
}

function DomainPill({
  candidate,
  domain,
  delayMs,
}: {
  candidate: NameCandidate;
  domain: DomainResult;
  delayMs: number;
}) {
  const resolved = useResolved(`${candidate.id}-${domain.tld}`, delayMs);
  if (!resolved) {
    return (
      <span className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-1.5 py-0.5 font-mono text-[0.7rem] text-neutral-500">
        <span className="size-1 animate-pulse rounded-full bg-neutral-500" />
        {candidate.name.toLowerCase()}
        {domain.tld}
      </span>
    );
  }
  return (
    <motion.span
      initial={{ scale: 0.92, opacity: 0.4 }}
      animate={{ scale: [1, 1.04, 1], opacity: 1 }}
      transition={{ duration: 0.18, ease: EASE }}
      className={cn(
        'rounded-md border px-1.5 py-0.5 font-mono text-[0.7rem]',
        DOMAIN[domain.status],
      )}
    >
      {candidate.name.toLowerCase()}
      {domain.tld}
    </motion.span>
  );
}

function TrademarkPill({ candidate }: { candidate: NameCandidate }) {
  const tm = TRADEMARK[candidate.trademark];
  const detail = trademarkDetail(candidate);
  const resolved = useResolved(`${candidate.id}-tm`, 500);
  const [open, setOpen] = useState(false);

  if (!resolved) {
    return (
      <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.68rem] text-neutral-500">
        <span className="size-1.5 animate-pulse rounded-full bg-neutral-500" />
        Checking…
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        initial={{ scale: 0.92 }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 0.18, ease: EASE }}
        className={cn(
          'flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.68rem] font-medium transition-colors',
          tm.className,
        )}
      >
        <span className={cn('size-1.5 rounded-full', tm.dot)} />
        {tm.label}
        <ChevronDown className={cn('size-3 transition-transform', open && 'rotate-180')} />
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="w-full overflow-hidden"
          >
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-left text-[0.72rem] leading-relaxed text-neutral-300">
              <p className="text-pretty">{detail.summary}</p>
              {detail.matches.length > 0 && (
                <ul className="mt-1.5 flex flex-col gap-0.5 font-mono text-neutral-400">
                  {detail.matches.map((m) => (
                    <li key={m}>• {m}</li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-[0.66rem] text-neutral-500">
                Checked against USPTO word marks. Not legal advice — verify before filing.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NameCard({ candidate, order }: { candidate: NameCandidate; order: number }) {
  const { chosenNameId, chooseName, saveName, brandKit } = useStudio();
  const isSaved = brandKit.name === candidate.name;
  const isChosen = chosenNameId === candidate.id && !isSaved;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE, delay: order * 0.06 }}
      className={cn(
        'flex flex-col gap-2.5 rounded-2xl border p-4 transition-colors',
        isSaved
          ? 'border-[#4f7bff] bg-[#101a33]'
          : isChosen
            ? 'border-[#2c3d6e] bg-[#12161f]'
            : 'border-white/10 bg-[#161619]',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-medium text-neutral-50">{candidate.name}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[0.68rem] text-neutral-300 capitalize">
            {candidate.tone}
          </span>
        </div>
        <TrademarkPill candidate={candidate} />
      </div>
      <p className="text-pretty text-xs leading-relaxed text-neutral-400">{candidate.rationale}</p>
      <div className="flex flex-wrap gap-1.5">
        {candidate.domains.map((domain, i) => (
          <DomainPill
            key={domain.tld}
            candidate={candidate}
            domain={domain}
            delayMs={700 + i * 350}
          />
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
            className="w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition-[background-color,scale] duration-150 ease-out hover:bg-white/90 active:scale-[0.97]"
          >
            Save to brand kit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => chooseName(candidate.id)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-neutral-100 transition-[background-color,scale] duration-150 ease-out hover:bg-white/10 active:scale-[0.97]"
          >
            Choose
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function BrandOutput({ names }: { names: NameCandidate[] }) {
  const { brandKit } = useStudio();
  const savedIndex = names.findIndex((n) => n.name === brandKit.name);
  const hasSaved = savedIndex >= 0;
  const [expanded, setExpanded] = useState(false);

  if (!hasSaved || expanded) {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {names.map((candidate, i) => (
            <NameCard key={candidate.id} candidate={candidate} order={i} />
          ))}
        </div>
        {hasSaved && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="self-start text-xs text-neutral-400 transition-colors hover:text-neutral-200"
          >
            Collapse other names
          </button>
        )}
      </div>
    );
  }

  const saved = names[savedIndex];
  const otherCount = names.length - 1;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3">
        <NameCard candidate={saved} order={0} />
      </div>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="group flex items-center gap-3 self-start rounded-xl border border-white/10 bg-[#161619] px-4 py-3 text-sm text-neutral-300 transition-colors hover:border-white/15 hover:bg-[#1b1b20] hover:text-neutral-100 active:scale-[0.99]"
      >
        <span className="font-medium">{otherCount} other names</span>
        <ChevronDown className="size-4 text-neutral-500 transition-transform group-hover:translate-y-0.5" />
      </button>
    </div>
  );
}
