import { describe, it, expect, beforeEach } from 'vitest';
import { TokenRegistry } from '@/lib/design-system/token-registry';
import type { DesignTokens } from '@/lib/types/tokens';

describe('TokenRegistry', () => {
  let registry: TokenRegistry;
  let mockTokens: DesignTokens;

  beforeEach(() => {
    registry = new TokenRegistry();
    mockTokens = {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#ffffff',
        foreground: '#000000',
        muted: '#6b7280',
        border: '#d1d5db',
        error: '#ef4444',
      },
      typography: {
        fontFamily: {
          sans: 'Inter, sans-serif',
          mono: 'JetBrains Mono, monospace',
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
        },
      },
      spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
        16: '4rem',
      },
      borders: {
        radius: {
          none: '0',
          sm: '0.125rem',
          base: '0.25rem',
          lg: '0.5rem',
          full: '9999px',
        },
        width: {
          thin: '1px',
          base: '2px',
          thick: '4px',
        },
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    };
  });

  describe('registerTokens', () => {
    it('should register tokens successfully', () => {
      expect(() => registry.registerTokens(mockTokens)).not.toThrow();
      expect(registry.hasTokens()).toBe(true);
    });

    it('should overwrite previously registered tokens', () => {
      registry.registerTokens(mockTokens);

      const newTokens: DesignTokens = {
        ...mockTokens,
        colors: {
          ...mockTokens.colors,
          primary: '#ff0000',
        },
      };

      registry.registerTokens(newTokens);
      const retrieved = registry.getTokens();

      expect(retrieved.colors.primary).toBe('#ff0000');
    });
  });

  describe('getTokens', () => {
    it('should return registered tokens', () => {
      registry.registerTokens(mockTokens);
      const tokens = registry.getTokens();

      expect(tokens).toEqual(mockTokens);
      expect(tokens.colors.primary).toBe('#3b82f6');
    });

    it('should throw error when no tokens are registered', () => {
      expect(() => registry.getTokens()).toThrow(
        'No tokens registered. Call registerTokens() first.'
      );
    });
  });

  describe('hasTokens', () => {
    it('should return false when no tokens are registered', () => {
      expect(registry.hasTokens()).toBe(false);
    });

    it('should return true when tokens are registered', () => {
      registry.registerTokens(mockTokens);
      expect(registry.hasTokens()).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear registered tokens', () => {
      registry.registerTokens(mockTokens);
      expect(registry.hasTokens()).toBe(true);

      registry.clear();
      expect(registry.hasTokens()).toBe(false);
    });

    it('should allow re-registration after clearing', () => {
      registry.registerTokens(mockTokens);
      registry.clear();

      expect(() => registry.registerTokens(mockTokens)).not.toThrow();
      expect(registry.hasTokens()).toBe(true);
    });
  });
});
