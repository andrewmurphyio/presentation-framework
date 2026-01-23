import { describe, it, expect } from 'vitest';
import { twoColumnLayout } from '@/lib/design-system/layouts/two-column';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Two-Column Layout', () => {
  it('should have correct name', () => {
    expect(twoColumnLayout.name).toBe('two-column');
  });

  it('should have a description', () => {
    expect(twoColumnLayout.description).toBeDefined();
    expect(twoColumnLayout.description.length).toBeGreaterThan(0);
  });

  it('should have title, left, and right zones', () => {
    expect(twoColumnLayout.zones).toHaveLength(3);

    const zoneNames = twoColumnLayout.zones.map((z) => z.name);
    expect(zoneNames).toContain('title');
    expect(zoneNames).toContain('left');
    expect(zoneNames).toContain('right');
  });

  it('should have title zone with correct grid area', () => {
    const titleZone = twoColumnLayout.zones.find((z) => z.name === 'title');
    expect(titleZone).toBeDefined();
    expect(titleZone?.gridArea).toBe('title');
  });

  it('should have left zone with correct grid area', () => {
    const leftZone = twoColumnLayout.zones.find((z) => z.name === 'left');
    expect(leftZone).toBeDefined();
    expect(leftZone?.gridArea).toBe('left');
  });

  it('should have right zone with correct grid area', () => {
    const rightZone = twoColumnLayout.zones.find((z) => z.name === 'right');
    expect(rightZone).toBeDefined();
    expect(rightZone?.gridArea).toBe('right');
  });

  it('should have CSS grid template areas defined', () => {
    expect(twoColumnLayout.gridTemplateAreas).toBeDefined();
    expect(twoColumnLayout.gridTemplateAreas).toContain('title');
    expect(twoColumnLayout.gridTemplateAreas).toContain('left');
    expect(twoColumnLayout.gridTemplateAreas).toContain('right');
  });

  it('should have CSS grid template columns for equal split', () => {
    expect(twoColumnLayout.gridTemplateColumns).toBeDefined();
    // Two equal columns
    expect(twoColumnLayout.gridTemplateColumns).toBe('1fr 1fr');
  });

  it('should have CSS grid template rows', () => {
    expect(twoColumnLayout.gridTemplateRows).toBeDefined();
    // Title should be auto-sized, columns should fill remaining space
    expect(twoColumnLayout.gridTemplateRows).toContain('auto');
    expect(twoColumnLayout.gridTemplateRows).toContain('1fr');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() =>
      registry.registerLayout('two-column', twoColumnLayout)
    ).not.toThrow();

    const retrieved = registry.getLayout('two-column');
    expect(retrieved).toEqual(twoColumnLayout);
  });

  it('should have zone descriptions', () => {
    const titleZone = twoColumnLayout.zones.find((z) => z.name === 'title');
    const leftZone = twoColumnLayout.zones.find((z) => z.name === 'left');
    const rightZone = twoColumnLayout.zones.find((z) => z.name === 'right');

    expect(titleZone?.description).toBeDefined();
    expect(leftZone?.description).toBeDefined();
    expect(rightZone?.description).toBeDefined();
  });
});
