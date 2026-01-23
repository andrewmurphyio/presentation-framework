import type { LayoutDefinition } from '../../types/layout';

/**
 * Section layout - for section dividers and chapter breaks
 *
 * A full-screen, centered layout with a single prominent heading.
 * Designed for marking major transitions in a presentation.
 *
 * Features:
 * - Single zone: "heading" (large, centered, vertically and horizontally)
 * - Full-bleed design ideal for bold background colors
 * - Maximum visual impact for section transitions
 *
 * This layout is ideal for:
 * - Section dividers between major talk sections
 * - Chapter breaks in long presentations
 * - Transition slides
 * - Break announcements
 */
export const sectionLayout: LayoutDefinition = {
  name: 'section',
  description: 'Full-screen centered heading for section dividers',
  zones: [
    {
      name: 'heading',
      gridArea: 'heading',
      description: 'Main section heading text',
    },
  ],
  gridTemplateAreas: `
    "."
    "heading"
    "."
  `,
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr auto 1fr',
};
