import type {
  BrandColor,
  FontPairing,
  LogoConcept,
  NameCandidate,
  PaletteOption,
} from '@/lib/contracts';

/** Simulates token-by-token LLM streaming so the UI handles real SSE unchanged. */
export async function* streamTokens(
  text: string,
  opts: { signal?: AbortSignal; delayMs?: number } = {},
): AsyncGenerator<string> {
  const { signal, delayMs = 18 } = opts;
  const chunks = text.match(/\S+\s*/g) ?? [text];
  for (const chunk of chunks) {
    if (signal?.aborted) return;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    yield chunk;
  }
}

export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve();
    setTimeout(resolve, ms);
  });
}

const MOCK_NAMES: NameCandidate[] = [
  {
    id: 'nimbus',
    name: 'Nimbus',
    tone: 'techy',
    rationale: 'Light, cloud-like, and easy to say — reads modern and infrastructural.',
    trademark: 'safe',
    domains: [
      { tld: '.com', status: 'taken' },
      { tld: '.io', status: 'available' },
      { tld: '.dev', status: 'available' },
    ],
  },
  {
    id: 'ledgr',
    name: 'Ledgr',
    tone: 'serious',
    rationale: 'A trimmed "ledger" — precise and fintech-native without sounding stiff.',
    trademark: 'safe',
    domains: [
      { tld: '.com', status: 'available' },
      { tld: '.io', status: 'available' },
      { tld: '.dev', status: 'expiring' },
    ],
  },
  {
    id: 'vaultly',
    name: 'Vaultly',
    tone: 'bold',
    rationale: 'Security-forward with a friendly "-ly" — confident but approachable.',
    trademark: 'crowded',
    domains: [
      { tld: '.com', status: 'taken' },
      { tld: '.io', status: 'taken' },
      { tld: '.dev', status: 'available' },
    ],
  },
  {
    id: 'aria',
    name: 'Aria',
    tone: 'elegant',
    rationale: 'Short, melodic, and premium — works across a wide range of products.',
    trademark: 'crowded',
    domains: [
      { tld: '.com', status: 'taken' },
      { tld: '.io', status: 'available' },
      { tld: '.dev', status: 'available' },
    ],
  },
  {
    id: 'pockit',
    name: 'Pockit',
    tone: 'playful',
    rationale: 'A playful spin on "pocket" — memorable and great for a consumer app.',
    trademark: 'conflict',
    domains: [
      { tld: '.com', status: 'taken' },
      { tld: '.io', status: 'taken' },
      { tld: '.dev', status: 'taken' },
    ],
  },
];

export function mockNames(): NameCandidate[] {
  return MOCK_NAMES;
}

export function namesIntro(prompt: string): string {
  const subject = prompt.trim().replace(/[.!?]+$/, '');
  const label = subject.length > 0 && subject.length <= 60 ? subject : 'your product';
  return (
    `Here are five brandable directions for ${label}, each with a different tone. ` +
    `I checked basic trademark risk and domain availability for every option — pick the one ` +
    `that feels right and I'll save it to your brand kit.`
  );
}

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => (c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;'));

function wordmark(name: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 96" width="340" height="96"><text x="20" y="62" font-family="Plus Jakarta Sans, ui-sans-serif, sans-serif" font-size="46" font-weight="700" fill="#4f7bff">${esc(name)}</text></svg>`;
}

function monogram(name: string): string {
  const letter = esc(name.charAt(0).toUpperCase() || 'D');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120"><rect x="8" y="8" width="104" height="104" rx="26" fill="#4f7bff"/><text x="60" y="83" text-anchor="middle" font-family="Plus Jakarta Sans, ui-sans-serif, sans-serif" font-size="62" font-weight="800" fill="#ffffff">${letter}</text></svg>`;
}

function abstractMark(name: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 120" width="340" height="120"><circle cx="58" cy="60" r="30" fill="#4f7bff"/><circle cx="86" cy="60" r="30" fill="#9cbaff" opacity="0.8"/><text x="140" y="73" font-family="Plus Jakarta Sans, ui-sans-serif, sans-serif" font-size="40" font-weight="700" fill="#e8ebf2">${esc(name)}</text></svg>`;
}

export function mockLogos(name: string): LogoConcept[] {
  const safe = name.trim() || 'Brand';
  return [
    { id: 'wordmark', style: 'Wordmark', svg: wordmark(safe) },
    { id: 'monogram', style: 'Monogram', svg: monogram(safe) },
    { id: 'abstract', style: 'Abstract mark', svg: abstractMark(safe) },
  ];
}

export function logoIntro(name: string): string {
  return (
    `Here are three logo directions for ${name} — a wordmark, a monogram, and an abstract mark. ` +
    `Download any of them as SVG, PNG, or JPG, or save your favourite to the brand kit.`
  );
}

export function systemIntro(name: string): string {
  return (
    `Here's a starter style for ${name} — I picked a palette and a type pairing to match. ` +
    `Open the editor to preview them, type your own sample text, swap or tweak anything, then save.`
  );
}

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'clean',
    label: 'Clean',
    displayFamily: 'Plus Jakarta Sans',
    bodyFamily: 'Geist',
    displayVar: 'var(--font-jakarta)',
    bodyVar: 'var(--font-geist-sans)',
    recommended: true,
  },
  {
    id: 'modern',
    label: 'Modern SaaS',
    displayFamily: 'Space Grotesk',
    bodyFamily: 'Inter',
    displayVar: 'var(--font-space-grotesk)',
    bodyVar: 'var(--font-inter)',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    displayFamily: 'Playfair Display',
    bodyFamily: 'Source Serif 4',
    displayVar: 'var(--font-playfair)',
    bodyVar: 'var(--font-source-serif)',
  },
  {
    id: 'warm',
    label: 'Warm',
    displayFamily: 'Sora',
    bodyFamily: 'Space Grotesk',
    displayVar: 'var(--font-sora)',
    bodyVar: 'var(--font-space-grotesk)',
  },
  {
    id: 'refined',
    label: 'Refined',
    displayFamily: 'Instrument Serif',
    bodyFamily: 'Sora',
    displayVar: 'var(--font-instrument)',
    bodyVar: 'var(--font-sora)',
  },
];

function palette(
  primary: string,
  accent: string,
  ink: string,
  surface: string,
  neutral: string,
): BrandColor[] {
  return [
    { name: 'Primary', hex: primary, role: 'primary' },
    { name: 'Accent', hex: accent, role: 'accent' },
    { name: 'Ink', hex: ink, role: 'text' },
    { name: 'Surface', hex: surface, role: 'surface' },
    { name: 'Neutral', hex: neutral, role: 'neutral' },
  ];
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  {
    id: 'signal',
    label: 'Signal',
    colors: palette('#4F7BFF', '#9CBAFF', '#0A0A0B', '#131316', '#8A8F98'),
  },
  {
    id: 'violet',
    label: 'Violet',
    colors: palette('#7C5CFF', '#C4B5FD', '#0A0A0B', '#141218', '#8B8792'),
  },
  {
    id: 'emerald',
    label: 'Emerald',
    colors: palette('#10B981', '#6EE7B7', '#06120E', '#0F1613', '#7E8B85'),
  },
  {
    id: 'sunset',
    label: 'Sunset',
    colors: palette('#FF6B4A', '#FFB088', '#140A08', '#17110F', '#948881'),
  },
];
