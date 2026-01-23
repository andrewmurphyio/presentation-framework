import type { LayoutDefinition } from '../../types/layout';

/**
 * Quote layout - large quote with attribution
 *
 * A layout designed for displaying quotes, testimonials, or
 * impactful statements. Features a large, centered quote with
 * attribution below.
 *
 * Features:
 * - Two zones: "quote" (large, centered) and "attribution" (smaller, below)
 * - Full-screen impact with vertical centering
 * - Minimal chrome for maximum visual impact
 *
 * This layout is ideal for:
 * - Customer testimonials
 * - Inspirational quotes
 * - Pull quotes from articles
 * - User feedback highlights
 * - Mission statements
 * - Key takeaways or principles
 */
export const quoteLayout: LayoutDefinition = {
  name: 'quote',
  description: 'Large centered quote with attribution',
  zones: [
    {
      name: 'quote',
      gridArea: 'quote',
      description: 'Main quote text',
    },
    {
      name: 'attribution',
      gridArea: 'attribution',
      description: 'Quote attribution or source',
    },
  ],
  gridTemplateAreas: `
    "."
    "quote"
    "attribution"
    "."
  `,
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr auto auto 1fr',
};
