import { Theme } from '@lib/theming/theme';
import { defaultTokens } from '@lib/design-system/default-tokens';
import type { DesignTokens } from '@lib/types/tokens';
import { CustomLayoutBuilder } from '@lib/design-system/custom-layout-builder';
import type { CustomLayoutDefinition } from '@lib/types/deck';

/**
 * Example theme demonstrating theme customization
 *
 * This theme uses the default tokens as a base but overrides
 * a few colors to create a distinctive purple-based color scheme.
 *
 * This demonstrates how themes can inherit from defaults while
 * providing brand-specific customizations.
 */

const exampleTokens: DesignTokens = {
  ...defaultTokens,
  colors: {
    ...defaultTokens.colors,
    primary: '#7c3aed', // Purple 600 - distinctive brand color
    secondary: '#ec4899', // Pink 500 - complementary accent
    accent: '#10b981', // Green 500 - for success/highlights
  },
};

/**
 * Featured layout - Theme-specific layout for highlighting key content
 *
 * This layout demonstrates theme-level customization by providing
 * a branded layout that uses the theme's purple accent colors.
 *
 * Zones:
 * - kicker: Small text above the title (e.g., "New Feature")
 * - title: Main headline
 * - subtitle: Supporting text
 * - cta: Call-to-action area (button text, link, etc.)
 */
const featuredLayout = CustomLayoutBuilder.create('featured', 'Theme-specific featured content layout')
  .addZone('kicker', 'kicker', 'Small accent text above title')
  .addZone('title', 'title', 'Main featured headline')
  .addZone('subtitle', 'subtitle', 'Supporting description')
  .addZone('cta', 'cta', 'Call-to-action button or link')
  .setGridTemplateAreas(`
    "."
    "kicker"
    "title"
    "subtitle"
    "."
    "cta"
    "."
  `)
  .setGridTemplateRows('1fr auto auto auto 2fr auto 1fr')
  .setCustomStyles(`
    /* Featured layout custom styles using theme colors */
    .slide[data-layout="featured"] {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      padding: var(--spacing-16);
    }

    .slide[data-layout="featured"] .zone-kicker {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-accent);
      opacity: 0.9;
    }

    .slide[data-layout="featured"] .zone-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: var(--font-weight-bold);
      color: white;
      text-align: center;
      line-height: var(--line-height-tight);
      margin-top: var(--spacing-2);
    }

    .slide[data-layout="featured"] .zone-subtitle {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-normal);
      color: white;
      opacity: 0.95;
      text-align: center;
      max-width: 80%;
      margin: var(--spacing-4) auto 0;
    }

    .slide[data-layout="featured"] .zone-cta {
      display: inline-flex;
      padding: var(--spacing-3) var(--spacing-8);
      background: var(--color-accent);
      color: white;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--border-radius-full);
      text-align: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: var(--shadow-lg);
    }

    .slide[data-layout="featured"] .zone-cta:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }
  `)
  .build() as CustomLayoutDefinition;

/**
 * Example theme instance with custom layouts
 * Use this as a template for creating custom branded themes
 */
export const exampleTheme = new Theme('example-theme', exampleTokens, [featuredLayout]);
