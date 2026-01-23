import type { LayoutDefinition } from '../../types/layout';

/**
 * Content layout - single content area with title
 *
 * A standard layout with a title at the top and a main content area below.
 * Provides balanced padding and spacing for readable content presentations.
 *
 * Features:
 * - Two zones: "title" (top) and "content" (main area)
 * - Balanced vertical spacing
 * - Appropriate padding for readability
 *
 * This layout is ideal for:
 * - Standard content slides
 * - Text-heavy presentations
 * - Lists and bullet points
 * - General information slides
 */
export const contentLayout: LayoutDefinition = {
  name: 'content',
  description: 'Single content area with title for standard slides',
  zones: [
    {
      name: 'title',
      gridArea: 'title',
      description: 'Slide title',
    },
    {
      name: 'content',
      gridArea: 'content',
      description: 'Main content area',
    },
  ],
  gridTemplateAreas: `
    "title"
    "content"
  `,
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr',
};
