import { ThemeClass } from './theme-class';
import { defaultTokens } from '../design-system/default-tokens';
import type { DesignTokens } from '../types/tokens';

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
 * Example theme instance
 * Use this as a template for creating custom branded themes
 */
export const exampleTheme = new ThemeClass('example-theme', exampleTokens);
