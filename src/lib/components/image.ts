import type { Image } from '../types/component';
import { componentRegistry } from './component-registry';

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Render an Image component to HTML
 *
 * Features:
 * - Three fit modes: contain, cover, original
 * - Optional lazy loading
 * - Optional caption
 * - Semantic HTML with figure/figcaption
 * - Support for custom id and className
 */
export function renderImage(component: Image): string {
  const {
    src,
    alt,
    fitMode = 'contain',
    caption,
    lazyLoad = false,
    id,
    className,
  } = component;

  // Build classes
  const figureClasses = ['image-container', `image-fit-${fitMode}`];
  if (className) {
    figureClasses.push(className);
  }

  const imgClasses = ['image', `image-${fitMode}`];

  // Build loading attribute
  const loadingAttr = lazyLoad ? ' loading="lazy"' : '';

  // Escape attributes
  const escapedSrc = escapeHtml(src);
  const escapedAlt = escapeHtml(alt);

  // Generate caption if provided
  const captionHtml = caption
    ? `\n  <figcaption class="image-caption">${escapeHtml(caption)}</figcaption>`
    : '';

  // Build the complete HTML structure
  return `<figure class="${figureClasses.join(' ')}"${id ? ` id="${escapeHtml(id)}"` : ''}>
  <img src="${escapedSrc}" alt="${escapedAlt}" class="${imgClasses.join(' ')}"${loadingAttr} />${captionHtml}
</figure>`;
}

/**
 * Register the Image renderer with the global component registry
 */
export function registerImageRenderer(): void {
  componentRegistry.registerRenderer('image', renderImage);
}

// Auto-register when module is imported
registerImageRenderer();
