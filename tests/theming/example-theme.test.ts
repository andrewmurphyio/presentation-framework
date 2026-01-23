import { describe, it, expect } from 'vitest';
import { exampleTheme } from '@examples/themes/example';
import { defaultTokens } from '@/lib/design-system/default-tokens';

describe('Example Theme', () => {
  it('should have the correct name', () => {
    expect(exampleTheme.getName()).toBe('example-theme');
  });

  it('should have all required token categories', () => {
    const tokens = exampleTheme.getTokens();

    expect(tokens.colors).toBeDefined();
    expect(tokens.typography).toBeDefined();
    expect(tokens.spacing).toBeDefined();
    expect(tokens.borders).toBeDefined();
    expect(tokens.shadows).toBeDefined();
  });

  it('should override primary, secondary, and accent colors', () => {
    const tokens = exampleTheme.getTokens();

    // These should be overridden
    expect(tokens.colors.primary).toBe('#7c3aed');
    expect(tokens.colors.secondary).toBe('#ec4899');
    expect(tokens.colors.accent).toBe('#10b981');

    // These should NOT match defaults (proving override worked)
    expect(tokens.colors.primary).not.toBe(defaultTokens.colors.primary);
    expect(tokens.colors.secondary).not.toBe(defaultTokens.colors.secondary);
    expect(tokens.colors.accent).not.toBe(defaultTokens.colors.accent);
  });

  it('should inherit non-overridden colors from defaults', () => {
    const tokens = exampleTheme.getTokens();

    // These should remain the same as defaults
    expect(tokens.colors.background).toBe(defaultTokens.colors.background);
    expect(tokens.colors.foreground).toBe(defaultTokens.colors.foreground);
    expect(tokens.colors.muted).toBe(defaultTokens.colors.muted);
    expect(tokens.colors.border).toBe(defaultTokens.colors.border);
    expect(tokens.colors.error).toBe(defaultTokens.colors.error);
  });

  it('should inherit all typography tokens from defaults', () => {
    const tokens = exampleTheme.getTokens();

    expect(tokens.typography).toEqual(defaultTokens.typography);
  });

  it('should inherit all spacing tokens from defaults', () => {
    const tokens = exampleTheme.getTokens();

    expect(tokens.spacing).toEqual(defaultTokens.spacing);
  });

  it('should inherit all border tokens from defaults', () => {
    const tokens = exampleTheme.getTokens();

    expect(tokens.borders).toEqual(defaultTokens.borders);
  });

  it('should inherit all shadow tokens from defaults', () => {
    const tokens = exampleTheme.getTokens();

    expect(tokens.shadows).toEqual(defaultTokens.shadows);
  });

  it('should generate CSS variables with overridden colors', () => {
    const vars = exampleTheme.getCSSVariables();

    expect(vars['--color-primary']).toBe('#7c3aed');
    expect(vars['--color-secondary']).toBe('#ec4899');
    expect(vars['--color-accent']).toBe('#10b981');
  });

  it('should generate valid CSS string', () => {
    const css = exampleTheme.toCSSString();

    expect(css).toContain(':root {');
    expect(css).toContain('--color-primary: #7c3aed;');
    expect(css).toContain('--color-secondary: #ec4899;');
    expect(css).toContain('--color-accent: #10b981;');
    expect(css).toContain('}');
  });

  describe('theme layout support', () => {
    it('should have a custom featured layout', () => {
      const layouts = exampleTheme.getLayouts();
      expect(layouts).toHaveLength(1);
      expect(layouts[0].name).toBe('featured');
    });

    it('should have featured layout with correct zones', () => {
      const layouts = exampleTheme.getLayouts();
      const featuredLayout = layouts[0];

      expect(featuredLayout.zones).toHaveLength(4);
      const zoneNames = featuredLayout.zones.map(z => z.name);
      expect(zoneNames).toContain('kicker');
      expect(zoneNames).toContain('title');
      expect(zoneNames).toContain('subtitle');
      expect(zoneNames).toContain('cta');
    });

    it('should have featured layout with custom styles', () => {
      const layouts = exampleTheme.getLayouts();
      const featuredLayout = layouts[0];

      expect(featuredLayout.customStyles).toBeDefined();
      expect(featuredLayout.customStyles).toContain('background: linear-gradient');
      expect(featuredLayout.customStyles).toContain('var(--color-primary)');
      expect(featuredLayout.customStyles).toContain('var(--color-secondary)');
    });

    it('should have featured layout with correct grid template', () => {
      const layouts = exampleTheme.getLayouts();
      const featuredLayout = layouts[0];

      expect(featuredLayout.gridTemplateAreas).toBeDefined();
      expect(featuredLayout.gridTemplateAreas).toContain('kicker');
      expect(featuredLayout.gridTemplateAreas).toContain('title');
      expect(featuredLayout.gridTemplateAreas).toContain('subtitle');
      expect(featuredLayout.gridTemplateAreas).toContain('cta');
      expect(featuredLayout.gridTemplateRows).toBe('1fr auto auto auto 2fr auto 1fr');
    });

    it('should demonstrate theme-level customization', () => {
      const layouts = exampleTheme.getLayouts();
      const featuredLayout = layouts[0];

      // Check that it uses theme-specific colors in styles
      expect(featuredLayout.customStyles).toContain('var(--color-accent)');
      expect(featuredLayout.customStyles).toContain('.zone-kicker');
      expect(featuredLayout.customStyles).toContain('.zone-cta');
      expect(featuredLayout.customStyles).toContain('text-transform: uppercase');
    });
  });
});
