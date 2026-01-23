import { describe, it, expect } from 'vitest';
import { sectionLayout } from '@/lib/design-system/layouts/section';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Section Layout', () => {
  it('should have correct name', () => {
    expect(sectionLayout.name).toBe('section');
  });

  it('should have a description', () => {
    expect(sectionLayout.description).toBeDefined();
    expect(sectionLayout.description.length).toBeGreaterThan(0);
  });

  it('should have heading zone', () => {
    expect(sectionLayout.zones).toHaveLength(1);

    const zoneNames = sectionLayout.zones.map((z) => z.name);
    expect(zoneNames).toContain('heading');
  });

  it('should have heading zone with correct grid area', () => {
    const headingZone = sectionLayout.zones.find((z) => z.name === 'heading');
    expect(headingZone).toBeDefined();
    expect(headingZone?.gridArea).toBe('heading');
  });

  it('should have CSS grid template areas defined', () => {
    expect(sectionLayout.gridTemplateAreas).toBeDefined();
    expect(sectionLayout.gridTemplateAreas).toContain('heading');
  });

  it('should have CSS grid template columns', () => {
    expect(sectionLayout.gridTemplateColumns).toBeDefined();
    expect(sectionLayout.gridTemplateColumns).toBe('1fr');
  });

  it('should have CSS grid template rows for vertical centering', () => {
    expect(sectionLayout.gridTemplateRows).toBeDefined();
    // Should have spacing before and after for vertical centering
    expect(sectionLayout.gridTemplateRows).toContain('1fr');
    expect(sectionLayout.gridTemplateRows).toContain('auto');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() => registry.registerLayout('section', sectionLayout)).not.toThrow();

    const retrieved = registry.getLayout('section');
    expect(retrieved).toEqual(sectionLayout);
  });

  it('should have zone description', () => {
    const headingZone = sectionLayout.zones.find((z) => z.name === 'heading');
    expect(headingZone?.description).toBeDefined();
  });
});
