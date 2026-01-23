import type { LayoutDefinition } from '../../types/layout';

/**
 * Split-60-40 layout - asymmetric two-column layout (inverse)
 *
 * A layout with a title at the top and two columns below with
 * a 60/40 split. The wider left column (60%) and narrower right
 * column (40%) create visual emphasis on the left content.
 *
 * Features:
 * - Three zones: "title" (top), "left" (60%), "right" (40%)
 * - Asymmetric grid layout emphasizing left content
 * - Creates visual hierarchy through unequal columns
 *
 * This layout is ideal for:
 * - Main content (left) with supporting points (right)
 * - Details (left) with summary (right)
 * - Descriptions (left) with labels or categories (right)
 * - Primary focus (left) with secondary content (right)
 * - Main content (left) with sidebar navigation (right)
 */
export const split6040Layout: LayoutDefinition = {
  name: 'split-60-40',
  description: 'Asymmetric two-column layout with 60/40 split',
  zones: [
    {
      name: 'title',
      gridArea: 'title',
      description: 'Slide title',
    },
    {
      name: 'left',
      gridArea: 'left',
      description: 'Left column content (60%)',
    },
    {
      name: 'right',
      gridArea: 'right',
      description: 'Right column content (40%)',
    },
  ],
  gridTemplateAreas: `
    "title title"
    "left right"
  `,
  gridTemplateColumns: '3fr 2fr',
  gridTemplateRows: 'auto 1fr',
};
