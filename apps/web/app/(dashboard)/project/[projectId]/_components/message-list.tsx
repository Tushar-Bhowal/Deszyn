'use client';

import { useEffect, useRef } from 'react';

import { ChatMessage } from './chat-message';
import { useStudio } from './studio-provider';

export function MessageList() {
  const { messages } = useStudio();
  const endRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: autoscroll as messages/stream update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  }, [messages]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
