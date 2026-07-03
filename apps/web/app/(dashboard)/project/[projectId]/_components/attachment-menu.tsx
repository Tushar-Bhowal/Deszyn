'use client';

import { FileText, ImageIcon, Plus } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Attachment } from '@/lib/contracts';
import {
  ACCEPT_DOCUMENT,
  ACCEPT_IMAGE,
  MAX_ATTACHMENTS,
  validateFile,
} from '@/lib/validate-attachment';
import { useStudio } from './studio-provider';

export function AttachmentMenu() {
  const { attachments, addAttachments } = useStudio();
  const imageRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const remaining = MAX_ATTACHMENTS - attachments.length;
    if (remaining <= 0) {
      toast.error(`You can attach up to ${MAX_ATTACHMENTS} files.`);
      return;
    }
    const incoming = Array.from(list);
    const accepted = incoming.slice(0, remaining);
    const valid: Attachment[] = [];
    for (const file of accepted) {
      const result = validateFile(file);
      if (result.ok) {
        valid.push(result.attachment);
      } else {
        toast.error(result.error);
      }
    }
    if (incoming.length > remaining) {
      toast.error(`Only ${MAX_ATTACHMENTS} files allowed — extra files were skipped.`);
    }
    if (valid.length) {
      addAttachments(valid);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Add attachment"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200"
          >
            <Plus className="size-[18px]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem
            onSelect={() => setTimeout(() => imageRef.current?.click(), 0)}
            className="gap-2"
          >
            <ImageIcon className="size-4" />
            Image
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setTimeout(() => docRef.current?.click(), 0)}
            className="gap-2"
          >
            <FileText className="size-4" />
            Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        ref={imageRef}
        type="file"
        accept={ACCEPT_IMAGE}
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={docRef}
        type="file"
        accept={ACCEPT_DOCUMENT}
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </>
  );
}
