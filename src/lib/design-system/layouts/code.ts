import type { LayoutDefinition } from '../../types/layout';

/**
 * Code layout - optimized for code display
 *
 * A layout designed specifically for presenting code snippets and examples.
 * Features a small title and a large code area with minimal chrome to maximize
 * code visibility and readability.
 *
 * Features:
 * - Two zones: "title" (minimal, top) and "code" (large, main area)
 * - Code area fills most of the slide
 * - Minimal padding and chrome for maximum code space
 *
 * This layout is ideal for:
 * - Code snippets and examples
 * - Live coding demonstrations
 * - Technical implementation details
 * - Algorithm explanations
 * - API examples
 */
export const codeLayout: LayoutDefinition = {
  name: 'code',
  description: 'Code-optimized layout with large code area',
  zones: [
    {
      name: 'title',
      gridArea: 'title',
      description: 'Brief code title or description',
    },
    {
      name: 'code',
      gridArea: 'code',
      description: 'Code content area',
    },
  ],
  gridTemplateAreas: `
    "title"
    "code"
  `,
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr',
};
