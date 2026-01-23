import { describe, it, expect } from 'vitest';
import { split4060Layout } from '@/lib/design-system/layouts/split-40-60';
import { LayoutRegistry } from '@/lib/design-system/layout-registry';

describe('Split-40-60 Layout', () => {
  it('should have correct name', () => {
    expect(split4060Layout.name).toBe('split-40-60');
  });

  it('should have a description', () => {
    expect(split4060Layout.description).toBeDefined();
    expect(split4060Layout.description.length).toBeGreaterThan(0);
  });

  it('should have title, left, and right zones', () => {
    expect(split4060Layout.zones).toHaveLength(3);

    const zoneNames = split4060Layout.zones.map((z) => z.name);
    expect(zoneNames).toContain('title');
    expect(zoneNames).toContain('left');
    expect(zoneNames).toContain('right');
  });

  it('should have title zone with correct grid area', () => {
    const titleZone = split4060Layout.zones.find((z) => z.name === 'title');
    expect(titleZone).toBeDefined();
    expect(titleZone?.gridArea).toBe('title');
  });

  it('should have left zone with correct grid area', () => {
    const leftZone = split4060Layout.zones.find((z) => z.name === 'left');
    expect(leftZone).toBeDefined();
    expect(leftZone?.gridArea).toBe('left');
  });

  it('should have right zone with correct grid area', () => {
    const rightZone = split4060Layout.zones.find((z) => z.name === 'right');
    expect(rightZone).toBeDefined();
    expect(rightZone?.gridArea).toBe('right');
  });

  it('should have CSS grid template areas defined', () => {
    expect(split4060Layout.gridTemplateAreas).toBeDefined();
    expect(split4060Layout.gridTemplateAreas).toContain('title');
    expect(split4060Layout.gridTemplateAreas).toContain('left');
    expect(split4060Layout.gridTemplateAreas).toContain('right');
  });

  it('should have CSS grid template columns for 40/60 split', () => {
    expect(split4060Layout.gridTemplateColumns).toBeDefined();
    // 2fr (40%) for left, 3fr (60%) for right
    expect(split4060Layout.gridTemplateColumns).toBe('2fr 3fr');
  });

  it('should have CSS grid template rows', () => {
    expect(split4060Layout.gridTemplateRows).toBeDefined();
    // Title should be auto-sized, columns should fill remaining space
    expect(split4060Layout.gridTemplateRows).toContain('auto');
    expect(split4060Layout.gridTemplateRows).toContain('1fr');
  });

  it('should be registrable in LayoutRegistry', () => {
    const registry = new LayoutRegistry();
    expect(() =>
      registry.registerLayout('split-40-60', split4060Layout)
    ).not.toThrow();

    const retrieved = registry.getLayout('split-40-60');
    expect(retrieved).toEqual(split4060Layout);
  });

  it('should have zone descriptions', () => {
    const titleZone = split4060Layout.zones.find((z) => z.name === 'title');
    const leftZone = split4060Layout.zones.find((z) => z.name === 'left');
    const rightZone = split4060Layout.zones.find((z) => z.name === 'right');

    expect(titleZone?.description).toBeDefined();
    expect(leftZone?.description).toBeDefined();
    expect(rightZone?.description).toBeDefined();
  });
});
