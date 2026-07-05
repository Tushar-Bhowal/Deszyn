'use client';

import { motion } from 'framer-motion';
import { Check, ChevronDown, Download } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { LogoConcept } from '@/lib/contracts';
import { downloadSvg, svgToRaster } from '@/lib/export-svg';
import { cn } from '@/lib/utils';
import { useStudio } from './studio-provider';

const EASE = [0.16, 1, 0.3, 1] as const;

function LogoCard({ concept, order }: { concept: LogoConcept; order: number }) {
  const { chosenLogoId, chooseLogo, saveLogo, brandKit } = useStudio();
  const isSaved = brandKit.logo?.svg === concept.svg;
  const isChosen = chosenLogoId === concept.id && !isSaved;

  const base = `${(brandKit.name ?? 'logo').toLowerCase()}-${concept.style.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE, delay: order * 0.06 }}
      className={cn(
        'flex flex-col gap-3 rounded-2xl border p-4 transition-colors',
        isSaved
          ? 'border-[#4f7bff] bg-[#101a33]'
          : isChosen
            ? 'border-[#2c3d6e] bg-[#12161f]'
            : 'border-white/10 bg-[#161619]',
      )}
    >
      <div
        className="grid h-28 place-items-center overflow-hidden rounded-xl bg-[#0d0d0f] px-6 py-3 [&>svg]:h-auto [&>svg]:max-h-20 [&>svg]:w-auto [&>svg]:max-w-full"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: mock SVG generated locally from a fixed set (names are HTML-escaped)
        dangerouslySetInnerHTML={{ __html: concept.svg }}
      />
      <span className="text-sm font-medium text-neutral-200">{concept.style}</span>

      {isSaved ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <Check className="size-3.5" /> Saved to brand kit
        </span>
      ) : isChosen ? (
        <button
          type="button"
          onClick={saveLogo}
          className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition-[background-color,scale] duration-150 ease-out hover:bg-white/90 active:scale-[0.97]"
        >
          Use this logo
        </button>
      ) : (
        <button
          type="button"
          onClick={() => chooseLogo(concept.id)}
          className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-neutral-100 transition-[background-color,scale] duration-150 ease-out hover:bg-white/10 active:scale-[0.97]"
        >
          Select
        </button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-neutral-200"
          >
            <Download className="size-3.5" />
            Download
            <ChevronDown className="size-3 opacity-70" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onSelect={() => downloadSvg(concept.svg, `${base}.svg`)}>
            SVG
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => svgToRaster(concept.svg, 'image/png', `${base}.png`)}>
            PNG
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => svgToRaster(concept.svg, 'image/jpeg', `${base}.jpg`)}>
            JPG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}

export function LogoOutput({ logos }: { logos: LogoConcept[] }) {
  const { brandKit } = useStudio();
  const savedIndex = logos.findIndex((l) => l.svg === brandKit.logo?.svg);
  const hasSaved = savedIndex >= 0;
  const [expanded, setExpanded] = useState(false);

  if (!hasSaved || expanded) {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-3">
          {logos.map((concept, i) => (
            <LogoCard key={concept.id} concept={concept} order={i} />
          ))}
        </div>
        {hasSaved && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="self-start text-xs text-neutral-400 transition-colors hover:text-neutral-200"
          >
            Collapse other logos
          </button>
        )}
      </div>
    );
  }

  const saved = logos[savedIndex];
  const otherCount = logos.length - 1;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <LogoCard concept={saved} order={0} />
      </div>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="group flex items-center gap-3 self-start rounded-xl border border-white/10 bg-[#161619] px-4 py-3 text-sm text-neutral-300 transition-colors hover:border-white/15 hover:bg-[#1b1b20] hover:text-neutral-100 active:scale-[0.99]"
      >
        <span className="font-medium">{otherCount} other logos</span>
        <ChevronDown className="size-4 text-neutral-500 transition-transform group-hover:translate-y-0.5" />
      </button>
    </div>
  );
}
