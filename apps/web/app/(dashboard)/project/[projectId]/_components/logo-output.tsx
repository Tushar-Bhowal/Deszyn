'use client';

import { Check, ChevronDown, Download } from 'lucide-react';

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

function LogoCard({ concept }: { concept: LogoConcept }) {
  const { chosenLogoId, chooseLogo, saveLogo, brandKit } = useStudio();
  const isSaved = brandKit.logo?.svg === concept.svg;
  const isChosen = chosenLogoId === concept.id && !isSaved;

  const base = `${(brandKit.name ?? 'logo').toLowerCase()}-${concept.style.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border p-4 transition-colors',
        isSaved
          ? 'border-[#3a4f88] bg-[#101a33]'
          : isChosen
            ? 'border-[#2c3d6e] bg-[#12161f]'
            : 'border-white/10 bg-[#161619]',
      )}
    >
      <div
        className="grid h-28 place-items-center overflow-hidden rounded-xl bg-[#0d0d0f] p-3 [&>svg]:max-h-20 [&>svg]:w-auto"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: mock SVG generated locally from a fixed set (names are HTML-escaped)
        dangerouslySetInnerHTML={{ __html: concept.svg }}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-neutral-200">{concept.style}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-white/[0.06]"
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
            <DropdownMenuItem
              onSelect={() => svgToRaster(concept.svg, 'image/jpeg', `${base}.jpg`)}
            >
              JPG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isSaved ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <Check className="size-3.5" /> Saved to brand kit
        </span>
      ) : isChosen ? (
        <button
          type="button"
          onClick={saveLogo}
          className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-white/90"
        >
          Use this logo
        </button>
      ) : (
        <button
          type="button"
          onClick={() => chooseLogo(concept.id)}
          className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-neutral-100 transition-colors hover:bg-white/[0.1]"
        >
          Select
        </button>
      )}
    </div>
  );
}

export function LogoOutput({ logos }: { logos: LogoConcept[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {logos.map((concept) => (
        <LogoCard key={concept.id} concept={concept} />
      ))}
    </div>
  );
}
