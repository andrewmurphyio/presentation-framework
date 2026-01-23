import type { LayoutDefinition } from '../../types/layout';

/**
 * Two-column layout - equal-width columns with title
 *
 * A layout with a title at the top and two equal-width columns below.
 * Uses CSS Grid with a 50/50 split for balanced content presentation.
 *
 * Features:
 * - Three zones: "title" (top), "left" (50%), "right" (50%)
 * - Equal column widths using CSS Grid
 * - Ideal for side-by-side comparisons and parallel content
 *
 * This layout is ideal for:
 * - Before/after comparisons
 * - Pros and cons lists
 * - Side-by-side code examples
 * - Parallel concepts or ideas
 * - Feature comparisons
 */
export const twoColumnLayout: LayoutDefinition = {
  name: 'two-column',
  description: 'Equal-width two-column layout with title',
  zones: [
    {
      name: 'title',
      gridArea: 'title',
      description: 'Slide title',
    },
    {
      name: 'left',
      gridArea: 'left',
      description: 'Left column content',
    },
    {
      name: 'right',
      gridArea: 'right',
      description: 'Right column content',
    },
  ],
  gridTemplateAreas: `
    "title title"
    "left right"
  `,
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'auto 1fr',
};
