import { describe, it, expect } from 'vitest';
import type { Theme } from '@/lib/types/theme';

describe('Theme Types', () => {
  it('should accept a valid Theme object', () => {
    const validTheme: Theme = {
      name: 'example-theme',
      tokens: {
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
      },
    };

    expect(validTheme.name).toBe('example-theme');
    expect(validTheme.tokens.colors.primary).toBe('#3b82f6');
  });
});
