import type { DesignTokens } from './tokens';

/**
 * CSS Variable mapping for design tokens
 * Maps token paths to CSS custom property names
 */
export type CSSVariables = Record<string, string>;

/**
 * Theme definition
 *
 * A theme provides concrete values for all design tokens.
 * Themes enable brand switching without changing slide content.
 */
export interface Theme {
  name: string;
  tokens: DesignTokens;

  /**
   * Get the theme name
   */
  getName(): string;

  /**
   * Get the complete token set
   */
  getTokens(): DesignTokens;

  /**
   * Generate CSS custom properties from tokens
   */
  getCSSVariables(): CSSVariables;

  /**
   * Generate CSS string for style tag injection
   */
  toCSSString(): string;
}
