'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { cleanTranscript } from '@/lib/clean-transcript';

const SILENCE_MS = 15000;

interface VoiceHandlers {
  onStart?: () => void;
  onLive?: (transcript: string) => void;
  onStop?: (cleaned: string) => void;
}

export function useVoiceDictation(handlers: VoiceHandlers) {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [mounted, setMounted] = useState(false);
  const handlersRef = useRef(handlers);
  const transcriptRef = useRef('');
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  handlersRef.current = handlers;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const stop = useCallback(async () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    await SpeechRecognition.stopListening();
    handlersRef.current.onStop?.(cleanTranscript(transcriptRef.current));
    resetTranscript();
  }, [resetTranscript]);

  const start = useCallback(async () => {
    resetTranscript();
    handlersRef.current.onStart?.();
    await SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  }, [resetTranscript]);

  const toggle = useCallback(() => {
    if (listening) {
      void stop();
    } else {
      void start();
    }
  }, [listening, start, stop]);

  // Push the live transcript to the caller and (re)arm the silence timer on every
  // update — so text appears as it's spoken and dictation auto-stops after 15s quiet.
  useEffect(() => {
    if (!listening) return;
    handlersRef.current.onLive?.(transcript);
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => void stop(), SILENCE_MS);
    return () => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [transcript, listening, stop]);

  return { listening, supported: mounted && browserSupportsSpeechRecognition, toggle };
}
