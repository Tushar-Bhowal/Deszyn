'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import type { Attachment, ChatMessage, ModelTier } from '@/lib/contracts';
import { mockBrandReply, streamTokens } from '@/lib/mock/brand';

interface StudioContextValue {
  messages: ChatMessage[];
  isStreaming: boolean;
  selectedModel: ModelTier;
  setSelectedModel: (model: ModelTier) => void;
  attachments: Attachment[];
  addAttachments: (files: Attachment[]) => void;
  removeAttachment: (id: string) => void;
  sendMessage: (text: string) => void;
  stop: () => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return ctx;
}

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelTier>('opus-4-8');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const streamingRef = useRef(false);

  const addAttachments = useCallback((files: Attachment[]) => {
    setAttachments((prev) => [...prev, ...files]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streamingRef.current) {
        return;
      }

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
        attachments: attachments.length ? attachments : undefined,
        createdAt: Date.now(),
      };
      const assistantId = crypto.randomUUID();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
        streaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setAttachments([]);
      setIsStreaming(true);
      streamingRef.current = true;

      const reply = mockBrandReply(trimmed);
      const controller = new AbortController();
      abortRef.current = controller;

      (async () => {
        try {
          for await (const chunk of streamTokens(reply.intro, { signal: controller.signal })) {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
            );
          }
        } finally {
          const aborted = controller.signal.aborted;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, streaming: false, brand: aborted ? m.brand : reply }
                : m,
            ),
          );
          setIsStreaming(false);
          streamingRef.current = false;
          abortRef.current = null;
        }
      })();
    },
    [attachments],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const value = useMemo<StudioContextValue>(
    () => ({
      messages,
      isStreaming,
      selectedModel,
      setSelectedModel,
      attachments,
      addAttachments,
      removeAttachment,
      sendMessage,
      stop,
    }),
    [
      messages,
      isStreaming,
      selectedModel,
      attachments,
      addAttachments,
      removeAttachment,
      sendMessage,
      stop,
    ],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}
