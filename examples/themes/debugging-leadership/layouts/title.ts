import type { LayoutDefinition } from '../../../../src/lib/types/layout';

/**
 * Debugging Leadership Title Layout
 *
 * Custom title layout matching the Debugging Leadership brand design:
 * - Logo/brand in top-left corner
 * - Large multi-line title with mixed colors
 * - Presenter info bottom-left
 * - Website bottom-right
 *
 * Zones:
 * - logo: Top-left brand/logo area
 * - title-line-1: First line of title (colored)
 * - title-line-2: Second line of title
 * - title-line-3: Third line of title
 * - presenter-label: "Presented By:" label
 * - presenter-name: Presenter's name
 * - website: Website URL bottom-right
 */
export const debuggingLeadershipTitleLayout: LayoutDefinition = {
  name: 'debugging-leadership-title',
  description: 'Custom title layout for Debugging Leadership presentations',
  zones: [
    {
      name: 'logo',
      gridArea: 'logo',
      description: 'Brand logo/text in top-left',
    },
    {
      name: 'title-line-1',
      gridArea: 'title1',
      description: 'First line of title (usually colored)',
    },
    {
      name: 'title-line-2',
      gridArea: 'title2',
      description: 'Second line of title',
    },
    {
      name: 'title-line-3',
      gridArea: 'title3',
      description: 'Third line of title',
    },
    {
      name: 'presenter-label',
      gridArea: 'presenter-label',
      description: 'Presented By label',
    },
    {
      name: 'presenter-name',
      gridArea: 'presenter-name',
      description: 'Presenter name',
    },
    {
      name: 'website',
      gridArea: 'website',
      description: 'Website URL in bottom-right',
    },
  ],
  gridTemplateAreas: `
    "logo . ."
    ". . ."
    "title1 title1 ."
    "title2 title2 ."
    "title3 title3 ."
    ". . ."
    "presenter-label . website"
    "presenter-name . website"
  `,
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'auto 1fr auto auto auto 1fr auto auto',
  customStyles: `
    /* Logo styling */
    .slide[data-layout="debugging-leadership-title"] .zone-logo {
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--color-muted);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 2rem;
      text-align: left;
      justify-content: flex-start;
    }

    .slide[data-layout="debugging-leadership-title"] .zone-logo::before {
      content: '🔧';
      font-size: 1.5rem;
    }

    /* Title line styling */
    .slide[data-layout="debugging-leadership-title"] .zone-title-line-1 {
      font-size: 5rem;
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1.1;
      text-align: left;
      padding: 0 4rem;
      letter-spacing: -0.02em;
      justify-content: flex-start;
    }

    .slide[data-layout="debugging-leadership-title"] .zone-title-line-2,
    .slide[data-layout="debugging-leadership-title"] .zone-title-line-3 {
      font-size: 5rem;
      font-weight: 700;
      color: var(--color-foreground);
      line-height: 1.1;
      text-align: left;
      padding: 0 4rem;
      letter-spacing: -0.02em;
      justify-content: flex-start;
    }

    /* Presenter styling */
    .slide[data-layout="debugging-leadership-title"] .zone-presenter-label {
      font-size: 1.125rem;
      font-weight: 400;
      color: var(--color-foreground);
      text-align: left;
      padding: 0 2rem;
      opacity: 0.9;
      justify-content: flex-start;
      align-items: flex-end;
    }

    .slide[data-layout="debugging-leadership-title"] .zone-presenter-name {
      font-size: 1.125rem;
      font-weight: 400;
      color: var(--color-foreground);
      text-align: left;
      padding: 0 2rem 2rem 2rem;
      justify-content: flex-start;
      align-items: flex-start;
    }

    /* Website styling */
    .slide[data-layout="debugging-leadership-title"] .zone-website {
      font-size: 1.125rem;
      font-weight: 400;
      color: var(--color-foreground);
      text-align: right;
      padding: 2rem;
      opacity: 0.9;
      justify-content: flex-end;
      align-items: flex-end;
    }

    /* Container adjustments */
    .slide[data-layout="debugging-leadership-title"] {
      padding: 0;
      background: var(--color-background);
      display: grid;
      height: 100vh;
      width: 100vw;
    }

    /* All zones - remove default centering */
    .slide[data-layout="debugging-leadership-title"] .slide-zone {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: left;
    }

    /* Responsive font sizing */
    @media (max-width: 1200px) {
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-1,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-2,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-3 {
        font-size: 4rem;
      }
    }

    @media (max-width: 900px) {
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-1,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-2,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-3 {
        font-size: 3rem;
      }
    }

    @media (max-width: 600px) {
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-1,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-2,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-3 {
        font-size: 2rem;
        padding: 0 2rem;
      }

      .slide[data-layout="debugging-leadership-title"] .zone-logo {
        font-size: 1rem;
        padding: 1rem;
      }

      .slide[data-layout="debugging-leadership-title"] .zone-presenter-label,
      .slide[data-layout="debugging-leadership-title"] .zone-presenter-name,
      .slide[data-layout="debugging-leadership-title"] .zone-website {
        font-size: 0.875rem;
      }
    }
  `,
};