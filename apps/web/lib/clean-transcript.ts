// Filler / disfluency sounds to strip from raw dictation (um, uh, hm, er, erm, ah, haa, huu…).
const FILLERS = /\b(?:u+m+|u+h+|h+m+|e+r+|erm+|a+h+|hu+|ha+|mhm+|uhm+)\b/gi;

/**
 * Cleans a raw Web Speech API transcript into readable text, approximating
 * Claude-style dictation: drop filler sounds, collapse stutter repeats, and fix
 * spacing, casing, and terminal punctuation. Does NOT strip real words.
 */
export function cleanTranscript(raw: string): string {
  let text = raw.replace(FILLERS, ' ');
  // collapse immediate duplicate words ("the the cat" -> "the cat")
  text = text.replace(/\b(\w+)(?:\s+\1\b)+/gi, '$1');
  text = text
    .replace(/\s+([,.!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (!text) return '';
  text = text[0].toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) text += '.';
  return text;
}
