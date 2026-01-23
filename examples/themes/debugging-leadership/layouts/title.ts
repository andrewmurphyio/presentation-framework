import type { LayoutDefinition } from '../../../../src/lib/types/layout';

/**
 * Debugging Leadership Title Layout
 *
 * Custom title layout matching the Debugging Leadership brand design:
 * - Logo/brand in top-left corner (DL icon + "Debugging Leadership" text)
 * - Large multi-line title with monospace font and mixed colors
 * - Pink separator line above footer
 * - Presenter info bottom-left
 * - Website bottom-right
 * - Gradient background (dark purple)
 *
 * Zones:
 * - logo: Top-left brand/logo area
 * - title-line-1: First line of title (colored/primary)
 * - title-line-2: Second line of title (white)
 * - title-line-3: Third line of title (white)
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
    "title1 title1 title1"
    "title2 title2 title2"
    "title3 title3 title3"
    ". . ."
    "separator separator separator"
    "presenter-label . website"
    "presenter-name . website"
  `,
  gridTemplateColumns: '1fr 1fr 1fr',
  gridTemplateRows: 'auto 1fr auto auto auto 1fr auto auto auto',
  customStyles: `
    /* Container with gradient background */
    .slide[data-layout="debugging-leadership-title"] {
      padding: 0;
      background: linear-gradient(160deg, #0a0212 0%, #150a24 40%, #1E0E2E 100%);
      display: grid;
      height: 100vh;
      width: 100vw;
      position: relative;
    }

    /* Pink separator line */
    .slide[data-layout="debugging-leadership-title"]::before {
      content: '';
      position: absolute;
      bottom: 5rem;
      left: 2.5rem;
      right: 2.5rem;
      height: 2px;
      background: var(--color-primary);
    }

    /* Logo styling - DL icon with text inline */
    .slide[data-layout="debugging-leadership-title"] .zone-logo {
      font-size: 1.25rem;
      font-weight: 500;
      color: var(--color-primary);
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 2.5rem;
      text-align: left;
      justify-content: flex-start;
      font-family: var(--font-family-mono);
    }

    /* DL logo icon - using actual logo image */
    .slide[data-layout="debugging-leadership-title"] .zone-logo::before {
      content: '';
      display: block;
      flex-shrink: 0;
      width: 2.25rem;
      height: 2.25rem;
      background-image: url('/examples/themes/debugging-leadership/media/favicon.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    /* Title line styling - monospace font, larger size */
    .slide[data-layout="debugging-leadership-title"] .zone-title-line-1 {
      font-size: clamp(3rem, 6vw, 5.5rem);
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1.1;
      text-align: left;
      padding: 0 2.5rem;
      font-family: var(--font-family-mono);
      display: flex;
      align-items: center;
    }

    .slide[data-layout="debugging-leadership-title"] .zone-title-line-2,
    .slide[data-layout="debugging-leadership-title"] .zone-title-line-3 {
      font-size: clamp(3rem, 6vw, 5.5rem);
      font-weight: 700;
      color: var(--color-foreground);
      line-height: 1.1;
      text-align: left;
      padding: 0 2.5rem;
      font-family: var(--font-family-mono);
      display: flex;
      align-items: center;
    }

    /* Presenter styling */
    .slide[data-layout="debugging-leadership-title"] .zone-presenter-label {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--color-foreground);
      text-align: left;
      padding: 1rem 2.5rem 0.25rem 2.5rem;
      display: flex;
      align-items: flex-end;
    }

    .slide[data-layout="debugging-leadership-title"] .zone-presenter-name {
      font-size: 0.9rem;
      font-weight: 400;
      color: var(--color-foreground);
      text-align: left;
      padding: 0 2.5rem 1.5rem 2.5rem;
      display: flex;
      align-items: flex-start;
    }

    /* Website styling - right aligned */
    .slide[data-layout="debugging-leadership-title"] .zone-website {
      font-size: 0.9rem;
      font-weight: 400;
      color: var(--color-foreground);
      text-align: right;
      padding: 1rem 2.5rem 1.5rem 2.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      grid-row: span 2;
    }

    /* All zones base styling */
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
        font-size: clamp(2.5rem, 5vw, 4rem);
      }
    }

    @media (max-width: 900px) {
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-1,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-2,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-3 {
        font-size: clamp(2rem, 4vw, 3rem);
      }
    }

    @media (max-width: 600px) {
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-1,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-2,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-3 {
        font-size: 1.75rem;
        padding: 0 1.5rem;
      }

      .slide[data-layout="debugging-leadership-title"] .zone-logo {
        font-size: 1rem;
        padding: 1rem 1.5rem;
      }

      .slide[data-layout="debugging-leadership-title"] .zone-presenter-label,
      .slide[data-layout="debugging-leadership-title"] .zone-presenter-name,
      .slide[data-layout="debugging-leadership-title"] .zone-website {
        font-size: 0.8rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }

      .slide[data-layout="debugging-leadership-title"]::before {
        left: 1.5rem;
        right: 1.5rem;
        bottom: 4rem;
      }
    }
  `,
};