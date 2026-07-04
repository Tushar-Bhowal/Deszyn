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
  note: string;
}

export interface LogoConcept {
  id: string;
  style: string;
  svg: string;
}

/** A selectable display+body font pairing offered in the style editor. */
export interface FontPairing {
  id: string;
  label: string;
  displayFamily: string;
  bodyFamily: string;
  displayVar: string;
  bodyVar: string;
  recommended?: boolean;
}

/** A selectable colour palette offered in the style editor. */
export interface PaletteOption {
  id: string;
  label: string;
  colors: BrandColor[];
}

/** Assets the user has explicitly saved into their brand. */
export interface BrandKit {
  name?: string;
  tagline?: string;
  logo?: { style: string; svg: string };
  colors: BrandColor[];
  fonts: BrandFont[];
}

/** Live status of the current assistant turn (drives the working animation). */
export type WorkStatus =
  | 'idle'
  | 'thinking'
  | 'generating_names'
  | 'generating_logo'
  | 'generating_system';

/** Where the guided flow currently is. */
export type Stage = 'naming' | 'name_saved' | 'logo' | 'logo_saved' | 'system' | 'complete';

export type NextStep = 'logo' | 'system';

/** A rich block attached to an assistant message. */
export type MessageBlock =
  | { type: 'names'; names: NameCandidate[] }
  | { type: 'logos'; logos: LogoConcept[] }
  | { type: 'style' }
  | { type: 'next'; step: NextStep; label: string };

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  attachments?: Attachment[];
  block?: MessageBlock;
  /** Non-idle while this assistant turn is still generating — shows the working animation. */
  pending?: WorkStatus;
  createdAt: number;
  /** True while the assistant text is still streaming in. */
  streaming?: boolean;
}
