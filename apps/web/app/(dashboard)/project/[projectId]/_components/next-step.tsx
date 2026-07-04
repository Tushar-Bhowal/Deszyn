'use client';

import { ArrowRight, Palette, PenTool } from 'lucide-react';

import type { NextStep } from '@/lib/contracts';
import { useStudio } from './studio-provider';

export function NextStepCta({ step, label }: { step: NextStep; label: string }) {
  const { startLogo, startSystem, isStreaming } = useStudio();
  const onClick = step === 'logo' ? startLogo : startSystem;
  const Icon = step === 'logo' ? PenTool : Palette;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isStreaming}
      className="group inline-flex items-center gap-2 self-start rounded-xl border border-[#2c3d6e] bg-[#111f3d] px-4 py-2.5 text-sm font-medium text-[#cddcff] transition-colors hover:border-[#3a4f88] hover:bg-[#16264d] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="size-4 text-[#6f9bff]" />
      {label}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
