import type { DesignTokens } from '../types/tokens';

/**
 * CSS Variable mapping for design tokens
 * Maps token paths to CSS custom property names
 */
export type CSSVariables = Record<string, string>;

/**
 * Theme provides token management and CSS variable generation
 *
 * Themes wrap DesignTokens and provide utilities for applying them
 * to slides via CSS custom properties.
 */
export class Theme {
  readonly name: string;
  readonly tokens: DesignTokens;

  constructor(name: string, tokens: DesignTokens) {
    this.name = name;
    this.tokens = tokens;
  }

  /**
   * Get the theme name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get the complete token set
   */
  getTokens(): DesignTokens {
    return this.tokens;
  }

  /**
   * Generate CSS custom properties from tokens
   *
   * Converts design tokens into CSS variables that can be applied
   * to the presentation root element.
   *
   * Example output:
   * {
   *   '--color-primary': '#3b82f6',
   *   '--font-size-base': '1rem',
   *   '--spacing-4': '1rem'
   * }
   */
  getCSSVariables(): CSSVariables {
    const vars: CSSVariables = {};

    // Color tokens
    Object.entries(this.tokens.colors).forEach(([key, value]) => {
      vars[`--color-${key}`] = value as string;
    });

    // Typography - font families
    Object.entries(this.tokens.typography.fontFamily).forEach(([key, value]) => {
      vars[`--font-family-${key}`] = value;
    });

    // Typography - font sizes
    Object.entries(this.tokens.typography.fontSize).forEach(([key, value]) => {
      vars[`--font-size-${key}`] = value;
    });

    // Typography - font weights
    Object.entries(this.tokens.typography.fontWeight).forEach(([key, value]) => {
      vars[`--font-weight-${key}`] = String(value);
    });

    // Typography - line heights
    Object.entries(this.tokens.typography.lineHeight).forEach(([key, value]) => {
      vars[`--line-height-${key}`] = String(value);
    });

    // Spacing tokens
    Object.entries(this.tokens.spacing).forEach(([key, value]) => {
      vars[`--spacing-${key}`] = value as string;
    });

    // Border radius
    Object.entries(this.tokens.borders.radius).forEach(([key, value]) => {
      vars[`--border-radius-${key}`] = value;
    });

    // Border width
    Object.entries(this.tokens.borders.width).forEach(([key, value]) => {
      vars[`--border-width-${key}`] = value;
    });

    // Shadows
    Object.entries(this.tokens.shadows).forEach(([key, value]) => {
      vars[`--shadow-${key}`] = value as string;
    });

    return vars;
  }

  /**
   * Generate CSS string for style tag injection
   *
   * Returns a CSS :root selector with all custom properties
   */
  toCSSString(): string {
    const vars = this.getCSSVariables();
    const properties = Object.entries(vars)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');

    return `:root {\n${properties}\n}`;
  }
}
