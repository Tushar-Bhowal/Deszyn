export type RasterType = 'image/png' | 'image/jpeg';

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadSvg(svg: string, filename: string): void {
  triggerDownload(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), filename);
}

/**
 * Rasterizes an SVG string to a PNG/JPEG Blob entirely client-side (SVG → Image →
 * canvas → toBlob). JPEG gets a white matte since it has no alpha. Reused by both
 * single-file downloads and the brand-kit zip.
 */
export async function rasterizeSvg(svg: string, type: RasterType, scale = 3): Promise<Blob> {
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Could not render SVG'));
      img.src = svgUrl;
    });

    const width = (img.naturalWidth || 340) * scale;
    const height = (img.naturalHeight || 120) * scale;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    if (type === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.95));
    if (!blob) throw new Error('Could not rasterize SVG');
    return blob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export async function svgToRaster(
  svg: string,
  type: RasterType,
  filename: string,
  scale = 3,
): Promise<void> {
  triggerDownload(await rasterizeSvg(svg, type, scale), filename);
}
