import type { BrandResult, NameCandidate } from '@/lib/contracts';

/** Simulates token-by-token LLM streaming so the UI handles real SSE unchanged. */
export async function* streamTokens(
  text: string,
  opts: { signal?: AbortSignal; delayMs?: number } = {},
): AsyncGenerator<string> {
  const { signal, delayMs = 22 } = opts;
  const chunks = text.match(/\S+\s*/g) ?? [text];
  for (const chunk of chunks) {
    if (signal?.aborted) return;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    yield chunk;
  }
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

export function mockBrandReply(prompt: string): BrandResult {
  const subject = prompt.trim().replace(/[.!?]+$/, '');
  const label = subject.length > 0 && subject.length <= 60 ? subject : 'your product';
  return {
    intro:
      `Great — here are five brandable directions for ${label}, each with a different tone. ` +
      `I checked basic trademark risk and domain availability for every option so you can weigh ` +
      `memorability against how easy it is to actually secure. Pick one and I'll build out its ` +
      `logo, colors, and type.`,
    names: MOCK_NAMES,
  };
}
