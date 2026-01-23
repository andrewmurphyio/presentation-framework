import { describe, it, expect } from 'vitest';
import { split6040Layout } from '@/lib/design-system/layouts/split-60-40';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Split-60-40 Layout', () => {
  it('should have correct name', () => {
    expect(split6040Layout.name).toBe('split-60-40');
  });

  it('should have a description', () => {
    expect(split6040Layout.description).toBeDefined();
    expect(split6040Layout.description.length).toBeGreaterThan(0);
  });

  it('should have title, left, and right zones', () => {
    expect(split6040Layout.zones).toHaveLength(3);

    const zoneNames = split6040Layout.zones.map((z) => z.name);
    expect(zoneNames).toContain('title');
    expect(zoneNames).toContain('left');
    expect(zoneNames).toContain('right');
  });

  it('should have title zone with correct grid area', () => {
    const titleZone = split6040Layout.zones.find((z) => z.name === 'title');
    expect(titleZone).toBeDefined();
    expect(titleZone?.gridArea).toBe('title');
  });

  it('should have left zone with correct grid area', () => {
    const leftZone = split6040Layout.zones.find((z) => z.name === 'left');
    expect(leftZone).toBeDefined();
    expect(leftZone?.gridArea).toBe('left');
  });

  it('should have right zone with correct grid area', () => {
    const rightZone = split6040Layout.zones.find((z) => z.name === 'right');
    expect(rightZone).toBeDefined();
    expect(rightZone?.gridArea).toBe('right');
  });

  it('should have CSS grid template areas defined', () => {
    expect(split6040Layout.gridTemplateAreas).toBeDefined();
    expect(split6040Layout.gridTemplateAreas).toContain('title');
    expect(split6040Layout.gridTemplateAreas).toContain('left');
    expect(split6040Layout.gridTemplateAreas).toContain('right');
  });

  it('should have CSS grid template columns for 60/40 split', () => {
    expect(split6040Layout.gridTemplateColumns).toBeDefined();
    // 3fr (60%) for left, 2fr (40%) for right
    expect(split6040Layout.gridTemplateColumns).toBe('3fr 2fr');
  });

  it('should have CSS grid template rows', () => {
    expect(split6040Layout.gridTemplateRows).toBeDefined();
    // Title should be auto-sized, columns should fill remaining space
    expect(split6040Layout.gridTemplateRows).toContain('auto');
    expect(split6040Layout.gridTemplateRows).toContain('1fr');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() =>
      registry.registerLayout('split-60-40', split6040Layout)
    ).not.toThrow();

    const retrieved = registry.getLayout('split-60-40');
    expect(retrieved).toEqual(split6040Layout);
  });

  it('should have zone descriptions', () => {
    const titleZone = split6040Layout.zones.find((z) => z.name === 'title');
    const leftZone = split6040Layout.zones.find((z) => z.name === 'left');
    const rightZone = split6040Layout.zones.find((z) => z.name === 'right');

    expect(titleZone?.description).toBeDefined();
    expect(leftZone?.description).toBeDefined();
    expect(rightZone?.description).toBeDefined();
  });
});
