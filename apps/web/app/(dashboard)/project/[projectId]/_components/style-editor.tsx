'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { BrandColor, BrandFont, FontPairing, PaletteOption } from '@/lib/contracts';
import { FONT_PAIRINGS, PALETTE_OPTIONS } from '@/lib/mock/brand';
import { cn } from '@/lib/utils';
import { useStudio } from './studio-provider';

export function StyleBlockCard() {
  const { openStyleEditor, brandKit } = useStudio();
  const saved = brandKit.colors.length > 0;
  const displayFamily = brandKit.fonts.find((f) => f.role === 'display')?.family;
  const bodyFamily = brandKit.fonts.find((f) => f.role === 'body')?.family;
  const pairing = FONT_PAIRINGS.find((p) => p.displayFamily === displayFamily);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#161619] p-4">
      {saved ? (
        <>
          <div className="flex items-center gap-1.5">
            {brandKit.colors.map((c) => (
              <span
                key={c.role}
                className="size-6 rounded-md border border-white/10"
                style={{ background: c.hex }}
              />
            ))}
          </div>
          <span className="text-sm text-neutral-200" style={{ fontFamily: pairing?.displayVar }}>
            {displayFamily}
            <span className="text-neutral-500"> / {bodyFamily}</span>
          </span>
        </>
      ) : (
        <p className="text-sm text-neutral-400">
          Preview fonts and colours, type your own sample text, and tweak anything before you save.
        </p>
      )}
      <button
        type="button"
        onClick={openStyleEditor}
        className="self-start rounded-lg border border-[#2c3d6e] bg-[#111f3d] px-3.5 py-2 text-sm font-medium text-[#cddcff] transition-colors hover:bg-[#16264d]"
      >
        {saved ? 'Edit style' : 'Open style editor'}
      </button>
    </div>
  );
}

function BrandPreview({
  name,
  pairing,
  primary,
  accent,
  surface,
  logo,
}: {
  name: string;
  pairing: FontPairing;
  primary: string;
  accent: string;
  surface: string;
  logo?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] p-5" style={{ background: surface }}>
      {logo && (
        <div
          className="mb-4 h-8 [&>svg]:h-8 [&>svg]:w-auto"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: saved mock SVG generated locally
          dangerouslySetInnerHTML={{ __html: logo }}
        />
      )}
      <h2
        className="text-3xl font-bold leading-tight"
        style={{ fontFamily: pairing.displayVar, color: primary }}
      >
        {name || 'Your brand'}
      </h2>
      <p className="mt-2 text-sm text-neutral-400" style={{ fontFamily: pairing.bodyVar }}>
        Turn your idea into a brand people remember — names, logos, and a design system in minutes.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
          style={{ background: primary, fontFamily: pairing.bodyVar }}
        >
          Get started
        </span>
        <span
          className="rounded-lg border px-3 py-1.5 text-sm"
          style={{ borderColor: accent, color: accent, fontFamily: pairing.bodyVar }}
        >
          Learn more
        </span>
      </div>
    </div>
  );
}

function PairingCard({
  pairing,
  selected,
  onSelect,
  previewText,
}: {
  pairing: FontPairing;
  selected: boolean;
  onSelect: () => void;
  previewText: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors',
        selected
          ? 'border-[#4f7bff] bg-[#101a33]'
          : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] text-neutral-400">
          {pairing.label}
          {pairing.recommended && <span className="text-[#6f9bff]"> · Recommended</span>}
        </span>
        {selected && <Check className="size-4 text-[#6f9bff]" />}
      </div>
      <span className="truncate text-xl text-neutral-50" style={{ fontFamily: pairing.displayVar }}>
        {previewText || pairing.displayFamily}
      </span>
      <span className="text-xs text-neutral-500" style={{ fontFamily: pairing.bodyVar }}>
        {pairing.displayFamily} / {pairing.bodyFamily}
      </span>
    </button>
  );
}

export function StyleEditor() {
  const { styleEditorOpen, closeStyleEditor, saveStyle, brandKit } = useStudio();
  const [pairingId, setPairingId] = useState('clean');
  const [colors, setColors] = useState<BrandColor[]>(PALETTE_OPTIONS[0].colors);
  const [previewText, setPreviewText] = useState('');

  // biome-ignore lint/correctness/useExhaustiveDependencies: seed drafts each time the editor opens
  useEffect(() => {
    if (!styleEditorOpen) return;
    setPreviewText(brandKit.name || 'Your brand');
    if (brandKit.colors.length) setColors(brandKit.colors);
    const savedDisplay = brandKit.fonts.find((f) => f.role === 'display')?.family;
    const match = FONT_PAIRINGS.find((p) => p.displayFamily === savedDisplay);
    if (match) setPairingId(match.id);
  }, [styleEditorOpen]);

  const pairing = FONT_PAIRINGS.find((p) => p.id === pairingId) ?? FONT_PAIRINGS[0];
  const colorOf = (role: BrandColor['role'], fallback: string) =>
    colors.find((c) => c.role === role)?.hex ?? fallback;

  const updateColor = (role: BrandColor['role'], hex: string) =>
    setColors((prev) => prev.map((c) => (c.role === role ? { ...c, hex } : c)));
  const applyPalette = (option: PaletteOption) => setColors(option.colors);

  const onSave = () => {
    const fonts: BrandFont[] = [
      { role: 'display', family: pairing.displayFamily, note: 'Headings & logo' },
      { role: 'body', family: pairing.bodyFamily, note: 'Body & UI' },
      { role: 'mono', family: 'Geist Mono', note: 'Code & data' },
    ];
    saveStyle(fonts, colors);
  };

  return (
    <Sheet
      open={styleEditorOpen}
      onOpenChange={(open) => {
        if (!open) closeStyleEditor();
      }}
    >
      <SheetContent
        side="right"
        className="w-full gap-0 border-white/[0.08] bg-[#0b0b0d] p-0 text-foreground sm:max-w-xl"
      >
        <SheetHeader className="border-white/[0.06] border-b">
          <SheetTitle className="font-display">Style editor</SheetTitle>
          <SheetDescription>Preview, tweak, and lock in your fonts &amp; colours.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-neutral-500">Preview text</span>
            <input
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Type sample text…"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:border-white/20 focus:outline-none"
            />
          </div>

          <BrandPreview
            name={previewText}
            pairing={pairing}
            primary={colorOf('primary', '#4F7BFF')}
            accent={colorOf('accent', '#9CBAFF')}
            surface={colorOf('surface', '#131316')}
            logo={brandKit.logo?.svg}
          />

          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-neutral-300">Type pairing</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {FONT_PAIRINGS.map((p) => (
                <PairingCard
                  key={p.id}
                  pairing={p}
                  selected={p.id === pairingId}
                  onSelect={() => setPairingId(p.id)}
                  previewText={previewText}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-neutral-300">Palette</h3>
            <div className="flex flex-wrap gap-2">
              {PALETTE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => applyPalette(option)}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="flex overflow-hidden rounded-md">
                    {option.colors.map((c) => (
                      <span key={c.role} className="size-4" style={{ background: c.hex }} />
                    ))}
                  </span>
                  <span className="text-xs text-neutral-400">{option.label}</span>
                </button>
              ))}
            </div>
            <div className="grid gap-2">
              {colors.map((color) => (
                <label
                  key={color.role}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2"
                >
                  <span
                    className="relative size-8 shrink-0 overflow-hidden rounded-md border border-white/10"
                    style={{ background: color.hex }}
                  >
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColor(color.role, e.target.value)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </span>
                  <span className="flex-1 text-sm text-neutral-200">{color.name}</span>
                  <span className="font-mono text-xs text-neutral-500 uppercase">{color.hex}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <SheetFooter className="flex-row gap-2 border-white/[0.06] border-t">
          <button
            type="button"
            onClick={closeStyleEditor}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/[0.06]"
          >
            Cancel
          </button>
          <button type="button" onClick={onSave} className="btn-cta-primary rounded-lg flex-1">
            Save brand style
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
