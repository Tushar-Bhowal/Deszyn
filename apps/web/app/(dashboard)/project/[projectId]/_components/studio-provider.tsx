'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import type {
  Attachment,
  BrandColor,
  BrandFont,
  BrandKit,
  ChatMessage,
  Creativity,
  MessageBlock,
  ModelTier,
  NameTone,
  Stage,
  WorkStatus,
} from '@/lib/contracts';
import {
  delay,
  logoIntro,
  mockLogos,
  mockNames,
  namesIntro,
  streamTokens,
  systemIntro,
} from '@/lib/mock/brand';

interface StudioContextValue {
  messages: ChatMessage[];
  isStreaming: boolean;
  status: WorkStatus;
  stage: Stage;
  brandKit: BrandKit;
  chosenNameId: string | null;
  chosenLogoId: string | null;
  selectedModel: ModelTier;
  setSelectedModel: (model: ModelTier) => void;
  creativity: Creativity;
  setCreativity: (value: Creativity) => void;
  attachments: Attachment[];
  addAttachments: (files: Attachment[]) => void;
  removeAttachment: (id: string) => void;
  sendMessage: (text: string) => void;
  chooseName: (id: string) => void;
  saveName: () => void;
  startLogo: () => void;
  chooseLogo: (id: string) => void;
  saveLogo: () => void;
  startSystem: () => void;
  saveStyle: (fonts: BrandFont[], colors: BrandColor[]) => void;
  styleEditorOpen: boolean;
  openStyleEditor: () => void;
  closeStyleEditor: () => void;
  renameBrand: (name: string) => void;
  clearName: () => void;
  clearLogo: () => void;
  clearStyle: () => void;
  resetStudio: () => void;
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

const EMPTY_KIT: BrandKit = { colors: [], fonts: [] };

const EXAMPLE_PROMPTS = [
  'A budgeting app for freelancers',
  'Developer tool for testing APIs',
  'A marketplace for vintage furniture',
];

const GREETING = /^(hi|hey+|hello|yo|sup|hola|howdy|test+|ok|okay|thanks|thank you|help|hmm+)\b/i;

/** Greetings, gibberish, or too-thin input shouldn't burn a generation. */
function isThinInput(text: string): boolean {
  const t = text.trim();
  const words = t.split(/\s+/).filter((w) => w.replace(/[^a-z0-9]/gi, '').length > 1);
  if (t.length < 6 || words.length < 3) return true;
  if (GREETING.test(t) && words.length < 4) return true;
  if (!/[aeiou]/i.test(t)) return true; // no vowels → gibberish
  return false;
}

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<WorkStatus>('idle');
  const [stage, setStage] = useState<Stage>('naming');
  const [brandKit, setBrandKit] = useState<BrandKit>(EMPTY_KIT);
  const [chosenNameId, setChosenNameId] = useState<string | null>(null);
  const [chosenLogoId, setChosenLogoId] = useState<string | null>(null);
  const [styleEditorOpen, setStyleEditorOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelTier>('opus-4-8');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [creativity, setCreativity] = useState<Creativity>('balanced');
  const [savedTone, setSavedTone] = useState<NameTone | undefined>(undefined);

  const abortRef = useRef<AbortController | null>(null);
  const streamingRef = useRef(false);
  // Latest values for cross-action reads without stale closures / dep churn.
  const stateRef = useRef({ chosenNameId, chosenLogoId, brandKit, creativity, savedTone });
  stateRef.current = { chosenNameId, chosenLogoId, brandKit, creativity, savedTone };

  const addAttachments = useCallback((files: Attachment[]) => {
    setAttachments((prev) => [...prev, ...files]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const patch = useCallback((id: string, next: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...next } : m)));
  }, []);

  const pushAssistant = useCallback((content: string, block?: MessageBlock) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', content, block, createdAt: Date.now() },
    ]);
  }, []);

  // Runs one assistant turn: think (working animation) → stream intro → attach block.
  const runTurn = useCallback(
    async (opts: {
      userText?: string;
      status: WorkStatus;
      buildIntro: () => string;
      buildBlock: () => MessageBlock;
      thinkMs?: number;
    }) => {
      if (streamingRef.current) return;
      const { userText, status: turnStatus, buildIntro, buildBlock, thinkMs = 1700 } = opts;

      const controller = new AbortController();
      abortRef.current = controller;
      streamingRef.current = true;
      setIsStreaming(true);
      setStatus(turnStatus);

      const assistantId = crypto.randomUUID();
      const additions: ChatMessage[] = [];
      if (userText) {
        additions.push({
          id: crypto.randomUUID(),
          role: 'user',
          content: userText,
          attachments: attachments.length ? attachments : undefined,
          createdAt: Date.now(),
        });
      }
      additions.push({
        id: assistantId,
        role: 'assistant',
        content: '',
        pending: turnStatus,
        createdAt: Date.now(),
      });
      setMessages((prev) => [...prev, ...additions]);
      if (userText) setAttachments([]);

      try {
        await delay(thinkMs, controller.signal);
        if (controller.signal.aborted) return;
        patch(assistantId, { pending: undefined, streaming: true });
        for await (const chunk of streamTokens(buildIntro(), { signal: controller.signal })) {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
          );
        }
        if (controller.signal.aborted) return;
        patch(assistantId, { streaming: false, block: buildBlock() });
      } finally {
        patch(assistantId, { pending: undefined, streaming: false });
        setStatus('idle');
        setIsStreaming(false);
        streamingRef.current = false;
        abortRef.current = null;
      }
    },
    [attachments, patch],
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streamingRef.current) return;

      // Greetings / gibberish / too-thin input: clarify instead of burning a generation.
      if (isThinInput(trimmed)) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'user', content: trimmed, createdAt: Date.now() },
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Tell me what your product does — one line is enough.',
            block: { type: 'examples', prompts: EXAMPLE_PROMPTS },
            createdAt: Date.now(),
          },
        ]);
        return;
      }

      const cr = stateRef.current.creativity;
      const bias = stateRef.current.savedTone;
      runTurn({
        userText: trimmed,
        status: 'generating_names',
        buildIntro: () => namesIntro(trimmed, cr, bias),
        buildBlock: () => ({ type: 'names', names: mockNames(cr, bias) }),
      });
    },
    [runTurn],
  );

  const chooseName = useCallback((id: string) => setChosenNameId(id), []);

  const saveName = useCallback(() => {
    const candidate = mockNames().find((n) => n.id === stateRef.current.chosenNameId);
    if (!candidate) return;
    setBrandKit((prev) => ({ ...prev, name: candidate.name }));
    setSavedTone(candidate.tone);
    setStage('name_saved');
    pushAssistant(`Saved — **${candidate.name}** is in your brand kit. Ready to design a logo?`, {
      type: 'next',
      step: 'logo',
      label: 'Design a logo',
    });
  }, [pushAssistant]);

  const startLogo = useCallback(() => {
    const name = stateRef.current.brandKit.name ?? 'your brand';
    setStage('logo');
    runTurn({
      status: 'generating_logo',
      buildIntro: () => logoIntro(name),
      buildBlock: () => ({ type: 'logos', logos: mockLogos(name) }),
    });
  }, [runTurn]);

  const chooseLogo = useCallback((id: string) => setChosenLogoId(id), []);

  const saveLogo = useCallback(() => {
    const name = stateRef.current.brandKit.name ?? 'your brand';
    const logo = mockLogos(name).find((l) => l.id === stateRef.current.chosenLogoId);
    if (!logo) return;
    setBrandKit((prev) => ({ ...prev, logo: { style: logo.style, svg: logo.svg } }));
    setStage('logo_saved');
    pushAssistant(
      `Nice — the ${logo.style.toLowerCase()} is saved. Want to build your colours & type next?`,
      { type: 'next', step: 'system', label: 'Build colours & type' },
    );
  }, [pushAssistant]);

  const startSystem = useCallback(() => {
    const name = stateRef.current.brandKit.name ?? 'your brand';
    setStage('system');
    runTurn({
      status: 'generating_system',
      buildIntro: () => systemIntro(name),
      buildBlock: () => ({ type: 'style' }),
    }).then(() => setStyleEditorOpen(true));
  }, [runTurn]);

  const openStyleEditor = useCallback(() => setStyleEditorOpen(true), []);
  const closeStyleEditor = useCallback(() => setStyleEditorOpen(false), []);

  const saveStyle = useCallback(
    (fonts: BrandFont[], colors: BrandColor[]) => {
      const firstTime = stateRef.current.brandKit.colors.length === 0;
      setBrandKit((prev) => ({ ...prev, fonts, colors }));
      setStage('complete');
      setStyleEditorOpen(false);
      if (firstTime) {
        const name = stateRef.current.brandKit.name ?? 'your brand';
        pushAssistant(
          `Your brand kit for **${name}** is ready — name, logo, colours, and type are all saved. ✨`,
        );
      }
    },
    [pushAssistant],
  );

  const renameBrand = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBrandKit((prev) => ({ ...prev, name: trimmed }));
  }, []);

  const clearName = useCallback(() => setBrandKit((prev) => ({ ...prev, name: undefined })), []);
  const clearLogo = useCallback(() => setBrandKit((prev) => ({ ...prev, logo: undefined })), []);
  const clearStyle = useCallback(
    () => setBrandKit((prev) => ({ ...prev, colors: [], fonts: [] })),
    [],
  );

  const resetStudio = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setBrandKit(EMPTY_KIT);
    setStage('naming');
    setChosenNameId(null);
    setChosenLogoId(null);
    setSavedTone(undefined);
    setStyleEditorOpen(false);
    setStatus('idle');
    streamingRef.current = false;
    setIsStreaming(false);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const value = useMemo<StudioContextValue>(
    () => ({
      messages,
      isStreaming,
      status,
      stage,
      brandKit,
      chosenNameId,
      chosenLogoId,
      selectedModel,
      setSelectedModel,
      creativity,
      setCreativity,
      attachments,
      addAttachments,
      removeAttachment,
      sendMessage,
      chooseName,
      saveName,
      startLogo,
      chooseLogo,
      saveLogo,
      startSystem,
      saveStyle,
      styleEditorOpen,
      openStyleEditor,
      closeStyleEditor,
      renameBrand,
      clearName,
      clearLogo,
      clearStyle,
      resetStudio,
      stop,
    }),
    [
      messages,
      isStreaming,
      status,
      stage,
      brandKit,
      chosenNameId,
      chosenLogoId,
      selectedModel,
      creativity,
      attachments,
      addAttachments,
      removeAttachment,
      sendMessage,
      chooseName,
      saveName,
      startLogo,
      chooseLogo,
      saveLogo,
      startSystem,
      saveStyle,
      styleEditorOpen,
      openStyleEditor,
      closeStyleEditor,
      renameBrand,
      clearName,
      clearLogo,
      clearStyle,
      resetStudio,
      stop,
    ],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}
