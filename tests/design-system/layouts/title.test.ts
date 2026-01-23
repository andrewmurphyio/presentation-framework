import { describe, it, expect } from 'vitest';
import { titleLayout } from '@/lib/design-system/layouts/title';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Title Layout', () => {
  it('should have correct name', () => {
    expect(titleLayout.name).toBe('title');
  });

  it('should have a description', () => {
    expect(titleLayout.description).toBeDefined();
    expect(titleLayout.description.length).toBeGreaterThan(0);
  });

  it('should have all required zones', () => {
    expect(titleLayout.zones).toHaveLength(6);

    const zoneNames = titleLayout.zones.map((z) => z.name);
    expect(zoneNames).toContain('header-left');
    expect(zoneNames).toContain('header-right');
    expect(zoneNames).toContain('title');
    expect(zoneNames).toContain('subtitle');
    expect(zoneNames).toContain('footer-left');
    expect(zoneNames).toContain('footer-right');
  });

  it('should have title zone with correct grid area', () => {
    const titleZone = titleLayout.zones.find((z) => z.name === 'title');
    expect(titleZone).toBeDefined();
    expect(titleZone?.gridArea).toBe('title');
  });

  it('should have subtitle zone with correct grid area', () => {
    const subtitleZone = titleLayout.zones.find((z) => z.name === 'subtitle');
    expect(subtitleZone).toBeDefined();
    expect(subtitleZone?.gridArea).toBe('subtitle');
  });

  it('should have CSS grid template areas defined', () => {
    expect(titleLayout.gridTemplateAreas).toBeDefined();
    expect(titleLayout.gridTemplateAreas).toContain('header-left');
    expect(titleLayout.gridTemplateAreas).toContain('header-right');
    expect(titleLayout.gridTemplateAreas).toContain('title');
    expect(titleLayout.gridTemplateAreas).toContain('subtitle');
    expect(titleLayout.gridTemplateAreas).toContain('footer-left');
    expect(titleLayout.gridTemplateAreas).toContain('footer-right');
  });

  it('should have CSS grid template columns', () => {
    expect(titleLayout.gridTemplateColumns).toBeDefined();
    expect(titleLayout.gridTemplateColumns).toBe('auto 1fr auto');
  });

  it('should have CSS grid template rows for vertical centering', () => {
    expect(titleLayout.gridTemplateRows).toBeDefined();
    // Should have spacing before and after for vertical centering
    expect(titleLayout.gridTemplateRows).toContain('1fr');
    expect(titleLayout.gridTemplateRows).toContain('auto');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() => registry.registerLayout('title', titleLayout)).not.toThrow();

    const retrieved = registry.getLayout('title');
    expect(retrieved).toEqual(titleLayout);
  });

  it('should have zone descriptions', () => {
    const titleZone = titleLayout.zones.find((z) => z.name === 'title');
    const subtitleZone = titleLayout.zones.find((z) => z.name === 'subtitle');

    expect(titleZone?.description).toBeDefined();
    expect(subtitleZone?.description).toBeDefined();
  });
});
