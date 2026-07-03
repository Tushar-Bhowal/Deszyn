import type { Attachment, AttachmentKind } from '@/lib/contracts';

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'webp'];
const DOC_EXT = ['pdf', 'doc', 'docx'];

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_ATTACHMENTS = 5;
export const ACCEPT_IMAGE = [...IMAGE_TYPES, ...IMAGE_EXT.map((e) => `.${e}`)].join(',');
export const ACCEPT_DOCUMENT = [...DOC_TYPES, ...DOC_EXT.map((e) => `.${e}`)].join(',');

export type ValidationResult = { ok: true; attachment: Attachment } | { ok: false; error: string };

function kindFor(file: File): AttachmentKind | null {
  if (IMAGE_TYPES.includes(file.type)) return 'image';
  if (DOC_TYPES.includes(file.type)) return 'document';
  // Some browsers report an empty MIME type (notably .doc) — fall back to the extension.
  const ext = file.name.toLowerCase().split('.').pop() ?? '';
  if (IMAGE_EXT.includes(ext)) return 'image';
  if (DOC_EXT.includes(ext)) return 'document';
  return null;
}

export function validateFile(file: File): ValidationResult {
  const kind = kindFor(file);
  if (!kind) {
    return {
      ok: false,
      error: `"${file.name}" isn't supported. Use PNG, JPG, WebP, PDF, DOC, or DOCX.`,
    };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: `"${file.name}" is too large (max 10 MB).` };
  }
  return {
    ok: true,
    attachment: {
      id: crypto.randomUUID(),
      kind,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      previewUrl: kind === 'image' ? URL.createObjectURL(file) : undefined,
    },
  };
}
