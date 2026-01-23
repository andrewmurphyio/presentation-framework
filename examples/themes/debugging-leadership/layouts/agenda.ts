import type { LayoutDefinition } from '../../../../src/lib/types/layout';
import { debuggingLeadershipBaseLayout } from './base';

/**
 * Debugging Leadership Agenda Layout
 *
 * Custom agenda layout matching the Debugging Leadership brand design:
 * - Logo/brand in top-left corner (DL icon + "Debugging Leadership" text)
 * - Bulleted list on the left with colored items
 * - Image/illustration on the right
 * - Black background
 *
 * Zones:
 * - logo: Top-left brand/logo area
 * - content: Bulleted list content (left side)
 * - image: Image/illustration (right side)
 */
export const debuggingLeadershipAgendaLayout: LayoutDefinition = {
  name: 'debugging-leadership-agenda',
  description: 'Custom agenda layout for Debugging Leadership presentations',
  zones: [
    {
      name: 'logo',
      gridArea: 'logo',
      description: 'Brand logo/text in top-left',
    },
    {
      name: 'content',
      gridArea: 'content',
      description: 'Bulleted list content (left side)',
    },
    {
      name: 'image',
      gridArea: 'image',
      description: 'Image/illustration (right side)',
    },
  ],
  gridTemplateAreas: `
    "logo ."
    "content image"
  `,
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'auto 1fr',
  customStyles: `
    /* Container with black background */
    .slide[data-layout="debugging-leadership-agenda"] {
      padding: 0;
      background: #000000;
      display: grid;
      height: 100vh;
      width: 100vw;
      position: relative;
    }

    /* All zones base styling */
    .slide[data-layout="debugging-leadership-agenda"] .slide-zone {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: left;
    }

    /* Base logo styling - shared across all DL layouts */
    ${debuggingLeadershipBaseLayout.customStyles}

    /* Content zone - bulleted list styling */
    .slide[data-layout="debugging-leadership-agenda"] .zone-content {
      padding: clamp(2rem, 4vh, 6rem) clamp(1.5rem, 2vw, 3rem);
      font-family: var(--font-family-mono);
      font-size: clamp(1.25rem, 2.5vw, 4rem);
      line-height: 1.6;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: clamp(1rem, 2vh, 2rem);
    }

    /* Bulleted list items - each with different color */
    .slide[data-layout="debugging-leadership-agenda"] .zone-content ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: clamp(1rem, 2vh, 2rem);
    }

    .slide[data-layout="debugging-leadership-agenda"] .zone-content li {
      display: flex;
      align-items: center;
      gap: clamp(0.75rem, 1.5vw, 1.5rem);
    }

    /* Bullet points - colored circles */
    .slide[data-layout="debugging-leadership-agenda"] .zone-content li::before {
      content: '';
      display: block;
      flex-shrink: 0;
      width: clamp(0.5rem, 1vw, 1rem);
      height: clamp(0.5rem, 1vw, 1rem);
      border-radius: 50%;
    }

    /* First bullet - orange-red (accent) */
    .slide[data-layout="debugging-leadership-agenda"] .zone-content li:nth-child(1)::before {
      background-color: var(--color-accent);
    }
    .slide[data-layout="debugging-leadership-agenda"] .zone-content li:nth-child(1) {
      color: var(--color-accent);
    }

    /* Second bullet - teal/cyan (secondary) */
    .slide[data-layout="debugging-leadership-agenda"] .zone-content li:nth-child(2)::before {
      background-color: var(--color-secondary);
    }
    .slide[data-layout="debugging-leadership-agenda"] .zone-content li:nth-child(2) {
      color: var(--color-secondary);
    }

    /* Third bullet - yellow */
    .slide[data-layout="debugging-leadership-agenda"] .zone-content li:nth-child(3)::before {
      background-color: #FBBF24;
    }
    .slide[data-layout="debugging-leadership-agenda"] .zone-content li:nth-child(3) {
      color: #FBBF24;
    }

    /* Fourth bullet - purple (primary) */
    .slide[data-layout="debugging-leadership-agenda"] .zone-content li:nth-child(4)::before {
      background-color: var(--color-primary);
    }
    .slide[data-layout="debugging-leadership-agenda"] .zone-content li:nth-child(4) {
      color: var(--color-primary);
    }

    /* Image zone styling - right side, not full width */
    .slide[data-layout="debugging-leadership-agenda"] .zone-image {
      padding: clamp(2rem, 4vh, 6rem) clamp(1.5rem, 2vw, 3rem);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .slide[data-layout="debugging-leadership-agenda"] .zone-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    /* Responsive adjustments for very small screens */
    @media (max-width: 600px) {
      .slide[data-layout="debugging-leadership-agenda"] {
        gridTemplateAreas: 
          "logo"
          "content"
          "image";
        gridTemplateColumns: 1fr;
        gridTemplateRows: auto 1fr auto;
      }
    }
  `,
};
