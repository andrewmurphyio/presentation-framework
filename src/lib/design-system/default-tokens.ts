import type { DesignTokens } from '../types/tokens';

/**
 * Default design tokens for the presentation framework
 *
 * These tokens provide a sensible starting point for presentations.
 * They use a blue-based color scheme with professional typography.
 *
 * Themes can override these values to create branded experiences.
 */
export const defaultTokens: DesignTokens = {
  colors: {
    primary: '#3b82f6', // Blue 500
    secondary: '#8b5cf6', // Purple 500
    accent: '#f59e0b', // Amber 500
    background: '#ffffff', // White
    foreground: '#1f2937', // Gray 800
    muted: '#6b7280', // Gray 500
    border: '#d1d5db', // Gray 300
    error: '#ef4444', // Red 500
  },
  typography: {
    fontFamily: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'JetBrains Mono, "Fira Code", Consolas, Monaco, "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
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
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    12: '3rem', // 48px
    16: '4rem', // 64px
  },
  borders: {
    radius: {
      none: '0',
      sm: '0.125rem', // 2px
      base: '0.25rem', // 4px
      lg: '0.5rem', // 8px
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
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};
