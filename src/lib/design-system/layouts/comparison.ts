import type { LayoutDefinition } from '../../types/layout';

/**
 * Comparison layout - side-by-side comparison with labels
 *
 * A layout designed for structured comparisons with labeled columns.
 * Features a title at the top, labels for each column, and two equal-width
 * content areas below. Perfect for "vs" slides and feature comparisons.
 *
 * Features:
 * - Five zones: "title", "left-label", "left", "right-label", "right"
 * - Equal-width columns with labels above
 * - Structured grid for clear visual comparison
 *
 * This layout is ideal for:
 * - Product comparisons (Product A vs Product B)
 * - Before and after comparisons
 * - Old vs new approaches
 * - Feature comparison tables
 * - Pros and cons (left: pros, right: cons)
 * - Technology stack comparisons
 */
export const comparisonLayout: LayoutDefinition = {
  name: 'comparison',
  description: 'Side-by-side comparison with labels',
  zones: [
    {
      name: 'title',
      gridArea: 'title',
      description: 'Slide title',
    },
    {
      name: 'left-label',
      gridArea: 'left-label',
      description: 'Label for left column',
    },
    {
      name: 'left',
      gridArea: 'left',
      description: 'Left column content',
    },
    {
      name: 'right-label',
      gridArea: 'right-label',
      description: 'Label for right column',
    },
    {
      name: 'right',
      gridArea: 'right',
      description: 'Right column content',
    },
  ],
  gridTemplateAreas: `
    "title title"
    "left-label right-label"
    "left right"
  `,
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'auto auto 1fr',
};
