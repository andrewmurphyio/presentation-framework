import type { LayoutDefinition } from '../../types/layout';

/**
 * Split-40-60 layout - asymmetric two-column layout
 *
 * A layout with a title at the top and two columns below with
 * a 40/60 split. The narrower left column (40%) and wider right
 * column (60%) create visual emphasis on the right content.
 *
 * Features:
 * - Three zones: "title" (top), "left" (40%), "right" (60%)
 * - Asymmetric grid layout emphasizing right content
 * - Creates visual hierarchy through unequal columns
 *
 * This layout is ideal for:
 * - Supporting points (left) with main content (right)
 * - Summary (left) with details (right)
 * - Labels or categories (left) with descriptions (right)
 * - Secondary content (left) with primary focus (right)
 * - Sidebar navigation (left) with main content (right)
 */
export const split4060Layout: LayoutDefinition = {
  name: 'split-40-60',
  description: 'Asymmetric two-column layout with 40/60 split',
  zones: [
    {
      name: 'title',
      gridArea: 'title',
      description: 'Slide title',
    },
    {
      name: 'left',
      gridArea: 'left',
      description: 'Left column content (40%)',
    },
    {
      name: 'right',
      gridArea: 'right',
      description: 'Right column content (60%)',
    },
  ],
  gridTemplateAreas: `
    "title title"
    "left right"
  `,
  gridTemplateColumns: '2fr 3fr',
  gridTemplateRows: 'auto 1fr',
};
