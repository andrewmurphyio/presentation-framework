import type { DesignTokens } from './tokens';

/**
 * Theme definition
 *
 * A theme provides concrete values for all design tokens.
 * Themes enable brand switching without changing slide content.
 */
export interface Theme {
  name: string;
  tokens: DesignTokens;
}
