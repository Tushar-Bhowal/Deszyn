declare module 'react-speech-recognition' {
  export interface ListeningOptions {
    continuous?: boolean;
    language?: string;
    interimResults?: boolean;
  }

  export interface SpeechRecognitionHook {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    browserSupportsContinuousListening: boolean;
    isMicrophoneAvailable: boolean;
  }

  export function useSpeechRecognition(options?: {
    transcribing?: boolean;
    clearTranscriptOnListen?: boolean;
  }): SpeechRecognitionHook;

  interface SpeechRecognitionStatic {
    startListening: (options?: ListeningOptions) => Promise<void>;
    stopListening: () => Promise<void>;
    abortListening: () => Promise<void>;
    browserSupportsSpeechRecognition: () => boolean;
  }

  const SpeechRecognition: SpeechRecognitionStatic;
  export default SpeechRecognition;
}
