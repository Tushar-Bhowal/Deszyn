'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Download, Pencil, RotateCcw, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { Fragment, type KeyboardEvent, useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { DownloadKitDialog } from './download-kit-dialog';
import { useStudio } from './studio-provider';

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="relative grid size-6 place-items-center rounded-md text-neutral-500 transition-colors after:absolute after:top-1/2 after:left-1/2 after:size-8 after:-translate-x-1/2 after:-translate-y-1/2 hover:bg-white/5 hover:text-neutral-200"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SectionLabel({ children, actions }: { children: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[0.68rem] text-neutral-400 uppercase tracking-wide">{children}</span>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function Ghost({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-white/10 border-dashed bg-white/[0.01] px-3 py-5 text-center text-xs text-neutral-500">
      {label}
    </div>
  );
}

function Stepper({
  steps,
  activeIndex,
}: {
  steps: { label: string; done: boolean }[];
  activeIndex: number;
}) {
  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const active = i === activeIndex;
        return (
          <Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1.5">
              <motion.span
                animate={{ scale: step.done || active ? 1 : 0.9 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className={cn(
                  'relative grid size-6 place-items-center rounded-full border text-[0.68rem] font-semibold transition-colors duration-300',
                  step.done
                    ? 'border-[#4f7bff] bg-[#4f7bff] text-white'
                    : active
                      ? 'border-[#4f7bff] text-[#9cbaff]'
                      : 'border-white/15 text-neutral-500',
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {step.done ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="size-3.5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="num"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {i + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
              <span
                className={cn(
                  'text-[0.68rem] transition-colors',
                  step.done || active ? 'text-neutral-300' : 'text-neutral-500',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mt-3 h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className="block h-full rounded-full bg-[#4f7bff]"
                  initial={false}
                  animate={{ width: step.done ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export function BrandKitContent() {
  const { brandKit, openStyleEditor, renameBrand, clearName, clearLogo, clearStyle, resetStudio } =
    useStudio();

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const startEditName = () => {
    setNameDraft(brandKit.name ?? '');
    setEditingName(true);
  };
  const commitName = () => {
    renameBrand(nameDraft);
    setEditingName(false);
  };
  const onNameKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitName();
    if (e.key === 'Escape') setEditingName(false);
  };

  const steps = [
    { label: 'Name', done: Boolean(brandKit.name) },
    { label: 'Logo', done: Boolean(brandKit.logo) },
    { label: 'Style', done: brandKit.colors.length > 0 },
  ];
  const activeIndex = steps.findIndex((s) => !s.done);
  const hasAnything = steps.some((s) => s.done);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-sm font-medium text-neutral-200">Brand kit</h2>
        <p className="mt-0.5 text-xs text-neutral-500">Everything here is editable</p>
      </div>

      <Stepper steps={steps} activeIndex={activeIndex} />

      <div className="flex flex-col gap-1.5">
        <SectionLabel
          actions={
            brandKit.name &&
            !editingName && (
              <>
                <IconButton label="Rename" onClick={startEditName}>
                  <Pencil className="size-3.5" />
                </IconButton>
                <IconButton label="Remove name" onClick={clearName}>
                  <Trash2 className="size-3.5" />
                </IconButton>
              </>
            )
          }
        >
          Name
        </SectionLabel>
        {!brandKit.name ? (
          <Ghost label="Not yet named" />
        ) : editingName ? (
          <div className="flex items-center gap-2">
            <input
              value={nameDraft}
              // biome-ignore lint/a11y/noAutofocus: focus the field the user just opened to edit
              autoFocus
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={onNameKey}
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 font-display text-lg font-medium text-neutral-50 focus:border-[#4f7bff] focus:outline-none"
            />
            <IconButton label="Save name" onClick={commitName}>
              <Check className="size-4 text-emerald-400" />
            </IconButton>
            <IconButton label="Cancel" onClick={() => setEditingName(false)}>
              <X className="size-4" />
            </IconButton>
          </div>
        ) : (
          <span
            key={brandKit.name}
            className="rounded-md px-1 font-display text-xl font-medium text-neutral-50 animate-[kit-flash_0.6s_ease-out]"
          >
            {brandKit.name}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel
          actions={
            brandKit.logo && (
              <IconButton label="Remove logo" onClick={clearLogo}>
                <Trash2 className="size-3.5" />
              </IconButton>
            )
          }
        >
          Logo
        </SectionLabel>
        {brandKit.logo ? (
          <div
            key={brandKit.logo.svg}
            className="grid h-24 animate-[kit-flash_0.6s_ease-out] place-items-center overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d0d0f] px-6 py-3 [&>svg]:h-auto [&>svg]:max-h-16 [&>svg]:w-auto [&>svg]:max-w-full"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: saved mock SVG generated locally
            dangerouslySetInnerHTML={{ __html: brandKit.logo.svg }}
          />
        ) : (
          <Ghost label="No logo yet" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel
          actions={
            brandKit.colors.length > 0 && (
              <>
                <IconButton label="Edit style" onClick={openStyleEditor}>
                  <SlidersHorizontal className="size-3.5" />
                </IconButton>
                <IconButton label="Remove style" onClick={clearStyle}>
                  <Trash2 className="size-3.5" />
                </IconButton>
              </>
            )
          }
        >
          Style
        </SectionLabel>
        {brandKit.colors.length > 0 ? (
          <div className="flex animate-[kit-flash_0.6s_ease-out] flex-col gap-2">
            <div className="flex gap-1.5">
              {brandKit.colors.map((color) => (
                <span
                  key={color.role}
                  title={`${color.name} ${color.hex}`}
                  className="h-8 flex-1 rounded-md border border-white/10"
                  style={{ background: color.hex }}
                />
              ))}
            </div>
            {brandKit.fonts.map((font) => (
              <span key={font.role} className="text-xs text-neutral-300">
                {font.family}
                <span className="text-neutral-500"> · {font.role}</span>
              </span>
            ))}
          </div>
        ) : (
          <Ghost label="No colours or type yet" />
        )}
      </div>

      {brandKit.colors.length > 0 && (
        <DownloadKitDialog
          trigger={
            <button type="button" className="btn-cta-primary w-full">
              <Download className="size-4" />
              Download brand kit
            </button>
          }
        />
      )}

      {hasAnything && (
        <div className="mt-auto border-white/[0.06] border-t pt-4">
          {confirmReset ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-400">
                Clear everything and start a new brand?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetStudio();
                    setConfirmReset(false);
                  }}
                  className="flex-1 rounded-lg bg-red-500/90 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500"
                >
                  Yes, start over
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-neutral-300 transition-colors hover:bg-white/[0.06]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
            >
              <RotateCcw className="size-3.5" />
              Start over
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function BrandKitPanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 m-3 mb-4 hidden w-80 shrink-0 flex-col overflow-y-auto rounded-xl bg-[#0c0c0e] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_30px_-12px_rgba(0,0,0,0.7)] lg:flex"
    >
      <BrandKitContent />
    </motion.aside>
  );
}
