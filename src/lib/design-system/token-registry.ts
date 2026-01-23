import type { DesignTokens } from '../types/tokens';

/**
 * TokenRegistry manages design token definitions
 *
 * This class provides a centralized store for design tokens,
 * allowing themes to register their token values and components
 * to retrieve them for styling.
 */
export class TokenRegistry {
  private tokens: DesignTokens | null = null;

  /**
   * Register a complete set of design tokens
   * If tokens are already registered, they will be overwritten
   */
  registerTokens(tokens: DesignTokens): void {
    this.tokens = tokens;
  }

  /**
   * Get the currently registered tokens
   * @throws Error if no tokens have been registered
   */
  getTokens(): DesignTokens {
    if (!this.tokens) {
      throw new Error('No tokens registered. Call registerTokens() first.');
    }
    return this.tokens;
  }

  /**
   * Check if tokens are currently registered
   */
  hasTokens(): boolean {
    return this.tokens !== null;
  }

  /**
   * Clear all registered tokens
   */
  clear(): void {
    this.tokens = null;
  }
}

/**
 * Global singleton instance of TokenRegistry
 * Most applications will use this shared instance
 */
export const tokenRegistry = new TokenRegistry();
