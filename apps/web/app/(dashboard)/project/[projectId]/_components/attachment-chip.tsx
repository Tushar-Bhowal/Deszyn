'use client';

import { FileText, X } from 'lucide-react';

import type { Attachment } from '@/lib/contracts';
import { useStudio } from './studio-provider';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentChip({ attachment }: { attachment: Attachment }) {
  const { removeAttachment } = useStudio();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#0d0d0f] py-1.5 pr-1.5 pl-2">
      {attachment.kind === 'image' && attachment.previewUrl ? (
        // biome-ignore lint/performance/noImgElement: transient object URL, not a static asset
        <img
          src={attachment.previewUrl}
          alt={attachment.name}
          className="size-7 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white/5 text-neutral-400">
          <FileText className="size-3.5" />
        </span>
      )}
      <div className="grid min-w-0 leading-tight">
        <span className="max-w-40 truncate text-xs text-neutral-200">{attachment.name}</span>
        <span className="text-[0.68rem] text-neutral-500">{formatSize(attachment.size)}</span>
      </div>
      <button
        type="button"
        aria-label={`Remove ${attachment.name}`}
        onClick={() => removeAttachment(attachment.id)}
        className="grid size-5 shrink-0 place-items-center rounded-md text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
