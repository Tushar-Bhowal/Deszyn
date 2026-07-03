'use client';

import { ArrowUp, Square, Zap } from 'lucide-react';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { useVoiceDictation } from '@/hooks/use-voice-dictation';
import { cn } from '@/lib/utils';
import { AttachmentChip } from './attachment-chip';
import { AttachmentMenu } from './attachment-menu';
import { ModelSwitcher } from './model-switcher';
import { useStudio } from './studio-provider';
import { VoiceInput } from './voice-input';

const MIN_TEXTAREA_HEIGHT = 96;
const MAX_TEXTAREA_HEIGHT = 260;

export function Composer({ autoFocus }: { autoFocus?: boolean }) {
  const { sendMessage, isStreaming, stop, attachments } = useStudio();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const voiceBaseRef = useRef('');

  const voice = useVoiceDictation({
    onStart: () => {
      voiceBaseRef.current = text.trim();
    },
    onLive: (transcript) => {
      setText(voiceBaseRef.current ? `${voiceBaseRef.current} ${transcript}` : transcript);
    },
    onStop: (cleaned) => {
      setText([voiceBaseRef.current, cleaned].filter(Boolean).join(' '));
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure height whenever text changes
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(Math.max(el.scrollHeight, MIN_TEXTAREA_HEIGHT), MAX_TEXTAREA_HEIGHT)}px`;
  }, [text]);

  const submit = () => {
    if (!text.trim() || isStreaming) return;
    sendMessage(text);
    setText('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const canSend = text.trim().length > 0 && !isStreaming;

  return (
    <div className="rounded-[20px] border border-white/[0.07] bg-[#131315] p-2 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 px-2.5 pt-1.5 pb-2.5 text-[0.8rem] text-neutral-500">
        <Zap className="size-3.5" />
        Unlock unlimited brand generations with Pro.
      </div>
      <div className="rounded-[14px] bg-[#0d0d0f] p-1.5">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1 pt-1 pb-2">
            {attachments.map((attachment) => (
              <AttachmentChip key={attachment.id} attachment={attachment} />
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          // biome-ignore lint/a11y/noAutofocus: composer is the primary action on this screen
          autoFocus={autoFocus}
          placeholder="Describe your product or idea ..."
          className="block max-h-[260px] min-h-[96px] w-full resize-none bg-transparent px-2.5 pt-2 pb-1 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <div className="flex items-center gap-1">
            <AttachmentMenu />
            <ModelSwitcher />
          </div>
          <div className="flex items-center gap-1">
            <VoiceInput
              listening={voice.listening}
              supported={voice.supported}
              onClick={voice.toggle}
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop generating"
                className="grid size-8 place-items-center rounded-lg bg-white/10 text-neutral-200 transition-colors hover:bg-white/15"
              >
                <Square className="size-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canSend}
                aria-label="Send message"
                className={cn(
                  'grid size-8 place-items-center rounded-lg transition-colors',
                  canSend
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'cursor-not-allowed bg-white/10 text-neutral-500',
                )}
              >
                <ArrowUp className="size-[18px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
