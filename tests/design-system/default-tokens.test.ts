import { describe, it, expect } from 'vitest';
import { defaultTokens } from '@/lib/design-system/default-tokens';

describe('Default Tokens', () => {
  describe('colors', () => {
    it('should have all required color tokens', () => {
      expect(defaultTokens.colors.primary).toBeDefined();
      expect(defaultTokens.colors.secondary).toBeDefined();
      expect(defaultTokens.colors.accent).toBeDefined();
      expect(defaultTokens.colors.background).toBeDefined();
      expect(defaultTokens.colors.foreground).toBeDefined();
      expect(defaultTokens.colors.muted).toBeDefined();
      expect(defaultTokens.colors.border).toBeDefined();
      expect(defaultTokens.colors.error).toBeDefined();
    });

    it('should have valid CSS color values', () => {
      // Hex color format validation
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      expect(defaultTokens.colors.primary).toMatch(hexColorRegex);
      expect(defaultTokens.colors.secondary).toMatch(hexColorRegex);
      expect(defaultTokens.colors.accent).toMatch(hexColorRegex);
      expect(defaultTokens.colors.background).toMatch(hexColorRegex);
      expect(defaultTokens.colors.foreground).toMatch(hexColorRegex);
      expect(defaultTokens.colors.muted).toMatch(hexColorRegex);
      expect(defaultTokens.colors.border).toMatch(hexColorRegex);
      expect(defaultTokens.colors.error).toMatch(hexColorRegex);
    });
  });

  describe('typography', () => {
    it('should have font families', () => {
      expect(defaultTokens.typography.fontFamily.sans).toBeDefined();
      expect(defaultTokens.typography.fontFamily.mono).toBeDefined();
      expect(defaultTokens.typography.fontFamily.sans).toContain('sans-serif');
      expect(defaultTokens.typography.fontFamily.mono).toContain('monospace');
    });

    it('should have complete font size scale', () => {
      expect(defaultTokens.typography.fontSize.xs).toBeDefined();
      expect(defaultTokens.typography.fontSize.sm).toBeDefined();
      expect(defaultTokens.typography.fontSize.base).toBe('1rem');
      expect(defaultTokens.typography.fontSize.lg).toBeDefined();
      expect(defaultTokens.typography.fontSize.xl).toBeDefined();
      expect(defaultTokens.typography.fontSize['2xl']).toBeDefined();
      expect(defaultTokens.typography.fontSize['3xl']).toBeDefined();
      expect(defaultTokens.typography.fontSize['4xl']).toBeDefined();
    });

    it('should have font weights', () => {
      expect(defaultTokens.typography.fontWeight.normal).toBe(400);
      expect(defaultTokens.typography.fontWeight.medium).toBe(500);
      expect(defaultTokens.typography.fontWeight.semibold).toBe(600);
      expect(defaultTokens.typography.fontWeight.bold).toBe(700);
    });

    it('should have line heights', () => {
      expect(defaultTokens.typography.lineHeight.tight).toBeLessThan(
        defaultTokens.typography.lineHeight.normal
      );
      expect(defaultTokens.typography.lineHeight.normal).toBeLessThan(
        defaultTokens.typography.lineHeight.relaxed
      );
    });
  });

  describe('spacing', () => {
    it('should have complete spacing scale', () => {
      expect(defaultTokens.spacing[0]).toBe('0');
      expect(defaultTokens.spacing[1]).toBe('0.25rem');
      expect(defaultTokens.spacing[2]).toBe('0.5rem');
      expect(defaultTokens.spacing[3]).toBe('0.75rem');
      expect(defaultTokens.spacing[4]).toBe('1rem');
      expect(defaultTokens.spacing[6]).toBe('1.5rem');
      expect(defaultTokens.spacing[8]).toBe('2rem');
      expect(defaultTokens.spacing[12]).toBe('3rem');
      expect(defaultTokens.spacing[16]).toBe('4rem');
    });

    it('should follow 4px base unit scale', () => {
      // Verify the scale increments properly (4px = 0.25rem)
      const remToPixel = (rem: string): number => {
        return parseFloat(rem) * 16;
      };

      expect(remToPixel(defaultTokens.spacing[1])).toBe(4);
      expect(remToPixel(defaultTokens.spacing[2])).toBe(8);
      expect(remToPixel(defaultTokens.spacing[4])).toBe(16);
      expect(remToPixel(defaultTokens.spacing[8])).toBe(32);
    });
  });

  describe('borders', () => {
    it('should have border radius tokens', () => {
      expect(defaultTokens.borders.radius.none).toBe('0');
      expect(defaultTokens.borders.radius.sm).toBeDefined();
      expect(defaultTokens.borders.radius.base).toBeDefined();
      expect(defaultTokens.borders.radius.lg).toBeDefined();
      expect(defaultTokens.borders.radius.full).toBe('9999px');
    });

    it('should have border width tokens', () => {
      expect(defaultTokens.borders.width.thin).toBe('1px');
      expect(defaultTokens.borders.width.base).toBe('2px');
      expect(defaultTokens.borders.width.thick).toBe('4px');
    });
  });

  describe('shadows', () => {
    it('should have all shadow levels', () => {
      expect(defaultTokens.shadows.sm).toBeDefined();
      expect(defaultTokens.shadows.base).toBeDefined();
      expect(defaultTokens.shadows.lg).toBeDefined();
      expect(defaultTokens.shadows.xl).toBeDefined();
    });

    it('should have valid CSS shadow values', () => {
      // Shadows should contain rgba or rgb and pixel values
      expect(defaultTokens.shadows.sm).toContain('rgba');
      expect(defaultTokens.shadows.base).toContain('rgba');
      expect(defaultTokens.shadows.lg).toContain('rgba');
      expect(defaultTokens.shadows.xl).toContain('rgba');
    });
  });
});
