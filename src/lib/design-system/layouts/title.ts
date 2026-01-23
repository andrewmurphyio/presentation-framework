import type { LayoutDefinition } from '../../types/layout';

/**
 * Title layout - for opening slides and section dividers
 *
 * A centered, vertically-aligned layout with optional header and footer zones:
 * - header-left: Optional top-left content (e.g., logo/branding)
 * - header-right: Optional top-right content (e.g., event name)
 * - title: Main heading, typically large and prominent
 * - subtitle: Supporting text, typically smaller and muted
 * - footer-left: Optional left footer content (e.g., presenter name)
 * - footer-right: Optional right footer content (e.g., website/contact)
 *
 * This layout is ideal for:
 * - Presentation opening slides with attribution
 * - Section dividers
 * - Simple announcements
 * - Branded title slides
 */
export const titleLayout: LayoutDefinition = {
  name: 'title',
  description: 'Centered title and subtitle layout with optional header and footer',
  zones: [
    {
      name: 'header-left',
      gridArea: 'header-left',
      description: 'Optional header left area for branding/logo',
    },
    {
      name: 'header-right',
      gridArea: 'header-right',
      description: 'Optional header right area for event/company',
    },
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
    {
      name: 'footer-left',
      gridArea: 'footer-left',
      description: 'Optional left footer content',
    },
    {
      name: 'footer-right',
      gridArea: 'footer-right',
      description: 'Optional right footer content',
    },
  ],
  gridTemplateAreas: `
    "header-left . header-right"
    ". . ."
    ". title ."
    ". subtitle ."
    ". . ."
    "footer-left . footer-right"
  `,
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'auto 1fr auto auto 1fr auto',
};
