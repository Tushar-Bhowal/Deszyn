'use client';

import { FileText } from 'lucide-react';
import Image from 'next/image';

import type { ChatMessage as ChatMessageType, MessageBlock } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { BrandOutput } from './brand-output';
import { LoadingBlock } from './loading-block';
import { LogoOutput } from './logo-output';
import { NextStepCta } from './next-step';
import { useStudio } from './studio-provider';
import { StyleBlockCard } from './style-editor';
import { LoadingOrb } from './working-indicator';

function PromptExamples({ prompts }: { prompts: string[] }) {
  const { sendMessage } = useStudio();
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => sendMessage(prompt)}
          className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-white/[0.06] hover:text-neutral-100 active:scale-[0.98]"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  let offset = 0;
  return (
    <>
      {parts.map((part) => {
        const key = offset;
        offset += part.length;
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={key} className="font-semibold text-neutral-50">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={key}>{part}</span>;
      })}
    </>
  );
}

function Block({ block }: { block: MessageBlock }) {
  switch (block.type) {
    case 'names':
      return <BrandOutput names={block.names} />;
    case 'logos':
      return <LogoOutput logos={block.logos} />;
    case 'style':
      return <StyleBlockCard />;
    case 'next':
      return <NextStepCta step={block.step} label={block.label} />;
    case 'examples':
      return <PromptExamples prompts={block.prompts} />;
    default:
      return null;
  }
}

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser &&
        (message.pending ? (
          <LoadingOrb className="mt-0.5" />
        ) : (
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-white/5">
            <Image
              src="/logo.png"
              alt=""
              width={18}
              height={18}
              className="size-4.5 object-contain"
            />
          </span>
        ))}
      <div
        className={cn('flex min-w-0 flex-col gap-3', isUser ? 'max-w-[85%] items-end' : 'flex-1')}
      >
        {message.attachments && message.attachments.length > 0 && (
          <div className={cn('flex flex-wrap gap-2', isUser && 'justify-end')}>
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] py-1.5 pr-2.5 pl-2"
              >
                {attachment.kind === 'image' && attachment.previewUrl ? (
                  // biome-ignore lint/performance/noImgElement: transient object URL, not a static asset
                  <img
                    src={attachment.previewUrl}
                    alt={attachment.name}
                    className="size-6 rounded object-cover [outline:1px_solid_rgba(255,255,255,0.1)] -outline-offset-1"
                  />
                ) : (
                  <FileText className="size-4 text-neutral-400" />
                )}
                <span className="max-w-40 truncate text-xs text-neutral-300">
                  {attachment.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {message.pending ? (
          <LoadingBlock status={message.pending} />
        ) : (
          <>
            {(message.content || message.streaming) && (
              <div
                className={cn(
                  'text-sm leading-relaxed',
                  isUser
                    ? 'rounded-2xl bg-white/[0.06] px-4 py-2.5 text-neutral-100'
                    : 'text-neutral-200',
                )}
              >
                <RichText text={message.content} />
                {message.streaming && (
                  <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-neutral-400 align-middle" />
                )}
              </div>
            )}
            {message.block && <Block block={message.block} />}
          </>
        )}
      </div>
    </div>
  );
}
