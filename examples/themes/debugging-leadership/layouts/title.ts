import type { LayoutDefinition } from '../../../../src/lib/types/layout';
import { debuggingLeadershipBaseLayout } from './base';

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

    /* Pink separator line - fluid scaling, positioned above footer text */
    .slide[data-layout="debugging-leadership-title"]::before {
      content: '';
      position: absolute;
      bottom: clamp(5rem, 8vh, 12rem);
      left: clamp(1.5rem, 2vw, 3rem);
      right: clamp(1.5rem, 2vw, 3rem);
      height: clamp(2px, 0.2vh, 4px);
      background: var(--color-primary);
    }

    /* All zones base styling - MUST come before zone-specific styles */
    .slide[data-layout="debugging-leadership-title"] .slide-zone {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: left;
    }

    /* Base logo styling - shared across all DL layouts */
    ${debuggingLeadershipBaseLayout.customStyles}

    /* Title line styling - monospace font, fluid scaling for all viewport sizes */
    .slide[data-layout="debugging-leadership-title"] .zone-title-line-1 {
      font-size: clamp(2.5rem, 7.5vw, 25rem);
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1.1;
      text-align: left;
      padding: 0 clamp(1rem, 2vw, 3rem);
      font-family: var(--font-family-mono);
      display: flex;
      align-items: center;
    }

    .slide[data-layout="debugging-leadership-title"] .zone-title-line-2,
    .slide[data-layout="debugging-leadership-title"] .zone-title-line-3 {
      font-size: clamp(2.5rem, 7.5vw, 25rem);
      font-weight: 700;
      color: var(--color-foreground);
      line-height: 1.1;
      text-align: left;
      padding: 0 clamp(1rem, 2vw, 3rem);
      font-family: var(--font-family-mono);
      display: flex;
      align-items: center;
    }

    /* Presenter styling - fluid scaling */
    .slide[data-layout="debugging-leadership-title"] .zone-presenter-label {
      font-size: clamp(0.75rem, 1vw, 2rem);
      font-weight: 700;
      color: var(--color-foreground);
      text-align: left;
      padding: clamp(0.75rem, 1vh, 1.5rem) clamp(1.5rem, 2vw, 3rem) clamp(0.125rem, 0.3vh, 0.5rem) clamp(1.5rem, 2vw, 3rem);
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-end;
    }

    .slide[data-layout="debugging-leadership-title"] .zone-presenter-name {
      font-size: clamp(0.75rem, 1vw, 2rem);
      font-weight: 400;
      color: var(--color-foreground);
      text-align: left;
      padding: 0 clamp(1.5rem, 2vw, 3rem) clamp(1rem, 1.5vh, 2rem) clamp(1.5rem, 2vw, 3rem);
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
    }

    /* Website styling - right aligned, fluid scaling */
    .slide[data-layout="debugging-leadership-title"] .zone-website {
      font-size: clamp(0.75rem, 1vw, 2rem);
      font-weight: 400;
      color: var(--color-foreground);
      text-align: right;
      padding: clamp(0.75rem, 1vh, 1.5rem) clamp(1.5rem, 2vw, 3rem) clamp(1rem, 1.5vh, 2rem) clamp(1.5rem, 2vw, 3rem);
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      grid-row: span 2;
    }

    /* Responsive adjustments for very small screens only */
    @media (max-width: 600px) {
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-1,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-2,
      .slide[data-layout="debugging-leadership-title"] .zone-title-line-3 {
        font-size: 1.75rem;
        padding: 0 1.5rem;
      }
    }
  `,
};