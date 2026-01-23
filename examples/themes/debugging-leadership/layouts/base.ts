import type { LayoutDefinition } from '../../../../src/lib/types/layout';

/**
 * Debugging Leadership Base Layout
 *
 * Base layout that provides the common logo/branding zone and styling
 * that all Debugging Leadership layouts share. Other layouts can extend
 * this to inherit the logo zone and styling.
 *
 * Zones:
 * - logo: Top-left brand/logo area (DL icon + "Debugging Leadership" text)
 */
export const debuggingLeadershipBaseLayout: LayoutDefinition = {
  name: 'debugging-leadership-base',
  description: 'Base layout for Debugging Leadership presentations with logo',
  zones: [
    {
      name: 'logo',
      gridArea: 'logo',
      description: 'Brand logo/text in top-left',
    },
  ],
  gridTemplateAreas: `
    "logo"
  `,
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto',
  customStyles: `
    /* Base logo styling - shared across all DL layouts */
    /* This selector matches any layout starting with "debugging-leadership" */
    .slide[data-layout^="debugging-leadership"] .zone-logo {
      font-size: clamp(0.875rem, 1.2vw, 2.5rem);
      font-weight: 500;
      color: var(--color-primary);
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: clamp(0.5rem, 0.8vw, 1.5rem);
      padding: clamp(1rem, 1.5vh, 2.5rem) clamp(1.5rem, 2vw, 3rem);
      text-align: left;
      justify-content: flex-start;
      font-family: var(--font-family-mono);
    }

    /* DL logo icon - using actual logo image, fluid scaling */
    .slide[data-layout^="debugging-leadership"] .zone-logo::before {
      content: '';
      display: block;
      flex-shrink: 0;
      width: clamp(1.75rem, 2.5vw, 4rem);
      height: clamp(1.75rem, 2.5vw, 4rem);
      background-image: url('/examples/themes/debugging-leadership/media/favicon.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  `,
};
