export type ChatRole = 'user' | 'assistant';

export type AttachmentKind = 'image' | 'document';

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  name: string;
  size: number;
  mimeType: string;
  /** Object URL for image thumbnails (revoked when the attachment is removed). */
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  attachments?: Attachment[];
  /** Structured brand result rendered as a rich assistant block. */
  brand?: BrandResult;
  createdAt: number;
  /** True while the assistant message is still streaming in. */
  streaming?: boolean;
}

export type ModelTier = 'opus-4-8' | 'sonnet-5' | 'haiku-4-5';

export interface ModelOption {
  id: ModelTier;
  name: string;
  description: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'opus-4-8', name: 'Claude Opus 4.8', description: 'Most capable — best quality' },
  { id: 'sonnet-5', name: 'Claude Sonnet 5', description: 'Balanced speed and quality' },
  { id: 'haiku-4-5', name: 'Claude Haiku 4.5', description: 'Fastest — quick drafts' },
];

export type TrademarkStatus = 'safe' | 'crowded' | 'conflict';

export type DomainStatus = 'available' | 'taken' | 'expiring';

export interface DomainResult {
  tld: string;
  status: DomainStatus;
}

export type NameTone = 'serious' | 'playful' | 'techy' | 'elegant' | 'bold';

export interface NameCandidate {
  id: string;
  name: string;
  tone: NameTone;
  rationale: string;
  trademark: TrademarkStatus;
  domains: DomainResult[];
}

export type BrandColorRole = 'primary' | 'accent' | 'neutral' | 'surface' | 'text';

export interface BrandColor {
  name: string;
  hex: string;
  role: BrandColorRole;
}

export interface BrandFont {
  role: 'display' | 'body' | 'mono';
  family: string;
}

export interface BrandKit {
  name?: string;
  tagline?: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  logo?: { url: string; variants?: string[] };
}

/** A structured brand result attached to an assistant message. */
export interface BrandResult {
  intro: string;
  names: NameCandidate[];
}
