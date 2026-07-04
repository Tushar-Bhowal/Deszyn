'use client';

import { Check, Download, FileCode2, Palette } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { downloadBrandKit, type ThemeFormat } from '@/lib/download-kit';
import { cn } from '@/lib/utils';
import { useStudio } from './studio-provider';

const FORMATS: {
  id: ThemeFormat;
  icon: typeof FileCode2;
  title: string;
  desc: string;
}[] = [
  {
    id: 'shadcn',
    icon: FileCode2,
    title: 'shadcn / Tailwind v4',
    desc: 'globals.css with design tokens (:root, .dark, @theme) — drops into a shadcn app.',
  },
  {
    id: 'plain',
    icon: Palette,
    title: 'Plain CSS variables',
    desc: 'A simple :root { --brand-* } file plus the font @import. Works anywhere.',
  },
];

export function DownloadKitDialog({ trigger }: { trigger: React.ReactNode }) {
  const { brandKit } = useStudio();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ThemeFormat>('shadcn');
  const [busy, setBusy] = useState(false);

  const onDownload = async () => {
    setBusy(true);
    try {
      await downloadBrandKit(brandKit, format);
      toast.success('Brand kit downloaded');
      setOpen(false);
    } catch {
      toast.error('Could not build the kit — please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0d0d0f] text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Download brand kit</DialogTitle>
          <DialogDescription>
            Your logo in SVG, PNG &amp; JPG plus a ready-to-paste theme file — pick the format your
            project uses.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {FORMATS.map((option) => {
            const active = format === option.id;
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFormat(option.id)}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                  active
                    ? 'border-[#4f7bff] bg-[#101a33]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]',
                )}
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-[#6f9bff]" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-neutral-100">{option.title}</span>
                  <p className="mt-0.5 text-xs text-neutral-400">{option.desc}</p>
                </div>
                {active && <Check className="mt-0.5 size-4 shrink-0 text-[#6f9bff]" />}
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onDownload}
            disabled={busy}
            className="btn-cta-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="size-4" />
            {busy ? 'Preparing…' : 'Download .zip'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
