/**
 * Design token type definitions
 *
 * Tokens are the foundational values of the design system (colors, spacing, typography, etc.)
 * They provide a single source of truth for visual consistency across all presentations.
 */

/**
 * Color tokens for the design system
 * All color values should be valid CSS color strings (hex, rgb, hsl, etc.)
 */
export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  error: string;
}

/**
 * Typography tokens for text styling
 * Font families should be comma-separated fallback stacks
 * Sizes should be in rem units for accessibility
 */
export interface TypographyTokens {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

/**
 * Spacing tokens for layout and component spacing
 * All values should use a consistent scale (typically 4px base unit)
 * Values should be in rem for consistency and accessibility
 */
export interface SpacingTokens {
  0: string;
  1: string; // 4px equivalent
  2: string; // 8px equivalent
  3: string; // 12px equivalent
  4: string; // 16px equivalent
  6: string; // 24px equivalent
  8: string; // 32px equivalent
  12: string; // 48px equivalent
  16: string; // 64px equivalent
}

/**
 * Border tokens for component borders and outlines
 */
export interface BorderTokens {
  radius: {
    none: string;
    sm: string;
    base: string;
    lg: string;
    full: string;
  };
  width: {
    thin: string;
    base: string;
    thick: string;
  };
}

/**
 * Shadow tokens for elevation and depth
 * Shadows should be CSS box-shadow values
 */
export interface ShadowTokens {
  sm: string;
  base: string;
  lg: string;
  xl: string;
}

/**
 * Complete set of design tokens
 * This is the root interface that themes must implement
 */
export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borders: BorderTokens;
  shadows: ShadowTokens;
}
