import { describe, it, expect } from 'vitest';
import { Theme } from "@lib/theming/theme";
import { defaultTokens } from '@/lib/design-system/default-tokens';

describe('Theme', () => {
  const testTheme = new Theme('test-theme', defaultTokens);

  describe('getName', () => {
    it('should return the theme name', () => {
      expect(testTheme.getName()).toBe('test-theme');
    });
  });

  describe('getTokens', () => {
    it('should return the complete token set', () => {
      const tokens = testTheme.getTokens();
      expect(tokens).toEqual(defaultTokens);
      expect(tokens.colors.primary).toBe('#3b82f6');
    });
  });

  describe('getCSSVariables', () => {
    it('should generate CSS variables for all color tokens', () => {
      const vars = testTheme.getCSSVariables();

      expect(vars['--color-primary']).toBe('#3b82f6');
      expect(vars['--color-secondary']).toBe('#8b5cf6');
      expect(vars['--color-accent']).toBe('#f59e0b');
      expect(vars['--color-background']).toBe('#ffffff');
      expect(vars['--color-foreground']).toBe('#1f2937');
      expect(vars['--color-muted']).toBe('#6b7280');
      expect(vars['--color-border']).toBe('#d1d5db');
      expect(vars['--color-error']).toBe('#ef4444');
    });

    it('should generate CSS variables for font families', () => {
      const vars = testTheme.getCSSVariables();

      expect(vars['--font-family-sans']).toContain('Inter');
      expect(vars['--font-family-mono']).toContain('JetBrains Mono');
    });

    it('should generate CSS variables for font sizes', () => {
      const vars = testTheme.getCSSVariables();

      expect(vars['--font-size-xs']).toBe('0.75rem');
      expect(vars['--font-size-sm']).toBe('0.875rem');
      expect(vars['--font-size-base']).toBe('1rem');
      expect(vars['--font-size-lg']).toBe('1.125rem');
      expect(vars['--font-size-xl']).toBe('1.25rem');
      expect(vars['--font-size-2xl']).toBe('1.5rem');
      expect(vars['--font-size-3xl']).toBe('1.875rem');
      expect(vars['--font-size-4xl']).toBe('2.25rem');
    });

    it('should generate CSS variables for font weights', () => {
      const vars = testTheme.getCSSVariables();

      expect(vars['--font-weight-normal']).toBe('400');
      expect(vars['--font-weight-medium']).toBe('500');
      expect(vars['--font-weight-semibold']).toBe('600');
      expect(vars['--font-weight-bold']).toBe('700');
    });

    it('should generate CSS variables for line heights', () => {
      const vars = testTheme.getCSSVariables();

      expect(vars['--line-height-tight']).toBe('1.25');
      expect(vars['--line-height-normal']).toBe('1.5');
      expect(vars['--line-height-relaxed']).toBe('1.75');
    });

    it('should generate CSS variables for spacing', () => {
      const vars = testTheme.getCSSVariables();

      expect(vars['--spacing-0']).toBe('0');
      expect(vars['--spacing-1']).toBe('0.25rem');
      expect(vars['--spacing-2']).toBe('0.5rem');
      expect(vars['--spacing-3']).toBe('0.75rem');
      expect(vars['--spacing-4']).toBe('1rem');
      expect(vars['--spacing-6']).toBe('1.5rem');
      expect(vars['--spacing-8']).toBe('2rem');
      expect(vars['--spacing-12']).toBe('3rem');
      expect(vars['--spacing-16']).toBe('4rem');
    });

    it('should generate CSS variables for border radius', () => {
      const vars = testTheme.getCSSVariables();

      expect(vars['--border-radius-none']).toBe('0');
      expect(vars['--border-radius-sm']).toBe('0.125rem');
      expect(vars['--border-radius-base']).toBe('0.25rem');
      expect(vars['--border-radius-lg']).toBe('0.5rem');
      expect(vars['--border-radius-full']).toBe('9999px');
    });

    it('should generate CSS variables for border width', () => {
      const vars = testTheme.getCSSVariables();

      expect(vars['--border-width-thin']).toBe('1px');
      expect(vars['--border-width-base']).toBe('2px');
      expect(vars['--border-width-thick']).toBe('4px');
    });

    it('should generate CSS variables for shadows', () => {
      const vars = testTheme.getCSSVariables();

      expect(vars['--shadow-sm']).toContain('rgba');
      expect(vars['--shadow-base']).toContain('rgba');
      expect(vars['--shadow-lg']).toContain('rgba');
      expect(vars['--shadow-xl']).toContain('rgba');
    });
  });

  describe('toCSSString', () => {
    it('should generate valid CSS :root declaration', () => {
      const css = testTheme.toCSSString();

      expect(css).toContain(':root {');
      expect(css).toContain('--color-primary: #3b82f6;');
      expect(css).toContain('--font-size-base: 1rem;');
      expect(css).toContain('--spacing-4: 1rem;');
      expect(css).toContain('}');
    });

    it('should have proper CSS formatting with indentation', () => {
      const css = testTheme.toCSSString();
      const lines = css.split('\n');

      // First line should be :root {
      expect(lines[0]).toBe(':root {');

      // Last line should be }
      expect(lines[lines.length - 1]).toBe('}');

      // Middle lines should start with spaces (indented)
      expect(lines[1]?.startsWith('  --')).toBe(true);
    });
  });
});
