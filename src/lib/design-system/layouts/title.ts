import type { LayoutDefinition } from '../../types/layout';

/**
 * Title layout - for opening slides and section dividers
 *
 * A centered, vertically-aligned layout with two zones:
 * - title: Main heading, typically large and prominent
 * - subtitle: Supporting text, typically smaller and muted
 *
 * This layout is ideal for:
 * - Presentation opening slides
 * - Section dividers
 * - Simple announcements
 */
export const titleLayout: LayoutDefinition = {
  name: 'title',
  description: 'Centered title and subtitle layout for opening slides',
  zones: [
    {
      name: 'title',
      gridArea: 'title',
      description: 'Main title text',
    },
    {
      name: 'subtitle',
      gridArea: 'subtitle',
      description: 'Optional subtitle or supporting text',
    },
  ],
  gridTemplateAreas: `
    "."
    "title"
    "subtitle"
    "."
  `,
  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr auto auto 1fr',
};
